import { useEffect, useState } from "react";
import "./App.css";
import Web3 from "web3";
import detectProvider from "@metamask/detect-provider";

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [web3API, setWeb3API] = useState({
    provider: null,
    web3: null,
  });

  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectProvider();
      if (provider) {
        setWeb3API({
          web3: new Web3(provider),
          provider,
        });
      } else {
        console.error("Please install Metamask.");
      }
    };
    loadProvider();
  }, []);

  useEffect(() => {
    const getAccount = async () => {
      const accounts = await web3API.web3.eth.getAccounts();
      const account = accounts[0];
      if (account) {
        setCurrentAccount(account);
        const balance = await web3API.web3.eth.getBalance(account);
        const balanceInETH = web3API.web3.utils.fromWei(balance, "ether");
        setBalance(balanceInETH);
      }
    };
    web3API.web3 && getAccount();
  }, [web3API.web3]);

  return (
    <>
      <div className="faucet-wrapper">
        <div className="faucet">
          <span>
            <strong>Account: </strong>
          </span>
          {currentAccount ? (
            <>
              <h1>{currentAccount}</h1>
              <div className="balance-view is-size-2">
                Current Balance: <strong>{balance}</strong> ETH
              </div>
              <div className="button-container">
                <button className="button is-link mr-2">Donate</button>
                <button className="button is-primary">Withdraw</button>
              </div>
            </>
          ) : (
            <button
              className="is-link"
              onClick={() =>
                web3API.provider.request({ method: "eth_requestAccounts" })
              }
            >
              Connect
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
