import { useCallback, useEffect, useState } from "react";
import "./App.css";
import Web3 from "web3";
import detectProvider from "@metamask/detect-provider";
import { loadContract } from "./utils/load-contract";

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [web3API, setWeb3API] = useState({
    provider: null,
    isProviderLoaded: false,
    web3: null,
    contract: null,
  });

  const [shouldReload, setReload] = useState(false);
  const [balance, setBalance] = useState(0);
  const [userBalance, setUserBalance] = useState(0);

  const reloadEffect = useCallback(
    () => setReload(!shouldReload),
    [shouldReload]
  );

  const setAccountListener = (provider) => {
    provider.on("accountsChanged", () => window.location.reload());
  };

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectProvider();
      if (provider) {
        const contract = await loadContract("Faucet", provider);
        setAccountListener(provider);
        setWeb3API({
          web3: new Web3(provider),
          provider,
          contract,
          isProviderLoaded: true,
        });
      } else {
        setWeb3API((api) => ({
          ...api,
          isProviderLoaded: true,
        }));
        console.error("Please install Metamask.");
      }
    };
    loadProvider();
  }, []);

  useEffect(() => {
    const loadBalance = async () => {
      const { contract, web3 } = web3API;
      const balance = await web3.eth.getBalance(contract.address);
      const balanceInETH = web3API.web3.utils.fromWei(balance, "ether");
      setBalance(balanceInETH);
    };
    web3API.contract && loadBalance();
  }, [web3API, shouldReload]);

  useEffect(() => {
    const getAccount = async () => {
      const accounts = await web3API.web3.eth.getAccounts();
      const account = accounts[0];
      if (account) {
        console.log(account);
        setCurrentAccount(account);
        const userBalance = await web3API.web3.eth.getBalance(account);
        const balanceInETH = web3API.web3.utils.fromWei(userBalance, "ether");
        setUserBalance(balanceInETH);
      }
    };
    web3API.web3 && getAccount();
  }, [web3API.web3, shouldReload]);

  const addFunds = useCallback(async () => {
    const { contract, web3 } = web3API;
    await contract.addFunds({
      from: currentAccount,
      value: web3.utils.toWei("1", "ether"),
    });
    reloadEffect();
  }, [web3API, currentAccount, reloadEffect]);

  const withdrawFunds = async () => {
    const { contract, web3 } = web3API;
    const withdrawAmount = web3.utils.toWei("0.1", "ether");
    await contract.withdraw(withdrawAmount, {
      from: currentAccount,
    });
    reloadEffect();
  };

  return (
    <>
      <div className="faucet-wrapper">
        <div className="faucet">
          {web3API.isProviderLoaded ? (
            <div>
              {currentAccount ? (
                <>
                  <div className="info-container">
                    <div>
                      <strong>Account: </strong>
                      <h1 className="ml-2">{currentAccount}</h1>
                    </div>
                    <div>
                      <strong>User Balance: </strong>
                      <h1 className="ml-2">{userBalance} ETH</h1>
                    </div>
                  </div>
                </>
              ) : !web3API.provider ? (
                <div className="notification is-warning is-small is-rounded has-text-centered">
                  Wallet is not detected.
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://docs.metamask.io"
                    className="ml-2 is-link"
                  >
                    Install Metamask
                  </a>
                </div>
              ) : (
                <div className="text-container">
                  <h1>Please connect to your wallet to continue</h1>
                  <button
                    className="is-link mt-2"
                    onClick={async () =>
                      await web3API.provider.request({
                        method: "eth_requestAccounts",
                      })
                    }
                  >
                    Connect
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div>Searching for Web3...</div>
          )}
          <div className="balance-view is-size-2">
            Current Balance: <strong>{balance}</strong> ETH
          </div>
          <div className="button-container">
            <button
              className="button is-link mr-2"
              disabled={!currentAccount || !web3API.contract}
              onClick={addFunds}
            >
              Donate 1 ETH
            </button>
            <button
              className="button is-primary"
              disabled={!currentAccount || !web3API.contract}
              onClick={withdrawFunds}
            >
              Withdraw 0.1 ETH
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
