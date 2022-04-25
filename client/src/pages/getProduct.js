import React from "react";
import { Link } from "react-router-dom";

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
		const contract = drizzle.contracts.P2P;
		const { dataKey } = this.state;
		const items = P2P.getAllItem[dataKey];

		return (
			<div className='row'>
				<div className='col-3'></div>
				<div className='col-9'>
					<div className="row">
						{items && items.value && items.value.map((item, index) => {
							if (item.status === "2") {
								return "";
							}
							return <Link to={'/product?id=' + index} className="col-3 p-2 border text-decoration-none text-dark">
								<div>
									<img className="w-100" src={item.image || "/logo192.png"} />
								</div>
								<div className="d-flex justify-content-between">
									<p className="mb-0">{contract.web3.utils.hexToAscii(item.name).replace(/\u0000/g, '')}</p>
									<p className="mb-0">{item.status === "1" ? "Sold" : (contract.web3.utils.fromWei(item.price, "ether") + " ETH")}</p>
								</div>
							</Link>
						})}
					</div>
				</div>
			</div>
		);
	}
}

export default GetProduct;