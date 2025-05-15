import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ethers } from "ethers";
import FundABI from "../contracts/Fund.sol/Fund.json";
import { Navigation } from './Navigation';
import axios from 'axios';


const CONTRACT_ADDRESS = "0x47115DaBc70D1D1ef959bbCd45BEF9BB8d17dD2F";

const CampaignDetail = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [donationAmount, setDonationAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [creatorAddress, setCreatorAddress] = useState(null);
  const [maticPriceUSD, setMaticPriceUSD] = useState(null);


  useEffect(() => {
    const fetchMaticPrice = async () => {
      try {
        const res = await axios.get(
          'https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd'
        );
        setMaticPriceUSD(res.data['matic-network'].usd);
        console.log(res.data['matic-network'].usd)
      } catch (err) {
        console.error('Failed to fetch MATIC price:', err);
      }
    };
  
    fetchMaticPrice();
  }, []);

  useEffect(() => {
    async function fetchCampaign() {
      try {
        const provider = new ethers.JsonRpcProvider("https://rpc-amoy.polygon.technology/");
        // const signer = await provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, FundABI.abi, provider);

        const [
            names,
            descriptions,
            imageUrls,
            goals,
            balances,
            deadlines,
            fundingSuccesses,
            campaignExists,
            creators
          ] = await contract.getAllCampaignDetails();
          
          const campaignData = {
            name: names[id],
            description: descriptions[id],
            imageUrl: imageUrls[id],
            goal: ethers.formatEther(goals[id]),
            balance: ethers.formatEther(balances[id]),
            deadline: deadlines[id],
            fundingSuccessful: fundingSuccesses[id],
            exists: campaignExists[id],
            creator: creators[id], // ← now you have the creator address!
          };
        setCampaign(campaignData);
      } catch (error) {
        console.error("Error loading campaign:", error);
      }
    }

    fetchCampaign();
  }, [id]);

  const donate = async (creatorAddress) => {
    if (!donationAmount || isNaN(donationAmount)) {
      alert("Enter a valid donation amount in ETH");
      return;
    }
  
    try {
      setLoading(true);
  
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, FundABI.abi, signer);
  
      const valueInWei = ethers.parseEther((donationAmount / maticPriceUSD).toFixed(18).toString());
  
      const tx = await contract.fundCampaign(creatorAddress, {
        value: valueInWei,
      });
  
      await tx.wait();
  
      setDonationAmount("");
      alert("Donation successful!");
      window.location.reload();
  
    } catch (error) {
      console.error("Donation failed:", error);
      alert("Donation failed. Please ensure you're connected and try again.");
    } finally {
      setLoading(false);
    }
  };
  

  if (!campaign) return <p>Loading...</p>;

  const progress = Math.min(
    (parseFloat(campaign.balance) / parseFloat(campaign.goal)) * 100,
    100
  );

  return (
    <>
      <Navigation />
      <div style={{ display: "flex", padding: "40px", gap: "40px", flexWrap: "wrap" }}>
        <div style={{ flex: "1", minWidth: "300px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "bold" }}>{campaign.name}</h1>
          <img
            src={`https://gateway.pinata.cloud/${campaign.imageUrl}`}
            alt={campaign.name}
            style={{ width: "100%", borderRadius: "10px", marginTop: "20px" }}
          />
          <div style={{ marginTop: "20px", fontSize: "14px", color: "#555" }}>
            <p><strong>Organized by:</strong> {campaign.creator}</p>
          </div>
          <hr style={{ margin: "20px 0" }} />
          <p style={{ fontSize: "16px", lineHeight: "1.6" }}>
            {campaign.description}
          </p>
        </div>

        <div
          style={{
            flex: "0 0 350px",
            background: "#f9f9f9",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)"
          }}
        >
          <h2 style={{ fontSize: "22px", fontWeight: "bold" }}>
            ${parseFloat(campaign.balance).toLocaleString()} USD raised
          </h2>
          <p style={{ color: "#666" }}>Goal: USD {parseFloat(campaign.goal).toLocaleString()}  </p>

          {/* Progress bar */}
          <div style={{ height: "10px", background: "#eee", borderRadius: "5px", margin: "10px 0" }}>
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: "#4caf50",
                borderRadius: "5px"
              }}
            ></div>
          </div>

          {/* Donation Input */}
          <input
            type="number"
            step="0.01"
            placeholder="Amount in MTX"
            value={donationAmount}
            onChange={(e) => setDonationAmount(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "20px",
              borderRadius: "8px",
              border: "1px solid #ccc"
            }}
          />

          <button
            onClick={()=>donate(campaign.creator)}
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              background: loading ? "#888" : "#4caf50",
              color: "white",
              border: "none",
              borderRadius: "8px",
              marginTop: "10px",
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Processing..." : "Donate"}
          </button>
        </div>
      </div>
    </>
  );
};

export default CampaignDetail;
