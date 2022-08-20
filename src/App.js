import React, { useState, useEffect } from "react";
import './App.css';
import { graphql, buildSchema } from 'graphql';

//we will update this lib if we find something that doesn't work
import { jsonToSchema } from "@walmartlabs/json-to-simple-graphql-schema/lib";

function App() {

	const [output, setOutput] = useState({});

	const [input, setInput] = useState({
		json: "{\"hello\": \"world\", \"name\": \"sherlock\"}",
		graphql: "{ hello, name }"
	});

	const generateSchema = (jsonObject) => {
		// should we stringify object or directly take json instead
		const generatedSchema = jsonToSchema({ jsonInput: JSON.stringify(jsonObject), baseType: 'Query' });
		const schema = buildSchema(generatedSchema.value);
		return schema;
	}

	const generateResolvers = (jsonObject) => {
		let resolvers = {};
		for (let key in jsonObject) {
			let resolverFunction = () => {
				return jsonObject[key];
			}
			resolvers[key] = resolverFunction;
		}
		return resolvers;
	}

	const getGraphqlSchemaAndLoaders = () => {
		const jsonObject = JSON.parse(input.json);
		const schema = generateSchema(jsonObject);
		const rootValue = generateResolvers(jsonObject);
		return { schema: schema, rootValue: rootValue };
	}

	const runQuery = () => {
		const {schema, rootValue} = getGraphqlSchemaAndLoaders();
		let source = input.graphql;
		
		//run graphql
		graphql({ schema, source, rootValue }).then((result) => {
			setOutput(result);
		});
	}

	const handleJsonInputChange = (e) => {
		setInput({...input, json: e.target.value });
	}

	const handleGraphqlInputChange = (e) => {
		setInput({...input, graphql: e.target.value });
	}

 	return (
		<div className="App">
			<header className="App-header">
				<h2>Json filter tool that takes graphql query input</h2>
				<h3>Writing because could not find any on the internet surprisingly!</h3>
				<p><b>To do list:</b></p>
				<ul>
					<li>Input json file and json url support</li>
					<li>better ui</li>
				</ul>
			</header>
			<label htmlFor="jsoninput">Enter your json here:</label>
			<textarea onChange={(e) => handleJsonInputChange(e)} placeholder="Enter your json here:" cols="60" rows="10"
			 defaultValue={input.json} id="jsoninput"></textarea>
			<br /><br />
			<label htmlFor="graphqlinput">Enter your graphql query here (no arguments):</label>
			<textarea onChange={(e) => handleGraphqlInputChange(e)} placeholder="Enter your graphql query here (no arguments):" cols="60" rows="6" 
			 defaultValue={input.graphql} id="graphqlinput"></textarea>
			<br />
			<button onClick={() => runQuery()}>Give the output</button>
			<pre>{JSON.stringify(output)}</pre>
		</div>
	);
}

export default App;
