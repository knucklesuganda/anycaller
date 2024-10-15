// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;


// Contract for inner tests, do not use anywhere except for tests!
contract TestContract {
    uint256 public value;
    mapping(address => uint256) public balances;

    function setValue(uint256 _value) external {
        value = _value;
    }

    function getValue() external view returns (uint256) {
        return value;
    }

    function setMyBalance(uint256 balance) external {
        balances[msg.sender] = balance;
    }

    function setAnyBalance(address balanceOwner, uint256 balance) external{
        balances[balanceOwner] = balance;
    }

    function reverter() external pure {
        revert("ERROR!");
    }
}