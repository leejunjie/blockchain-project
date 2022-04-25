import React from "react";

class AddProduct extends React.Component {
	state = { name: "", price: "", image: "" };

	selectedImage = (e) => {
		this.setState({ image: URL.createObjectURL(e.target.files[0]) });
	}

	addItem = () => {
		const { drizzle, account } = this.props;
		const { name, price, image } = this.state;
		const contract = drizzle.contracts.P2P;

		const nameToHex = contract.web3.utils.asciiToHex(name);
		const weiValue = contract.web3.utils.toWei(image, price, "ether");
		contract.methods["addNewItem"].cacheSend(nameToHex, weiValue, {
			from: account, gas: 3000000
		});
	}

	render() {
		const { image } = this.state;
		return (
			<>
				<div className="row mt-5 justify-content-around">
					<div className="col-auto">
						<label className="form-label">Name</label>
					</div>
					<div className="col-auto">
						<input className="form-control" type="text" value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })} />
					</div>
					<div className="col-auto">
						<label className="form-label">Amount</label>
					</div>
					<div className="col-auto">
						<div className="input-group">
							<input className="form-control" type="number" value={this.state.price} onChange={(e) => this.setState({ price: e.target.value })} />
							<span className="input-group-text">ETH</span>
						</div>
					</div>
					<div className="col-auto">
						<button onClick={this.addItem} className="btn btn-primary">Add</button>
					</div>
				</div>
				<div className="row mt-3 justify-content-between">
					<div className="col-4">
						<input className="form-control" type="file" accept="image/*" onChange={this.selectedImage} />
					</div>
					<div className="col-3">
						{image && <img src={image || ""} className="w-100" />}
					</div>
				</div>
			</>
		);
	}
}

export default AddProduct;