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
		const { drizzle, drizzleState } = this.props;
		const contract = drizzle.contracts.P2P;

		contract.methods["removeItem"].cacheSend(id, {
			from: drizzleState.accounts[0], gas: 3000000
		});
	}

	render() {
		const { drizzle, drizzleState } = this.props;
		const { P2P } = drizzleState.contracts;
		const account = drizzleState.accounts[0];
		const contract = drizzle.contracts.P2P;
		const { dataKey } = this.state;
		const items = P2P.getAllItem[dataKey];
		const self = this;

		return (
			<div className='row'>
				<div className='col-3'></div>
				<div className='col-9'>
					<div className="row">
						{items && items.value && items.value.map((item, index) =>
							<div className="col-3 p-2 border">
								<div>
									<img className="w-100" src={item.image || "/logo192.png"} />
								</div>
								<div className="d-flex justify-content-between">
									<p className="mb-0">{contract.web3.utils.hexToAscii(item.name).replace(/\u0000/g, '')}</p>
									<p className="mb-0">{contract.web3.utils.fromWei(item.price, "ether")} ETH</p>
								</div>
							</div>
							// <ul key={index} style={{ marginTop: "30px", listStyle: "none" }}>
							// 	<li>ID: {index}</li>
							// 	<li>Name: {contract.web3.utils.hexToAscii(item.name).replace(/\u0000/g, '')}</li>
							// 	<li>Price: {contract.web3.utils.fromWei(item.price, "ether")} ETH</li>
							// 	<li>Seller: {item.seller === account ? "Me" : item.seller}</li>
							// 	<li>Status: {item.status === "1" ? "Sold" : item.status === "2" ? "Removed" : "Active"}</li>
							// 	{(account && item.seller === account && item.status === "0") && <li><button onClick={() => { self.removeItem(index) }}>Remove</button></li>}
							// </ul>
						)}
					</div>
				</div>
			</div>
		);
	}
}

export default GetProduct;