// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

/**
  ABSTRACT
  Is a way for designer to say that any 'child' of the abstract contract has to
  implement specified methods to use them.
 */

abstract contract Logger {
    // if a function does not need a function body then it needs the virtual keyword
    function emitLog() public pure virtual returns (bytes32);

    function test() internal pure returns (uint256) {
        return 100;
    }
}
