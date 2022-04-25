import React from "react";

class ReadText extends React.Component {
	state = { dataKey: null };

	componentDidMount() {
		const { drizzle } = this.props;

		// console.log(drizzle);

		const contract = drizzle.contracts.MyContract;

		// let drizzle know we want to watch the `myText` method
		const dataKey = contract.methods["myText"].cacheCall();

		// save the `dataKey` to local component state for later reference
		this.setState({ dataKey });
	}

	render() {
		// get the contract state from drizzleState
		const { MyContract } = this.props.drizzleState.contracts;

		// using the saved `dataKey`, get the variable we're interested in
		const myText = MyContract.myText[this.state.dataKey];

		// if it exists, then we display its value
		return <p>My stored Test: {myText && myText.value}</p>;
	}
}

export default ReadText;
