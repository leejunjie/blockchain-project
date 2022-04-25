import React from "react";

class Accounts extends React.Component {
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
		const { account } = this.props;
		const addressLength = account.length;
		// const { P2P } = this.props.drizzleState.contracts;
		// const { dataKey } = this.state;
		// const funds = P2P._pendingWithdrawals[dataKey];
		// let btnFunds = "";
		// if (funds && funds.value !== "0") {
		// 	btnFunds = <button onClick={this.pullFunds}>Get Funds</button>
		// }

		return (
			<div className="py-2">
				{account && (account.slice(0, 5) + "..." + account.slice(addressLength - 5, addressLength))}
				{/* {btnFunds} */}
			</div>
		);
	}
}

export default Accounts;