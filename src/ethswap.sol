pragma solidity ^0.4.21;

contract ethswap {
  bytes32 keyHash;
  uint expiration;
  address deployer;
  address recipient;

  function ethswap (bytes32 _keyHash, uint _expiration, address _recipient) payable public {
    keyHash = _keyHash;
    recipient = _recipient;
    expiration = _expiration;
    deployer = msg.sender;
  }

  function claim (bytes32 preHash) public {
    if (keccak256(preHash) == keyHash && msg.sender == recipient) {
      msg.sender.transfer(address(this).balance);
    }
  }

  function expire () public {
    if (now > expiration) {
      deployer.transfer(address(this).balance);
    }
  }
}
