import { ethers } from "hardhat";

import verify from "./verify-contract";

async function deployPet() {
  const Simplwswap = await ethers.getContractFactory("Simpleswap");

  console.log("Deploying...");
  const SimpleswapContract = await Simplwswap.deploy();

  await SimpleswapContract.deployTransaction.wait(5);

  console.log(`Contract deployed to ${SimpleswapContract.address}`);

  await verify(SimpleswapContract.address, [], ethers.provider.network.chainId);
}

deployPet()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
