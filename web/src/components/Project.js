import React, { useEffect, useState } from "react";
import CrowdfundingContract from "../utils/contracts/Crowdfunding.json";

const Crowdfunding = ({ web3, accounts }) => {
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const initContract = async () => {
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = CrowdfundingContract.networks[networkId];
      const instance = new web3.eth.Contract(
        CrowdfundingContract.abi,
        deployedNetwork && deployedNetwork.address
      );
      setContract(instance);
    };

    initContract();
  }, [web3]);

  const createCampaign = async () => {
    if (contract) {
      await contract.methods
        .createCampaign("My Campaign", web3.utils.toWei("1", "ether"))
        .send({ from: accounts[0] });
      alert("Campaign created!");
    }
  };

  return (
    <div>
      <h2>Crowdfunding</h2>
      <button onClick={createCampaign}>Create Campaign</button>
    </div>
  );
};

export default Crowdfunding;
