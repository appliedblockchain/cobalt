pragma solidity ^0.4.18;

import "./Library.sol";

contract Contract {

  event Event(string message);

  function emitIfNonEmpty(string _string) public returns (uint256) {
    uint256 length = Library.length(bytes(_string));

    if (length > 0) {
      Event(_string);
    }

    return length;
  }

}
