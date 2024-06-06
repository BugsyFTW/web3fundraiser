import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '../context/Web3Context';

export default function CampaignList() {
    const { contract, signer } = useWeb3();
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [donationAmounts, setDonationAmounts] = useState<{ [key: number]: string }>({});

    useEffect(() => {
        const loadCampaigns = async () => {
            if (contract) {
                const campaignData = await contract.getCampaigns();
                setCampaigns(campaignData);
            }
        };

        loadCampaigns();
    }, [contract]);

    const handleDonationChange = (index: number, value: string) => {
        setDonationAmounts(prev => ({ ...prev, [index]: value }));
    };

    const donate = async (campaignId: number) => {
        if (contract && signer) {
            try {
                const amount = donationAmounts[campaignId];
                if (!amount) {
                    console.error('Donation amount is not set');
                    return;
                }
                const tx = await contract.fundCampagin(campaignId, {
                    value: ethers.parseUnits(amount, 'ether')
                });
                await tx.wait();
                console.log(`Donated ${amount} ETH to campaign ${campaignId}`);
            } catch (error) {
                console.error('Failed to donate:', error);
            }
        } else {
            console.error('Contract or signer is not initialized');
        }
    };

    return (
        <div>
            <h2>Campaigns</h2>
            {campaigns.map((campaign, index) => (
                <div key={index}>
                    <p>Description: {campaign.description}</p>
                    <p>Goal: {ethers.formatUnits(campaign.goal, 'ether')} ETH</p>
                    <p>Total Funds: {ethers.formatUnits(campaign.totalFunds, 'ether')} ETH</p>
                    <p>Deadline: {new Date(Number(campaign.deadline) * 1000).toLocaleString()}</p>
                    <input 
                        type="text" 
                        placeholder="Amount in ETH" 
                        value={donationAmounts[index] || ''} 
                        onChange={(e) => handleDonationChange(index, e.target.value)} 
                    />
                    <button onClick={() => donate(index)}>Donate</button>
                </div>
            ))}
        </div>
    );
};