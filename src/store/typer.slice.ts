import {createSlice} from "@reduxjs/toolkit"
import type {PayloadAction} from "@reduxjs/toolkit"

interface TyperState {
	texts: string[]
	text: string
	status: boolean
	timeStart: number
	completed: boolean
	countCharacters: number
	inputText: string
	time: number
	progress: number
	correctWords: string[]
}

const initialState: TyperState = {
	completed: false,
	inputText: "",
	text: "",
	progress: 0,
	correctWords: [],
	texts: [
		`You never read a book on psychology, Tippy. You did not need to. You knew by some divine instinct that you can make more friends in two months by becoming genuinely interested in other people than you can in two years by trying to get other people interested in you.`,
		`I know more about the private lives of celebrities than I do about any governmental policy that will actually affect me. I am interested in things that are none of my business, and I am bored by things that are important to know.`,
		`A spider body consists of two main parts: an anterior portion, the prosoma (or cephalothorax), and a posterior part, the opisthosoma (or abdomen).`,
		`As customers of all races, nationalities, and cultures visit the Dekalb Farmers Market by the thousands, I doubt that many stand in awe and contemplate the meaning of its existence. But in the capital of the Sunbelt South, the quiet revolution of immigration and food continues to upset and redefine the meanings of local, regional, and global identity.`,
		`Outside of two men on a train platform there is nothing in sight. They are waiting for spring to come, smoking down the track. The world could come to an end tonight, but that is alright. She could still be there sleeping when I get back.`,
		`I am a broke-nose fighter. I am a loose-lipped liar. Searching for the edge of darkness. But all I get is just tired. I went looking for attention. In all the wrong places. I was needing a redemption. And all I got was just cages.`,
		`I am already far north of London, and as I walk in the streets of Petersburgh, I feel a cold northern breeze play upon my cheeks, which braces my nerves and fills me with delight.`,
		`There was no possibility of taking a walk that day. We had been wandering, indeed, in the leafless shrubbery for an hour in the morning; but since dinner the cold winter wind had brought with it clouds so sombre, and a rain so penetrating, that further outdoor exercise was now out of the question.`,
	],
	timeStart: 0,
	countCharacters: 0,
	time: 0,
	status: false,
}

const typerSlice = createSlice({
	name: "typer",
	initialState,
	reducers: {
		startTyping(state) {
			const text = state.texts[Math.floor(Math.random() * state.texts.length)]
			state.text = text
			state.status = true
			state.timeStart = Date.now()
			state.progress = 0
			state.time = 0
			state.inputText = ""
			state.countCharacters = 0
			state.completed = false
		},
		stopTyping(state) {
			state.status = false
		},
		finishTyping(state) {
			state.status = false
			state.completed = true
			state.progress = 100
		},

		inputHandler(state, action: PayloadAction<string>) {
			state.inputText = action.payload
			if (!state.text.length) {
				state.progress = 0
				return
			}

			state.progress = Math.min(
				(state.inputText.length / state.text.length) * 100,
				100
			)
		},

		updateProgress(state) {
			if (!state.text.length) {
				state.progress = 0
				return
			}

			state.progress = Math.min(
				(state.inputText.length / state.text.length) * 100,
				100
			)
		},
		updateCountPerMinute(state, action: PayloadAction<number>) {
			state.countCharacters = action.payload
		},
		updateTimeDuration(state) {
			if (!state.status) {
				return
			}

			state.time += 1
		},

		handlerCorrectWords(state, action: PayloadAction<string>) {
			const words = state.correctWords
			words.push(action.payload)
		},
	},
})

export default typerSlice.reducer
export const {
	startTyping,
	handlerCorrectWords,
	updateProgress,
	updateTimeDuration,
	stopTyping,
	finishTyping,
	inputHandler,
	updateCountPerMinute,
} = typerSlice.actions
