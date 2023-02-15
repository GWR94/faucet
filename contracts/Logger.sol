// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

/**
  ABSTRACT
  Is a way for designer to say that any 'child' of the abstract contract has to
  implement specified methods to use them.

  INHERITANCE
  private   function can only be used from within the current contract
  internal  function can be called from within the contract, or the contracts that are inheriting
            the current contract.
  public    function can be called from anywhere, inside or outside the smart contract.
  external  function can only be called from outside of the smart contract, not inside it.
 */

abstract contract Logger {
    // if a function does not need a function body then it needs the virtual keyword
    function emitLog() public pure virtual returns (bytes32);

    function test() internal pure returns (uint256) {
        return 100;
    }
}
