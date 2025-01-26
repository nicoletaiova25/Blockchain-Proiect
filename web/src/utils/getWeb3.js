import Web3 from "web3";

const getWeb3 = async () => {
  try {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" }); // Solicită acces la conturi
      return web3;
    } else {
      throw new Error("Metamask not detected. Please install it!");
    }
  } catch (error) {
    console.error("Error connecting to Web3: ", error);
  }
};

export default getWeb3;
