import React from "react";

class GetProduct extends React.Component {
	state = { dataKey: null };

	componentDidMount() {
		const { drizzle } = this.props;
		const contract = drizzle.contracts.P2P;
		const dataKey = contract.methods["getAllItem"].cacheCall();

		this.setState({ dataKey });
	}

	removeItem = (id) => {
		const { drizzle, account } = this.props;
		const contract = drizzle.contracts.P2P;

		contract.methods["removeItem"].cacheSend(id, {
			from: account, gas: 3000000
		});
	}

	render() {
		const { drizzle, drizzleState, account } = this.props;
		const { P2P } = drizzleState.contracts;
		const contract = drizzle.contracts.P2P;
		const { dataKey } = this.state;
		const items = P2P.getAllItem[dataKey];
		const self = this;
		let list = "";

		if (items && items.value) {
			list = items.value.map((item, index) => <ul key={index} style={{ marginTop: "30px", listStyle: "none" }}>
				<li>ID: {index}</li>
				<li>Name: {contract.web3.utils.hexToAscii(item.name).replace(/\u0000/g, '')}</li>
				<li>Price: {contract.web3.utils.fromWei(item.price, "ether")} ETH</li>
				<li>Seller: {item.seller === account ? "Me" : item.seller}</li>
				<li>Status: {item.status === "1" ? "Sold" : item.status === "2" ? "Removed" : "Active"}</li>
				{(account && item.seller === account && item.status === "0") && <li><button onClick={() => { self.removeItem(index) }}>Remove</button></li>}
			</ul>)
		}

		return (
			<div style={{ textAlign: 'left', marginBottom: "50px", marginTop: "50px", marginLeft: "30px", marginRight: "30px", maxHeight: "200px", overflow: "auto", border: "solid 1px #000" }}>
				{list}
			</div>
		);
	}
}

export default GetProduct;