import { ethers } from "hardhat";

import verify from "./verify-contract";

const { PRIVATE_KEY = "", MULTISIG_ADDRESS = "" } = process.env;

async function deployPet() {
  const provider = ethers.provider;
  const Pokemon = await ethers.getContractFactory("Pet");

  //================================================================================
  // Deploy Contract
  //================================================================================

  console.log("Deploying...");
  const PokemonContract = await Pokemon.deploy();

  await PokemonContract.deployTransaction.wait(5);

  console.log(`Contract deployed to ${PokemonContract.address}`);

  // //================================================================================
  // // Grant Default Admin Role to MultiSig
  // //================================================================================
  //
  // console.log("Granting Default Admin Role to Multisig...");
  // // Grant Default Admin role to MultiSig
  // const grantTxn = await PokemonContract.grantRole(
  //   DEFAULT_ADMIN_ROLE,
  //   MULTISIG_ADDRESS
  // );
  // grantTxn.wait(5);

  //================================================================================
  // Verify Contract
  //================================================================================

  await verify(
    PokemonContract.address,
    [],
    ethers.provider.network.chainId
  );

//   //================================================================================
//   // Renounce Default Admin Role
//   //================================================================================
//
//   const roleTransferred = await PokemonContract.hasRole(
//     DEFAULT_ADMIN_ROLE,
//     MULTISIG_ADDRESS
//   );
//   console.log("Role Transfered:", roleTransferred);
//
//   // Renounce Default Admin Role if grant transaction succeeds
//   if (roleTransferred) {
//     console.log("Renouncing Admin Role...");
//     const signer = new ethers.Wallet(PRIVATE_KEY, provider);
//     const renounceTxn = await PokemonContract.renounceRole(
//       DEFAULT_ADMIN_ROLE,
//       signer.address
//     );
//     renounceTxn.wait(5);
//     console.log("Renounced");
//   } else {
//     console.log("Transaction Failure");
//   }
}

deployPet()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
