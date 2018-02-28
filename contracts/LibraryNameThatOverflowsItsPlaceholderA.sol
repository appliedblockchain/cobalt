pragma solidity ^0.4.18;

library LibraryNameThatOverflowsItsPlaceholderA {

  function longLengthA(bytes data) public pure returns (uint256) {
    return data.length;
  }

}
