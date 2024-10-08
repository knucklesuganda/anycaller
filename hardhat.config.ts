import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";


const config: HardhatUserConfig = {
    solidity: "0.8.27",
    networks: {
        hardhat: {
            chains: {
                1: {
                    hardforkHistory: {
                        london: 12965000,
                        shanghai: 30000000,
                    }
                },
                137: {
                    hardforkHistory: {
                        berlin: 23850000,
                        london: 30000000,
                        shanghai: 62000000,
                    }
                },
            }
        },
    },
};

export default config;
