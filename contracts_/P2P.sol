// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract P2P {
    struct Item {
        address seller;
        string name;
        uint256 price;
        uint8 quantity;
    }

    Item[] public items;

    mapping(address => uint256[]) sellerProducts;

    // mapping(address => Item[]) public buyerOrderItems;
    // mapping(address => Item[]) public buyerReceivedItems;

    function addItem(
        string memory _name,
        uint256 _price,
        uint8 _quantity
    ) public {
        items.push(Item(msg.sender, _name, _price, _quantity));
        uint256 index = items.length - 1;
        sellerProducts[msg.sender].push(index);
    }

    function getItem(uint256 _index) public view returns (Item memory) {
        return items[_index];
    }

    function getAllItem() public view returns (Item[] memory) {
        return items;
    }
}

// contract Buyer is P2P {
//     function orderItem(uint256 _index, uint8 _quantity) public payable {
//         Item memory itemInfo = items[_index];
//         Item memory currentOrderItem = Item(
//             itemInfo.seller,
//             itemInfo.name,
//             itemInfo.price,
//             _quantity
//         );

//         uint256 totalAmount = currentOrderItem.price *
//             currentOrderItem.quantity;
//         require(msg.value <= totalAmount, "Not enough tokens in the reserve");

//         buyerOrderItems[msg.sender].push(currentOrderItem);

//         this.transferMoneyToMiddleman(totalAmount);
//     }

//     function getOrderItems() external view returns (Item[] memory) {
//         return buyerOrderItems[msg.sender];
//     }

//     function getOrderItem(uint256 _index) external view returns (Item memory) {
//         return buyerOrderItems[msg.sender][_index];
//     }

//     function orderReceived(uint256 _index) public {
//         if (_index >= buyerOrderItems[msg.sender].length) return;

//         Item memory currentReceivedItem = buyerOrderItems[msg.sender][_index];
//         // push to received
//         buyerReceivedItems[msg.sender].push(currentReceivedItem);

//         Item[] storage myOrderItems = buyerOrderItems[msg.sender];
//         for (uint256 i = _index; i < myOrderItems.length; i += 1) {
//             myOrderItems[i] = myOrderItems[i + 1];
//         }
//         delete myOrderItems[myOrderItems.length - 1];

//         // update order items list
//         // buyerOrderItems[msg.sender] = myOrderItems;

//         uint256 totalAmount = currentReceivedItem.price *
//             currentReceivedItem.quantity;
//         this.transferMoneyToSeller(currentReceivedItem.seller, totalAmount);
//     }

//     function transferMoneyToMiddleman(uint256 _amount) external payable {
//         payable(tx.origin).transfer(_amount);
//     }

//     function transferMoneyToSeller(address _seller, uint256 _amount)
//         external
//         payable
//     {
//         payable(_seller).transfer(_amount);
//     }
// }
