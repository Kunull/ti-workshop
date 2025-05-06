import React from 'react';
import { Navbar, Nav, Container, ProgressBar } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useWorkshop } from '../context/WorkshopContext';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { worksheetProgress } = useWorkshop();

  const totalProgress = Math.floor(
    (worksheetProgress.worksheet1 + worksheetProgress.worksheet2 + worksheetProgress.worksheet3 + 
     worksheetProgress.worksheet4 + worksheetProgress.worksheet5 + worksheetProgress.worksheet6) / 6
  );

  const goToHome = () => {
    navigate('/');
  };

  return (
    <Navbar expand="lg" className="py-3 shadow-sm position-relative">
      <Container>
        <Navbar.Brand onClick={goToHome} className="d-flex align-items-center" style={{ cursor: 'pointer' }}>
          <div className="cyware-logo-container me-3 d-flex align-items-center justify-content-center">
            <svg width="180" height="40" viewBox="0 0 800 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Cyware Logo Symbol - 3 diamonds */}
              <g transform="translate(10, 20) scale(0.8)">
                {/* Blue diamond */}
                <path d="M150,0 L0,150 L150,300 L300,150 Z" fill="#0052CC" />
                
                {/* Green triangle */}
                <path d="M180,0 L300,120 L180,120 Z" fill="#0CCA98" />
                
                {/* Purple triangle */}
                <path d="M120,180 L120,300 L240,180 Z" fill="#9900CC" />
              </g>
              
              {/* CYWARE Text */}
              <g transform="translate(280, 65) scale(1.2)">
                {/* C */}
                <path d="M30,110 C13.4,110 0,96.6 0,80 C0,63.4 13.4,50 30,50 C41.4,50 51.2,56.7 55.7,66.4 L43.9,72.1 C41.6,67.2 36.2,64 30,64 C21.2,64 14,71.2 14,80 C14,88.8 21.2,96 30,96 C36.2,96 41.6,92.8 43.9,87.9 L55.7,93.5 C51.2,103.3 41.4,110 30,110 Z" fill="#1F272E" />
                
                {/* Y */}
                <path d="M111.5,52 L126.2,52 L126.2,77.6 L152.8,77.6 L152.8,52 L167.4,52 L167.4,110 L152.8,110 L152.8,90.4 L126.2,90.4 L126.2,110 L111.5,110 L111.5,52 Z" fill="#1F272E" />
                
                {/* W */}
                <path d="M260,110 L245.5,110 L238.6,68.3 L221.8,110 L210.2,110 L193.4,68.3 L186.5,110 L172,110 L184,52 L201.4,52 L219.8,97.2 L238.2,52 L255.6,52 L267.5,110 L260,110 Z" fill="#1F272E" />
                
                {/* A */}
                <path d="M318.5,110 L304,110 L301,100 L276,100 L273,110 L258.5,110 L281.5,52 L295.5,52 L318.5,110 Z M288.5,65.8 L281.5,87 L295.5,87 L288.5,65.8 Z" fill="#1F272E" />
                
                {/* R */}
                <path d="M352,52 L380,52 C392.1,52 402,61.9 402,74 C402,82.9 396.5,90.6 388.8,93.7 L405,110 L387,110 L373.5,95 L366.6,95 L366.6,110 L352,110 L352,52 Z M366.6,65 L366.6,82 L380,82 C384.4,82 388,78.4 388,74 C388,69.6 384.4,66 380,66 L366.6,65 Z" fill="#1F272E" />
                
                {/* E */}
                <path d="M418,52 L467,52 L467,65 L432.6,65 L432.6,74 L462,74 L462,87 L432.6,87 L432.6,97 L467,97 L467,110 L418,110 L418,52 Z" fill="#1F272E" />
              </g>
            </svg>
          </div>
          <div>
            <span className="fw-bold fs-4 text-white">Threat Intel Workshop</span>
            <div className="brand-tagline" style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.7)' }}>Operationalizing Intelligence</div>
          </div>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 shadow-none" style={{ color: 'white' }} />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link onClick={() => window.location.href = '/'} className={location.pathname === '/' ? 'active' : ''}>
              <div className="d-flex align-items-center">
                <svg className="me-2" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Home
              </div>
            </Nav.Link>
            
            <Nav.Link 
              onClick={() => {
                console.log('Navigating to worksheet-1');
                window.location.href = '/worksheet-1';
              }} 
              className={location.pathname === '/worksheet-1' ? 'active' : ''}
            >
              <div className="d-flex align-items-center">
                <svg className="me-2" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Morning Briefing
              </div>
            </Nav.Link>
            
            <Nav.Link 
              onClick={() => {
                console.log('Navigating to worksheet-2');
                window.location.href = '/worksheet-2';
              }} 
              className={location.pathname === '/worksheet-2' ? 'active' : ''}
            >
              <div className="d-flex align-items-center">
                <svg className="me-2" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 9L12 16L5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Prioritization & Tasking
              </div>
            </Nav.Link>
            
            <Nav.Link 
              onClick={() => {
                console.log('Navigating to worksheet-3');
                window.location.href = '/worksheet-3';
              }} 
              className={location.pathname === '/worksheet-3' ? 'active' : ''}
            >
              <div className="d-flex align-items-center">
                <svg className="me-2" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Deep Dive Investigation
              </div>
            </Nav.Link>
            
            <Nav.Link 
              onClick={() => {
                console.log('Navigating to worksheet-4');
                window.location.href = '/worksheet-4';
              }} 
              className={location.pathname === '/worksheet-4' ? 'active' : ''}
            >
              <div className="d-flex align-items-center">
                <svg className="me-2" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 21V19C17 16.7909 15.2091 15 13 15H5C2.79086 15 1 16.7909 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Threat Actor Profiling
              </div>
            </Nav.Link>
            
            <Nav.Link 
              onClick={() => {
                console.log('Navigating to worksheet-5');
                window.location.href = '/worksheet-5';
              }} 
              className={location.pathname === '/worksheet-5' ? 'active' : ''}
            >
              <div className="d-flex align-items-center">
                <svg className="me-2" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 3L8 21M16 3L14 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3.5 9H21.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2.5 15H20.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Threat Hunting
              </div>
            </Nav.Link>
            
            <Nav.Link 
              onClick={() => {
                console.log('Navigating to worksheet-6');
                window.location.href = '/worksheet-6';
              }} 
              className={location.pathname === '/worksheet-6' ? 'active' : ''}
            >
              <div className="d-flex align-items-center">
                <svg className="me-2" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Reporting & Sharing
              </div>
            </Nav.Link>
            
            <Nav.Link 
              onClick={() => {
                console.log('Navigating to results');
                window.location.href = '/results';
              }} 
              className={location.pathname === '/results' ? 'active' : ''}
            >
              <div className="d-flex align-items-center">
                <svg className="me-2" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 11.0799V11.9999C21.9988 14.1563 21.3005 16.2545 20.0093 17.9817C18.7182 19.7088 16.9033 20.9723 14.8354 21.5838C12.7674 22.1952 10.5573 22.1218 8.53447 21.3744C6.51168 20.6271 4.78465 19.246 3.61096 17.4369C2.43727 15.6279 1.87979 13.4879 2.02168 11.3362C2.16356 9.18443 2.99721 7.13619 4.39828 5.49694C5.79935 3.85768 7.69279 2.71525 9.79619 2.24001C11.8996 1.76477 14.1003 1.9822 16.07 2.85986" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Results
              </div>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
      
      {/* Progress Bar */}
      {location.pathname !== '/' && (
        <div className="progress-container w-100 position-absolute" style={{ bottom: '0', left: 0 }}>
          <div className="position-relative">
            <ProgressBar now={totalProgress} style={{ height: '6px', borderRadius: 0 }} />
            <div className="position-absolute d-flex justify-content-center align-items-center" 
                 style={{ 
                   right: '16px', 
                   bottom: '6px', 
                   transform: 'translateY(50%)',
                   backgroundColor: 'var(--cyware-secondary)',
                   borderRadius: '20px',
                   padding: '4px 12px',
                   boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                 }}>
              <span className="progress-text text-white" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                {totalProgress}% Complete ({Math.ceil(totalProgress / 100 * 6)}/6 Exercises)
              </span>
            </div>
          </div>
        </div>
      )}
    </Navbar>
  );
};

export default Navigation;
