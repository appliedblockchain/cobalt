pragma solidity ^0.5.9;

library Library {

  function length(bytes memory data) public pure returns (uint256) {
    return data.length;
  }

}
