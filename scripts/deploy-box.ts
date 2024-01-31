import { ethers } from "hardhat";
import verify from "./verify-contract";

const contractName = "Box";

async function deployPet() {
  const provider = ethers.provider;
  const Box = await ethers.getContractFactory(contractName);

  console.log("Deploying...");
  const BoxContract = await Box.deploy();
  await BoxContract.deployTransaction.wait(5);
  console.log(`Contract deployed to ${BoxContract.address}`);
  console.log(
    `ethers.provider.network.chainId: ${ethers.provider.network.chainId}`
  );
  await verify(BoxContract.address, [], ethers.provider.network.chainId);
}

deployPet()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
