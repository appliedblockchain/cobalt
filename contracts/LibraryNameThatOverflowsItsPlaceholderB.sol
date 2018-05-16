pragma solidity ^0.4.23;

library LibraryNameThatOverflowsItsPlaceholderB {

  function longLengthB(bytes data) public pure returns (uint256) {
    return data.length;
  }

}
