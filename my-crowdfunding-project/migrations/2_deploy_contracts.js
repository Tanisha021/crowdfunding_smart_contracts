const Crowdfunding = artifacts.require("Crowdfunding");

module.exports = function (deployer) {
    const goalAmount = web3.utils.toWei("1", "ether"); // Set goal to 1 Ether
    const durationInDays = 7; // Duration in days
    deployer.deploy(Crowdfunding, goalAmount, durationInDays);
};
