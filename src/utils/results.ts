export type TypingResult = {
	id: string
	time: number
	charactersPerMinute: number
	createdAt: string
}

const STORAGE_KEY = "typingResults"
const MAX_RESULTS = 6

export const RESULTS_UPDATED_EVENT = "typing-results-updated"

export const getSavedResults = (): TypingResult[] => {
	try {
		const savedResults = localStorage.getItem(STORAGE_KEY)
		if (!savedResults) {
			return []
		}

		return JSON.parse(savedResults) as TypingResult[]
	} catch {
		return []
	}
}

export const saveTypingResult = (result: Omit<TypingResult, "id" | "createdAt">) => {
	const resultId =
		crypto.randomUUID?.() || `${Date.now()}-${Math.round(Math.random() * 10000)}`
	const nextResult: TypingResult = {
		...result,
		id: resultId,
		createdAt: new Date().toLocaleString(),
	}
	const nextResults = [nextResult, ...getSavedResults()].slice(0, MAX_RESULTS)

	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(nextResults))
		window.dispatchEvent(new Event(RESULTS_UPDATED_EVENT))
	} catch {
		return
	}
}
