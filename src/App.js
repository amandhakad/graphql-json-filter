import { useState, useEffect } from "react";
import './App.css';

import Main from './components/main/Main';

function App() {

 	return (
		<div className="App">
			<header className="App-header">
				<h2>Json filter tool that takes graphql query input</h2>
				<h3>Writing because could not find any on the internet surprisingly!</h3>
			</header>
			<Main />
		</div>
	);
}

export default App;
