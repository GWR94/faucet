const contract = require("@truffle/contract");

export const loadContract = async (name, provider) => {
  try {
    const res = await fetch(`/contracts/${name}.json`);
    const Artifact = await res.json();

    const _contract = contract(Artifact);
    _contract.setProvider(provider);

    let deployed = null;
    try {
      deployed = await _contract.deployed();
    } catch {
      console.error("You are connected to the wrong network.");
    }

    console.log(deployed);

    return deployed;
  } catch (err) {
    console.error("Unable to fetch", err);
  }
};
