// App.js
import React from "react";
import WalletChecker from "./components/WalletChecker.jsx";

export default function App() {
  return (
    <div className="App">
      <h1 style={{ textAlign: "center", margin: "20px 0" }}>
        Ethereum Wallet Checker
      </h1>
      <WalletChecker />
    </div>
  );
}
