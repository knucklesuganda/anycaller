import { expect } from "chai";
import { ethers } from "hardhat";
import { AnyCall } from "../contracts/typechain-types/AnyCall";
import { deployTestContracts } from "./functions";


describe("AnyCall", function () {
    let AnyCallFactory;
    let anyCallInstance: AnyCall;

    beforeEach(async function () {
        AnyCallFactory = await ethers.getContractFactory("AnyCall");
        anyCallInstance = await AnyCallFactory.deploy();
        await anyCallInstance.waitForDeployment();
    });

    it("Should revert if targets and data lengths don't match", async function () {
        await expect(anyCallInstance.execute(
            [ethers.ZeroAddress],
            []
        )).to.be.revertedWith("Invalid number of contracts or data provided");

        await expect(anyCallInstance.execute(
            [],
            ['0x' + Buffer.from(new Uint8Array(32)).toString('hex')]
        )).to.be.revertedWith("Invalid number of contracts or data provided");
    });

    it("Should successfully call multiple contracts", async function () {
        const contracts = await deployTestContracts(3);
        const randomAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';
        const firstValue = 12345;
        const secondValue = 67890;
        const thirdValue = 12345;
        const [owner, _] = await ethers.getSigners();


        const targets = await Promise.all(contracts.map(async (contract) => await contract.getAddress()));
        const data = [
            contracts[0].interface.encodeFunctionData('setValue', [firstValue]),
            contracts[1].interface.encodeFunctionData('setAnyBalance', [randomAddress, secondValue]),
            contracts[2].interface.encodeFunctionData('setAnyBalance', [owner.address, thirdValue]),
        ];

        const transaction = await anyCallInstance.execute(targets, data);
        await transaction.wait();

        await expect(await contracts[0].getValue()).to.be.equal(firstValue, "First operation did not go through");
        await expect(await contracts[1].balances(randomAddress)).to.be.equal(secondValue, "Second operation did not go through");
        await expect(await contracts[2].balances(owner.address)).to.be.equal(thirdValue, "Third operation did not go through");
    });

    it("Should revert at the correct index when a call fails", async function () {
        const testContracts = await deployTestContracts(1);

        const targets = [await testContracts[0].getAddress()];
        const data = [
            testContracts[0].interface.encodeFunctionData('reverter', [])
        ];

        await expect(anyCallInstance.execute(targets, data)).to.be.revertedWith("Operation did not succeed");
    });
});
