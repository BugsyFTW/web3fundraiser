import { useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '../context/Web3Context';

export default function CampaignForm() {
    const { contract } = useWeb3();
    const [description, setDescription] = useState('');
    const [goal, setGoal] = useState('');
    const [deadline, setDeadline] = useState('');

    const createCampaign = async () => {
        if (contract) {
            await contract.createCampaign(description, ethers.parseUnits(goal, 'ether'), new Date(deadline).getTime() / 1000);
        }
    };

    return (
        <div>
            <h2>Create a Campaign</h2>
            <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <input type="text" placeholder="Goal (ETH)" value={goal} onChange={(e) => setGoal(e.target.value)} />
            <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            <button onClick={createCampaign}>Create</button>
        </div>
    );
};
