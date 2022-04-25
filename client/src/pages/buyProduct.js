import React from "react";

class BuyProduct extends React.Component {
	state = { id: "", stackId: null, purchaseTx: null }

	componentDidMount() {
		const { drizzle } = this.props;
		const contract = drizzle.contracts.P2P;
		const slef = this;

		contract.events.ItemPurchased({}, function (err, res) {
			if (err) console.error(err);

			slef.setState({ purchaseTx: res.transactionHash });
		});
	}

	buyItem = () => {
		const { drizzle, account } = this.props;
		const { id } = this.state;
		const contract = drizzle.contracts.P2P;

		contract.methods.getItem(id).call({}, function (err, res) {
			if (err) return err;

			if (res.seller === account) return alert("You can't buy your own item!");

			const data = contract.methods.buyItem(id).encodeABI();
			contract.web3.eth.sendTransaction({
				from: account,
				to: contract.address,
				value: res.price,
				data,
			})
			// .on('transactionHash', function (hash) {
			// 	console.log(hash)
			// })
			// .on('receipt', function (receipt) {
			// 	console.log(receipt)
			// })
			// .on('confirmation', function (confirmationNumber, receipt) { console.log(confirmationNumber, receipt) })
			// .on('error', console.error);
		});
	};

	render() {
		return (
			<div>
				<h4>Buy Product</h4>
				<p>ID</p>
				<input type="text" value={this.state.id} onChange={(e) => this.setState({ id: e.target.value })} />
				<button onClick={this.buyItem}>Buy</button>
				<div>{this.state.purchaseTx && ("Tx Hash: " + this.state.purchaseTx)}</div>
			</div>
		);
	}
}

export default BuyProduct;