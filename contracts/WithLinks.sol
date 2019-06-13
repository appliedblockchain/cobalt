pragma solidity ^0.5.9;

import "./Library.sol";
import "./LibraryNameThatOverflowsItsPlaceholderA.sol";

contract WithLinks {

  event Event(string message);

  function emitIfNonEmpty(string memory _string) public returns (uint256) {
    uint length = Library.length(bytes(_string));
    uint longLengthA = LibraryNameThatOverflowsItsPlaceholderA.longLengthA(bytes(_string));

    if (length > 0) {
      emit Event(_string);
    }

    return length + longLengthA;
  }

}
