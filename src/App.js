import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Worksheet1 from './pages/Worksheet1'; // Analysis - Extract TTPs, IOCs, TAs
import Worksheet2 from './pages/Worksheet2'; // Detection Rules
import Worksheet3 from './pages/Worksheet3'; // Automated Response
import Worksheet4 from './pages/Worksheet4'; // Executive Summary
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
                <Route path="/worksheet-1" element={
                  <ProtectedRoute>
                    <RouteWrapper Component={Worksheet1} />
                  </ProtectedRoute>
                } />
                <Route path="/worksheet-2" element={
                  <ProtectedRoute>
                    <RouteWrapper Component={Worksheet2} />
                  </ProtectedRoute>
                } />
                <Route path="/worksheet-3" element={
                  <ProtectedRoute>
                    <RouteWrapper Component={Worksheet3} />
                  </ProtectedRoute>
                } />
                <Route path="/worksheet-4" element={
                  <ProtectedRoute>
                    <RouteWrapper Component={Worksheet4} />
                  </ProtectedRoute>
                } />

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
