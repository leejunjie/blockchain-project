import React from "react";

class AddProduct extends React.Component {
	state = { name: "", price: "" };

	addItem = () => {
		const { drizzle, account } = this.props;
		const { name, price } = this.state;
		const contract = drizzle.contracts.P2P;

		const nameToHex = contract.web3.utils.asciiToHex(name);
		const weiValue = contract.web3.utils.toWei(price, "ether");
		contract.methods["addNewItem"].cacheSend(nameToHex, weiValue, {
			from: account, gas: 3000000
		});
	}

	render() {
		return (
			<div>
				<h4>Add Product</h4>
				<p>Name</p>
				<input type="text" value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })} />
				<p>Amount</p>
				<input type="number" value={this.state.price} onChange={(e) => this.setState({ price: e.target.value })} />
				<button onClick={this.addItem}>Add</button>
			</div>
		);
	}
}

export default AddProduct;