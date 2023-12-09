
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleMoneyTransfer {
    struct HashDetails {
        string name;
        address account;
        uint256 balance;
    }

    mapping(bytes32 => HashDetails) public hashToAddress;

    event HashCreated(bytes32 indexed hash, string name, address account, uint256 balance);

    function createHash(string memory _name, address _address, uint256 _initialBalance) public returns (bytes32) {
        bytes32 hash = keccak256(abi.encodePacked(_name, _address));
        hashToAddress[hash] = HashDetails({ name: _name, account: _address, balance: _initialBalance });
        emit HashCreated(hash, _name, _address, _initialBalance);

        return hash;
    }

    function transferMoney(bytes32 _fromHash, bytes32 _toHash, uint256 _amount) public {
        require(hashToAddress[_fromHash].balance >= _amount, "Insufficient balance");

        hashToAddress[_fromHash].balance -= _amount;
        hashToAddress[_toHash].balance += _amount;
    }

    function checkBalance(bytes32 _hash) public view returns (uint256) {
        return hashToAddress[_hash].balance;
    }
}