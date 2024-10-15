// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";

contract AnyCall is Ownable{
    event OperationCompleted(address targets, uint16 operationIndex);

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Calls any number of contracts and functions in sequential order.
     * @param targets The addresses of the contracts you want to call.
     * @param data Calldata for all the addresses that you want to call.
     * @return All the returns of all the contracts.
     */
    function execute(
        address[] memory targets,
        bytes[] memory data
    ) external payable returns(bytes[] memory){
        require(targets.length == data.length, "Invalid number of contracts or data provided");
        bytes[] memory results = new bytes[](targets.length);

        // Nobody will use more than 65000 operations that's why uint16 is used.
        for(uint16 i = 0; i < targets.length; i++){
            (bool success, bytes memory result) = targets[i].call(data[i]);
            require(success, "Operation did not succeed");
            results[i] = result;
            emit OperationCompleted(targets[i], i);
        }

        return results;
    }

}