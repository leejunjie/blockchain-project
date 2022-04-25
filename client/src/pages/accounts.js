import React from "react";

class Accounts extends React.Component {
	state = { dataKey: null };

	componentDidMount() {
		const { drizzle } = this.props;
		const contract = drizzle.contracts.P2P;
		const self = this;

		// contract.events.ItemPurchased({}, function (err, res) {
		// 	if (err) console.error(err);
		// 	console.log(res)
		// 	// slef.setState({ purchaseTx: res.transactionHash });
		// });
	}

	componentDidUpdate(prevProps, prevState) {
		const { drizzleState } = this.props;
		const { dataKey } = this.state;
		const account = drizzleState.accounts[0];
		const prevAccount = prevProps.drizzleState.accounts[0];
		if ((account && !dataKey) || prevAccount !== account) {
			this.getPending()
		}
	}

	getPending = () => {
		const { drizzleState, drizzle } = this.props;

		if (drizzleState && drizzleState.accounts) {
			const contract = drizzle.contracts.P2P;
			const dataKey = contract.methods["_pendingWithdrawals"].cacheCall(drizzleState.accounts[0], {
				from: drizzleState.accounts[0],
				gas: 3000000
			});

			this.setState({ dataKey });
		}
	}

	pullFunds = () => {
		const { drizzle, drizzleState } = this.props;
		const contract = drizzle.contracts.P2P;

		contract.methods["pullFunds"].cacheSend({
			from: drizzleState.accounts[0], gas: 3000000
		});
	}

	render() {
		const { drizzleState } = this.props;
		const { P2P } = this.props.drizzleState.contracts;
		const { dataKey } = this.state;
		const funds = P2P._pendingWithdrawals[dataKey];
		let btnFunds = "";

		if (funds && funds.value !== "0") {
			btnFunds = <button onClick={this.pullFunds}>Get Funds</button>
		}
		let addressLength = drizzleState.accounts[0].length

		return (
			<div className="py-2">
				{drizzleState.accounts && (drizzleState.accounts[0].slice(0, 5) + "..." + drizzleState.accounts[0].slice(addressLength - 5, addressLength))}
				{/* {btnFunds} */}
			</div>
		);
	}
}

export default Accounts;