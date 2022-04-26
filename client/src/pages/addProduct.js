import React from "react";

class AddProduct extends React.Component {
	state = { name: "", price: "", image: { file: "", blob: "", base64: "" }, stackId: null };

	selectedImage = (e) => {
		const file = e.target.files[0];
		const blob = URL.createObjectURL(file);

		let reader = new FileReader()
		reader.readAsDataURL(file)
		reader.onload = () => {
			this.setState({
				image: {
					file,
					blob,
					base64: reader.result
				}
			})
		};
		reader.onerror = function (error) {
			console.log('Error: ', error);
		}
	}

	addItem = () => {
		const { drizzle, account } = this.props;
		const { name, price, image } = this.state;
		const { file } = image;
		const contract = drizzle.contracts.P2P;
		const self = this;

		const formData = new FormData()
		formData.append('image', file)
		fetch('http://127.0.0.1:3001/upload/image', {
			method: 'POST',
			body: formData
		})
			.then(response => response.json())
			.then(data => {
				if (data.status === "success") {
					const nameToHex = contract.web3.utils.asciiToHex(name);
					const weiValue = contract.web3.utils.toWei(price, "ether");
					const stackId = contract.methods["addNewItem"].cacheSend(data.path, nameToHex, weiValue, {
						from: account,
						gas: 3000000
					});
					self.setState({ stackId });
				} else {
					alert("Please try again later")
				}
			})
			.catch(error => {
				console.error(error)
			})


	}

	getTxStatus = () => {
		const { transactions, transactionStack } = this.props.drizzleState;
		const txHash = transactionStack[this.state.stackId];

		if (!txHash) return null;
		// clear
		if (transactions[txHash] && transactions[txHash].status === "success" && this.state.name) {
			this.setState({ name: "", price: "", image: { file: "", blob: "", base64: "" } }, () => {
				alert("Add product successful!");
			});
		}

		return `Transaction status: ${transactions[txHash] && transactions[txHash].status}`;
	};

	render() {
		const { image } = this.state;
		const { blob } = image;
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
						{blob && <img src={blob || ""} className="w-100" />}
					</div>
					<div className="col-12">
						<p>{this.getTxStatus()}</p>
					</div>
				</div>
			</>
		);
	}
}

export default AddProduct;