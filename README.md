# AnyCall
### Approve, Trade and transfer in a single transaction.

AnyCall is a Solidity project that enables chaining multiple contract calls into a single Ethereum Virtual Machine(EVM) transaction. It provides a solution for Web3 users who need to execute multiple operations in a single transaction, simplifying workflows and reducing gas costs. This project is ideal for scenarios where users interact with multiple contracts and want to optimize their on-chain actions.

## Features
- Chain Multiple Calls: Allows users to chain multiple contract function calls within one transaction, reducing the overhead of individual transactions.
- Gas Optimization: By bundling several operations into a single transaction, users can potentially save on gas fees.
- Ease of Use: Provides a simple interface to execute sequential calls, even when interacting with different contracts.


## Local installation

- `npm install`
- `npx hardhat deploy`
- `npx hardhat test`


## Functions:
- execute(address[] targets, bytes[] data): Executes multiple contract calls in sequential order. It ensures the same number of targets and calldata arrays, reverting the transaction in case of failure. If your function has no inputs, provide 0x as data for the corresponding address.

## License
MIT
