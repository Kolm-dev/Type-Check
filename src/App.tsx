import React from "react"
import "./App.css"
import Results from "./components/Results"
import Tester from "./components/Tester"
import "bootstrap/scss/bootstrap.scss"
import "./index.scss"

const routes = {
	results: "/results",
	speedTest: "/speed-test",
}

const App: React.FC = () => {
	const [currentPath, setCurrentPath] = React.useState(window.location.pathname)

	const navigate = (path: string) => {
		window.history.pushState(null, "", path)
		setCurrentPath(path)
	}

	React.useEffect(() => {
		const handlePopState = () => setCurrentPath(window.location.pathname)

		window.addEventListener("popstate", handlePopState)
		return () => {
			window.removeEventListener("popstate", handlePopState)
		}
	}, [])

	const isResultsPage = currentPath === routes.results

	return (
		<div className="appShell">
			<nav className="appNav">
				<button
					className={`appNavButton ${!isResultsPage ? "appNavButtonActive" : ""}`}
					onClick={() => navigate(routes.speedTest)}>
					Speed Test
				</button>
				<button
					className={`appNavButton ${isResultsPage ? "appNavButtonActive" : ""}`}
					onClick={() => navigate(routes.results)}>
					Results
				</button>
			</nav>
			{isResultsPage ? <Results /> : <Tester />}
		</div>
	)
}

export default App
