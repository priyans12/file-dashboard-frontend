import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import ManagerDashboard from './pages/ManagerDashboard';
import CoordinatorDashboard from './pages/CoordinatorDashboard';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />                       {/* Landing page */}
      <Route path="/manager" element={<ManagerDashboard />} />
      <Route path="/coordinator" element={<CoordinatorDashboard />} />
    </Routes>
  </BrowserRouter>
);

export default App;
