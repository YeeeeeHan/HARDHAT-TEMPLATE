// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

import "../erc20tokens/Frg.sol";
import "hardhat/console.sol";

error InsufficientFrgBalance();

contract Pet is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    Frg public immutable frgTokenAddress;
    uint256 public rate = 10 * 10 ** 18; // FRG tokens required per mint

    constructor(address _frgTokenAddress) ERC721("Pet", "PET") {
        frgTokenAddress = Frg(_frgTokenAddress);
    }

    function safeMint(string memory uri, address minter) public onlyOwner {
        // Burn Frg as the cost for minting
        frgTokenAddress.burnFrom(minter, rate);

        // Perform NFT minting
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(minter, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function safeMintWithBurnFrg(
        string memory uri,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public {
        if (frgTokenAddress.balanceOf(_msgSender()) < rate)
            revert InsufficientFrgBalance();
        frgTokenAddress.permit(
            _msgSender(),
            address(this),
            rate,
            deadline,
            v,
            r,
            s
        );
        // Burn Frg as the cost for minting
        frgTokenAddress.burnFrom(_msgSender(), rate);

        // Perform NFT minting
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(_msgSender(), tokenId);
        _setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(
        uint256 tokenId
    ) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
