import { ethers } from 'ethers';
import { abi as originalABI } from './abis/AnyCall.json';


export class AnyCallExecutor {
    private signer: ethers.Signer;
    private contract: ethers.Contract;

    constructor(data: { address: string, signer: ethers.Signer, abi?: any }) {
        this.signer = data.signer;
        this.contract = new ethers.Contract(
            data.address,
            data.abi !== undefined ? data.abi : originalABI,
            this.signer
        );
    }

    /**
     * Execute a series of contract calls with the provided targets and calldata.
     * @param targets - The addresses of the contracts you want to call.
     * @param data - Calldata for the contracts you want to call.
     * @returns The transaction that calls all operations
     */
    public async executeRaw(targets: string[], data: string[], options: { value?: ethers.BigNumberish } = {}) {
        if (targets.length !== data.length) {
            throw new Error("The number of targets and data must match.");
        }

        return await this.contract.execute(targets, data, options);
    }

    public async execute(operations: { contract: ethers.BaseContract, functionName: string, params: any[]}[]){
        const addresses: string[] = [];
        const data: string[] = [];

        for (const operation of operations) {
            const { contract, functionName, params } = operation;
            addresses.push(await contract.getAddress());
            const encodedCallData = contract.interface.encodeFunctionData(functionName, params);
            data.push(encodedCallData);
        }

        return await this.executeRaw(addresses, data);
    }

    /**
     * Listen for the OperationCompleted event emitted by the contract.
     * @param callback - Function to be called when the event is emitted.
     */
    public listenForOperationCompleted(callback: (target: string, operationIndex: number) => void) {
        this.contract.on("OperationCompleted", (target: string, operationIndex: number) => {
            callback(target, operationIndex);
        });
    }
}
