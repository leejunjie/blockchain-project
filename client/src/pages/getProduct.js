import React from "react";
import { Link } from "react-router-dom";

const filters = [
	{ title: "Acitve" },
	{ title: "Sold" },
	{ title: "Removed" },
]

class GetProduct extends React.Component {
	state = { dataKey: null, filter: null };

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

	handleCheckbox = (e) => {
		const checkboxes = document.getElementsByName("filterCheckbox");
		let filter = [];
		for (let i = 0; i < checkboxes.length; i++) {
			if (checkboxes[i].checked) filter.push(i);
		}
		this.setState({ filter });
	}

	render() {
		const { drizzle, drizzleState } = this.props;
		const { dataKey, filter } = this.state;
		const { P2P } = drizzleState.contracts;
		const contract = drizzle.contracts.P2P;
		const items = P2P.getAllItem[dataKey];

		return (
			<div className='row'>
				<div className='col-3'>
					{filters.map((checkbox, index) => (
						<div className="form-check" key={checkbox.title}>
							<input className="form-check-input" type="checkbox" name="filterCheckbox" onChange={this.handleCheckbox} checked={filter == null ? true : filter.includes(index)} id={"checkbox" + index} />
							<label className="form-check-label" htmlFor={"checkbox" + index}>
								{checkbox.title}
							</label>
						</div>
					))}
				</div>
				<div className='col-9'>
					<div className="row">
						{items && items.value && items.value.map((item, index) => {
							if (item.status === "2" || (filter != null && !filter.includes(Number(item.status)))) {
								return "";
							}
							return <Link to={'/product?id=' + index} key={index} className="col-3 text-decoration-none text-dark">
								<div className="card p-2">
									<div>
										<img className="w-100" src={item.image || "/logo192.png"} />
									</div>
									<div className="d-flex justify-content-between">
										<p className="mb-0">{contract.web3.utils.hexToAscii(item.name).replace(/\u0000/g, '')}</p>
										<p className="mb-0">{contract.web3.utils.fromWei(item.price, "ether")} ETH</p>
									</div>
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