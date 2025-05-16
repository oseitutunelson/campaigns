import React from 'react';
import { BrowserRouter,Routes,Route} from 'react-router-dom';
import App from './App'
import CreateCampaign from './components/CreateCampaign'; 
import Campaigns from './components/Campaigns';
import CampaignDetail from './components/CampaignDetail';
import MyCampaigns from './components/MyCampaign';


function AppRoutes() {

  return (
    <>
      <BrowserRouter>
  <Routes>
    <Route path="/" element={<App/>} />
    <Route path="/createcampaign" element={<CreateCampaign/>} />
    <Route path="/campaigns" element={<Campaigns/>} />
    <Route path="/campaign/:id" element={<CampaignDetail />} />
    <Route path="/mycampaign/:id" element={<MyCampaigns />} />

    </Routes>
</BrowserRouter>
    </>
  );
}

export default AppRoutes;