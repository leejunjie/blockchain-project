// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./Product.sol";

contract Seller is Product {
    function addProduct(
        string memory _name,
        uint256 _price,
        uint8 _quantity
    ) public {
        createItem(_name, _price, _quantity);
    }
}
