import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import FundABI from "../contracts/Fund.sol/Fund.json"; 
import { Navigation } from './Navigation' 
import '../styles/campaign.css'; 
import { Link } from 'react-router-dom';


const CONTRACT_ADDRESS = "0x47115DaBc70D1D1ef959bbCd45BEF9BB8d17dD2F";

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);

  async function loadCampaigns() {
    try {

      const provider = new ethers.BrowserProvider(window.ethereum);
        const signer =await provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, FundABI.abi, signer);
  
      const [
        names,
        descriptions,
        imageUrls,
        goals,
        balances,
        deadlines,
        fundingSuccesses,
        campaignExists
      ] = await contract.getAllCampaignDetails();
  
      const campaigns = names.map((_, index) => ({
        name: names[index],
        description: descriptions[index],
        imageUrl: imageUrls[index],
        goal: ethers.formatEther(goals[index]),
        balance: ethers.formatEther(balances[index]),
        deadline: deadlines[index],
        fundingSuccessful: fundingSuccesses[index],
        campaignExist: campaignExists[index]
      }));
  
      console.log(campaigns);
      setCampaigns(campaigns)
      return campaigns;
    } catch (error) {
      console.error("Failed to load campaigns:", error);
    }
  }
  

  useEffect(() => {
    loadCampaigns();
  }, []);

  return (
    <>
    <Navigation/>
    <h2 className="campaign-title">Support a fundraising campaign today</h2>
    <div className="campaigns-grid">
      
      {campaigns.length === 0 ? (
        <p className="loading-text">Loading campaigns...</p>
      ) : (
        campaigns.map((campaign, index) => (
          <div key={index} className="campaigns-card">
            <img src={`https://gateway.pinata.cloud/${campaign.imageUrl}`} alt={campaign.name} />
            <div className="content">
              {/* Link to individual campaign page */}
              <h3 className="title">
                <Link to={`/campaign/${index}`}>{campaign.name}</Link>
              </h3>
        
              {/* Shortened description */}
              <p className="description">
                {campaign.description.length > 100
                  ? campaign.description.substring(0, 100) + '...'
                  : campaign.description}
              </p>
        
              <div className="details">
                <p><strong>Goal:</strong> {campaign.goal} ETH</p>
                <p><strong>Raised:</strong> {campaign.balance} ETH</p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className={campaign.fundingSuccessful ? "status-funded" : "status-open"}>
                    {campaign.fundingSuccessful ? "Funded" : "Open"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ))
         )}
    </div>
    </>
  );
};

export default Campaigns;
