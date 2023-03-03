import React, { useState } from "react";
import "./App.css";

import Header from "./Components/Header";
import Dashboard from "./Components/Dashboard";

function App() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [account, setAccount] = useState("");
  const connectWallet = async () => {
    if (
      typeof window !== "undefined" &&
      typeof window.ethereum !== "undefined"
    ) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletConnected(true);
        setAccount(accounts[0]);
      } catch (err) {
        console.error(err);
      }
    } else {
      alert("Install metamask");
    }
  };
  return (
    <div className="App">
      <Header account={account} />
      {walletConnected ? (
        <>
          <Dashboard address={account} />
        </>
      ) : (
        <button className="connect-button" onClick={connectWallet}>
          Connect Wallet
        </button>
      )}
    </div>
  );
}
export default App;
