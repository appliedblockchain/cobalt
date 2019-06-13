pragma solidity ^0.5.9;

library LibraryNameThatOverflowsItsPlaceholderB {

  function longLengthB(bytes memory data) public pure returns (uint256) {
    return data.length;
  }

}
