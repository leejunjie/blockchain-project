// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract P2P {
    enum ItemStatus {
        active,
        sold,
        removed
    }

    struct Item {
        string image;
        bytes32 name;
        uint256 price;
        address seller;
        ItemStatus status;
    }

    event ItemAdded(
        uint256 id,
        string image,
        bytes32 name,
        uint256 price,
        address seller
    );
    event ItemPurchased(uint256 itemID, address buyer, address seller);
    event ItemRemoved(uint256 itemID);
    event FundsPulled(address owner, uint256 amount);

    Item[] private _items;
    mapping(address => uint256) public _pendingWithdrawals;

    modifier onlyIfItemExists(uint256 itemID) {
        require(_items[itemID].seller != address(0));
        _;
    }

    function addNewItem(
        string memory image,
        bytes32 name,
        uint256 price
    ) public returns (uint256 itemID) {
        _items.push(
            Item({
                image: image,
                name: name,
                price: price,
                seller: msg.sender,
                status: ItemStatus.active
            })
        );

        uint256 id = _items.length - 1;

        emit ItemAdded(id, image, name, price, msg.sender);

        return id;
    }

    function getItem(uint256 itemID)
        public
        view
        onlyIfItemExists(itemID)
        returns (
            bytes32 name,
            uint256 price,
            address seller,
            uint256 status
        )
    {
        Item storage item = _items[itemID];
        return (item.name, item.price, item.seller, uint256(item.status));
    }

    function getAllItem() public view returns (Item[] memory) {
        return _items;
    }

    function buyItem(uint256 itemID) public payable onlyIfItemExists(itemID) {
        Item storage currentItem = _items[itemID];

        require(currentItem.status == ItemStatus.active);
        require(currentItem.price >= msg.value);

        _pendingWithdrawals[currentItem.seller] = currentItem.price;
        currentItem.status = ItemStatus.sold;

        emit ItemPurchased(itemID, msg.sender, currentItem.seller);
    }

    function removeItem(uint256 itemID) public onlyIfItemExists(itemID) {
        Item storage currentItem = _items[itemID];

        require(currentItem.seller == msg.sender);
        require(currentItem.status == ItemStatus.active);

        currentItem.status = ItemStatus.removed;

        emit ItemRemoved(itemID);
    }

    function pullFunds() public returns (bool) {
        require(_pendingWithdrawals[msg.sender] > 0);

        uint256 outstandingFundsAmount = _pendingWithdrawals[msg.sender];

        bool sendResult = payable(msg.sender).send(outstandingFundsAmount);
        if (sendResult) {
            _pendingWithdrawals[msg.sender] = 0;

            emit FundsPulled(msg.sender, outstandingFundsAmount);
            return true;
        } else {
            return false;
        }
    }
}
