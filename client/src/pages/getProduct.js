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
				<div className='col-2 border-right' style={{ minHeight: 550 }}>
					<h5>Filter</h5>
					{filters.map((checkbox, index) => (
						<div className="form-check" key={checkbox.title}>
							<input className="form-check-input" type="checkbox" name="filterCheckbox" onChange={this.handleCheckbox} checked={filter == null ? true : filter.includes(index)} id={"checkbox" + index} />
							<label className="form-check-label" htmlFor={"checkbox" + index}>
								{checkbox.title}
							</label>
						</div>
					))}
					<hr className="mt-5" />
					<p>The point of NFTs depends on whether you’re an artist or a buyer.</p>
				</div>
				<div className='col-10'>
					<div className="row overflow-auto" style={{ maxHeight: 550 }}>
						{items && items.value && items.value.map((item, index) => {
							if (item.status === "2" || (filter != null && !filter.includes(Number(item.status)))) {
								return "";
							}
							return <Link to={'/product?id=' + index} key={index} className="col-3 text-decoration-none text-dark mb-4">
								<div className="card">
									<div className="d-flex justify-content-center rounded-top overflow-hidden bg-secondary" style={{ height: 150 }}>
										<img
											className="h-100"
											src={item.image || "/logo192.png"}
											alt={contract.web3.utils.hexToAscii(item.name).replace(/\u0000/g, '')}
											onError={(e) => { if (e.target.src != "/logo192.png") e.target.src = "/logo192.png" }}
										/>
									</div>
									<div className="card-body">
										<h6 className="card-title">{contract.web3.utils.hexToAscii(item.name).replace(/\u0000/g, '')}</h6>
										<p className="card-text">{contract.web3.utils.fromWei(item.price, "ether")} ETH</p>
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