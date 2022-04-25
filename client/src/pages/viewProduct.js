import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";


function ViewProduct(props) {
	const [product, setProduct] = useState(null);
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
	}, []);

	const removeItem = () => {
		contract.methods["removeItem"].cacheSend(id, {
			from: account, gas: 3000000
		});
	}

	return (product) ? (
		<div>
			<div className="row justify-content-center">
				<div className="col-4">
					<img src={product.image || "/logo192.png"} />
				</div>
			</div>
			<div className="row justify-content-between">
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
				{product.status != "0" ? <div className="col-12">
					<div className="d-flex justify-content-center">
						{product.status === "1" ? <p className="bg-success text-light px-3 py-2">Sold</p> : <p className="bg-danger text-light px-3 py-2">Removed</p>}
					</div>
				</div>
					: (product.seller === account && <button onClick={removeItem}>Remove</button>)}
			</div>
		</div>
	) : <div></div>;
}

export default ViewProduct;