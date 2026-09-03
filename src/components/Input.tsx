import React, {useEffect, useState} from "react"
import "./styles/Input.scss"
import {useAppDispatch, useAppSelector} from "../hooks/hooks"
import {Input as InputText} from "semantic-ui-react"
import {
	inputHandler,
	updateCountPerMinute,
	finishTyping,
} from "../store/typer.slice"
import {saveTypingResult} from "../utils/results"

type TypeInput = {
	setPrintedText: (value: string) => void
	text: string
}

const Input = ({setPrintedText, text}: TypeInput) => {
	const {status, time, timeStart} = useAppSelector((state) => state.typer)

	const dispatch = useAppDispatch()
	const [inputedCount, setInputedCount] = useState(0)
	const [inputValue, setInputValue] = useState("")
	const inputRef = React.useRef<InputText>(null)

	const handlerCountCh = () => {
		const elapsedTime = (Date.now() - timeStart) / 1000
		if (!status || elapsedTime <= 0) {
			return
		}

		const cpr = (inputedCount / elapsedTime) * 60
		dispatch(updateCountPerMinute(cpr))
	}

	useEffect(() => {
		handlerCountCh()
	}, [dispatch, inputedCount, status, time, timeStart])

	useEffect(() => {
		setInputValue("")
		setInputedCount(0)
		setPrintedText("")
		inputRef.current?.focus()
	}, [text, setPrintedText])

	const inputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		const elapsedTime = (Date.now() - timeStart) / 1000
		const charactersPerMinute =
			status && elapsedTime > 0 ? (value.length / elapsedTime) * 60 : 0

		setInputValue(value)
		setInputedCount(value.length)
		dispatch(inputHandler(value))
		dispatch(updateCountPerMinute(charactersPerMinute))

		let newPrintedText = ""
		for (let i = 0; i < text.length; i++) {
			if (i < value.length) {
				if (text[i] === value[i]) {
					newPrintedText += `<span class='correct'>${text[i]}</span>`
				} else {
					newPrintedText += `<span class='text-bg-danger'>${text[i]}</span>`
				}
			} else {
				newPrintedText += text[i]
			}
		}
		setPrintedText(newPrintedText)

		if (value.length >= text.length) {
			dispatch(finishTyping())
			saveTypingResult({
				time: Math.ceil(elapsedTime),
				charactersPerMinute,
			})
		}
	}
	return (
		<div className="wrapperInput">
			<InputText
				ref={inputRef}
				className="textInput"
				onChange={inputOnChange}
				value={inputValue}
				type="text"
				size="massive"
				placeholder="Start typing..."
				maxLength={text.length}
				disabled={!status}
			/>
		</div>
	)
}

export default Input
