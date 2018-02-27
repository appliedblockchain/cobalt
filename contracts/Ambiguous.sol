pragma solidity ^0.4.18;

import "./Library.sol";
import "./LibraryOverflowsPlaceholderA.sol";
import "./LibraryOverflowsPlaceholderB.sol";

// This should not compile, but solc says it's fine - generating ambiguous placeholders. Fortunatelly we can catch it.
contract Ambiguous {

  event Event(string message);

  function emitIfNonEmpty(string _string) public returns (uint256) {
    uint length = Library.length(bytes(_string));
    uint longLengthA = LibraryOverflowsPlaceholderA.longLengthA(bytes(_string));
    uint longLengthB = LibraryOverflowsPlaceholderB.longLengthB(bytes(_string));

    if (length > 0) {
      Event(_string);
    }

    return length + longLengthA + longLengthB;
  }

}
