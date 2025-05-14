import React from 'react';
import { BrowserRouter,Routes,Route} from 'react-router-dom';
import App from './App'
import CreateCampaign from './components/CreateCampaign'; 
 

function AppRoutes() {

  return (
    <>
      <BrowserRouter>
  <Routes>
    <Route path="/" element={<App/>} />
    <Route path="/createcampaign" element={<CreateCampaign/>} />

    </Routes>
</BrowserRouter>
    </>
  );
}

export default AppRoutes;