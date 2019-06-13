pragma solidity ^0.5.9;

/**
 * Minimal ERC20 implementation for tests.
 */
contract Erc20Mock {

  mapping (address => uint) balances;

  function balanceOf(address _address) public view returns (uint) {
    return balances[_address];
  }

  function setBalanceOf(address _address, uint balance) public {
    balances[_address] = balance;
  }

}
