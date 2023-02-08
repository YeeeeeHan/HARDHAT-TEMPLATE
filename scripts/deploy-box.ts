import { ethers } from "hardhat";
import verify from "./verify-contract";

const contractName = "Pet";

async function deployPet() {
  const provider = ethers.provider;
  const Pokemon = await ethers.getContractFactory(contractName);

  console.log("Deploying...");
  const PokemonContract = await Pokemon.deploy();
  await PokemonContract.deployTransaction.wait(5);
  console.log(`Contract deployed to ${PokemonContract.address}`);
  await verify(PokemonContract.address, [], ethers.provider.network.chainId);
}

deployPet()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
