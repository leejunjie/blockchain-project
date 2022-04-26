import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


function ViewProduct(props) {
	const [product, setProduct] = useState(null);
	const [buyTxHash, setBuyTxHash] = useState(null);
	const { drizzle, account } = props;
	const contract = drizzle.contracts.P2P;
	const query = new URLSearchParams(window.location.search);
	const navigate = useNavigate();
	const id = query.get("id") || "";

	useEffect(() => {
		if (id) {
			contract.methods.getItem(id).call({}, function (err, res) {
				if (err) return err;

				setProduct(res);
			});
		} else {
			navigate("/");
		}

		// event when item buy
		contract.events.ItemPurchased({}, function (err, res) {
			if (err) console.error(err);

			setBuyTxHash(res.transactionHash);
		});
	}, []);

	const removeItem = () => {
		contract.methods["removeItem"].cacheSend(id, {
			from: account, gas: 3000000
		});
	}

	const buyItem = () => {
		contract.methods.getItem(id).call({}, function (err, res) {
			if (err) return err;

			if (res.seller === account) return alert("You can't buy your own item!");

			const data = contract.methods.buyItem(id).encodeABI();
			contract.web3.eth.sendTransaction({
				from: account,
				to: contract.address,
				value: res.price,
				data,
			})
			// .on('transactionHash', function (hash) {
			// 	console.log(hash)
			// })
			// .on('receipt', function (receipt) {
			// 	console.log(receipt)
			// })
			// .on('confirmation', function (confirmationNumber, receipt) { console.log(confirmationNumber, receipt) })
			// .on('error', console.error);
		});
	};

	if (product) console.log(product.status, typeof product.status)

	return (product) ? (
		<div className="row g-0" style={{ margin: "-1rem" }}>
			<div className="col-md-4">
				<div
					className="h-100 rounded overflow-hidden bg-secondary"
					style={{
						background: `url(${product.image || "/logo192.png"})`,
						backgroundPosition: "center",
						backgroundSize: "cover"
					}}
				>
					{/* <img
						className="img-fluid"
						src={product.image || "/logo192.png"}
						alt={contract.web3.utils.hexToAscii(product.name).replace(/\u0000/g, '')}
						onError={(e) => { if (e.target.src != "/logo192.png") e.target.src = "/logo192.png" }}
					/> */}
				</div>
			</div>
			<div className="col-md-8">
				<div className="card-body">
					<h4 className="card-title mb-4">{contract.web3.utils.hexToAscii(product.name).replace(/\u0000/g, '')}</h4>
					<h5 className="card-title mb-3">{contract.web3.utils.fromWei(product.price, "ether")} ETH</h5>
					<p className="card-text mb-3">Owned by {product.seller}</p>
					<p className="card-text mb-5">{product.description}</p>
					{product.status != "0"
						? product.status === "1"
							? <p className="text-success">Sold</p>
							: <p className="text-dark">Removed</p>
						: product.seller === account
							? <button onClick={removeItem} className="btn btn-danger">Remove</button>
							: !buyTxHash && <button onClick={buyItem} className="btn btn-primary">Buy</button>
					}
					{buyTxHash && <h5 className="text-break">Tx Hash:{buyTxHash}</h5>}
				</div>
			</div>
		</div>
	) : <div></div>;
}

export default ViewProduct;