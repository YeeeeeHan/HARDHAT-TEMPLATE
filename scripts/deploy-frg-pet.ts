import { ethers } from "hardhat";

import verify from "./verify-contract";

async function deployAll() {
  // Deploy Frg contract
  const Frg = await ethers.getContractFactory("Frg");
  console.log("Deploying...");
  const FrgContract = await Frg.deploy();
  await FrgContract.deployTransaction.wait(5);
  console.log(
    `\x1b[32m[FRG CONTRACT] deployed to ${FrgContract.address}  \x1b[0m`
  );
  await verify(FrgContract.address, [], ethers.provider.network.chainId);

  // Deploy Pet contract
  const Pet = await ethers.getContractFactory("Pet");
  console.log("Deploying...!!");
  const PetContract = await Pet.deploy(FrgContract.address);
  await PetContract.deployTransaction.wait(5);
  console.log(
    `\x1b[32m [PET CONTRACT] Contract deployed to ${PetContract.address}  \x1b[0m`
  );
  await verify(
    PetContract.address,
    [FrgContract.address],
    ethers.provider.network.chainId
  );
}

deployAll()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
