// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Owned {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier checkAdmin() {
        require(msg.sender == owner, "User is not an admin");
        _;
    }
}
