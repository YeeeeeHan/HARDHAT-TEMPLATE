import { ethers } from "hardhat";

import verify from "./verify-contract";

const { PRIVATE_KEY = "", MULTISIG_ADDRESS = "" } = process.env;

const frgContract = "0x8cfcf856735748fbc8639a90540a90aefd766b61";

async function deployPet() {
  const Pet = await ethers.getContractFactory("Pet");
  console.log("Deploying...");
  const PetContract = await Pet.deploy(frgContract);
  await PetContract.deployTransaction.wait(5);
  console.log(`Contract deployed to ${PetContract.address}`);
  await verify(
    PetContract.address,
    [frgContract],
    ethers.provider.network.chainId
  );
}

deployPet()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
