import React from "react";
import ComponentDropzone from "../components/dropzone";

class AddProduct extends React.Component {
	state = { name: "", price: "", desc: "", imageFile: "", stackId: null };

	selectedImage = (imageFiles) => {
		this.setState({ imageFile: imageFiles[0] })
	}

	addItem = () => {
		const { drizzle, account } = this.props;
		const { name, price, desc, imageFile } = this.state;
		const contract = drizzle.contracts.P2P;
		const self = this;

		const formData = new FormData()
		formData.append('image', imageFile)
		fetch('http://127.0.0.1:3001/upload/image', {
			method: 'POST',
			body: formData
		})
			.then(response => response.json())
			.then(data => {
				if (data.status === "success") {
					const nameToHex = contract.web3.utils.asciiToHex(name);
					const weiValue = contract.web3.utils.toWei(price, "ether");
					const stackId = contract.methods["addNewItem"].cacheSend(nameToHex, weiValue, data.path, desc, {
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
		return (
			<div className="row align-items-center">
				<div className="col-6 px-5">
					<img src="/bg-sell.png" alt="sell" className="w-100" />
				</div>
				<div className="col-6 px-5 py-4">
					<div className="mb-4 row">
						<h5 className="text-center">Sell Your Art</h5>
					</div>
					<div className="mb-3 row">
						<input className="form-control" type="text" placeholder="Name" aria-label="Name" value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })} />
					</div>
					<div className="mb-3 row">
						<div className="input-group px-0">
							<input className="form-control" type="number" placeholder="Amount" aria-label="Amount" value={this.state.price} onChange={(e) => this.setState({ price: e.target.value })} />
							<span className="input-group-text">ETH</span>
						</div>
					</div>
					<div className="mb-3 row">
						<textarea rows={5} className="form-control" type="text" placeholder="Description" aria-label="Description" value={this.state.desc} onChange={(e) => this.setState({ desc: e.target.value })} />
					</div>
					<div className="mb-3 row">
						<ComponentDropzone
							accept="image/*"
							title="Drag 'n' drop image here, or click to select image"
							onDrop={this.selectedImage}
						/>
					</div>
					<div className="d-flex float-right" style={{ marginRight: "calc(var(--bs-gutter-x)/ -2)" }}>
						<p className="text-break mr-3">{this.getTxStatus()}</p>
						<button onClick={this.addItem} className="btn btn-primary">Add</button>
					</div>
				</div>
			</div>
		);
	}
}

export default AddProduct;