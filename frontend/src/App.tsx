import { Web3Provider } from "./context/Web3Context";

import CampaignForm from "./components/CampaignForm";
import CampaignList from "./components/CampaignList";

export default function App() {
  return (
    <Web3Provider>
    <div className="App">
        <h1>Decentralized Fundraiser</h1>
        <CampaignForm />
        <CampaignList />
    </div>
</Web3Provider>
  )
}
