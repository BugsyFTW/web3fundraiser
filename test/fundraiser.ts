import { ethers } from "hardhat";
import { expect } from "chai";
import { Fundraiser } from "../typechain-types";

let fundraiser: Fundraiser;

async function createFundraiser() {
  const FundraiserFactory = await ethers.getContractFactory("Fundraiser");
  fundraiser = await FundraiserFactory.deploy();
  await fundraiser.waitForDeployment();
}

async function createTestCampaign() {
  const createCampaign = fundraiser.createCampaign(
    "Test Campaign",
    ethers.parseUnits("10", "ether"),
    Math.floor(Date.now() / 1000) + 3600
  );
  (await createCampaign).wait();  
}

describe("Fundraiser", () => {
  beforeEach(async () => {
    await createFundraiser();
    await createTestCampaign();
  });

  it("should create new campaign", async () => {
    const campaigns = await fundraiser.getCampaigns();
    expect(campaigns.length).equal(1);
    expect(campaigns[0].description).to.equal("Test Campaign");
    expect(ethers.formatUnits(campaigns[0].goal, "ether")).to.equal("10.0");
  });

  it("should allow donations to a campaign", async () => {
    const [, donor] = await ethers.getSigners();
    
    const donateTx = await fundraiser.connect(donor).fundCampagin(0, {
      value: ethers.parseUnits("1", "ether"),
    });

    await donateTx.wait();

    const campaigns = await fundraiser.getCampaigns();
    expect(ethers.formatUnits(campaigns[0].totalFunds, "ether")).to.equal("1.0");
  });

  it("should allow the creator to withdraw funds after the deadline if the goal is met", async () => {
    const [, donor] = await ethers.getSigners();

    const createCampaignTx = await fundraiser.createCampaign(
      "Another Test Campaign",
      ethers.parseUnits("1", "ether"),
      Math.floor(Date.now() / 1000) + 10 // 10 seconds from now
    );
    await createCampaignTx.wait();

    const donateTx = await fundraiser.connect(donor).fundCampagin(1, {
      value: ethers.parseUnits("1", "ether"),
    });
    await donateTx.wait();

    // Wait for the deadline to pass
    await new Promise((resolve) => setTimeout(resolve, 11000));

    const withdrawTx = await fundraiser.withdrawFunds(1);
    await withdrawTx.wait();

    const campaigns = await fundraiser.getCampaigns();
    expect(campaigns[1].completed).to.be.true;
    expect(campaigns[1].totalFunds).to.equal(0);
  });
});