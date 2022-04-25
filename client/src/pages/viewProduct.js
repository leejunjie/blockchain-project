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
		<div>
			<div className="row justify-content-center">
				<div className="col-6">
					<img src={product.image || "/logo192.png"} className="w-100" />
				</div>
			</div>
			<div className="row justify-content-between mt-3">
				<div className="col-6">
					<h4>{contract.web3.utils.hexToAscii(product.name).replace(/\u0000/g, '')}</h4>
				</div>
				<div className="col-6 text-right">
					<h5 className="">{contract.web3.utils.fromWei(product.price, "ether")} ETH</h5>
				</div>
			</div>
			<div className="row justify-content-between">
				<div className="col-12">
					<p>Seller: {product.seller === account ? "Me" : product.seller}</p>
				</div>
				<div className="col-12 justify-content-end">
					{product.status != "0"
						? product.status === "1"
							? <p className="text-success text-right">Sold</p>
							: <p className="text-dark text-right">Removed</p>
						: product.seller === account
							? <button onClick={removeItem} className="btn btn-danger">Remove</button>
							: !buyTxHash && <button onClick={buyItem} className="btn btn-primary">Buy</button>
					}
				</div>
				{buyTxHash && <div className="col-12"><h5>Tx Hash: {buyTxHash}</h5></div>}
			</div>
		</div>
	) : <div></div>;
}

export default ViewProduct;