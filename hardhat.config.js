//require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.18",
  paths: {
    artifacts: "./client/artifacts",
  },
  networks: {
    hardhat: {
      chainId: 1337,
      mining: {
        auto: true,
        interval: 0
      }
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 1337
    }
  },
 };
 /*
 module.exports = {
  solidity: "0.8.18",
  paths: {
    artifacts: "./client/artifacts",
  },
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/4528dc6d05f84018b8ef620931b1f132",
      accounts: ["kMOH1YnaI85/eS7AJoawsVLvfX2DBQwCXf471lwqSS5+h8Nl3fBl3w"],
      chainId: 11155111
    }
  }
 };*/
