import {useAppSelector} from "../hooks/hooks"
import "./styles/TypeStatistics.scss"
import {ProgressBar} from "react-bootstrap"
const TypeStatistics = () => {
	const time = useAppSelector((state) => state.typer.time)
	const characters = useAppSelector((state) => state.typer.countCharacters)
	const progress = useAppSelector((state) => state.typer.progress)

	return (
		<div className="typeStatisticsWrapper">
			<ProgressBar
				variant="success"
				animated
				label={`${progress.toFixed(2)}%`}
				now={progress}
			/>
			<div className="typeStatistics">
				<span className="statisticsItem text-uppercase text-center">
					CPR: {characters.toFixed()}
				</span>
				<span className="statisticsItem text-uppercase text-center">
					Time: {time} s.
				</span>
			</div>
		</div>
	)
}

export default TypeStatistics
