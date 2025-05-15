import React, { useState } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import '../styles/CreateCampaign.css'; 
import contract from '../contracts/Fund.sol/Fund.json'
import { Navigation } from './Navigation' 
 
const CreateCampaign = ( ) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    goal: '',
    deadline: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const getImageFromIPFS = async () => {
    if (!imageFile) return "";
    const formData = new FormData();
    formData.append("file", imageFile);

    const resFile = await axios({
      method: "post",
      url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
      data: formData,
      headers: {
        'pinata_api_key': "0b2a7f7407084e8179e6",
        'pinata_secret_api_key': "7b3a9282c34557195331529c3802da0ccd7f357abe4e5f5154906713994d1d82",
        "Content-Type": "multipart/form-data"
      },
    });

    return `ipfs/${resFile.data.IpfsHash}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setTxHash('');

    try {
      

      const imageUrl = await getImageFromIPFS()
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractAddress = '0x47115DaBc70D1D1ef959bbCd45BEF9BB8d17dD2F';
      const fundContract = new ethers.Contract(contractAddress, contract.abi, signer);

      const tx = await fundContract.createCampaign(
        form.name,
        form.description,
        imageUrl,
        ethers.parseEther(form.goal),
        parseInt(form.deadline)
      );

      await tx.wait();
      setTxHash(tx.hash);
      setForm({ name: '', description: '', goal: '', deadline: '' });
      setImageFile(null);
       
      
    } catch (err) {
      setError(err.message || 'Transaction failed');
    }

    setIsLoading(false);
  };

  return (
    <>
    <Navigation/>

    <div className="create-campaign-container">
      <h2 className="title">Create Campaign</h2>
      <form onSubmit={handleSubmit} className="form">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Campaign Name"
          required
          className="input"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          required
          className="textarea"
        />
        <input
          name="goal"
          value={form.goal}
          onChange={handleChange}
          placeholder="Goal (in ETH)"
          type="number"
          required
          className="input"
        />
        <input
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
          placeholder="Deadline (in days)"
          type="number"
          required
          className="input"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
          className="file-input"
        />
        <button type="submit" disabled={isLoading} className="submit-button">
          {isLoading ? 'Creating...' : 'Create Campaign'}
        </button>
      </form>

      {txHash && (
        <div className="success-message">
          ✅ Campaign created!{' '}
          
        </div>
      )}
      {error && <div className="error-message">❌ {error}</div>}
    </div></>
  );
};

export default CreateCampaign;
