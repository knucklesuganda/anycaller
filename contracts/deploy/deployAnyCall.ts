import { HardhatRuntimeEnvironment } from "hardhat/types";


export default async function deployAnyCall(hre: HardhatRuntimeEnvironment) {

    let account;
    if(!hre.network.live){
        account = (await hre.getUnnamedAccounts())[0];
    }else{
        account = (await hre.getNamedAccounts())[0];
    }

    await hre.deployments.deploy('AnyCall', {
        from: account,
        log: true,
    });
};

module.exports.tags = ['AnyCall'];
