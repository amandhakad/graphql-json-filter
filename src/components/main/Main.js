import React, { useState, useEffect } from "react";

import { graphql, buildSchema } from 'graphql';

//we will update this lib if we find something that doesn't work
import { jsonToSchema } from "@walmartlabs/json-to-simple-graphql-schema/lib";

function Main() {

	const [output, setOutput] = useState({});

	const [graphqlLoad, setGraphqlLoad] = useState({schema: {}, rootValue: {}});

	const [input, setInput] = useState({
		json: "{\"hello\": \"world\", \"name\": \"sherlock\"}",
		graphql: "{ hello, name }"
	});

	useEffect(() => {
	    runQuery();
	}, [input.graphql, graphqlLoad]);

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
		setGraphqlLoad({ schema: schema, rootValue: rootValue });
	}

	const runQuery = () => {
		const {schema, rootValue} = graphqlLoad;
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
		<div className="mainApp">
			<textarea className="data-source-textarea" onChange={(e) => handleJsonInputChange(e)} placeholder="Enter your json here:" cols="60" rows="10"
			 defaultValue={input.json} id="jsoninput"></textarea>

			<button onClick={() => getGraphqlSchemaAndLoaders()}>Load the json</button>
			<br/>
			<textarea className="graphql-textarea" onChange={(e) => handleGraphqlInputChange(e)} placeholder="Enter your graphql query here (no arguments):" cols="60" rows="6" 
			 defaultValue={input.graphql} id="graphqlinput"></textarea>
			<textarea className="output-textarea" placeholder="Your JSON output:" value={JSON.stringify(output, null, 4)} readOnly></textarea>

			
		</div>
	);
}

export default Main;
