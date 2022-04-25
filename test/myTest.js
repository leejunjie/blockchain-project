const P2P = artifacts.require("P2P");

contract("P2P", accounts => {
	var itemName = "Product";
	var itemPrice = 1000;

	var itemID;
	it("should add a new product", async () => {

		const p2p = await P2P.deployed();

		// event
		p2p.ItemAdded({}, function (err, res) {
			if (err) console.error(err);

			itemID = res.args.id.toString();
		});

		await p2p.addNewItem(web3.utils.fromAscii(itemName), itemPrice, { from: accounts[1] });
	});

	it("should get a product", async () => {

		const p2p = await P2P.deployed();
		const getItemByIndex = await p2p.getItem(itemID);
		let { name, price, seller, status } = getItemByIndex;

		// Start testing. Use web3.toAscii() to convert the result of
		// the smart contract from Solidity bytecode to ASCII. After that
		// use the .replace() to pad the excess bytes from bytes32
		assert.equal(itemName, web3.utils.toAscii(name).replace(/\u0000/g, ''), "Name wasn't properly added");
		// Use assert.equal() to check all the variables
		assert.equal(itemPrice, price, "Price wasn't properly added");
		assert.equal(accounts[1], seller, "Seller wasn't properly added");
		assert.equal(status, 0, "Status wasn't properly added");
	});

	it("should buy a product", async () => {

		const p2p = await P2P.deployed();

		// event
		p2p.ItemPurchased({}, function (err, res) {
			if (err) console.error(err);

			// res.args
		});

		await p2p.buyItem(itemID, { from: accounts[2] });
	});
});
