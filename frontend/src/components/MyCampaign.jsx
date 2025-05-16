import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import "../styles/MyCampaign.css";
import contract from '../contracts/Fund.sol/Fund.json'
import { useAppKitProvider, useAppKitAccount } from "@reown/appkit/react";
import { useParams } from "react-router-dom";
import { Navigation } from './Navigation' 


const CONTRACT_ADDRESS = "0x47115DaBc70D1D1ef959bbCd45BEF9BB8d17dD2F";

const MyCampaigns =() => {
  const [myCampaign, setMyCampaign] = useState(null);
  const [loading, setLoading] = useState(false);
  const [withdrawalStatus, setWithdrawalStatus] = useState("");
  const { address, isConnected } = useAppKitAccount();
  const { id } = useParams();


  const fetchCampaign = async () => {
    try {
        const provider = new ethers.JsonRpcProvider("https://rpc-amoy.polygon.technology/");
      //const signer =await provider.getSigner();
        const myContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, provider);
      const campaign = await myContract.campaigns(address);
      if (campaign.campaignExist) {
        setMyCampaign({
          name: campaign.name,
          description: campaign.description,
          imageUrl: campaign.imageUrl,
          goal: ethers.formatEther(campaign.fundingGoal),
          balance: ethers.formatEther(campaign.balance),
          deadline: campaign.deadline,
          fundingSuccessful: campaign.fundingSuccessful,
        });
      } else {
        setMyCampaign(null);
      }
    } catch (error) {
      console.error("Error fetching campaign:", error);
    }
  };

  const handleWithdraw = async () => {
    setLoading(true);

    const provider = new ethers.JsonRpcProvider("https://rpc-amoy.polygon.technology/");
      //const signer =await provider.getSigner();
        const myContract = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, provider);
    try {
      const tx = await myContract.withdrawFromCampaign();
      await tx.wait();
      setWithdrawalStatus("Withdrawal successful!");
      fetchCampaign();
    } catch (err) {
      console.error(err);
      setWithdrawalStatus("Withdrawal failed. Are you eligible?");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (address) {
      fetchCampaign();
    }
  }, [address,id]);

  return (
   <>
<Navigation/>
    <div className="my-campaigns-container">
      <h1>My Campaign</h1>
      {myCampaign ? (
        <div className="campaign-card">
          <img src={`https://gateway.pinata.cloud/${myCampaign.imageUrl}`} alt="Campaign" />
          <div className="campaign-details">
            <h2>{myCampaign.name}</h2>
            <p>{myCampaign.description}</p>
            <p><strong>Goal:</strong> {myCampaign.goal} ETH</p>
            <p><strong>Balance:</strong> {myCampaign.balance} ETH</p>
            <p>
              <strong>Status:</strong>{" "}
              {myCampaign.fundingSuccessful ? "Goal Reached ✅" : "In Progress ⏳"}
            </p>
            <button
              className="withdraw-button"
              disabled={!myCampaign.fundingSuccessful || loading}
              onClick={handleWithdraw}
            >
              {loading ? "Withdrawing..." : "Withdraw Funds"}
            </button>
            {withdrawalStatus && <p className="withdraw-status">{withdrawalStatus}</p>}
          </div>
        </div>
      ) : (
        <p>You haven’t created a campaign yet.</p>
      )}
    </div>
   </>
  );
};

export default MyCampaigns;
