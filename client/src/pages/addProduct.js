import React from "react";
import ComponentDropzone from "../components/dropzone";

class AddProduct extends React.Component {
	state = { name: "", price: "", imageFile: "", stackId: null };

	selectedImage = (imageFiles) => {
		this.setState({ imageFile: imageFiles[0] })
	}

	addItem = () => {
		const { drizzle, account } = this.props;
		const { name, price, imageFile } = this.state;
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
		return (
			<>
				<div className="row">
					<div className="col-6">
						<p>I’m proud of you. Way to go. You might be interested in NFTs because it gives you a way to sell work that there otherwise might not be much of a market for. If you come up with a really cool digital sticker idea.</p>
						<p>Also, NFTs have a feature that you can enable that will pay you every time the NFT is sold, making sure that if your work gets super popular and balloons in value, you’ll see some of that benefit.</p>
					</div>
					<div className="col-6">
						<div className="mb-3 row">
							<ComponentDropzone
								accept="image/*"
								title="Drag 'n' drop image here, or click to select image"
								onDrop={this.selectedImage}
							/>
						</div>
						<div className="mb-3 row">
							<label htmlFor="inputName" className="col-sm-2 col-form-label">Name</label>
							<div className="col-sm-10">
								<input type="text" className="form-control" id="inputName" value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })} />
							</div>
						</div>
						<div className="mb-3 row">
							<label htmlFor="inputAmount" className="col-sm-2 col-form-label">Amount</label>
							<div className="col-sm-10">
								<div className="input-group">
									<input className="form-control" type="number" id="inputAmount" value={this.state.price} onChange={(e) => this.setState({ price: e.target.value })} />
									<span className="input-group-text">ETH</span>
								</div>
							</div>
						</div>
						<div className="d-flex float-right">
							<button onClick={this.addItem} className="btn btn-primary">Add</button>
						</div>
						<div>
							<p>{this.getTxStatus()}</p>
						</div>
					</div>
				</div>
			</>
		);
	}
}

export default AddProduct;