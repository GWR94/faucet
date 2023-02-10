// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./Logger.sol";
import "./Owned.sol";
import "./IFaucet.sol";

/** 
  == KEYWORDS ==

  EXTERNAL
  External functions are functions which are part of the contract but can only be used externally (outside of 
  the contract by other contracts)

  PAYABLE
  The payable keyword in a functions allows a user to send ether to a contract and run code to account for the
  deposit

  PURE
  Adding the pure keyword notes that the function should not read or modify variables of the storage state in
  any way. Pure functions cost zero gas fees due to the function not updating the storage state.

  VIEW
  Adding the view keyword notes that the function will not modify data from the storage state, however it can still
  read data from the contract. View functions cost zero gas fees due to the function not updating the storage state.

  PRIVATE
  A function with the private keyword can only be accessible within the current smart contract, and can not be accessed
  at all outside of it or derived smart contracts.

  INTERNAL
  A function with the internal keyword can only be accessible within the current smart contract, but also derived smart
  contracts

  RETURNS(TYPE)
  The returns keyword is a keyword that notes what type will be returned from the function call. The TYPE in the
  parameter determines the type which should be returned, such as uint256, as shown below

  READ-ONLY VS TRANSACTIONS
  Read-only functions such as pure or view functions do not cost any gas fees due to the function not modifying the
  storage state. Transactions, however, cost gas fees due to the storage state being updated.

  PUBLIC VS EXTERNAL
  If a function uses the external keyword, it cannot be used inside the current smart contract, and can only be used
  via other external contracts. If a function usesd the public keyword, it can be used both by the internal smart
  contract and other contracts externally.


*/

contract Faucet is Owned, Logger, IFaucet {
    uint256 public numOfFunders;

    mapping(address => bool) private funders;
    mapping(uint256 => address) private lutFunders;

    /**
      MODIFIER
      Modifiers bring utility by giving a way to repeat multiple lines of code without actually repeating the code that you
      write.
     */
    modifier limitWithdraw(uint256 withdrawAmount) {
        require(
            withdrawAmount <= 100000000000000000,
            "Cannot withdraw more than 0.1 ether"
        );
        // the _; is signifying that it will run the function body if all conditions are met.
        _;
    }

    function adminFuncOne() external checkAdmin {
        // do something for admin
    }

    function adminFuncTwo() external checkAdmin {
        // do something for admin 2
    }

    receive() external payable {}

    function addFunds() external payable override {
        address funder = msg.sender;
        if (!funders[funder]) {
            uint256 idx = numOfFunders++;
            funders[funder] = true;
            lutFunders[idx] = funder;
        }
    }

    function emitLog() public pure override returns (bytes32) {
        return "Hello world!";
    }

    function withdraw(uint256 withdrawAmount)
        external
        override
        // limitWithdraw is a modifier
        limitWithdraw(withdrawAmount)
    {
        payable(msg.sender).transfer(withdrawAmount);
    }

    function getAllFunders() public view returns (address[] memory) {
        address[] memory _funders = new address[](numOfFunders);
        for (uint256 i = 0; i < numOfFunders; i++) {
            _funders[i] = lutFunders[i];
        }
        return _funders;
    }

    function getFunderAtIndex(uint8 index) public view returns (address) {
        // address[] memory _funders = getAllFunders();
        return lutFunders[index];
    }
}

/**
  const instance = await Faucet.deployed();
  instance.addFunds({ value: "1000000000000000000", from: accounts[0] });
  instance.addFunds({ value: "1000000000000000000", from: accounts[1] });
  instance.addFunds({ value: "1000000000000000000", from: accounts[2] });
  instance.withdraw("500000000000000000", { from: accounts[0] });

 */
