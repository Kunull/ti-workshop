import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Table, Badge } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useWorkshop } from '../context/WorkshopContext';

const Worksheet3 = () => {
  const navigate = useNavigate();
  const { 
    responseOptions, 
    setResponseOptions,
    worksheetProgress,
    setWorksheetProgress
  } = useWorkshop();

  const [currentStep, setCurrentStep] = useState(1);

  // Scenario data
  const scenarioData = {
    title: "Emerging Banking Trojan Threat",
    description: `
      Your threat intelligence team has identified a new variant of the DarkVault banking trojan that's targeting financial institutions.
      
      Key findings:
      
      1. The malware is being distributed through phishing emails that appear to be invoices from legitimate vendors.
      2. Attachments are Excel files with malicious macros that download the trojan from compromised WordPress sites.
      3. The trojan targets banking credentials and has screen recording capabilities to capture user input.
      4. Command and control infrastructure has been identified across several IP addresses and domains.
      5. The actors appear to be targeting regional banks and credit unions with limited security resources.
      6. Several organizations in your industry have already been compromised.
    `,
    iocs: [
      { type: "Email Subject", value: "Invoice #INV-29581 for May 2025" },
      { type: "Attachment", value: "Invoice-29581.xlsx" },
      { type: "Hash", value: "a8f5de56c87e31b6ca7b3d9ad74b258d" },
      { type: "C2 Domain", value: "business-invoices-secure.com" },
      { type: "C2 IP", value: "45.113.202.39" }
    ]
  };

  // Systems options
  const detectionSystemOptions = [
    "Email Gateway",
    "Endpoint Detection & Response",
    "Network Monitoring",
    "SIEM",
    "Proxy/Web Filter",
    "DNS Monitoring",
    "User Behavior Analytics",
    "Deception Technology"
  ];

  // Response action options
  const responseActionOptions = [
    { id: "blockingIOCs", name: "Blocking known IOCs" },
    { id: "threatHunting", name: "Threat hunting for additional compromise" },
    { id: "patchingVulnerabilities", name: "Patching vulnerable systems" },
    { id: "incidentResponse", name: "Preparing incident response playbook" },
    { id: "stakeholderCommunication", name: "Stakeholder communication" }
  ];

  // MITRE ATT&CK tactics
  const mitreTactics = [
    "Initial Access",
    "Execution",
    "Persistence",
    "Privilege Escalation",
    "Defense Evasion",
    "Credential Access",
    "Discovery",
    "Lateral Movement",
    "Collection",
    "Command and Control",
    "Exfiltration",
    "Impact"
  ];

  // MITRE ATT&CK techniques
  const mitreTechniques = [
    { id: "T1566", name: "Phishing", tactic: "Initial Access" },
    { id: "T1204", name: "User Execution", tactic: "Execution" },
    { id: "T1059.005", name: "Visual Basic", tactic: "Execution" },
    { id: "T1547", name: "Boot or Logon Autostart Execution", tactic: "Persistence" },
    { id: "T1027", name: "Obfuscated Files or Information", tactic: "Defense Evasion" },
    { id: "T1056.001", name: "Keylogging", tactic: "Collection" },
    { id: "T1113", name: "Screen Capture", tactic: "Collection" },
    { id: "T1102", name: "Web Service", tactic: "Command and Control" },
    { id: "T1567", name: "Exfiltration Over Web Service", tactic: "Exfiltration" }
  ];

  // Calculate progress
  useEffect(() => {
    let progress = 0;
    
    // Check detection systems selection
    if (responseOptions.detectionSystems.length > 0) progress += 25;
    
    // Check detection rule
    if (responseOptions.detectionRule.length > 10) progress += 25;
    
    // Check response actions prioritization
    const actionsDone = Object.values(responseOptions.responseActions).some(score => score > 0);
    if (actionsDone) progress += 25;
    
    // Check executive summary
    if (responseOptions.executiveSummary.length > 10) progress += 25;
    
    setWorksheetProgress({
      ...worksheetProgress,
      worksheet3: progress
    });
  }, [responseOptions]);

  // Handle detection system selection
  const handleDetectionSystemSelection = (system) => {
    const updatedSystems = [...responseOptions.detectionSystems];
    
    if (updatedSystems.includes(system)) {
      // Remove if already selected
      const index = updatedSystems.indexOf(system);
      updatedSystems.splice(index, 1);
    } else {
      // Add if not already selected
      updatedSystems.push(system);
    }
    
    setResponseOptions({
      ...responseOptions,
      detectionSystems: updatedSystems
    });
  };

  // Handle detection rule change
  const handleDetectionRuleChange = (e) => {
    setResponseOptions({
      ...responseOptions,
      detectionRule: e.target.value
    });
  };

  // Handle response action priority change
  const handleResponseActionChange = (actionId, value) => {
    setResponseOptions({
      ...responseOptions,
      responseActions: {
        ...responseOptions.responseActions,
        [actionId]: parseInt(value)
      }
    });
  };

  // Handle executive summary change
  const handleExecutiveSummaryChange = (e) => {
    setResponseOptions({
      ...responseOptions,
      executiveSummary: e.target.value
    });
  };

  // Handle next step
  const handleNextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/worksheet-4');
    }
  };

  // Handle previous step
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/worksheet-2');
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-4 mb-5">
        <Col md={10}>
          <Card className="shadow">
            <Card.Header as="h4" className="bg-primary text-white">
              Worksheet 3: Operationalizing Intel
            </Card.Header>
            <Card.Body>
              <div className="mb-4 p-3 bg-light border">
                <h5>{scenarioData.title}</h5>
                <p style={{ whiteSpace: 'pre-line' }}>{scenarioData.description}</p>
                
                <h6>Identified IOCs:</h6>
                <Table bordered size="sm">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scenarioData.iocs.map((ioc, index) => (
                      <tr key={index}>
                        <td>{ioc.type}</td>
                        <td><code>{ioc.value}</code></td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            
              {currentStep === 1 && (
                <>
                  <h5>1. Detection Opportunities</h5>
                  <p>Which systems would you check for this threat? (Select all that apply)</p>
                  
                  <Form.Group className="mb-4">
                    <div className="d-flex flex-wrap">
                      {detectionSystemOptions.map((system) => (
                        <div key={system} className="me-3 mb-2" style={{ minWidth: '200px' }}>
                          <Form.Check
                            type="checkbox"
                            id={`system-${system}`}
                            label={system}
                            checked={responseOptions.detectionSystems.includes(system)}
                            onChange={() => handleDetectionSystemSelection(system)}
                          />
                        </div>
                      ))}
                    </div>
                  </Form.Group>
                  
                  <h5>2. Detection Content Development</h5>
                  <p>Draft a detection rule based on the provided IOCs:</p>
                  
                  <Form.Group className="mb-4">
                    <Form.Control
                      as="textarea"
                      rows={5}
                      value={responseOptions.detectionRule}
                      onChange={handleDetectionRuleChange}
                      placeholder="Write your detection rule here (e.g., SIEM, EDR, or Yara rule)..."
                    />
                    <Form.Text className="text-muted">
                      Example: Sigma, Snort, Yara, or even pseudocode is acceptable
                    </Form.Text>
                  </Form.Group>
                </>
              )}
              
              {currentStep === 2 && (
                <>
                  <h5>3. Response Prioritization</h5>
                  <p>Rank the following response actions (1-5, with 1 being highest priority):</p>
                  
                  <Form.Group className="mb-4">
                    <Row>
                      {responseActionOptions.map((action) => (
                        <Col md={6} key={action.id} className="mb-3">
                          <Form.Label>{action.name}</Form.Label>
                          <div className="d-flex align-items-center">
                            <Form.Range
                              min={0}
                              max={5}
                              value={responseOptions.responseActions[action.id]}
                              onChange={(e) => handleResponseActionChange(action.id, e.target.value)}
                              className="me-2"
                            />
                            <Badge bg={responseOptions.responseActions[action.id] ? "primary" : "secondary"}>
                              {responseOptions.responseActions[action.id] || "Not ranked"}
                            </Badge>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </Form.Group>
                  
                  <h5>4. Stakeholder Communication</h5>
                  <p>Draft a brief executive summary (3-5 bullets):</p>
                  
                  <Form.Group className="mb-4">
                    <Form.Control
                      as="textarea"
                      rows={5}
                      value={responseOptions.executiveSummary}
                      onChange={handleExecutiveSummaryChange}
                      placeholder="Write a brief summary for executives about this threat and your recommended actions..."
                    />
                  </Form.Group>
                  
                  <h5>5. MITRE ATT&CK Mapping</h5>
                  <p>Select the MITRE ATT&CK techniques that apply to this scenario:</p>
                  
                  <div className="p-3 border mb-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    <Table bordered hover>
                      <thead>
                        <tr>
                          <th style={{ width: '10%' }}>ID</th>
                          <th style={{ width: '30%' }}>Technique</th>
                          <th style={{ width: '30%' }}>Tactic</th>
                          <th style={{ width: '30%' }}>In Scenario?</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mitreTechniques.map((technique) => (
                          <tr key={technique.id}>
                            <td>{technique.id}</td>
                            <td>{technique.name}</td>
                            <td>{technique.tactic}</td>
                            <td>
                              <Form.Check
                                type="checkbox"
                                id={`technique-${technique.id}`}
                                label="Applies"
                                checked={responseOptions.mitreMapping[technique.id] || false}
                                onChange={() => {
                                  setResponseOptions({
                                    ...responseOptions,
                                    mitreMapping: {
                                      ...responseOptions.mitreMapping,
                                      [technique.id]: !responseOptions.mitreMapping[technique.id]
                                    }
                                  });
                                }}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </>
              )}
              
              <div className="d-flex justify-content-between mt-4">
                {currentStep === 1 ? (
                  <Button 
                    variant="secondary" 
                    onClick={() => window.location.href = '/worksheet-2'}
                  >
                    Previous Exercise
                  </Button>
                ) : (
                  <Button variant="secondary" onClick={handlePrevStep}>Previous Step</Button>
                )}
                
                {currentStep === 2 ? (
                  <Button 
                    variant="primary" 
                    onClick={() => window.location.href = '/worksheet-4'}
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
                <div>Worksheet Progress: {worksheetProgress.worksheet3}%</div>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Worksheet3;
