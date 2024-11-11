// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Crowdfunding {
    address public owner;
    uint public goalAmount;
    uint public deadline;
    uint public totalContributed;

    mapping(address => uint) public contributions;

    event ContributionReceived(address contributor, uint amount);
    event GoalReached();
 
    constructor(uint _goalAmount, uint _durationInDays) {
        owner = msg.sender;
        goalAmount = _goalAmount;
        deadline = block.timestamp + (_durationInDays * 1 days);
    }

    function contribute() public payable {
        require(block.timestamp < deadline, "Crowdfunding has ended");
        require(totalContributed < goalAmount, "Goal already reached");
        require(msg.value > 0, "Contribution must be greater than zero");

        contributions[msg.sender] += msg.value;
        totalContributed += msg.value;

        emit ContributionReceived(msg.sender, msg.value);

        if (totalContributed >= goalAmount) {
            emit GoalReached();
        }
    }

    function withdraw() public {
        require(msg.sender == owner, "Only owner can withdraw");
        require(totalContributed >= goalAmount, "Goal not reached");
        require(block.timestamp >= deadline, "Crowdfunding not yet ended");

        payable(owner).transfer(totalContributed);
    }

    function refund() public {
        require(block.timestamp >= deadline, "Crowdfunding not yet ended");
        require(totalContributed < goalAmount, "Goal was reached, no refunds");

        uint contributedAmount = contributions[msg.sender];
        require(contributedAmount > 0, "No contributions to refund");

        contributions[msg.sender] = 0;
        payable(msg.sender).transfer(contributedAmount);
    }
}
