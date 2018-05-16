pragma solidity ^0.4.23;

library Library {

  function length(bytes data) public pure returns (uint256) {
    return data.length;
  }

}
