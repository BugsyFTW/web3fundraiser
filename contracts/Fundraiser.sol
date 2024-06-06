// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Fundraiser {
    struct Campaign {
      address payable creator;
      string description;
      uint256 goal;
      uint256 deadline;
      uint256 totalFunds;
      bool completed;
    }

    struct Donation {
      address donor;
      uint ammount;
    }

    Campaign[] public campaigns;
    mapping(uint256 => Donation[]) public donations;

    event CampaignCreated(
      uint256 id,
      address creator,
      string description,
      uint256 goal,
      uint256 deadline
    );
    event DonationReceived(uint256 campaignId, address donor, uint256 amount);

    event FundsWithdrawn(uint256 campaignId, uint256 amount);
    event RefundIssued(uint256 campaignId, address donor, uint256 amount);

    function createCampaign(string memory _description, uint256 _goal, uint256 _deadline) public {
      require(_deadline > block.timestamp, "Deadline must be in the future");

      campaigns.push(
        Campaign({
          creator: payable(msg.sender),
          description: _description,
          goal: _goal,
          deadline: _deadline,
          totalFunds: 0,
          completed: false
        })
      );
      emit CampaignCreated(campaigns.length -1, payable(msg.sender), _description, _goal, _deadline);
    }

    function fundCampagin(uint256 _cid) public payable {
      Campaign storage campaign = campaigns[_cid];
      
      require(block.timestamp < campaign.deadline, "Campaign has ended!");
      require(msg.value > 0, "Donation must be greater than zero!");

      campaign.totalFunds += msg.value;
      donations[_cid].push(Donation({ donor: msg.sender, ammount: msg.value}));
      emit DonationReceived(_cid, msg.sender, msg.value);
    }

    function withdrawFunds(uint256 _cid) public {
      Campaign storage campaign = campaigns[_cid];

      require(msg.sender == campaign.creator, "Only Campaign creator can withdraw funds!"); 
      require(block.timestamp >= campaign.deadline, "Cannot withdraw before deadline");
      require(!campaign.completed, "Funds have already been withdrawn!");
      require(campaign.totalFunds >= campaign.goal, "Campaign goal not met!");

      uint256 ammount = campaign.totalFunds;
      campaign.totalFunds = 0;
      campaign.completed = true;
      campaign.creator.transfer(ammount);

      emit FundsWithdrawn(_cid, ammount);
    }

    function refund(uint256 _cid) public {
      Campaign storage campaign = campaigns[_cid];

      require(block.timestamp > campaign.deadline, "Cannot refund before deadline");
      require(campaign.totalFunds < campaign.goal, "Campaign goal was not met");

      uint256 refundAmmount = 0;
      for (uint256 i = 0; i < donations[_cid].length; i++) {
        Donation storage donation = donations[_cid][i];
        if (donation.donor == msg.sender && donation.ammount > 0) {
          refundAmmount += donation.ammount;
          donation.ammount = 0;
        }
      }

      require(refundAmmount > 0, "No funds to refund!");
      payable(msg.sender).transfer(refundAmmount);

      emit RefundIssued(_cid, msg.sender, refundAmmount);
    }

    function getCampaigns() public view returns(Campaign[] memory) {
      return campaigns;
    }
}
