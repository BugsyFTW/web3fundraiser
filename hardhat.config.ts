import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import 'dotenv/config';

const config: HardhatUserConfig = {
  solidity: '0.8.4',
  networks: {
    localhost: {
      url: process.env.LOCALHOST_URL,
    },
  },
};

export default config;
