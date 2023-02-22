import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { Frg__factory, Frg, Pet, Pet__factory } from "../typechain-types";
import { GetPermitSignature } from "./test-frg";
import { Contract } from "ethers";

const name = "Pet";
const symbol = "PET";
const rate = (100 * 10 ** 18).toLocaleString("fullwide", {
  useGrouping: false,
});
const url = "https://www.jsonkeeper.com/b/C19T";
const firstTokenId = 0;
const secondTokenId = 1;

describe("Pet NFT", function () {
  // Deploys Pet NFT contract
  async function deployPetContractFixture(): Promise<{
    contractFactory: Pet__factory;
    petContract: Pet;
    frgContract: Frg;
    owner: SignerWithAddress;
    addr1: SignerWithAddress;
    addr2: SignerWithAddress;
  }> {
    const frgContractFactory: Frg__factory = await ethers.getContractFactory(
      "Frg"
    );
    const frgContract = await frgContractFactory.deploy();
    await frgContract.deployed();
    // Get the ContractFactory and Signers here.
    const contractFactory: Pet__factory = await ethers.getContractFactory(
      "Pet"
    );
    const [owner, addr1, addr2]: SignerWithAddress[] =
      await ethers.getSigners();
    // TODO: solve typescript address issue
    console.log("deployed frgContract to ", frgContract.address);
    const petContract = await contractFactory.deploy(frgContract.address);
    await petContract.deployed();
    console.log("deployed petContract to ", petContract.address);

    // Fixtures can return anything you consider useful for your tests
    return { contractFactory, petContract, frgContract, owner, addr1, addr2 };
  }

  describe("Deployment", function () {
    it("should have a name", async function () {
      const { petContract } = await loadFixture(deployPetContractFixture);
      expect(await petContract.name()).to.equal(name);
    });

    it("should have a symbol", async function () {
      const { petContract } = await loadFixture(deployPetContractFixture);
      expect(await petContract.symbol()).to.equal(symbol);
    });

    it("should have a frgTokenAddress", async function () {
      const { petContract, frgContract } = await loadFixture(
        deployPetContractFixture
      );
      expect(await petContract.frgTokenAddress()).to.equal(frgContract.address);
    });

    it("should have correct rate", async function () {
      const { petContract } = await loadFixture(deployPetContractFixture);
      expect(await petContract.rate()).to.equal(rate);
    });
  });

  describe("Minting", function () {
    it("should return NFT balance of 0 if no NFT had been minted", async function () {
      const { petContract, owner, addr1 } = await loadFixture(
        deployPetContractFixture
      );
      expect(await petContract.balanceOf(owner.address)).to.equal(0);
      expect(await petContract.balanceOf(addr1.address)).to.equal(0);
    });

    it("should not mint if insufficient Frg tokens", async function () {
      const { petContract, frgContract, addr1 } = await loadFixture(
        deployPetContractFixture
      );

      // Addr1 should not have any FRG tokens initially
      expect(await frgContract.balanceOf(addr1.address)).to.be.equal(0);

      // No deadline
      const deadline = ethers.constants.MaxUint256;
      const { v, r, s } = await GetPermitSignature(
        addr1,
        frgContract,
        petContract.address,
        rate,
        deadline
      );
      console.log(
        "GetPermitSignature args:",
        // addr1,
        // frgContract,
        addr1.address,
        rate,
        deadline,
        v,
        r,
        s
      );

      await expect(
        petContract
          .connect(addr1)
          .safeMintWithBurnFrg(url, ethers.constants.MaxUint256, v, r, s)
      ).to.be.revertedWithCustomError(petContract, "InsufficientFrgBalance");
    });

    it("should successfully mint with sufficient Frg tokens", async function () {
      const { petContract, frgContract, addr1 } = await loadFixture(
        deployPetContractFixture
      );

      // Addr1 should have enough FRG tokens initially
      await frgContract.connect(addr1).mint(addr1.address, rate);
      expect(await frgContract.balanceOf(addr1.address)).to.be.equal(rate);

      // Addr1 mints NFT
      console.log("In test.ts, addr1: ", addr1.address);

      // Offchain addr1 signing of permit
      const { v, r, s } = await GetPermitSignature(
        addr1,
        frgContract,
        petContract.address,
        rate,
        ethers.constants.MaxUint256
      );

      // Minting
      await petContract
        .connect(addr1)
        .safeMintWithBurnFrg(url, ethers.constants.MaxUint256, v, r, s);

      // NFT balance should increase to 1
      expect(await petContract.balanceOf(addr1.address)).to.be.equal(1);

      // Frg token balance should decrease by rate
      expect(await frgContract.balanceOf(addr1.address)).to.be.equal(0);
    });

    // it("should return correct balanceOf after minting tokens", async function () {
    //   const { petContract, owner } = await loadFixture(
    //     deployPetContractFixture
    //   );

    //   await petContract.safeMintWithBurnFrg(url);
    //   await petContract.safeMintWithBurnFrg(url);

    //   expect(await petContract.balanceOf(owner.address)).to.equal(2);
    // });

    // it("should revert for a zero address", async function () {
    //   const { petContract, owner } = await loadFixture(
    //     deployPetContractFixture
    //   );
    //   await expect(petContract.balanceOf(ZERO_ADDRESS)).to.be.revertedWith(
    //     "ERC721: address zero is not a valid owner"
    //   );
    // });

    // it("should return the correct uri", async function () {
    //   const { petContract } = await loadFixture(deployPetContractFixture);

    //   await petContract.safeMintWithBurnFrg(url);

    //   expect(await petContract.tokenURI(firstTokenId)).to.equal(url);
    // });
  });
});
