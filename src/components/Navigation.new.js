import React, { useState, useRef, useEffect } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWorkshop } from '../contexts/WorkshopContext';
import './navigation.css';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { worksheetProgress } = useWorkshop();
  const { currentUser, logout } = useAuth();
  
  // State for dropdown visibility
  const [worksheetOpen, setWorksheetOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  
  // Refs for dropdown elements
  const worksheetRef = useRef(null);
  const profileRef = useRef(null);
  
  // Handle click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (worksheetRef.current && !worksheetRef.current.contains(event.target)) {
        setWorksheetOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Close dropdowns on navigation
  useEffect(() => {
    setWorksheetOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);
  
  // Calculate total progress
  const totalProgress = Math.floor(
    (worksheetProgress.worksheet1 + worksheetProgress.worksheet2 + worksheetProgress.worksheet3 + 
     worksheetProgress.worksheet4 + worksheetProgress.worksheet5 + worksheetProgress.worksheet6) / 6
  );

  const goToHome = () => {
    navigate('/');
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="py-3 shadow-sm position-relative">
      <Container>
        <Navbar.Brand onClick={goToHome} className="d-flex align-items-center" style={{ cursor: 'pointer' }}>
          <div>
            <span className="fw-bold fs-4">Threat Intel Workshop</span>
            <div className="brand-tagline" style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)' }}>Operationalizing Intelligence</div>
          </div>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 shadow-none" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto d-flex align-items-center">
            <Nav.Link onClick={() => navigate('/')} className={location.pathname === '/' ? 'active' : ''}>
              <div className="d-flex align-items-center">
                <svg className="me-2" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 22V12H15V22" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Home
              </div>
            </Nav.Link>
            
            <div className="custom-dropdown mx-2" ref={worksheetRef}>
              <button 
                className="dropdown-button d-flex align-items-center" 
                onClick={() => setWorksheetOpen(!worksheetOpen)}
              >
                <svg className="me-2" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 2V8H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Worksheets
              </button>
              <div className={`dropdown-content ${worksheetOpen ? 'show' : ''}`}>
                <Link 
                  to="/worksheet-1" 
                  className={`dropdown-item ${location.pathname === '/worksheet-1' ? 'active' : ''}`}
                  onClick={() => {
                    if (location.pathname === '/worksheet-1') {
                      window.location.reload();
                    }
                  }}
                  style={{ color: 'black' }}
                >
                  1. Morning Briefing
                </Link>
                <Link 
                  to="/worksheet-2" 
                  className={`dropdown-item ${location.pathname === '/worksheet-2' ? 'active' : ''}`}
                  onClick={() => {
                    if (location.pathname === '/worksheet-2') {
                      window.location.reload();
                    }
                  }}
                  style={{ color: 'black' }}
                >
                  2. Prioritization & Tasking
                </Link>
                <Link 
                  to="/worksheet-3" 
                  className={`dropdown-item ${location.pathname === '/worksheet-3' ? 'active' : ''}`}
                  onClick={() => {
                    if (location.pathname === '/worksheet-3') {
                      window.location.reload();
                    }
                  }}
                  style={{ color: 'black' }}
                >
                  3. Deep Dive Investigation
                </Link>
                <Link 
                  to="/worksheet-4" 
                  className={`dropdown-item ${location.pathname === '/worksheet-4' ? 'active' : ''}`}
                  onClick={() => {
                    if (location.pathname === '/worksheet-4') {
                      window.location.reload();
                    }
                  }}
                  style={{ color: 'black' }}
                >
                  4. Threat Actor Profiling
                </Link>
                <Link 
                  to="/worksheet-5" 
                  className={`dropdown-item ${location.pathname === '/worksheet-5' ? 'active' : ''}`}
                  onClick={() => {
                    if (location.pathname === '/worksheet-5') {
                      window.location.reload();
                    }
                  }}
                  style={{ color: 'black' }}
                >
                  5. Threat Hunting
                </Link>
                <Link 
                  to="/worksheet-6" 
                  className={`dropdown-item ${location.pathname === '/worksheet-6' ? 'active' : ''}`}
                  onClick={() => {
                    if (location.pathname === '/worksheet-6') {
                      window.location.reload();
                    }
                  }}
                  style={{ color: 'black' }}
                >
                  6. Reporting & Sharing
                </Link>
              </div>
            </div>
          
            <Nav.Link 
              onClick={() => navigate('/results')} 
              className={location.pathname === '/results' ? 'active' : ''}
            >
              <div className="d-flex align-items-center">
                <svg className="me-2" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 11.0799V11.9999C21.9988 14.1563 21.3005 16.2545 20.0093 17.9817C18.7182 19.7088 16.9033 20.9723 14.8354 21.5838C12.7674 22.1952 10.5573 22.1218 8.53447 21.3744C6.51168 20.6271 4.78465 19.246 3.61096 17.4369C2.43727 15.6279 1.87979 13.4879 2.02168 11.3362C2.16356 9.18443 2.99721 7.13619 4.39828 5.49694C5.79935 3.85768 7.69279 2.71525 9.79619 2.24001C11.8996 1.76477 14.1003 1.9822 16.07 2.85986" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 4L12 14.01L9 11.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Results
              </div>
            </Nav.Link>
            
            <Nav.Link 
              onClick={() => navigate('/about')} 
              className={location.pathname === '/about' ? 'active' : ''}
            >
              <div className="d-flex align-items-center">
                <svg className="me-2" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 16V12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 8H12.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                About
              </div>
            </Nav.Link>
            
            <div className="custom-dropdown ms-3 profile-dropdown" ref={profileRef}>
              <button 
                className="dropdown-button"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <div className={`dropdown-content dropdown-content-end ${profileOpen ? 'show' : ''}`}>
                {currentUser ? (
                  <>
                    <span className="dropdown-item-text" style={{ color: 'black' }}>Signed in as <strong>{currentUser.username}</strong></span>
                    <hr className="dropdown-divider" />
                    <button className="dropdown-item" onClick={handleLogout} style={{ color: 'black' }}>Logout</button>
                  </>
                ) : (
                  <>
                    <button className="dropdown-item" onClick={() => navigate('/login')} style={{ color: 'black' }}>Login</button>
                    <button className="dropdown-item" onClick={() => navigate('/login?register=true')} style={{ color: 'black' }}>Sign Up</button>
                  </>
                )}
              </div>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
