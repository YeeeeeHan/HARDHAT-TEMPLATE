import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { Frg } from "../typechain-types/contracts/erc20tokens/Frg";
import { Frg__factory } from "../typechain-types/factories/contracts/erc20tokens/Frg__factory";

describe("Token frgContract", function () {
  async function deployContractFixture(): Promise<{
    contractFactory: Frg__factory;
    frgContract: Frg;
    owner: SignerWithAddress;
    addr1: SignerWithAddress;
    addr2: SignerWithAddress;
  }> {
    // Get the ContractFactory and Signers here.
    const contractFactory: Frg__factory = await ethers.getContractFactory(
      "Frg"
    );
    const [owner, addr1, addr2]: SignerWithAddress[] =
      await ethers.getSigners();
    const frgContract = await contractFactory.deploy();
    await frgContract.deployed();

    // Fixtures can return anything you consider useful for your tests
    return { contractFactory, frgContract, owner, addr1, addr2 };
  }

  describe("Deployment", function () {
    it("Should assign the 7_000_000 tokens to the owner", async function () {
      const { frgContract, owner } = await loadFixture(deployContractFixture);
      const ownerBalance = await frgContract.balanceOf(owner.address);
      expect(ownerBalance.toString()).to.equal(
        (7_000_000 * 10 ** 18).toLocaleString("fullwide", {
          useGrouping: false,
        })
      );
    });

    it("Should have the correct MAXIMUMSUPPLY of 10_000_000", async function () {
      const { frgContract } = await loadFixture(deployContractFixture);
      expect(await frgContract.MAXIMUMSUPPLY()).to.equal(
        (10_000_000 * 10 ** 18).toLocaleString("fullwide", {
          useGrouping: false,
        })
      );
    });

    it("Tokensupply should equal owner balance", async function () {
      const { frgContract, owner } = await loadFixture(deployContractFixture);
      const ownerBalance = await frgContract.balanceOf(owner.address);
      expect(await frgContract.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("ERC20 - Transfer()", function () {
    it("Should transfer tokens between accounts", async function () {
      const { frgContract, addr1, addr2 } = await loadFixture(
        deployContractFixture
      );

      // Transfer 50 tokens from owner to addr1
      await frgContract.transfer(addr1.address, 50);
      const addr1Balance = await frgContract.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);

      // Transfer 50 tokens from addr1 to addr2
      // Use .connect(signer) to send a transaction from another account
      await frgContract.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await frgContract.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });

    it("Should fail if sender doesnt have enough tokens", async function () {
      const { frgContract, owner, addr1 } = await loadFixture(
        deployContractFixture
      );

      const initialOwnerBalance = await frgContract.balanceOf(owner.address);

      const TRANSFER_AMOUNT = 100;

      // Try to send TRANSFER_AMOUNT tokens from addr1 (0 tokens) to owner.
      // `require` will evaluate false and revert the transaction.
      await expect(
        frgContract.connect(addr1).transfer(owner.address, TRANSFER_AMOUNT)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

      // Owner balance shouldn't have changed.
      expect(await frgContract.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

    it("Should update balances after transfers", async function () {
      const { frgContract, owner, addr1 } = await loadFixture(
        deployContractFixture
      );
      const initialOwnerBalance = await frgContract.balanceOf(owner.address);

      const TRANSFER_AMOUNT = 100;

      // Transfer 100 tokens from owner to addr1.
      await frgContract.transfer(addr1.address, TRANSFER_AMOUNT);

      // Check balances.
      const finalOwnerBalance = await frgContract.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(
        initialOwnerBalance.sub(TRANSFER_AMOUNT)
      );

      const addr1Balance = await frgContract.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(TRANSFER_AMOUNT);
    });
  });
});
