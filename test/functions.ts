import { expect } from "chai";
import { TestContract } from "../typechain-types";
import { ethers } from "hardhat";


export async function deployTestContracts(numberOfContracts: number): Promise<TestContract[]>{
    let contracts = [];
    
    for(let i = 0; i < numberOfContracts; i++){
        const TestContractFactory = await ethers.getContractFactory("TestContract");
        const testContract = await TestContractFactory.deploy();
        await testContract.waitForDeployment();
        contracts.push(testContract);
    }

    return contracts;
}
