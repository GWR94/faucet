// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

/** 
  == KEYWORDS ==


*/

contract Storage {
    // maximum storage for one chunk is 32 bytes

    // mapping is stored like keccak256(key, slot)
    mapping(uint256 => uint256) public nums; // slot 0
    mapping(address => uint256) public addr; // slot 1

    // uint array is stored like keccak256(slot) + index of item
    uint256[] public numsArr;

    uint8 public a = 7; // 1 byte
    uint16 public b = 10; // 2 bytes
    address public c = 0x6f64C9EC2C287A9B5d7a3Ab2A7B931eA4Cd80310; // 20 bytes
    bool d = true; // 1 byte
    uint64 public e = 15; // 8 bytes
    // ALL = 32 bytes, which can be stored in one slot in storage slot 4

    uint256 public f = 200; // 32 bytes
    // f = 32 bytes, so must be stored on its own in storage slot 5

    uint8 public g = 40; // 1 byte
    // g goes into slot 6 as it cannot be placed in a full storage slot

    uint256 public h = 789; // 32 bytes

    // h goes into its own slot (7) as it needs a full 32 bytes to store data in slot

    // constructor is called as you are deploying the contract, so you can define values
    // inside it.
    constructor() {
        numsArr.push(1);
        numsArr.push(11);
        numsArr.push(111);
        nums[2] = 4;
        nums[3] = 10;
        addr[0x6f64C9EC2C287A9B5d7a3Ab2A7B931eA4Cd80310] = 100;
    }
}
// 0000000000000000000000000000000000000000000000000000000000000002
