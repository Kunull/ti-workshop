import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';

// Scenario 1: Malware Incident Analysis
import Worksheet1 from './pages/Worksheet1'; // Analysis - Extract TTPs, IOCs, TAs
import Worksheet2 from './pages/Worksheet2'; // Detection Rules
import Worksheet3 from './pages/Worksheet3'; // Automated Response
import Worksheet4 from './pages/Worksheet4'; // Executive Summary

// Scenario 2: Threat Intel-Driven Hunting
import Worksheet7 from './pages/Worksheet7'; // Identify Sector-Specific TTPs
import Worksheet8 from './pages/Worksheet8'; // Craft Hunt Hypothesis
import Worksheet9 from './pages/Worksheet9'; // Translate to Queries
import Worksheet10 from './pages/Worksheet10'; // Perform Hunting

import About from './pages/About';

// Components
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';
import { WorkshopProvider } from './context/WorkshopContext';
import { AuthProvider } from './context/AuthContext';

// Wrapper component to force remounting when route changes
const RouteWrapper = ({ Component }) => {
  const location = useLocation();
  // Using the pathname as a key forces the component to remount when the route changes
  return <Component key={location.pathname} />;
};

function App() {
  return (
    <AuthProvider>
      <WorkshopProvider>
        <BrowserRouter>
          <div className="App">
            <Navigation />
            <div className="container mt-4">
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                
                {/* Protected routes */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <RouteWrapper Component={Home} />
                  </ProtectedRoute>
                } />
                
                {/* Scenario 1 Routes */}
                <Route path="/scenario1/worksheet1" element={
                  <ProtectedRoute>
                    <RouteWrapper Component={Worksheet1} />
                  </ProtectedRoute>
                } />
                <Route path="/scenario1/worksheet2" element={
                  <ProtectedRoute>
                    <RouteWrapper Component={Worksheet2} />
                  </ProtectedRoute>
                } />
                <Route path="/scenario1/worksheet3" element={
                  <ProtectedRoute>
                    <RouteWrapper Component={Worksheet3} />
                  </ProtectedRoute>
                } />
                <Route path="/scenario1/worksheet4" element={
                  <ProtectedRoute>
                    <RouteWrapper Component={Worksheet4} />
                  </ProtectedRoute>
                } />
                
                {/* Scenario 2 Routes */}
                <Route path="/scenario2/worksheet1" element={
                  <ProtectedRoute>
                    <RouteWrapper Component={Worksheet7} />
                  </ProtectedRoute>
                } />
                <Route path="/scenario2/worksheet2" element={
                  <ProtectedRoute>
                    <RouteWrapper Component={Worksheet8} />
                  </ProtectedRoute>
                } />
                <Route path="/scenario2/worksheet3" element={
                  <ProtectedRoute>
                    <RouteWrapper Component={Worksheet9} />
                  </ProtectedRoute>
                } />
                <Route path="/scenario2/worksheet4" element={
                  <ProtectedRoute>
                    <RouteWrapper Component={Worksheet10} />
                  </ProtectedRoute>
                } />
                
                {/* Legacy routes for backward compatibility */}
                <Route path="/worksheet-1" element={<Navigate to="/scenario1/worksheet1" replace />} />
                <Route path="/worksheet-2" element={<Navigate to="/scenario1/worksheet2" replace />} />
                <Route path="/worksheet-3" element={<Navigate to="/scenario1/worksheet3" replace />} />
                <Route path="/worksheet-4" element={<Navigate to="/scenario1/worksheet4" replace />} />
                <Route path="/worksheet-7" element={<Navigate to="/scenario2/worksheet1" replace />} />
                <Route path="/worksheet-8" element={<Navigate to="/scenario2/worksheet2" replace />} />
                <Route path="/worksheet-9" element={<Navigate to="/scenario2/worksheet3" replace />} />
                <Route path="/worksheet-10" element={<Navigate to="/scenario2/worksheet4" replace />} />

                <Route path="/about" element={<RouteWrapper Component={About} />} />
                
                {/* Catch all undefined routes and redirect to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </WorkshopProvider>
    </AuthProvider>
  );
}

export default App;
