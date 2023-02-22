import { ethers } from "hardhat";

import verify from "./verify-contract";

async function deployFrg() {
  const Frg = await ethers.getContractFactory("Frg");
  console.log("Deploying...");
  const FrgContract = await Frg.deploy();
  await FrgContract.deployTransaction.wait(5);
  console.log(`Contract deployed to ${FrgContract.address}`);
  await verify(FrgContract.address, [], ethers.provider.network.chainId);
}

deployFrg()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
