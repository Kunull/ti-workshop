import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Table, ListGroup, Badge, InputGroup } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useWorkshop } from '../context/WorkshopContext';

const Worksheet2 = () => {
  const navigate = useNavigate();
  const { 
    actorProfile, 
    setActorProfile,
    ttpChain,
    setTtpChain,
    worksheetProgress,
    setWorksheetProgress
  } = useWorkshop();
  
  // Initialize local state for backward compatibility
  const [localActorProfile, setLocalActorProfile] = useState({
    motivation: actorProfile.motivation || '',
    capability: actorProfile.capabilities ? actorProfile.capabilities.length : 1,
    ttps: actorProfile.ttps || [],
    targetIndustries: [],
    attributionConfidence: actorProfile.attributionConfidence || 1
  });

  const [currentStep, setCurrentStep] = useState(1);

  // Actor intelligence data
  const actorData = {
    observedActivity: `
      Recent campaigns targeting financial institutions with sophisticated spear-phishing emails.
      Uses custom malware called "DarkVault" that targets banking applications.
      Infrastructure leverages compromised WordPress sites as command and control servers.
      Exfiltrates data using encrypted channels to cloud storage services.
      Shows high operational security, rotating infrastructure regularly.
      Active hours suggest operators in Eastern Europe time zones.
      Uses living-off-the-land techniques to avoid detection.
      Some code comments found in Russian language.
    `,
    recentIncidents: [
      "March 2025: Targeted 15 banks across Europe with spear-phishing campaign",
      "January 2025: Compromised a financial service provider's update server",
      "November 2024: Targeted cryptocurrency exchanges with watering hole attacks"
    ],
    toolsObserved: [
      "DarkVault custom banking malware",
      "Modified Cobalt Strike",
      "PowerShell Empire",
      "Custom exfiltration tools",
      "Credential harvesting scripts"
    ]
  };

  // TTP options
  const ttpOptions = [
    { id: "T1566", name: "Phishing", tactic: "Initial Access" },
    { id: "T1189", name: "Drive-by Compromise", tactic: "Initial Access" },
    { id: "T1195", name: "Supply Chain Compromise", tactic: "Initial Access" },
    { id: "T1078", name: "Valid Accounts", tactic: "Defense Evasion, Persistence, Privilege Escalation, Initial Access" },
    { id: "T1053", name: "Scheduled Task/Job", tactic: "Execution, Persistence, Privilege Escalation" },
    { id: "T1059", name: "Command and Scripting Interpreter", tactic: "Execution" },
    { id: "T1027", name: "Obfuscated Files or Information", tactic: "Defense Evasion" },
    { id: "T1082", name: "System Information Discovery", tactic: "Discovery" },
    { id: "T1005", name: "Data from Local System", tactic: "Collection" },
    { id: "T1119", name: "Automated Collection", tactic: "Collection" },
    { id: "T1048", name: "Exfiltration Over Alternative Protocol", tactic: "Exfiltration" },
    { id: "T1567", name: "Exfiltration Over Web Service", tactic: "Exfiltration" },
  ];

  // Industry options
  const industryOptions = [
    "Financial Services",
    "Healthcare",
    "Government",
    "Energy",
    "Manufacturing",
    "Retail",
    "Transportation",
    "Technology",
    "Telecommunications",
    "Education"
  ];

  // Calculate progress
  useEffect(() => {
    let progress = 0;
    
    // Check motivation selection
    if (localActorProfile.motivation) progress += 20;
    
    // Check capability rating
    if (localActorProfile.capability > 1) progress += 20;
    
    // Check TTPs selection
    if (localActorProfile.ttps.length > 0) progress += 20;
    
    // Check target industries selection
    if (localActorProfile.targetIndustries.length > 0) progress += 20;
    
    // Check attribution confidence
    if (localActorProfile.attributionConfidence > 1) progress += 20;
    
    // Update new context structure
    setActorProfile({
      motivation: localActorProfile.motivation,
      capabilities: localActorProfile.capability > 1 ? ['Moderate', 'Advanced', 'Sophisticated'].slice(0, localActorProfile.capability - 1) : [],
      ttps: localActorProfile.ttps,
      relationshipToOtherActors: 'Potential links to state-sponsored groups',
      attributionConfidence: localActorProfile.attributionConfidence
    });
    
    setWorksheetProgress({
      ...worksheetProgress,
      worksheet2: progress
    });
  }, [localActorProfile, setActorProfile, worksheetProgress, setWorksheetProgress]);

  // Handle profile changes
  const handleProfileChange = (field, value) => {
    setLocalActorProfile({
      ...localActorProfile,
      [field]: value
    });
  };

  // Handle TTP selection
  const handleTTPSelection = (ttpId) => {
    const updatedTTPs = [...localActorProfile.ttps];
    
    if (updatedTTPs.includes(ttpId)) {
      // Remove if already selected
      const index = updatedTTPs.indexOf(ttpId);
      updatedTTPs.splice(index, 1);
    } else {
      // Add if not already selected
      updatedTTPs.push(ttpId);
    }
    
    setLocalActorProfile({
      ...localActorProfile,
      ttps: updatedTTPs
    });
    
    // Also update the ttpChain for the new context structure
    if (updatedTTPs.length > 0) {
      setTtpChain({
        ...ttpChain,
        attackFlow: updatedTTPs.map(id => {
          const ttp = ttpOptions.find(t => t.id === id);
          return { id, name: ttp.name, tactic: ttp.tactic };
        })
      });
    }
  };

  // Handle industry selection
  const handleIndustrySelection = (industry) => {
    const updatedIndustries = [...localActorProfile.targetIndustries];
    
    if (updatedIndustries.includes(industry)) {
      // Remove if already selected
      const index = updatedIndustries.indexOf(industry);
      updatedIndustries.splice(index, 1);
    } else {
      // Add if not already selected
      updatedIndustries.push(industry);
    }
    
    setLocalActorProfile({
      ...localActorProfile,
      targetIndustries: updatedIndustries
    });
  };

  // Handle next step
  const handleNextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final update of the ttpChain before navigation
      setTtpChain({
        ...ttpChain,
        userAssessment: `Actor appears to be a ${localActorProfile.motivation.toLowerCase()} group with ${localActorProfile.capability > 3 ? 'sophisticated' : 'moderate'} capabilities, primarily targeting ${localActorProfile.targetIndustries.join(', ')} sectors.`
      });
      navigate('/worksheet-3');
    }
  };

  // Handle previous step
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/worksheet-1');
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-4 mb-5">
        <Col md={10}>
          <Card className="shadow">
            <Card.Header as="h4" className="bg-primary text-white">
              Worksheet 2: Threat Actor Profiling
            </Card.Header>
            <Card.Body>
              <div className="mb-4 p-3 bg-light border">
                <h5>Threat Intelligence Summary</h5>
                <p style={{ whiteSpace: 'pre-line' }}>{actorData.observedActivity}</p>
                
                <h6>Recent Incidents:</h6>
                <ListGroup className="mb-3">
                  {actorData.recentIncidents.map((incident, index) => (
                    <ListGroup.Item key={index}>{incident}</ListGroup.Item>
                  ))}
                </ListGroup>
                
                <h6>Observed Tools:</h6>
                <div>
                  {actorData.toolsObserved.map((tool, index) => (
                    <Badge 
                      key={index} 
                      bg="secondary" 
                      className="me-2 mb-2 p-2"
                    >
                      {tool}
                    </Badge>
                  ))}
                </div>
              </div>
            
              {currentStep === 1 && (
                <>
                  <h5>Profile Components</h5>
                  <Form>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label><strong>1. Primary Motivation</strong></Form.Label>
                          <div>
                            {['Financial gain', 'Espionage', 'Disruption/Destruction', 'Hacktivism', 'Unknown'].map((motivation) => (
                              <Form.Check
                                key={motivation}
                                type="radio"
                                id={`motivation-${motivation}`}
                                label={motivation}
                                name="motivation"
                                checked={actorProfile.motivation === motivation}
                                onChange={() => handleProfileChange('motivation', motivation)}
                              />
                            ))}
                          </div>
                        </Form.Group>
                      </Col>
                      
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label><strong>2. Capability Assessment (1-5)</strong></Form.Label>
                          <Form.Range 
                            value={localActorProfile.capability} 
                            onChange={(e) => handleProfileChange('capability', parseInt(e.target.value))}
                            min="1"
                            max="5"
                            step="1"
                          />  
                          <div className="d-flex justify-content-between">
                            <small>Basic</small>
                            <small>Advanced</small>
                          </div>
                          <div className="text-center mt-2">
                            <Badge bg="primary" pill>
                              Level: {localActorProfile.capability}
                            </Badge>
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>
                  
                    <Form.Group className="mb-3">
                      <Form.Label><strong>3. Key TTPs (Select all that apply)</strong></Form.Label>
                      <div className="d-flex flex-wrap">
                        {ttpOptions.map((ttp) => (
                          <div key={ttp.id} className="me-3 mb-2" style={{ minWidth: '180px' }}>
                            <Form.Check
                              type="checkbox"
                              id={`ttp-${ttp.id}`}
                              label={`${ttp.id}: ${ttp.name} (${ttp.tactic})`}
                              checked={localActorProfile.ttps.includes(ttp.id)}
                              onChange={() => handleTTPSelection(ttp.id)}
                              className="mb-2"
                            />
                            <small className="text-muted d-block">
                              {ttp.tactic}
                            </small>
                          </div>
                        ))}
                      </div>
                    </Form.Group>
                  </Form>
                </>
              )}
              
              {currentStep === 2 && (
                <>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label><strong>4. Target Industries</strong></Form.Label>
                        <div className="d-flex flex-wrap">
                          {industryOptions.map((industry) => (
                            <div key={industry} className="me-3 mb-2" style={{ minWidth: '180px' }}>
                              <Form.Check
                                type="checkbox"
                                id={`industry-${industry}`}
                                label={industry}
                                checked={localActorProfile.targetIndustries.includes(industry)}
                                onChange={() => handleIndustrySelection(industry)}
                              />
                            </div>
                          ))}
                        </div>
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label><strong>5. Attribution Confidence (1-5)</strong></Form.Label>
                        <Form.Range 
                          value={localActorProfile.attributionConfidence} 
                          onChange={(e) => handleProfileChange('attributionConfidence', parseInt(e.target.value))}
                          min="1"
                          max="5"
                          step="1"
                        />
                        <div className="d-flex justify-content-between">
                          <small>Low Confidence</small>
                          <small>High Confidence</small>
                        </div>
                        <div className="text-center mt-2">
                          <Badge bg="primary" pill>
                            Level: {localActorProfile.attributionConfidence}
                          </Badge>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <div className="mt-4 p-3 bg-light">
                    <h5>Actor Profile Summary</h5>
                    <Table bordered size="sm">
                      <tbody>
                        <tr>
                          <th width="30%">Motivation:</th>
                          <td>{localActorProfile.motivation || "Not specified"}</td>
                        </tr>
                        <tr>
                          <th>Capability:</th>
                          <td>{localActorProfile.capability}/5</td>
                        </tr>
                        <tr>
                          <th>Primary TTPs:</th>
                          <td>
                            {localActorProfile.ttps.length > 0 ? (
                              <div className="d-flex flex-wrap">
                                {localActorProfile.ttps.map(ttpId => {
                                  const ttp = ttpOptions.find(t => t.id === ttpId);
                                  return (
                                    <Badge 
                                      key={ttpId} 
                                      bg="info" 
                                      className="me-1 mb-1 p-1"
                                    >
                                      {ttp.id}: {ttp.name}
                                    </Badge>
                                  );
                                })}
                              </div>
                            ) : "None selected"}
                          </td>
                        </tr>
                        <tr>
                          <th>Target Industries:</th>
                          <td>
                            {localActorProfile.targetIndustries.length > 0 ? (
                              <div className="d-flex flex-wrap">
                                {localActorProfile.targetIndustries.map(industry => (
                                  <Badge 
                                    key={industry} 
                                    bg="secondary" 
                                    className="me-1 mb-1 p-1"
                                  >
                                    {industry}
                                  </Badge>
                                ))}
                              </div>
                            ) : "None selected"}
                          </td>
                        </tr>
                        <tr>
                          <th>Attribution Confidence:</th>
                          <td>{localActorProfile.attributionConfidence}/5</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </>
              )}
              
              <div className="d-flex justify-content-between mt-4">
                {currentStep === 1 ? (
                  <Button 
                    variant="secondary" 
                    onClick={() => window.location.href = '/worksheet-1'}
                  >
                    Previous Exercise
                  </Button>
                ) : (
                  <Button variant="secondary" onClick={handlePrevStep}>Previous Step</Button>
                )}
                
                {currentStep === 2 ? (
                  <Button 
                    variant="primary" 
                    onClick={() => window.location.href = '/worksheet-3'}
                    disabled={localActorProfile.attributionConfidence < 1}
                  >
                    Next Exercise
                  </Button>
                ) : (
                  <Button variant="primary" onClick={handleNextStep}>Next Step</Button>
                )}
              </div>
            </Card.Body>
            <Card.Footer>
              <div className="d-flex justify-content-between align-items-center">
                <div>Step {currentStep} of 2</div>
                <div>Worksheet Progress: {worksheetProgress.worksheet2}%</div>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Worksheet2;
