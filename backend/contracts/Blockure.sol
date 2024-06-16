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

    event CertificateGenerated(bytes32 _mintTransactionHash);
    
    struct Certificate { 
        string recipient_name;
        address recipient_address;
        address issuer_address;
        uint256 issued_date;
    }

    mapping(bytes32 => Certificate) public certificates;

    function stringToBytes32(string memory source) private pure returns (bytes32 result) {
        require(bytes(source).length > 0, "Input string must not be empty");

        assembly {
            result := mload(add(source, 32))
        }
    }

    function generateCertificate(
        string memory mintTransactionHash,
        string memory _recipientName,
        address _recipientAddress,
        address _issuerAddress,
        uint256 _issuedDate
    ) public {
        bytes32 byte_id = stringToBytes32(mintTransactionHash);
        require(certificates[byte_id].issued_date == 0, "Certificate with given transaction hash already exists");

        certificates[byte_id] = Certificate(_recipientName, _recipientAddress, _issuerAddress, _issuedDate);
        emit CertificateGenerated(byte_id);
    }

    function getCertificateData(string memory _mintTransactionHash) 
    public
    view 
    returns(
        string memory, 
        address, 
        address,
        uint256
    ) {
        bytes32 byte_id = stringToBytes32(_mintTransactionHash);
        Certificate memory cer = certificates[byte_id];

        require(cer.issued_date != 0, "No data exists");
        return (cer.recipient_name, cer.recipient_address, cer.issuer_address, cer.issued_date);
    }

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
