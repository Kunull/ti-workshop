import React, { useState } from 'react';
import { Container, Card, Button, Form, Row, Col, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useWorkshop } from '../context/WorkshopContext';

const Home = () => {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useWorkshop();
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({
      ...userInfo,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const startWorkshop = () => {
    navigate('/worksheet-1');
  };

  return (
    <Container className="py-4">
      {/* Header Section with Animation */}
      <Row className="justify-content-md-center mb-5">
        <Col md={10} className="text-center">
          <div className="position-relative mb-2">
            <h1 className="display-4 fw-bold mb-0" style={{ color: 'var(--cyware-primary)' }}>
              Threat Intelligence Workshop
            </h1>
            <div className="position-absolute start-50 translate-middle-x" style={{ bottom: '-10px', width: '180px', height: '4px', backgroundColor: 'var(--cyware-secondary)', borderRadius: '2px' }}></div>
          </div>
          <h2 className="h3 mb-2" style={{ color: 'var(--cyware-primary)' }}>
            Taking Action in a Noisy World
          </h2>
          <p className="lead mb-4" style={{ color: 'var(--cyware-gray)' }}>
            A Day in the Life of an Intel Analyst (with GenAI Integration)
          </p>
        </Col>
      </Row>

      <Row className="justify-content-md-center">
        <Col md={8} lg={7}>
          <Card className="shadow border-0">
            <Card.Body className="p-0">
              <Row className="g-0">
                {/* Left Side - Info Section */}
                <Col md={5} className="bg-gradient p-4" style={{ background: 'var(--cyware-gradient)' }}>
                  <div className="text-white h-100 d-flex flex-column justify-content-between">
                    <div>
                      <h4 className="fw-bold mb-4">Workshop Overview</h4>
                      
                      <div className="mb-4">
                        <div className="d-flex align-items-center mb-3">
                          <div className="me-3 d-flex align-items-center justify-content-center" 
                              style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" strokeWidth="2"/>
                              <path d="M12 8V12L15 15" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                          </div>
                          <div>
                            <h6 className="mb-0 fw-semibold">Morning Briefing</h6>
                            <small>AI-Driven Threat Summarization</small>
                          </div>
                        </div>
                        
                        <div className="d-flex align-items-center mb-3">
                          <div className="me-3 d-flex align-items-center justify-content-center" 
                              style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M19 9L12 16L5 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <div>
                            <h6 className="mb-0 fw-semibold">Prioritization & Tasking</h6>
                            <small>AI-Assisted Threat Prioritization</small>
                          </div>
                        </div>
                        
                        <div className="d-flex align-items-center mb-3">
                          <div className="me-3 d-flex align-items-center justify-content-center" 
                              style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <div>
                            <h6 className="mb-0 fw-semibold">Investigation & Analysis</h6>
                            <small>AI-Enhanced IOC Analysis</small>
                          </div>
                        </div>
                        
                        <div className="d-flex align-items-center mb-3">
                          <div className="me-3 d-flex align-items-center justify-content-center" 
                              style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M17 21V19C17 16.7909 15.2091 15 13 15H5C2.79086 15 1 16.7909 1 19V21" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                              <path d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z" stroke="white" strokeWidth="2"/>
                            </svg>
                          </div>
                          <div>
                            <h6 className="mb-0 fw-semibold">Threat Actor Profiling</h6>
                            <small>AI-Assisted TTP Mapping</small>
                          </div>
                        </div>
                        
                        <div className="d-flex align-items-center mb-3">
                          <div className="me-3 d-flex align-items-center justify-content-center" 
                              style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M10 3L8 21M16 3L14 21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M3.5 9H21.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M2.5 15H20.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <div>
                            <h6 className="mb-0 fw-semibold">Threat Hunting</h6>
                            <small>AI-Guided Detection Engineering</small>
                          </div>
                        </div>
                        
                        <div className="d-flex align-items-center">
                          <div className="me-3 d-flex align-items-center justify-content-center" 
                              style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M14 2V8H20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M16 13H8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M16 17H8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M10 9H9H8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <div>
                            <h6 className="mb-0 fw-semibold">Reporting & Sharing</h6>
                            <small>AI-Enhanced Knowledge Sharing</small>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Badge bg="light" text="dark" className="mb-2">Interactive Exercises</Badge>
                      <p className="small mb-0 opacity-75">
                        Complete all six exercises to experience a day in the life of a GenAI-empowered threat intelligence analyst
                      </p>
                    </div>
                  </div>
                </Col>
                
                {/* Right Side - Form */}
                <Col md={7}>
                  <div className="p-4 p-lg-5">
                    {!formSubmitted ? (
                      <>
                        <h4 className="mb-4 fw-bold" style={{ color: 'var(--cyware-primary)' }}>Welcome to the Workshop</h4>
                        <p className="mb-4">
                          This digital workbook simulates a day in the life of a threat intelligence analyst, showcasing how both traditional techniques and cutting-edge Generative AI tools can be leveraged to navigate the complex threat landscape.
                        </p>
                        
                        <Form onSubmit={handleSubmit}>
                          <h6 className="mb-3 fw-semibold">Please tell us about yourself:</h6>
                          <Form.Group className="mb-3">
                            <Form.Label>Name (Optional)</Form.Label>
                            <Form.Control
                              type="text"
                              name="name"
                              value={userInfo.name}
                              onChange={handleInputChange}
                              placeholder="Your name"
                              className="shadow-sm"
                            />
                          </Form.Group>
                          
                          <Form.Group className="mb-3">
                            <Form.Label>Organization (Optional)</Form.Label>
                            <Form.Control
                              type="text"
                              name="organization"
                              value={userInfo.organization}
                              onChange={handleInputChange}
                              placeholder="Your organization"
                              className="shadow-sm"
                            />
                          </Form.Group>
                          
                          <Form.Group className="mb-4">
                            <Form.Label>Role</Form.Label>
                            <Form.Select 
                              name="role" 
                              value={userInfo.role}
                              onChange={handleInputChange}
                              required
                              className="shadow-sm"
                            >
                              <option value="">Select your role</option>
                              <option value="Security Analyst">Security Analyst</option>
                              <option value="SOC Analyst">SOC Analyst</option>
                              <option value="Threat Intelligence Analyst">Threat Intelligence Analyst</option>
                              <option value="Security Engineer">Security Engineer</option>
                              <option value="Security Manager">Security Manager/Director</option>
                              <option value="CISO">CISO</option>
                              <option value="Other">Other</option>
                            </Form.Select>
                          </Form.Group>
                          
                          <div className="d-grid">
                            <Button 
                              variant="primary" 
                              type="submit" 
                              size="lg" 
                              className="shadow-sm"
                            >
                              Continue
                            </Button>
                          </div>
                        </Form>
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <div className="mb-4">
                          <div className="d-inline-flex align-items-center justify-content-center mb-3"
                              style={{ width: '90px', height: '90px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                            <svg width="45" height="45" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M20 6L9 17L4 12" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <h4 className="mb-2 fw-bold" style={{ color: 'var(--cyware-primary)' }}>Ready to Begin!</h4>
                          <p className="mb-4" style={{ color: 'var(--cyware-gray)' }}>
                            Thanks, {userInfo.name || "participant"}! Your profile has been saved.
                            {userInfo.organization && ` Welcome from ${userInfo.organization}!`}
                          </p>
                        </div>
                        
                        <div className="d-grid mb-3">
                          <Button 
                            variant="success" 
                            onClick={startWorkshop} 
                            size="lg"
                            className="shadow-sm pulse"
                          >
                            <div className="d-flex align-items-center justify-content-center">
                              <span>Start First Exercise</span>
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ms-2">
                                <path d="M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M12 5L19 12L12 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                          </Button>
                        </div>
                        
                        <small className="text-muted">
                          Your progress will be saved as you complete each exercise
                        </small>
                      </div>
                    )}
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          
          <div className="text-center mt-4">
            <small className="text-muted">
              © 2025 Threat Intelligence Workshop | Presented by Avkash Kathiriya
            </small>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
