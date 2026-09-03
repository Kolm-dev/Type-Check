import React from "react"
import "./styles/CapsLockIndicator.scss"

const CapsLockIndicator = () => {
	const [capsLock, setCapsLock] = React.useState<boolean>()

	const handleKeyPress = (event: KeyboardEvent): void => {
		setCapsLock(event.getModifierState("CapsLock"))
	}

	React.useEffect(() => {
		document.addEventListener("keydown", handleKeyPress)
		return () => {
			document.removeEventListener("keydown", handleKeyPress)
		}
	}, [])

	if (capsLock === undefined) {
		return <p className="capsIndicator capsIndicatorUnknown">Press CapsLock</p>
	}

	return (
		<p className="capsIndicator">
			<span
				className={`capsIndicatorDot ${capsLock ? "capsIndicatorDotOn" : ""}`}
			/>
			<span>CapsLock</span>
			<span className="capsIndicatorStatus">{capsLock ? "ON" : "OFF"}</span>
		</p>
	)
}
export default CapsLockIndicator
