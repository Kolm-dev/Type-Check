import {mkdir, writeFile} from "node:fs/promises"
import {spawn} from "node:child_process"

const appUrl = process.argv[2] || "http://127.0.0.1:5174"
const debugPort = 9333
const screenshotsDir = "public/screenshots"

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const waitForJson = async (url) => {
	for (let attempt = 0; attempt < 60; attempt += 1) {
		try {
			const response = await fetch(url)
			if (response.ok) {
				return response.json()
			}
		} catch {
			await sleep(250)
		}
	}

	throw new Error(`Cannot connect to ${url}`)
}

const chrome = spawn(
	"google-chrome",
	[
		"--headless=new",
		"--no-sandbox",
		"--disable-gpu",
		"--no-first-run",
		"--disable-dev-shm-usage",
		`--remote-debugging-port=${debugPort}`,
		"--user-data-dir=/tmp/speedchecker-screenshots-chrome",
		"about:blank",
	],
	{stdio: "ignore"}
)

const createClient = async () => {
	await waitForJson(`http://127.0.0.1:${debugPort}/json/version`)
	const response = await fetch(`http://127.0.0.1:${debugPort}/json/new`, {
		method: "PUT",
	})
	const target = await response.json()
	const ws = new WebSocket(target.webSocketDebuggerUrl)
	let id = 0
	const callbacks = new Map()

	ws.addEventListener("message", (event) => {
		const message = JSON.parse(event.data)
		const callback = callbacks.get(message.id)
		if (callback) {
			callback(message)
			callbacks.delete(message.id)
		}
	})

	await new Promise((resolve) => ws.addEventListener("open", resolve, {once: true}))

	const send = (method, params = {}) =>
		new Promise((resolve, reject) => {
			const messageId = (id += 1)
			callbacks.set(messageId, (message) => {
				if (message.error) {
					reject(new Error(message.error.message))
					return
				}
				resolve(message.result)
			})
			ws.send(JSON.stringify({id: messageId, method, params}))
		})

	return {send, ws}
}

const setViewport = (send, width, height, mobile = false) =>
	send("Emulation.setDeviceMetricsOverride", {
		width,
		height,
		deviceScaleFactor: mobile ? 2 : 1,
		mobile,
	})

const navigate = async (send, url) => {
	await send("Page.navigate", {url})
	await sleep(900)
}

const evaluate = (send, expression) =>
	send("Runtime.evaluate", {
		expression,
		awaitPromise: true,
		returnByValue: true,
	})

const waitForExpression = async (send, expression) => {
	for (let attempt = 0; attempt < 40; attempt += 1) {
		const result = await evaluate(send, expression)
		if (result.result.value) {
			return
		}
		await sleep(250)
	}

	throw new Error(`Timed out waiting for: ${expression}`)
}

const screenshot = async (send, fileName) => {
	const result = await send("Page.captureScreenshot", {
		format: "png",
		fromSurface: true,
	})
	await writeFile(`${screenshotsDir}/${fileName}`, result.data, "base64")
}

const seedResults = async (send) => {
	await evaluate(
		send,
		`localStorage.setItem("typingResults", JSON.stringify([
			{id: "demo-1", time: 42, charactersPerMinute: 286, createdAt: "Demo result 1"},
			{id: "demo-2", time: 58, charactersPerMinute: 241, createdAt: "Demo result 2"},
			{id: "demo-3", time: 76, charactersPerMinute: 214, createdAt: "Demo result 3"}
		]))`
	)
}

try {
	await mkdir(screenshotsDir, {recursive: true})
	const {send, ws} = await createClient()
	await send("Page.enable")
	await send("Runtime.enable")

await setViewport(send, 1440, 900)
await navigate(send, `${appUrl}/speed-test`)
await waitForExpression(send, `Boolean(document.querySelector(".appNav"))`)
await seedResults(send)
await evaluate(send, `document.querySelector(".btn-success")?.click()`)
await waitForExpression(send, `Boolean(document.querySelector(".textForTest"))`)
await sleep(5000)
await evaluate(
	send,
	`document.querySelector(".textInput input")?.focus();
		const input = document.querySelector(".textInput input");
		const text = document.querySelector(".textForTest")?.textContent || "";
		const value = text.slice(0, 32);
		const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
		setter.call(input, value);
		input.dispatchEvent(new Event("input", {bubbles: true}));`
)
await sleep(500)
await screenshot(send, "speed-test-desktop.png")

await navigate(send, `${appUrl}/results`)
await waitForExpression(send, `Boolean(document.querySelector(".results"))`)
await screenshot(send, "results-desktop.png")

await setViewport(send, 320, 640, true)
await navigate(send, `${appUrl}/speed-test`)
await waitForExpression(send, `Boolean(document.querySelector(".appNav"))`)
await evaluate(send, `document.querySelector(".btn-success")?.click()`)
await waitForExpression(send, `Boolean(document.querySelector(".textForTest"))`)
await sleep(5000)
await evaluate(
	send,
	`document.querySelector(".textInput input")?.focus();
		const input = document.querySelector(".textInput input");
		const text = document.querySelector(".textForTest")?.textContent || "";
		const value = text.slice(0, 26);
		const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
		setter.call(input, value);
		input.dispatchEvent(new Event("input", {bubbles: true}));`
)
await sleep(500)
await screenshot(send, "speed-test-mobile.png")

await navigate(send, `${appUrl}/results`)
await waitForExpression(send, `Boolean(document.querySelector(".results"))`)
await screenshot(send, "results-mobile.png")

	ws.close()
} finally {
	chrome.kill()
}
