import { useState, useEffect } from "react";
import { ethers } from "ethers";
import contract from "../Artifacts/Bank.json";
const BankContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const abi = contract.abi;

const Dashboard = ({ address }) => {
  const [hasDeposits, setHasDeposits] = useState(false);
  const [balance, setBalance] = useState(0);
  const [depositAmount, setDepositAmount] = useState();
  const [withdrawalAmount, setWithdrawalAmount] = useState();
  const [transferAmount, setTransferAmount] = useState();
  const [transferAddress, setTransferAddress] = useState("");
  const getBalance = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const BankContract = new ethers.Contract(
          BankContractAddress,
          abi,
          signer
        );
        const bal = await BankContract.balance();
        if (bal > 0) {
          setHasDeposits(true);
        }
        setBalance(ethers.utils.formatEther(bal));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeposit = async (event) => {
    event.preventDefault();
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const BankContract = new ethers.Contract(
          BankContractAddress,
          abi,
          signer
        );
        const tx = await BankContract.deposit({
          value: ethers.utils.parseEther(depositAmount),
        });
        await tx.wait();
        alert(`Deposit of ${depositAmount} Ether Successful`);
        setDepositAmount("");
        getBalance();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleWithdrawal = async (event) => {
    event.preventDefault();
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const BankContract = new ethers.Contract(
          BankContractAddress,
          abi,
          signer
        );
        const tx = await BankContract.withdraw(
          ethers.utils.parseEther(withdrawalAmount)
        );
        await tx.wait();
        alert(`Withdrawal of ${withdrawalAmount} Ether Successful`);
        getBalance();
        setWithdrawalAmount("");
      }
    } catch (e) {
      console.error(e);
    }
  };
  const handleTransfer = async (event) => {
    event.preventDefault();
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const BankContract = new ethers.Contract(
          BankContractAddress,
          abi,
          signer
        );
        const tx = await BankContract.transfer(
          transferAddress,
          ethers.utils.parseEther(transferAmount)
        );
        await tx.wait();
        alert(
          `Transfer of ${transferAmount} Ether to address: ${transferAddress} Successful`
        );
        setTransferAddress("");
        setTransferAmount("");
        getBalance();
      }
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    getBalance();
  });
  return (
    <div className="dashboard">
      <div className="account-details">
        <h2>Account Details</h2>
        <h3>Address:{address}</h3>
        <p>
          Your Balance: <strong>{balance} Ether</strong>
        </p>
      </div>
      <div className="deposit">
        {hasDeposits ? <h2>Deposit</h2> : <h2>Make your first deposit</h2>}
        <form className="deposit-form">
          <input
            type="text"
            placeholder="Enter Amount in Ether"
            value={depositAmount}
            className="input-field"
            required
            onChange={(event) => setDepositAmount(event.target.value)}
          />
          <button className="button" onClick={handleDeposit}>
            Deposit
          </button>
        </form>
      </div>
      {hasDeposits ? (
        <div className="withdrawal">
          <h2>Withdraw</h2>
          <form className="withdrawal-form">
            <input
              name="deposit"
              type="text"
              placeholder="Enter Amount in Ether"
              className="input-field"
              required
              value={withdrawalAmount}
              onChange={(event) => setWithdrawalAmount(event.target.value)}
            />
            <button className="button" onClick={handleWithdrawal}>
              Withdraw
            </button>
          </form>
        </div>
      ) : (
        <></>
      )}
      {hasDeposits ? (
        <div className="transfer">
          <h2>Transfer</h2>
          <form className="transfer-form">
            <input
              name="address"
              placeholder="Enter Recipient's ethereum address(0xdf7q..)"
              value={transferAddress}
              onChange={(e) => setTransferAddress(e.target.value)}
              required
              className="input-field"
            />
            <input
              name="amount"
              placeholder="Enter amount in ether"
              className="input-field"
              value={transferAmount}
              required
              onChange={(e) => setTransferAmount(e.target.value)}
            ></input>
            <button className="button" onClick={handleTransfer}>
              Transfer
            </button>
          </form>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Dashboard;
