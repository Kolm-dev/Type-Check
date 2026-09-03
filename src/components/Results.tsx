import React from "react"
import {getSavedResults, RESULTS_UPDATED_EVENT} from "../utils/results"
import "./styles/Results.scss"

const Results = () => {
	const [results, setResults] = React.useState(getSavedResults)

	React.useEffect(() => {
		const updateResults = () => setResults(getSavedResults())

		window.addEventListener(RESULTS_UPDATED_EVENT, updateResults)
		window.addEventListener("storage", updateResults)

		return () => {
			window.removeEventListener(RESULTS_UPDATED_EVENT, updateResults)
			window.removeEventListener("storage", updateResults)
		}
	}, [])

	return (
		<section className="results">
			<h2 className="resultsTitle">Typing Results</h2>
			{results.length ? (
				<ul className="resultsList">
					{results.map((result) => (
						<li className="resultsItem" key={result.id}>
							<span>{result.createdAt}</span>
							<strong>{result.time} s.</strong>
							<strong>{result.charactersPerMinute.toFixed()} CPR</strong>
						</li>
					))}
				</ul>
			) : (
				<p className="resultsEmpty">Finish a speed test to see your results.</p>
			)}
		</section>
	)
}

export default Results
