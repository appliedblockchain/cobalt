pragma solidity ^0.4.23;

import "./Library.sol";
import "./LibraryNameThatOverflowsItsPlaceholderA.sol";

contract WithLinks {

  event Event(string message);

  function emitIfNonEmpty(string _string) public returns (uint256) {
    uint length = Library.length(bytes(_string));
    uint longLengthA = LibraryNameThatOverflowsItsPlaceholderA.longLengthA(bytes(_string));

    if (length > 0) {
      emit Event(_string);
    }

    return length + longLengthA;
  }

}
