// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Blockure is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    constructor(address initialOwner)
    ERC721("Blockure", "BK")
    Ownable(initialOwner)
    {}

    function safeMint(address to, uint256 tokenId, string memory uri)
        public
        onlyOwner
    {
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function mintNFT(address recipient, string memory uri) public onlyOwner returns(uint256) {

        _nextTokenId += 1;

        uint256 newItemId = _nextTokenId;
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, uri);

        return newItemId;

    }

    // _beforeTokenTransfer method is a hook that is called before any token transfer
    // function _beforeTokenTransfer(address from, address to, uint256 firstTokenId, uint256 batchSize)
    // internal
    // override
    // virtual {
    //     require(from == address(0), "Err: BK Token transfer is BLOCKED");   
    //     super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
    // }

    function _update(address from, address to, uint256 value) internal virtual {
        require(from == address(0), "Err: BK Token transfer is BLOCKED");   
    }


    // The following functions are overrides required by Solidity.

    function tokenURI(uint256 tokenId)
    public
    view
    override(ERC721, ERC721URIStorage)
    returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721, ERC721URIStorage)
    returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
