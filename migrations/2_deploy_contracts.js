var Conference = artifacts.require("./Car.sol");
module.exports = function(deployer) {
  deployer.deploy(Conference,web3.eth.accounts[0]);
};

