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
		const { account } = this.props;
		const { dataKey } = this.state;
		if ((account && !dataKey) || prevProps.account !== account) {
			this.getPending()
		}
	}

	getPending = () => {
		const { account, drizzle } = this.props;

		if (account) {
			const contract = drizzle.contracts.P2P;
			const dataKey = contract.methods["_pendingWithdrawals"].cacheCall(account, { from: account, gas: 3000000 });

			this.setState({ dataKey });
		}
	}

	pullFunds = () => {
		const { drizzle, account } = this.props;
		const contract = drizzle.contracts.P2P;

		contract.methods["pullFunds"].cacheSend({
			from: account, gas: 3000000
		});
	}

	render() {
		const { drizzleState, account } = this.props;
		const { P2P } = this.props.drizzleState.contracts;
		const { dataKey } = this.state;
		const funds = P2P._pendingWithdrawals[dataKey];
		let btnFunds = "";

		let selectAcc = "";
		if (drizzleState.accounts) {
			selectAcc = Object.keys(drizzleState.accounts).map((accountId) =>
				<option
					key={drizzleState.accounts[accountId]}
					value={drizzleState.accounts[accountId]}
					selected={account && account === drizzleState.accounts[accountId]}>Account {accountId}</option>
			)
		}

		if (funds && funds.value !== "0") {
			btnFunds = <button onClick={this.pullFunds}>Get Funds</button>
		}

		return (
			<div>
				<h4>Account</h4>
				{selectAcc && <select onChange={this.props.handleChangeAcc}>{selectAcc}</select>}
				{btnFunds}
			</div>
		);
	}
}

export default Accounts;