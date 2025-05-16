import React, { useState, useEffect } from "react";
import '../styles/home.css'
import { Link } from 'react-router-dom';
import { ethers } from 'ethers';
import FundABI from '../contracts/Fund.sol/Fund.json';  

const CONTRACT_ADDRESS = "0x47115DaBc70D1D1ef959bbCd45BEF9BB8d17dD2F";





 
const steps = [
  {
    number: '01',
    title: 'Start your collect',
    description: 'There is no better way to mobilize around a cause and attract donor support.',
  },
  {
    number: '02',
    title: 'Share to your friends',
    description: 'Invite your loved ones to participate in your cause via social networks, talk about it around.',
  },
  {
    number: '03',
    title: 'View the progress',
    description: 'Visualize in real time the progress of each collect thanks to live statistics.',
  },
  {
    number: '04',
    title: 'Receive your funds',
    description: 'Receive or offer your collect by requesting a transfer to a crypto wallet.',
  },
];

 

 

 
const Home = () => {
  const [campaigns, setCampaigns] = useState([]);
  
  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const provider = new ethers.JsonRpcProvider("https://rpc-amoy.polygon.technology/");
    //    const signer =await provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, FundABI.abi, provider);

        const count = await contract.getAllCampaigns();
        const details = await contract.getAllCampaignDetails();

        const maxToShow = 4;
        const campaignList = [];

        for (let i = 0; i < Math.min(maxToShow, Number(count)); i++) {
          campaignList.push({
            name: details[0][i],
            description: details[1][i],
            imageUrl: details[2][i],
            goal: ethers.formatEther(details[3][i]),
            balance: ethers.formatEther(details[4][i]),
            deadline: details[5][i],
            fundingSuccessful: details[6][i],
            campaignExist: details[7][i],
            creator: details[8][i],
          });
        }

        setCampaigns(campaignList);
      } catch (error) {
        console.error("Error loading campaigns:", error);
      }
    };

    loadCampaigns();
  }, []);


  return (
    <>
    <div className="home">
 <section className="header-section">
  <div className="content">
    <p className="badge">Online fundraising made easy</p>
    <h1 className="title">Online fundraising for any<br/> event, anytime, anywhere!</h1>
    <p className="subtitle">
      Initiate a fundraiser with us to champion the causes close to your heart, enjoying the
      benefit<br/> of 0% platform fees, ensuring every dollar goes directly to those in need.
    </p>
    <div className="image-wrapper">
    <img src="/volunteers.jpg" alt="Volunteers" className="volunteer-image" />
    <div className="donation-form-box">
      <div className="donation-form">
        <select className="form-control">
          <option>One-time</option>
          <option>Monthly</option>
        </select>
        <select className="form-control">
          <option>Amount</option>
          <option>$10</option>
          <option>$25</option>
          <option>$50</option>
          <option>$100</option>
        </select>
        <select className="form-control">
          <option>Choose a cause</option>
          <option>Education</option>
          <option>Healthcare</option>
          <option>Disaster Relief</option>
        </select>
    <Link to= "/campaigns"className="donate_b"> <button className="donate-button">Donate</button></Link>  
      </div>
    </div>
  </div>
  <div className="donate_text">
    <p>Easy to use and great crowdfunding platform.Campaigns<br/> is the best decentralized funding platform</p>
  </div>   <Link to="/createcampaign"><button className="campaign_button">Start a Campaign</button></Link>

  </div>
</section>
<section className="purpose-section">
  <div className="purpose-header">
    <h2 className="purpose-title">What's the purpose of Campaign?</h2>
    <p className="purpose-description">
      It’s important to note that new platforms can emerge, and the features of existing platforms can change over time.
    </p>
  </div>

  <div className="purpose-cards">
    <div className="card">
      <img src="/volunteerss.jpg" alt="Gift with friends" className="card-image" />
      <h3 className="card-title">Gift with friends</h3>
      <p className="card-text">
        Perfect for events between loved ones, births, weddings, party favors ...
      </p>
    </div>
    <div className="card">
      <img src="/volunteers.jpg" alt="Fundraising for causes" className="card-image" />
      <h3 className="card-title">Fundraising for causes</h3>
      <p className="card-text">
        Perfect for events between loved ones, births, weddings, party favors ...
      </p>
    </div>
  </div>
</section>
 
    <div className="section-container">
      <h2 className="section-title">Quick Campaign Fundraisers!</h2>
      <p className="section-description">
        Embark on your fundraising journey effortlessly with FundMe — a platform where<br/> creating a campaign takes just a few minutes, streamlining the process of turning your<br/> ideas into impactful fundraising initiatives.
      </p>
      
      <div className="steps-container">
        {/* Step 2 */}
        <div className="step">
          <div className="step-number">02</div>
          <div className="step-content">
            <h3 className="step-title">Share to your friends</h3>
            <p className="step-info">
              Invite your loved ones to participate in your cause via social networks, talk about it around.
            </p>
            <div className="step-details">
              <div className="icon">✔️</div>
              <p className="detail-text">
                Easy to Donate: Verify the legitimacy of the cause or organization before making any donation. If you have a specific cause or organization in mind.
              </p>
            </div>
            {/* Image */}
            
        </div>
         <img 
              src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e" 
              alt="Person using mobile" 
              className="step-image" 
            />
          </div>
      </div>
      
      <div className="step-section-container">
      <div className="steps-grid">
        {steps.map((step, index) => (
          <div key={step.number} className="step-card">
            <div className="circle">{step.number}</div>
            <h3 className="step-title">{step.title}</h3>
            <p className="step-description">{step.description}</p>
             
          </div>
        ))}
      </div>
    </div>
    </div>
 
    

    <section className="latest-campaigns-section">
      <h2>Initiate your fundraising <br/>campaign today</h2>
    <div className="c-grid">
      {campaigns.map((c, idx) => (
        <div key={idx} className="c-card">
        <img src={`https://gateway.pinata.cloud/${c.imageUrl}`} alt={c.name} />
        <div className="content">
          {/* Link to individual campaign page */}
          <h3 className="title">
            <Link to={`/campaign/${idx}`}>{c.name}</Link>
          </h3>
    
          {/* Shortened description */}
          <p className="description">
            {c.description.length > 100
              ? c.description.substring(0, 100) + '...'
              : c.description}
          </p>
    
          <div className="details">
            <p><strong>Goal:</strong> {c.goal} ETH</p>
            <p><strong>Raised:</strong> {c.balance} ETH</p>
            <p>
              <strong>Status:</strong>{" "}
              <span className={c.fundingSuccessful ? "status-funded" : "status-open"}>
                {c.fundingSuccessful ? "Funded" : "Open"}
              </span>
            </p>
          </div>
        </div>
      </div>
      ))}
    </div>
  <div className="see-more-button-wrapper">
    <Link to="/campaigns"><button className="see-more-button">See More Campaigns</button></Link>
  </div>
</section>
<footer className="footer">
  <div className="footer-content">
    <p>&copy; {new Date().getFullYear()} sexyprogrammer. All rights reserved.</p>
  </div>
</footer>

    </div>
    

    </>
  );
};



export default Home;
