import { useCallback, useEffect, useState } from "react";
import "./App.css";
import Web3 from "web3";
import detectProvider from "@metamask/detect-provider";
import { loadContract } from "./utils/load-contract";

const App = () => {
  // shows the current authenticated accounts address
  const [currentAccount, setCurrentAccount] = useState(null);
  const [web3API, setWeb3API] = useState({
    provider: null, // the provider for the contract
    isProviderLoaded: false, // checks if the provider has been loaded to help UI
    web3: null, // object for web3 including all utils and functions
    contract: null, // the currently loaded smart contract
  });

  const [shouldReload, setReload] = useState(false); // boolean value to determine if the UI needs reloading
  const [balance, setBalance] = useState(0); // the current balance of the faucet
  const [userBalance, setUserBalance] = useState(0); // the current balance of the user that is authenticated

  // function to alter the boolean value of shouldReload to determine if a page refresh is necessary
  const reloadEffect = useCallback(
    () => setReload(!shouldReload),
    [shouldReload]
  );

  // helper function to reload the page to update the UI when certain actions occur
  const setAccountListener = (provider) => {
    provider.on("accountsChanged", () => window.location.reload());
    provider.on("chainChanged", () => window.location.reload());
  };

  // function to load the provider into state for use within the front-end
  useEffect(() => {
    const loadProvider = async () => {
      // @metamask detects what provider is available within the browser
      const provider = await detectProvider();
      // if a provider exists, load the contract into state and update web3API state
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
        // if there is no provider then notify the user to install metamask
        setWeb3API((api) => ({
          ...api,
          isProviderLoaded: true,
        }));
        console.error("Please install Metamask.");
      }
    };
    loadProvider();
  }, []);

  // function to load the current balance for the faucet into state
  useEffect(() => {
    const loadBalance = async () => {
      const { contract, web3 } = web3API;
      const balance = await web3.eth.getBalance(contract.address);
      const balanceInETH = web3API.web3.utils.fromWei(balance, "ether");
      setBalance(balanceInETH);
    };
    web3API.contract && loadBalance();
  }, [web3API, shouldReload]);

  // function to load the authenticated user into state, and update their balance into state
  useEffect(() => {
    const getAccount = async () => {
      const accounts = await web3API.web3.eth.getAccounts();
      const account = accounts[0];
      if (account) {
        setCurrentAccount(account);
        const userBalance = await web3API.web3.eth.getBalance(account);
        const balanceInETH = web3API.web3.utils.fromWei(userBalance, "ether");
        setUserBalance(balanceInETH);
      }
    };
    // should only be triggered when there is a web3 object on web3API
    web3API.web3 && getAccount();
    // and should also reload when the shouldReload boolean value changes
  }, [web3API.web3, shouldReload]);

  // function to add funds (1 ETH) to the faucet from the users' balance
  const addFunds = useCallback(async () => {
    const { contract, web3 } = web3API;
    // deposits 1 ETH to faucet from users funds
    await contract.addFunds({
      from: currentAccount,
      value: web3.utils.toWei("1", "ether"),
    });
    // reload the page to update front-end UI without manual refresh
    reloadEffect();
  }, [web3API, currentAccount, reloadEffect]);

  // function to withdraw funds (0.1 ETH) from faucet into users' account
  const withdrawFunds = async () => {
    const { contract, web3 } = web3API;
    const withdrawAmount = web3.utils.toWei("0.1", "ether");
    await contract.withdraw(withdrawAmount, {
      from: currentAccount,
    });
    // reload the page to update front-end UI without manual refresh
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
              // disable if there is no authenticated user or no contract in state
              disabled={!currentAccount || !web3API.contract}
              onClick={addFunds}
            >
              Donate 1 ETH
            </button>
            <button
              className="button is-primary"
              // disable if there is no authenticated user or no contract in state
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
};

export default App;
