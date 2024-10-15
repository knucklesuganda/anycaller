import { expect } from "chai";
import { ethers } from "hardhat";
import { AnyCallExecutor } from "../anycall-ethers";
import { deployTestContracts } from "./functions";


describe('AnyCallEthers', () => {
    let anyCall: AnyCallExecutor;

    beforeEach(async function () {
        const AnyCallFactory = await ethers.getContractFactory("AnyCall");
        const anyCallInstance = await AnyCallFactory.deploy();
        const response = await anyCallInstance.waitForDeployment();
        const [signer, _] = await ethers.getSigners();

        anyCall = new AnyCallExecutor({
            address: await response.getAddress(),
            signer: signer,
        });
    });

    it("Should call execute for multifunction input", async function () {
        const contracts = await deployTestContracts(3);

        const results = await anyCall.execute([
            { contract: contracts[0], functionName: 'setValue', params: [100] },
            { contract: contracts[1], functionName: 'setAnyBalance', params: ['0x4838B106FCe9647Bdf1E7877BF73cE8B0BAD5f97', 200] },
            { contract: contracts[2], functionName: 'setValue', params: [500] },
        ]);
        await results.wait();

        expect(await contracts[0].getValue()).to.be.eq(100, "Invalid value for contract 0");
        expect(await contracts[1].balances('0x4838B106FCe9647Bdf1E7877BF73cE8B0BAD5f97')).to.be.eq(200, "Invalid value for contract 1");
        expect(await contracts[2].getValue()).to.be.eq(500, "Invalid value for contract 2");
    });

});
