// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

/**
  INTERFACES
  Interfaces cannot inherit from other smart contract, they can only inherit from
  other interfaces. Interfaces can also not declare a contructor, nor declare variables.
  All declared variables have to be external.
 */

interface IFaucet {
    // all functions in an interface must be external
    function addFunds() external payable;

    function withdraw(uint256 withdrawAmount) external;
}
