pragma solidity ^0.5.9;

library LibraryNameThatOverflowsItsPlaceholderA {

  function longLengthA(bytes memory data) public pure returns (uint256) {
    return data.length;
  }

}
