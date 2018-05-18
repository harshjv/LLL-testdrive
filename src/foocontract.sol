pragma solidity ^0.4.0;

contract foocontract {
  bytes32 keyHash;
  uint256 expiration;
  address deployer;
  address recipient;

  constructor (bytes32 _keyHash, uint256 _expiration, address _recipient) public payable {
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

  // for debugging purpose

  function get0() public constant returns (bytes32) {
    return keyHash;
  }

  function get1() public constant returns (uint256) {
    return expiration;
  }

  function get2() public constant returns (address) {
    return deployer;
  }

  function get3() public constant returns (address) {
    return recipient;
  }
}
