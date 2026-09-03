import "./styles/TextCharacters.scss"

type TextCharactersProps = {
	text: string
}

const TextCharacters = ({text}: TextCharactersProps) => {
	if (!text) {
		return null
	}

	return (
		<div className="textCharacters">
			Characters in text: {text.length}
		</div>
	)
}

export default TextCharacters
