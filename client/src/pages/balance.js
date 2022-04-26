import React from "react";

class Balance extends React.Component {
	state = { dataKey: null };

	componentDidUpdate(prevProps, prevState) {
		const { account } = this.props;
		const { dataKey } = this.state;
		if ((account && !dataKey) || prevProps.account !== account) {
			this.getPending()
		}
	}

	getPending = () => {
		const { drizzle, account } = this.props;

		if (account) {
			const contract = drizzle.contracts.P2P;
			const dataKey = contract.methods["_pendingWithdrawals"].cacheCall(account, {
				from: account,
				gas: 3000000
			});

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
		const { account, drizzleState, drizzle } = this.props;
		const contract = drizzle.contracts.P2P;
		const { P2P } = drizzleState.contracts;
		const { dataKey } = this.state;
		const funds = P2P._pendingWithdrawals[dataKey];
		let balance = 0;
		if (account) {
			balance = contract.web3.utils.fromWei(drizzleState.accountBalances[account], "ether")
			balance = Math.round((Number(balance) + Number.EPSILON) * 10000) / 10000
		}
		let btnFunds = "";
		if (funds && funds.value !== "0") {
			btnFunds = <button className="btn btn-primary mr-4" onClick={this.pullFunds}>Get Funds</button>
		}

		return (
			<div className="d-flex justify-content-end align-items-center">
				{btnFunds}
				<p className="mb-0">{balance} ETH</p>
			</div>
		);
	}
}

export default Balance;