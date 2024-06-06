import { ethers } from "hardhat";
import fs from "fs";
import path from "path";
import dotenv from 'dotenv';

async function main() {

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account: ", deployer.address);

  const Fundraiser = await ethers.getContractFactory("Fundraiser");
  const fundraiser = await Fundraiser.deploy();
  await fundraiser.waitForDeployment();

  const fundraiserAddress = await fundraiser.getAddress(); // Get the deployed contract address
  console.log("Fundraiser contract deployed to:", fundraiserAddress);

  // Update the .env file with the new contract address
  updateEnvFile(fundraiserAddress);
  
  console.log(`Updated .env with contract address: ${fundraiserAddress}`);  
}

function updateEnvFile(fundraiserAddress: string) {
  const envPath = path.resolve(__dirname, '../.env');
  const envFileContent = fs.readFileSync(envPath, 'utf8');
  const envVars = dotenv.parse(envFileContent);

  envVars.FUNDRAISER_CONTRACT_ADDRESS = fundraiserAddress;

  const updatedEnvContent = Object.entries(envVars)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');

  fs.writeFileSync(envPath, updatedEnvContent);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});