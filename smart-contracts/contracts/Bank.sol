//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

contract Bank {
    mapping (address => uint256) private balances;
    address public owner;
    bool isWithdrawing = false;
    
    struct Transaction {
        uint transactionCount;
        string transactionType;
        uint amount;
        uint time;
    }

    mapping (address => Transaction[]) public Transactions;

    constructor() {
        /* Set the owner to the creator of this contract */
        owner = msg.sender;
    }

    // Deposit ether into bank
    function deposit() public payable {
        balances[msg.sender] += msg.value;
        createTransaction("Deposit", msg.value, block.timestamp);
    }

    // Withdraw ether from bank
    function withdraw(uint256 amount) public {
        require(!isWithdrawing, "Wait till your previous request is fulfilled");
        isWithdrawing = true;
        // Check if enough balance available
        require(amount <= balances[msg.sender], "Insufficient funds!");
        (bool success, ) = payable(msg.sender).call{ value: amount }("");
        if(success){
            balances[msg.sender] -= amount;
        }
        require(success, "Transfer failed.");
        isWithdrawing = false;
        createTransaction("Withdrawal", amount, block.timestamp);
    }

    function transfer(address receiver, uint256 amount) public{
        require(balances[msg.sender]>=amount,"Insufficient Funds");
        balances[msg.sender] -= amount;
        (bool success, ) = payable(receiver).call{value:amount}("");
        require(success,"Transfer failed");
    }

    function createTransaction(string memory _transactionType, uint256 _amount, uint256 _time) internal {
        Transaction[] memory _transactions = Transactions[msg.sender];
        uint transactionCount = _transactions.length + 1;
        Transaction memory transaction = Transaction(transactionCount,_transactionType, _amount, _time);
        Transactions[msg.sender].push(transaction);
    }

    // Reads balance of the account requesting
    function balance() public view returns (uint256) {
        return balances[msg.sender];
    }

    // Balance of Bank contract
    function totalBalance() public view returns (uint256) {
        require(msg.sender == owner);
        return address(this).balance;
    }
    function getAllTransactions() public view returns (Transaction[] memory){
        uint256 transactionCount = Transactions[msg.sender].length;
        Transaction[] memory txs = Transactions[msg.sender];
        Transaction[] memory userTransactions = new Transaction[](transactionCount);
        for(uint i = 0; i<transactionCount;i++){
            userTransactions[i] = txs[i];
        }
        return userTransactions;
    }
}