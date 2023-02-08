import { expect } from "chai";
import { ethers } from "hardhat";

const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");


describe("Box", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployContractFixture() {
    // Get the ContractFactory and Signers here.
    const Contract = await ethers.getContractFactory("Box");
    const [owner, addr1, addr2] = await ethers.getSigners();

    const contractInstance = await Contract.deploy();

    await contractInstance.deployed();

    // Fixtures can return anything you c>onsider useful for your tests
    return { Contract, contractInstance, owner, addr1, addr2 };
  }

  describe("Deployment", function () {
    it("Should get the right value after set", async function () {
      const { contractInstance, owner } = await loadFixture(
        deployContractFixture
      );
      await contractInstance.store(42);
      expect(await contractInstance.retrieve()).to.equal(42);
    });
  });
});
