// SPDX-License-Identifier: MIT LICENSE

pragma solidity ^0.8.17;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Frg is ERC20, ERC20Burnable, ERC20Permit, Ownable {
    using SafeMath for uint256;

    // mapping(address => bool) controllers;
    uint256 public constant MAXIMUMSUPPLY = 10_000_000 * 10 ** 18;

    constructor() ERC20("FRG Token", "FRG") ERC20Permit("FRG Token") {
        _mint(msg.sender, 7_000_000 * 10 ** 18);
    }

    function mint(address to, uint256 amount) external {
        // require(controllers[msg.sender], "Only controllers can mint");
        require(
            (totalSupply() + amount) <= MAXIMUMSUPPLY,
            "Minting would exceed total supply"
        );
        _mint(to, amount);
    }

    // function burnFrom(address account, uint256 amount) public override {
    //     if (controllers[msg.sender]) {
    //         _burn(account, amount);
    //     } else {
    //         super.burnFrom(account, amount);
    //     }
    // }

    // function addController(address controller) external onlyOwner {
    //     controllers[controller] = true;
    // }

    // function removeController(address controller) external onlyOwner {
    //     controllers[controller] = false;
    // }

    function totalSupply() public view override returns (uint256) {
        return super.totalSupply();
    }
}
