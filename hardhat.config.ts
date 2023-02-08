import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import "hardhat-gas-reporter";

require("dotenv").config();

const {
  PRIVATE_KEY,
  ETHERSCAN_API_KEY,
  POLYGONSCAN_API_KEY,
  ALCHEMY_MUMBAI_URL,
  ALCHEMY_GOERLI_URL,
} = process.env;

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  // defaultNetwork: "polygon_mumbai",
  networks: {
    hardhat: {},
    goerli: {
      url: ALCHEMY_GOERLI_URL,
      accounts: [PRIVATE_KEY!],
    },
    polygon_mumbai: {
      url: ALCHEMY_MUMBAI_URL,
      accounts: [PRIVATE_KEY!],
    },
  },
  etherscan: {
    apiKey: {
      //ethereum
      mainnet: ETHERSCAN_API_KEY!,
      // ropsten: ETHERSCAN_API_KEY,
      goerli: ETHERSCAN_API_KEY!,
      // kovan: ETHERSCAN_API_KEY,
      //polygon
      polygon: POLYGONSCAN_API_KEY!,
      polygonMumbai: POLYGONSCAN_API_KEY!,
    },
  },
  paths: { tests: "tests" },
  // gasReporter: {
  // 	enabled: false,
  // },
};

export default config;
