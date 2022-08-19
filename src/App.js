import React, { useState, useEffect } from "react";
import './App.css';
import { graphql, GraphQLSchema, GraphQLObjectType, GraphQLString, buildSchema } from 'graphql';


function App() {

	const [output, setOutput] = useState({});

	const [input, setInput] = useState({
		json: "{\"hello\": \"world\", \"name\": \"sherlock\"}",
		graphql: "{ hello, name }"
	});

	const generateSchema = () => {
		const jsonObject = JSON.parse(input.json);

		//making just parentkeys for now, later have to add support for all hierarchy
		let parentKeys = "";
		let parentResolvers = {};
		for (let key in jsonObject) {
			parentKeys += (key + ": String,\n");

			let resolverFunction = () => {
				return jsonObject[key];
			}

			parentResolvers[key] = resolverFunction;
		}
		console.log("parentResolvers", parentResolvers);

		const schema = buildSchema(`
			type Query {
		    	`+parentKeys+`
			}
		`);

		let rootValue = {...parentResolvers};

		return { schema: schema, rootValue: rootValue };
	}

	const runQuery = () => {
		//build the schema dynamically
		const {schema, rootValue} = generateSchema();

		//run the graphql
		let source = input.graphql;

		graphql({ schema, source, rootValue }).then((result) => {
			setOutput(result);
		});
	}

	const handleInputChange = (e) => {
		setInput({...input, json: e.target.value });
	}

 	return (
		<div className="App">
			<header className="App-header">
				<h2>Json filter tool that takes graphql query input</h2>
				<h3>Writing because could not find any on the internet surprisingly!</h3>
				<p><b>To do list:</b></p>
				<ul>
					<li>all datatype supports</li>
					<li>json infinite hierarchy support</li>
					<li>Input json url support</li>
				</ul>
			</header>
			<label htmlFor="jsoninput">Enter your json here:</label>
			<textarea onChange={(e) => handleInputChange(e)} placeholder="Enter your json here:" cols="60" rows="10"
			 defaultValue={input.json} id="jsoninput"></textarea>
			<br /><br />
			<label htmlFor="graphqlinput">Enter your graphql query here (no arguments):</label>
			<textarea placeholder="Enter your graphql query here (no arguments):" cols="60" rows="6" 
			 defaultValue={input.graphql} id="graphqlinput"></textarea>
			<br />
			<button onClick={() => runQuery()}>Give the output</button>
			<pre>{JSON.stringify(output)}</pre>
		</div>
	);
}

export default App;
