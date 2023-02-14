import { ethers } from "hardhat";

import verify from "./verify-contract";

async function deployPet() {
  const Frg = await ethers.getContractFactory("Frg");

  //================================================================================
  // Deploy Contract
  //================================================================================

  console.log("Deploying...");
  const FrgContract = await Frg.deploy();

  await FrgContract.deployTransaction.wait(5);

  console.log(`Contract deployed to ${FrgContract.address}`);

  //================================================================================
  // Verify Contract
  //================================================================================

  await verify(FrgContract.address, [], ethers.provider.network.chainId);

  //   //================================================================================
  //   // Renounce Default Admin Role
  //   //================================================================================
  //
  //   const roleTransferred = await PokemonContract.hasRole(
  //     DEFAULT_ADMIN_ROLE,
  //     MULTISIG_ADDRESS-
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
