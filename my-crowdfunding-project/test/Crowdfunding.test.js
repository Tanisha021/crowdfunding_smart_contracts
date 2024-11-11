const Crowdfunding = artifacts.require("Crowdfunding");

contract("Crowdfunding", (accounts) => {
    let crowdfundingInstance;
    const goalAmount = web3.utils.toWei("1", "ether"); // Set the goal to 1 ether
    const durationInDays = 7;

    beforeEach(async () => {
        crowdfundingInstance = await Crowdfunding.new(goalAmount, durationInDays);
    });

    it("should deploy the contract correctly", async () => {
        assert(crowdfundingInstance.address !== "");
    });

    it("should set the correct goal amount and duration", async () => {
        const contractGoalAmount = await crowdfundingInstance.goalAmount();
        const contractDeadline = await crowdfundingInstance.deadline();
        
        assert.equal(contractGoalAmount.toString(), goalAmount, "Goal amount is incorrect");
        assert.isAbove(Number(contractDeadline), 0, "Deadline is incorrect");
    });

    it("should allow contributions and increase the total contributed amount", async () => {
        await crowdfundingInstance.contribute({ from: accounts[1], value: web3.utils.toWei("0.5", "ether") });
        const contribution = await crowdfundingInstance.contributions(accounts[1]);
        const totalContributed = await crowdfundingInstance.totalContributed();

        assert.equal(contribution.toString(), web3.utils.toWei("0.5", "ether"), "Contribution amount is incorrect");
        assert.equal(totalContributed.toString(), web3.utils.toWei("0.5", "ether"), "Total contributed amount is incorrect");
    });

    it("should allow multiple contributions and accumulate balance", async () => {
        await crowdfundingInstance.contribute({ from: accounts[1], value: web3.utils.toWei("0.5", "ether") });
        await crowdfundingInstance.contribute({ from: accounts[2], value: web3.utils.toWei("0.3", "ether") });

        const totalContributed = await crowdfundingInstance.totalContributed();

        assert.equal(totalContributed.toString(), web3.utils.toWei("0.8", "ether"), "Total contributed amount is incorrect after multiple contributions");
    });

    it("should not allow contributions after the goal is reached", async () => {
        await crowdfundingInstance.contribute({ from: accounts[1], value: web3.utils.toWei("1", "ether") });
    
        try {
            await crowdfundingInstance.contribute({ from: accounts[2], value: web3.utils.toWei("0.1", "ether") });
            assert.fail("Expected an error but did not get one");
        } catch (error) {
            assert(error.message.includes("Goal already reached"), "Expected 'Goal already reached' error");
        }
    });
});


// const Crowdfunding = artifacts.require("Crowdfunding");

// contract("Crowdfunding", (accounts) => {
//     let crowdfunding;
//     const owner = accounts[0];
//     const contributor1 = accounts[1];
//     const contributor2 = accounts[2];
//     const goalAmount = web3.utils.toWei("1", "ether"); // Set goal to 1 Ether
//     const duration = 1; // 1 day

//     beforeEach(async () => {
//         crowdfunding = await Crowdfunding.new(goalAmount, duration);
//     });

//     it("should allow contributions", async () => {
//         await crowdfunding.contribute({ from: contributor1, value: web3.utils.toWei("0.5", "ether") });
//         const contribution = await crowdfunding.contributions(contributor1);
//         assert.equal(contribution.toString(), web3.utils.toWei("0.5", "ether"), "Contribution should be 0.5 Ether");
//     });

//     it("should emit ContributionReceived event", async () => {
//         const receipt = await crowdfunding.contribute({ from: contributor1, value: web3.utils.toWei("0.5", "ether") });
//         assert.equal(receipt.logs[0].event, "ContributionReceived", "Event should be ContributionReceived");
//     });

//     it("should allow owner to withdraw funds if goal is reached", async () => {
//         await crowdfunding.contribute({ from: contributor1, value: goalAmount });
//         await crowdfunding.contribute({ from: contributor2, value: goalAmount });
//         await crowdfunding.withdraw({ from: owner });
//         const balance = await web3.eth.getBalance(crowdfunding.address);
//         assert.equal(balance, 0, "Contract balance should be 0 after withdrawal");
//     });

//     it("should refund contributors if goal is not reached after deadline", async () => {
//         await crowdfunding.contribute({ from: contributor1, value: web3.utils.toWei("0.5", "ether") });
//         // Fast forward time
//         await new Promise(resolve => setTimeout(resolve, 24 * 60 * 60 * 1000)); // Simulate 1 day
//         await crowdfunding.refund({ from: contributor1 });
//         const contribution = await crowdfunding.contributions(contributor1);
//         assert.equal(contribution.toString(), "0", "Contribution should be refunded");
//     });
// });
