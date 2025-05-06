import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Pages
import Home from './pages/Home';
import Worksheet1 from './pages/Worksheet1'; // Morning Briefing & Threat Landscape
import Worksheet2 from './pages/Worksheet2'; // Prioritization & Tasking
import Worksheet3 from './pages/Worksheet3'; // Deep Dive Investigation
import Worksheet4 from './pages/Worksheet4'; // Threat Actor Understanding
import Worksheet5 from './pages/Worksheet5'; // Proactive Threat Hunting
import Worksheet6 from './pages/Worksheet6'; // Reporting & Knowledge Sharing
import Results from './pages/Results';

// Components
import Navigation from './components/Navigation';
import { WorkshopProvider } from './context/WorkshopContext';

function App() {
  return (
    <WorkshopProvider>
      <Router>
        <div className="App">
          <Navigation />
          <div className="container mt-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/worksheet-1" element={<Worksheet1 />} />
              <Route path="/worksheet-2" element={<Worksheet2 />} />
              <Route path="/worksheet-3" element={<Worksheet3 />} />
              <Route path="/worksheet-4" element={<Worksheet4 />} />
              <Route path="/worksheet-5" element={<Worksheet5 />} />
              <Route path="/worksheet-6" element={<Worksheet6 />} />
              <Route path="/results" element={<Results />} />
            </Routes>
          </div>
        </div>
      </Router>
    </WorkshopProvider>
  );
}

export default App;
