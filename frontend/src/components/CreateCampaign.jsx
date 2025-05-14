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

  const uploadToIPFS = async (file) => {
    const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
    const data = new FormData();
    data.append('file', file);

    const metadata = JSON.stringify({ name: 'campaign-image' });
    data.append('pinataMetadata', metadata);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        pinata_api_key: import.meta.env.VITE_PINATA_API_KEY,
        pinata_secret_api_key: import.meta.env.VITE_PINATA_API_SECRET,
      },
    };

    const res = await axios.post(url, data, config);
    return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setTxHash('');

    try {
      if (!imageFile) {
        setError('Please upload an image');
        setIsLoading(false);
        return;
      }

      const imageUrl = await uploadToIPFS(imageFile);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractAddress = '0xed5A12c409b7c138dB90C6D8961A26fbf55880b3';
      const fundContract = new ethers.Contract(contractAddress, contract.abi, signer);

      const tx = await fundContract.createCampaign(
        form.name,
        form.description,
        imageUrl,
        ethers.utils.parseEther(form.goal),
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
          <a href={`https://etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer">
            View on Etherscan
          </a>
        </div>
      )}
      {error && <div className="error-message">❌ {error}</div>}
    </div></>
  );
};

export default CreateCampaign;
