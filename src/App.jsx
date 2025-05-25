// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ManagerDashboard from './pages/ManagerDashboard';
import CoordinatorDashboard from './pages/CoordinatorDashboard';
import { getRole } from './auth';

const ProtectedRoute = ({ role, children }) => {
  const user = getRole();
  return user === role ? children : <Navigate to="/" />;
};

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/manager" element={
        <ProtectedRoute role="manager">
          <ManagerDashboard />
        </ProtectedRoute>
      } />
      <Route path="/coordinator" element={
        <ProtectedRoute role="coordinator">
          <CoordinatorDashboard />
        </ProtectedRoute>
      } />
    </Routes>
  </BrowserRouter>
);

export default App;
