import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, ListGroup, Badge, Table, Alert, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useWorkshop } from '../context/WorkshopContext';

const Worksheet5 = () => {
  const navigate = useNavigate();
  const { 
    worksheetProgress,
    setWorksheetProgress,
    malwareReport
  } = useWorkshop();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [disseminationData, setDisseminationData] = useState({
    // Audience targeting
    audienceSelection: [],
    
    // Intelligence product design
    reportFormat: '',
    customizationOptions: {
      executiveSummary: true,
      technicalDetails: true,
      iocs: true,
      mitigationSteps: true,
      attributionInfo: false
    },
    
    // Classification systems
    urgencyLevel: 2,
    confidentialityLevel: 2,
    
    // Sharing workflows
    deliveryMethods: [],
    automationRules: [],
    
    // Feedback mechanisms
    feedbackMechanisms: []
  });
  
  // Audience options with added priority field for rapid response focus
  const audienceOptions = [
    { id: 'security', name: 'Security Team', description: 'SOC analysts, Incident responders, Threat hunters', priority: 'Critical' },
    { id: 'it', name: 'IT Operations', description: 'System administrators, Network engineers, Help desk', priority: 'High' },
    { id: 'executive', name: 'Executive Leadership', description: 'C-suite, Board members, Senior management', priority: 'Medium' },
    { id: 'legal', name: 'Legal & Compliance', description: 'Legal counsel, Compliance officers, Risk management', priority: 'Medium' },
    { id: 'partners', name: 'External Partners', description: 'Vendors, Customers, Industry partners', priority: 'Low' },
    { id: 'isac', name: 'Information Sharing Groups', description: 'ISACs, CERTs, Industry working groups', priority: 'High' }
  ];
  
  // Report format options
  const reportFormatOptions = [
    { id: 'executive_brief', name: 'Executive Brief', description: 'High-level overview with business impact focus (1-2 pages)' },
    { id: 'technical_report', name: 'Technical Report', description: 'Detailed technical analysis with IOCs and mitigation steps' },
    { id: 'security_advisory', name: 'Security Advisory', description: 'Focused alert with essential details for quick action' },
    { id: 'threat_bulletin', name: 'Threat Bulletin', description: 'Regular update on evolving threats with moderate detail' },
    { id: 'incident_report', name: 'Incident Report', description: 'Comprehensive documentation of a security incident' }
  ];
  
  // Delivery method options with added speed metrics for rapid response
  const deliveryMethodOptions = [
    { id: 'automation', name: 'Automated Distribution', description: 'API-based sharing with security tools and platforms', speed: 'Immediate' },
    { id: 'sharing_platform', name: 'Threat Sharing Platform', description: 'MISP, ThreatConnect, or other sharing platforms', speed: 'Immediate' },
    { id: 'ticketing', name: 'Ticketing System', description: 'Creating tickets for tracking and assignment', speed: 'Fast' },
    { id: 'email', name: 'Email', description: 'Direct distribution to specific recipients', speed: 'Medium' },
    { id: 'portal', name: 'Security Portal', description: 'Posting to an internal security information portal', speed: 'Medium' },
    { id: 'meeting', name: 'Briefing Meeting', description: 'Live presentation of findings and recommendations', speed: 'Slow' }
  ];
  
  // Automation rule options
  const automationRuleOptions = [
    { id: 'severity', name: 'Severity-Based Routing', description: 'Route intelligence based on severity level' },
    { id: 'audience', name: 'Audience-Based Formatting', description: 'Automatically format intelligence for different audiences' },
    { id: 'urgency', name: 'Urgency-Based Timing', description: 'Adjust delivery timing based on urgency level' },
    { id: 'enrichment', name: 'Automatic Enrichment', description: 'Enrich intelligence with additional context before delivery' },
    { id: 'integration', name: 'Security Tool Integration', description: 'Automatically update security tools with new intelligence' }
  ];
  
  // Feedback mechanism options
  const feedbackMechanismOptions = [
    { id: 'survey', name: 'Post-Delivery Survey', description: 'Quick feedback form after intelligence delivery' },
    { id: 'tracking', name: 'Action Tracking', description: 'Track actions taken based on intelligence' },
    { id: 'metrics', name: 'Effectiveness Metrics', description: 'Measure impact of intelligence on security posture' },
    { id: 'comments', name: 'Collaborative Comments', description: 'Allow comments and discussion on intelligence products' },
    { id: 'meetings', name: 'Feedback Sessions', description: 'Regular meetings to discuss intelligence quality' }
  ];
  
  // Sample executive summary for the malware report
  const executiveSummary = `
    EXECUTIVE SUMMARY: ${malwareReport?.fileName || "UNKNOWN MALWARE"} ANALYSIS
    
    Our security team has identified and analyzed a significant malware threat targeting our organization. 
    The malware poses a ${disseminationData.urgencyLevel >= 3 ? 'critical' : disseminationData.urgencyLevel === 2 ? 'high' : 'moderate'} risk to our systems and data.
    
    Key findings:
    • The malware was initially detected in our environment on ${new Date().toLocaleDateString()}
    • It appears to be targeting financial data and credentials
    • The malware uses sophisticated evasion techniques to avoid detection
    • We have identified indicators of compromise that can be used to detect the malware
    
    Immediate action is recommended to mitigate this threat. See the attached technical details and mitigation steps.
  `;
  
  // Sample technical details for the report preview
  const technicalDetails = `
    TECHNICAL DETAILS
    
    The malware uses a multi-stage infection process:
    1. Initial access via phishing email with malicious document attachment
    2. Document contains obfuscated macros that execute when opened
    3. Establishes persistence through registry modifications and scheduled tasks
    4. Communicates with command and control servers to exfiltrate sensitive data
    
    The malware employs several evasion techniques:
    • Anti-VM checks to detect analysis environments
    • Process injection to hide malicious code
    • Encrypted communications to avoid network detection
    • Fileless components that operate only in memory
  `;
  
  // Sample mitigation steps for the report preview
  const mitigationSteps = `
    RECOMMENDED MITIGATION STEPS
    
    1. Block the following IOCs at network and endpoint levels:
       • IP: 185.193.141.247
       • Domain: malicious-command-server.net
       • File hash: ${malwareReport?.sha256 || "N/A"}
    
    2. Implement application allowlisting to prevent unauthorized code execution
    
    3. Update email security gateways to detect the current phishing patterns
    
    4. Deploy the provided YARA rules to detect the malware variants
    
    5. Conduct memory forensics on potentially compromised systems using the provided indicators
  `;
  
  // Calculate progress based on completed steps
  useEffect(() => {
    let progress = 0;
    
    // Check audience selection
    if (disseminationData.audienceSelection.length > 0) {
      progress += 20;
    }
    
    // Check report format selection
    if (disseminationData.reportFormat) {
      progress += 20;
    }
    
    // Check delivery methods
    if (disseminationData.deliveryMethods.length > 0) {
      progress += 20;
    }
    
    // Check automation rules
    if (disseminationData.automationRules.length > 0) {
      progress += 20;
    }
    
    // Check feedback mechanisms
    if (disseminationData.feedbackMechanisms.length > 0) {
      progress += 20;
    }
    
    setWorksheetProgress({
      ...worksheetProgress,
      worksheet5: progress
    });
  }, [disseminationData, worksheetProgress, setWorksheetProgress]);
  
  // Handle audience selection
  const handleAudienceSelection = (audienceId) => {
    const updatedSelection = [...disseminationData.audienceSelection];
    
    if (updatedSelection.includes(audienceId)) {
      // Remove if already selected
      const index = updatedSelection.indexOf(audienceId);
      updatedSelection.splice(index, 1);
    } else {
      // Add if not selected
      updatedSelection.push(audienceId);
    }
    
    setDisseminationData({
      ...disseminationData,
      audienceSelection: updatedSelection
    });
  };
  
  // Handle report format selection
  const handleReportFormatChange = (e) => {
    setDisseminationData({
      ...disseminationData,
      reportFormat: e.target.value
    });
  };
  
  // Handle urgency level change
  const handleUrgencyChange = (e) => {
    setDisseminationData({
      ...disseminationData,
      urgencyLevel: parseInt(e.target.value)
    });
  };
  
  // Handle confidentiality level change
  const handleConfidentialityChange = (e) => {
    setDisseminationData({
      ...disseminationData,
      confidentialityLevel: parseInt(e.target.value)
    });
  };
  
  // Handle content section toggle
  const handleContentToggle = (section) => {
    setDisseminationData({
      ...disseminationData,
      customizationOptions: {
        ...disseminationData.customizationOptions,
        [section]: !disseminationData.customizationOptions[section]
      }
    });
  };
  
  // Handle delivery method selection
  const handleDeliveryMethodSelection = (methodId) => {
    const updatedMethods = [...disseminationData.deliveryMethods];
    
    if (updatedMethods.includes(methodId)) {
      // Remove if already selected
      const index = updatedMethods.indexOf(methodId);
      updatedMethods.splice(index, 1);
    } else {
      // Add if not selected
      updatedMethods.push(methodId);
    }
    
    setDisseminationData({
      ...disseminationData,
      deliveryMethods: updatedMethods
    });
  };
  
  // Handle automation rule selection
  const handleAutomationRuleSelection = (ruleId) => {
    const updatedRules = [...disseminationData.automationRules];
    
    if (updatedRules.includes(ruleId)) {
      // Remove if already selected
      const index = updatedRules.indexOf(ruleId);
      updatedRules.splice(index, 1);
    } else {
      // Add if not selected
      updatedRules.push(ruleId);
    }
    
    setDisseminationData({
      ...disseminationData,
      automationRules: updatedRules
    });
  };
  
  // Handle feedback mechanism selection
  const handleFeedbackSelection = (feedbackId) => {
    const updatedFeedback = [...disseminationData.feedbackMechanisms];
    
    if (updatedFeedback.includes(feedbackId)) {
      // Remove if already selected
      const index = updatedFeedback.indexOf(feedbackId);
      updatedFeedback.splice(index, 1);
    } else {
      // Add if not selected
      updatedFeedback.push(feedbackId);
    }
    
    setDisseminationData({
      ...disseminationData,
      feedbackMechanisms: updatedFeedback
    });
  };
  
  // Handle next step
  const handleNextStep = () => {
    if (currentStep === 1) {
      // Validate that audience has been selected
      if (disseminationData.audienceSelection.length === 0) {
        alert('Please select at least one audience before proceeding.');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Validate that report format has been selected
      if (!disseminationData.reportFormat) {
        alert('Please select a report format before proceeding.');
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      // Validate that delivery methods have been selected
      if (disseminationData.deliveryMethods.length === 0) {
        alert('Please select at least one delivery method before proceeding.');
        return;
      }
      setCurrentStep(4);
    } else if (currentStep === 4) {
      // Navigate to next worksheet
      navigate('/worksheet-6');
    }
  };
  
  // Handle previous step
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      // Navigate to the previous worksheet
      navigate('/worksheet-4');
    }
  };
  
  // Generate report preview based on selections
  const generateReportPreview = () => {
    let reportContent = [];
    
    // Add executive summary if selected
    if (disseminationData.customizationOptions.executiveSummary) {
      reportContent.push({
        section: 'Executive Summary',
        content: executiveSummary
      });
    }
    
    // Add technical details if selected
    if (disseminationData.customizationOptions.technicalDetails) {
      reportContent.push({
        section: 'Technical Details',
        content: technicalDetails
      });
    }
    
    // Add mitigation steps if selected
    if (disseminationData.customizationOptions.mitigationSteps) {
      reportContent.push({
        section: 'Mitigation Steps',
        content: mitigationSteps
      });
    }
    
    return reportContent;
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={10}>
          <Card className="shadow">
            <Card.Header as="h4" className="bg-primary text-white">
              Worksheet 5: Dissemination - Enabling Rapid Response
            </Card.Header>
            <Card.Body>
              <div className="mb-4 p-3 bg-light border">
                <h5>Malware Sample: {malwareReport?.fileName || "Lumma.exe (Lumma Stealer)"}</h5>
                <p>In this phase, you'll learn how to deliver intelligence to the right people at the right time.</p>
                
                <Table bordered size="sm">
                  <tbody>
                    <tr>
                      <th width="20%">File Name:</th>
                      <td>{malwareReport?.fileName || "Lumma.exe"}</td>
                    </tr>
                    <tr>
                      <th>SHA256:</th>
                      <td><code>{malwareReport?.sha256 || "e2fe90ec9a2da8827e539bd056276cf319c5dc8d1999001b9c9caca81ee1d439"}</code></td>
                    </tr>
                    <tr>
                      <th>Classification:</th>
                      <td>{malwareReport?.classification || "Information Stealer"}</td>
                    </tr>
                    <tr>
                      <th>External Report:</th>
                      <td>
                        <a href="https://www.hybrid-analysis.com/sample/e2fe90ec9a2da8827e539bd056276cf319c5dc8d1999001b9c9caca81ee1d439/6828c2cdbce342c9060011a0" target="_blank" rel="noopener noreferrer">
                          View Hybrid Analysis Report
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
              
              {currentStep === 1 && (
                <>
                  <h5 className="mb-3">Step 1: Create Audience-Specific Intelligence Products</h5>
                  <p className="text-muted">Select the appropriate audiences for your intelligence and customize the report format.</p>
                  
                  <div className="mb-4">
                    <h6>Select Target Audiences</h6>
                    <p className="small text-muted">Choose the stakeholders who need to receive this intelligence.</p>
                    
                    <Row>
                      {audienceOptions.map(audience => (
                        <Col md={6} key={audience.id} className="mb-2">
                          <div className="d-flex border rounded p-2">
                            <div className="me-2">
                              <Form.Check
                                type="checkbox"
                                id={`audience-${audience.id}`}
                                checked={disseminationData.audienceSelection.includes(audience.id)}
                                onChange={() => handleAudienceSelection(audience.id)}
                              />
                            </div>
                            <div>
                              <div className="d-flex align-items-center">
                                <strong>{audience.name}</strong>
                                <Badge 
                                  bg={audience.priority === 'Critical' ? 'danger' : 
                                     audience.priority === 'High' ? 'warning' : 
                                     audience.priority === 'Medium' ? 'info' : 'secondary'}
                                  className="ms-2"
                                >
                                  {audience.priority}
                                </Badge>
                              </div>
                              <small className="text-muted">{audience.description}</small>
                            </div>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                  
                  <div className="mb-4">
                    <h6>Select Report Format</h6>
                    <p className="small text-muted">Choose the most appropriate format based on the audience and urgency.</p>
                    
                    <Form.Group>
                      <Form.Select 
                        value={disseminationData.reportFormat}
                        onChange={handleReportFormatChange}
                      >
                        <option value="">Select a report format...</option>
                        {reportFormatOptions.map(format => (
                          <option key={format.id} value={format.id}>
                            {format.name} - {format.description}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </div>
                </>
              )}
              
              {currentStep === 2 && (
                <>
                  <h5 className="mb-3">Step 2: Implement Urgency and Classification Systems</h5>
                  <p className="text-muted">Define the urgency and confidentiality levels for this intelligence.</p>
                  
                  <Row className="mb-4">
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Urgency Level</Form.Label>
                        <div className="d-flex align-items-center">
                          <Form.Range
                            min={1}
                            max={3}
                            value={disseminationData.urgencyLevel}
                            onChange={handleUrgencyChange}
                            className="me-3 flex-grow-1"
                          />
                          <Badge 
                            bg={disseminationData.urgencyLevel === 1 ? "success" : 
                               disseminationData.urgencyLevel === 2 ? "warning" : "danger"}
                            className="px-3 py-2"
                          >
                            {disseminationData.urgencyLevel === 1 ? "Low" : 
                             disseminationData.urgencyLevel === 2 ? "Medium" : "High"}
                          </Badge>
                        </div>
                        <div className="d-flex justify-content-between mt-1">
                          <small>Low</small>
                          <small>Medium</small>
                          <small>High</small>
                        </div>
                      </Form.Group>
                    </Col>
                    
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Confidentiality Level</Form.Label>
                        <div className="d-flex align-items-center">
                          <Form.Range
                            min={1}
                            max={3}
                            value={disseminationData.confidentialityLevel}
                            onChange={handleConfidentialityChange}
                            className="me-3 flex-grow-1"
                          />
                          <Badge 
                            bg={disseminationData.confidentialityLevel === 1 ? "success" : 
                               disseminationData.confidentialityLevel === 2 ? "warning" : "danger"}
                            className="px-3 py-2"
                          >
                            {disseminationData.confidentialityLevel === 1 ? "Public" : 
                             disseminationData.confidentialityLevel === 2 ? "Internal" : "Restricted"}
                          </Badge>
                        </div>
                        <div className="d-flex justify-content-between mt-1">
                          <small>Public</small>
                          <small>Internal</small>
                          <small>Restricted</small>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <div className="mb-4">
                    <h6>Customize Report Content</h6>
                    <p className="small text-muted">Select which sections to include based on the audience needs.</p>
                    
                    <Row>
                      <Col md={4}>
                        <Form.Check 
                          type="switch"
                          id="include-executive-summary"
                          label="Executive Summary"
                          checked={disseminationData.customizationOptions.executiveSummary}
                          onChange={() => handleContentToggle('executiveSummary')}
                        />
                      </Col>
                      <Col md={4}>
                        <Form.Check 
                          type="switch"
                          id="include-technical-details"
                          label="Technical Details"
                          checked={disseminationData.customizationOptions.technicalDetails}
                          onChange={() => handleContentToggle('technicalDetails')}
                        />
                      </Col>
                      <Col md={4}>
                        <Form.Check 
                          type="switch"
                          id="include-iocs"
                          label="Indicators of Compromise"
                          checked={disseminationData.customizationOptions.iocs}
                          onChange={() => handleContentToggle('iocs')}
                        />
                      </Col>
                      <Col md={4}>
                        <Form.Check 
                          type="switch"
                          id="include-mitigation"
                          label="Mitigation Steps"
                          checked={disseminationData.customizationOptions.mitigationSteps}
                          onChange={() => handleContentToggle('mitigationSteps')}
                        />
                      </Col>
                      <Col md={4}>
                        <Form.Check 
                          type="switch"
                          id="include-attribution"
                          label="Attribution Information"
                          checked={disseminationData.customizationOptions.attributionInfo}
                          onChange={() => handleContentToggle('attributionInfo')}
                        />
                      </Col>
                    </Row>
                  </div>
                  
                  <div className="mb-4">
                    <h6>Report Preview</h6>
                    <div className="border p-3 bg-white">
                      {generateReportPreview().map((section, index) => (
                        <div key={index} className="mb-3">
                          <h6 className="border-bottom pb-2">{section.section}</h6>
                          <pre className="small bg-light p-2" style={{ whiteSpace: 'pre-wrap' }}>
                            {section.content}
                          </pre>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              
              {currentStep === 3 && (
                <>
                  <h5 className="mb-3">Step 3: Design Intelligence Sharing Workflows</h5>
                  <p className="text-muted">Define how intelligence will be delivered to stakeholders.</p>
                  
                  <div className="mb-4">
                    <h6>Select Delivery Methods</h6>
                    <p className="small text-muted">Choose how this intelligence will be distributed.</p>
                    
                    <Row>
                      {deliveryMethodOptions.map(method => (
                        <Col md={6} key={method.id} className="mb-2">
                          <div className="d-flex border rounded p-2">
                            <div className="me-2">
                              <Form.Check
                                type="checkbox"
                                id={`method-${method.id}`}
                                checked={disseminationData.deliveryMethods.includes(method.id)}
                                onChange={() => handleDeliveryMethodSelection(method.id)}
                              />
                            </div>
                            <div>
                              <div className="d-flex align-items-center">
                                <strong>{method.name}</strong>
                                <Badge 
                                  bg={method.speed === 'Immediate' ? 'success' : 
                                     method.speed === 'Fast' ? 'info' : 
                                     method.speed === 'Medium' ? 'warning' : 'secondary'}
                                  className="ms-2"
                                >
                                  {method.speed}
                                </Badge>
                              </div>
                              <small className="text-muted">{method.description}</small>
                            </div>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                  
                  <div className="mb-4">
                    <h6>Select Automation Rules</h6>
                    <p className="small text-muted">Choose automation rules to speed up intelligence delivery.</p>
                    
                    <Row>
                      {automationRuleOptions.map(rule => (
                        <Col md={6} key={rule.id} className="mb-2">
                          <div className="d-flex border rounded p-2">
                            <div className="me-2">
                              <Form.Check
                                type="checkbox"
                                id={`rule-${rule.id}`}
                                checked={disseminationData.automationRules.includes(rule.id)}
                                onChange={() => handleAutomationRuleSelection(rule.id)}
                              />
                            </div>
                            <div>
                              <strong>{rule.name}</strong>
                              <div><small className="text-muted">{rule.description}</small></div>
                            </div>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                </>
              )}
              
              {currentStep === 4 && (
                <>
                  <h5 className="mb-3">Step 4: Establish Feedback Mechanisms</h5>
                  <p className="text-muted">Define how you'll measure the effectiveness of your intelligence.</p>
                  
                  <div className="mb-4">
                    <h6>Select Feedback Mechanisms</h6>
                    <p className="small text-muted">Choose methods to collect feedback on intelligence quality and usefulness.</p>
                    
                    <Row>
                      {feedbackMechanismOptions.map(feedback => (
                        <Col md={6} key={feedback.id} className="mb-2">
                          <div className="d-flex border rounded p-2">
                            <div className="me-2">
                              <Form.Check
                                type="checkbox"
                                id={`feedback-${feedback.id}`}
                                checked={disseminationData.feedbackMechanisms.includes(feedback.id)}
                                onChange={() => handleFeedbackSelection(feedback.id)}
                              />
                            </div>
                            <div>
                              <strong>{feedback.name}</strong>
                              <div><small className="text-muted">{feedback.description}</small></div>
                            </div>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                  
                  <div className="alert alert-success">
                    <h6 className="alert-heading">Dissemination Plan Complete</h6>
                    <p>
                      You've created a comprehensive plan for disseminating threat intelligence about the malware sample. 
                      This plan ensures that the right information reaches the right people at the right time, enabling 
                      rapid response to the threat.
                    </p>
                    <hr />
                    <p className="mb-0">
                      In the next worksheet, you'll learn how to measure the effectiveness of your intelligence and 
                      integrate it into your security operations.
                    </p>
                  </div>
                </>
              )}
              
              <div className="d-flex justify-content-between mt-4">
                {currentStep === 1 ? (
                  <Button 
                    variant="secondary" 
                    onClick={() => navigate('/worksheet-4')}
                  >
                    Previous Worksheet
                  </Button>
                ) : (
                  <Button variant="secondary" onClick={handlePrevStep}>
                    Previous Step
                  </Button>
                )}
                
                {currentStep === 4 ? (
                  <Button 
                    variant="primary" 
                    onClick={() => navigate('/worksheet-6')}
                  >
                    Next Worksheet
                  </Button>
                ) : (
                  <Button variant="primary" onClick={handleNextStep}>
                    Next Step
                  </Button>
                )}
              </div>
            </Card.Body>
            <Card.Footer>
              <div className="d-flex justify-content-between align-items-center">
                <div>Step {currentStep} of 4</div>
                <div className="d-flex align-items-center">
                  <span className="me-2">Worksheet Progress:</span>
                  <ProgressBar 
                    now={worksheetProgress.worksheet5} 
                    label={`${worksheetProgress.worksheet5}%`}
                    style={{ width: '150px', height: '20px' }}
                    variant={worksheetProgress.worksheet5 < 30 ? "danger" : 
                           worksheetProgress.worksheet5 < 70 ? "warning" : "success"}
                  />
                </div>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Worksheet5;
