import React from 'react';
import { Container, Card, Row, Col, Table, Badge, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useWorkshop } from '../context/WorkshopContext';

const Results = () => {
  const navigate = useNavigate();
  const { 
    userInfo,
    feedScores,
    topFeedJustification,
    actorProfile,
    responseOptions,
    iocManagement,
    worksheetProgress
  } = useWorkshop();

  // Feed data for reference
  const feedData = {
    feedA: {
      name: "DarkWeb Intel Feed",
      description: "Provides indicators from dark web forums and marketplaces focusing on stolen credentials and zero-day exploits."
    },
    feedB: {
      name: "Industry ISAC Feed",
      description: "Sector-specific intelligence sharing from peers in your industry with focus on current campaigns targeting your sector."
    },
    feedC: {
      name: "Vendor Threat Reports",
      description: "Commercial security vendor reports focusing on nation-state actors with comprehensive analysis but sometimes delayed disclosures."
    }
  };

  // TTP options for reference
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
    { id: "T1567", name: "Exfiltration Over Web Service", tactic: "Exfiltration" }
  ];

  // Calculate total scores for each feed
  const calculateTotalScore = (feed) => {
    const scores = feedScores[feed];
    return Object.values(scores).reduce((total, score) => total + score, 0);
  };

  // Get highest scoring feed
  const getHighestScoringFeed = () => {
    const totals = {
      feedA: calculateTotalScore('feedA'),
      feedB: calculateTotalScore('feedB'),
      feedC: calculateTotalScore('feedC')
    };
    
    return Object.entries(totals).reduce((a, b) => a[1] > b[1] ? a : b)[0];
  };

  // Calculate overall completion
  const calculateOverallCompletion = () => {
    return Math.floor(
      (worksheetProgress.worksheet1 + worksheetProgress.worksheet2 + worksheetProgress.worksheet3 + worksheetProgress.worksheet4) / 4
    );
  };

  // Handle reset and start over
  const handleStartOver = () => {
    // This would ideally reset all state
    navigate('/');
  };

  // Check if user has made any progress
  const hasProgress = worksheetProgress.worksheet1 > 0 || 
                     worksheetProgress.worksheet2 > 0 || 
                     worksheetProgress.worksheet3 > 0;

  if (!hasProgress) {
    return (
      <Container className="mt-5">
        <Card className="shadow text-center p-5">
          <Card.Title as="h4">No Workshop Data Available</Card.Title>
          <Card.Body>
            <p>You haven't completed any of the workshop exercises yet.</p>
            <Button variant="primary" onClick={() => navigate('/')}>Start Workshop</Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="justify-content-md-center mt-4 mb-5">
        <Col md={10}>
          <Card className="shadow mb-4">
            <Card.Header as="h4" className="bg-success text-white">
              Threat Intelligence Workshop Results
            </Card.Header>
            <Card.Body>
              <div className="mb-4">
                <h5>Workshop Completion</h5>
                <div className="d-flex align-items-center mb-3">
                  <div className="me-3" style={{ width: '150px' }}>Overall Completion:</div>
                  <div className="progress flex-grow-1" style={{ height: '25px' }}>
                    <div 
                      className="progress-bar bg-success" 
                      role="progressbar" 
                      style={{ width: `${calculateOverallCompletion()}%` }}
                      aria-valuenow={calculateOverallCompletion()}
                      aria-valuemin="0" 
                      aria-valuemax="100"
                    >
                      {calculateOverallCompletion()}%
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <div className="me-3" style={{ width: '150px' }}>Feed Prioritization:</div>
                  <div className="progress flex-grow-1" style={{ height: '20px' }}>
                    <div 
                      className="progress-bar" 
                      role="progressbar" 
                      style={{ width: `${worksheetProgress.worksheet1}%` }}
                      aria-valuenow={worksheetProgress.worksheet1}
                      aria-valuemin="0" 
                      aria-valuemax="100"
                    >
                      {worksheetProgress.worksheet1}%
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <div className="me-3" style={{ width: '150px' }}>Threat Actor Profiling:</div>
                  <div className="progress flex-grow-1" style={{ height: '20px' }}>
                    <div 
                      className="progress-bar" 
                      role="progressbar" 
                      style={{ width: `${worksheetProgress.worksheet2}%` }}
                      aria-valuenow={worksheetProgress.worksheet2}
                      aria-valuemin="0" 
                      aria-valuemax="100"
                    >
                      {worksheetProgress.worksheet2}%
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <div className="me-3" style={{ width: '150px' }}>Intel Operationalization:</div>
                  <div className="progress flex-grow-1" style={{ height: '20px' }}>
                    <div 
                      className="progress-bar" 
                      role="progressbar" 
                      style={{ width: `${worksheetProgress.worksheet3}%` }}
                      aria-valuenow={worksheetProgress.worksheet3}
                      aria-valuemin="0" 
                      aria-valuemax="100"
                    >
                      {worksheetProgress.worksheet3}%
                    </div>
                  </div>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <div className="me-3" style={{ width: '150px' }}>IOC Volume Management:</div>
                  <div className="progress flex-grow-1" style={{ height: '20px' }}>
                    <div 
                      className="progress-bar" 
                      role="progressbar" 
                      style={{ width: `${worksheetProgress.worksheet4}%` }}
                      aria-valuenow={worksheetProgress.worksheet4}
                      aria-valuemin="0" 
                      aria-valuemax="100"
                    >
                      {worksheetProgress.worksheet4}%
                    </div>
                  </div>
                </div>
              </div>

              {worksheetProgress.worksheet1 > 0 && (
                <Card className="mb-4">
                  <Card.Header as="h5" className="bg-light">
                    Exercise 1: Intelligence Feed Prioritization
                  </Card.Header>
                  <Card.Body>
                    <h6>Feed Assessment Scores (1-5)</h6>
                    <Table bordered striped size="sm" className="mb-4">
                      <thead>
                        <tr>
                          <th>Feed</th>
                          <th>Reliability</th>
                          <th>Relevance</th>
                          <th>Actionability</th>
                          <th>Timeliness</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(feedScores).map(([feedKey, scores]) => (
                          <tr key={feedKey}>
                            <td><strong>{feedData[feedKey].name}</strong></td>
                            <td>{scores.reliability || 0}</td>
                            <td>{scores.relevance || 0}</td>
                            <td>{scores.actionability || 0}</td>
                            <td>{scores.timeliness || 0}</td>
                            <td><strong>{calculateTotalScore(feedKey)}</strong></td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    
                    {topFeedJustification && (
                      <div className="mb-4">
                        <h6>Top Feed Justification</h6>
                        <div className="p-3 bg-light border">
                          <strong>Selected feed: {feedData[getHighestScoringFeed()].name}</strong>
                          <p className="mt-2">{topFeedJustification}</p>
                        </div>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              )}
              
              {worksheetProgress.worksheet2 > 0 && (
                <Card className="mb-4">
                  <Card.Header as="h5" className="bg-light">
                    Exercise 2: Threat Actor Profiling
                  </Card.Header>
                  <Card.Body>
                    <Table bordered size="sm">
                      <tbody>
                        <tr>
                          <th width="30%">Motivation:</th>
                          <td>{actorProfile.motivation || "Not specified"}</td>
                        </tr>
                        <tr>
                          <th>Capability:</th>
                          <td>{actorProfile.capability}/5</td>
                        </tr>
                        <tr>
                          <th>Primary TTPs:</th>
                          <td>
                            {actorProfile.ttps.length > 0 ? (
                              <div className="d-flex flex-wrap">
                                {actorProfile.ttps.map(ttpId => {
                                  const ttp = ttpOptions.find(t => t.id === ttpId);
                                  return ttp ? (
                                    <Badge 
                                      key={ttpId} 
                                      bg="info" 
                                      className="me-1 mb-1 p-1"
                                    >
                                      {ttp.id}: {ttp.name}
                                    </Badge>
                                  ) : null;
                                })}
                              </div>
                            ) : "None selected"}
                          </td>
                        </tr>
                        <tr>
                          <th>Target Industries:</th>
                          <td>
                            {actorProfile.targetIndustries.length > 0 ? (
                              <div className="d-flex flex-wrap">
                                {actorProfile.targetIndustries.map(industry => (
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
                          <td>{actorProfile.attributionConfidence}/5</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              )}
              
              {worksheetProgress.worksheet3 > 0 && (
                <Card className="mb-4">
                  <Card.Header as="h5" className="bg-light">
                    Exercise 3: Intel Operationalization
                  </Card.Header>
                  <Card.Body>
                    {responseOptions.detectionSystems.length > 0 && (
                      <div className="mb-3">
                        <h6>Selected Detection Systems</h6>
                        <div>
                          {responseOptions.detectionSystems.map(system => (
                            <Badge 
                              key={system} 
                              bg="primary" 
                              className="me-1 mb-1 p-2"
                            >
                              {system}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {responseOptions.detectionRule && (
                      <div className="mb-3">
                        <h6>Detection Rule</h6>
                        <pre className="p-2 bg-light border" style={{ whiteSpace: 'pre-wrap' }}>
                          {responseOptions.detectionRule}
                        </pre>
                      </div>
                    )}
                    
                    {Object.values(responseOptions.responseActions).some(val => val > 0) && (
                      <div className="mb-3">
                        <h6>Response Actions Prioritization</h6>
                        <Table bordered size="sm">
                          <thead>
                            <tr>
                              <th>Action</th>
                              <th>Priority (1-5)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(responseOptions.responseActions)
                              .filter(([_, value]) => value > 0)
                              .sort((a, b) => a[1] - b[1])
                              .map(([key, value]) => {
                                const actionName = {
                                  blockingIOCs: "Blocking known IOCs",
                                  threatHunting: "Threat hunting for additional compromise",
                                  patchingVulnerabilities: "Patching vulnerable systems",
                                  incidentResponse: "Preparing incident response playbook",
                                  stakeholderCommunication: "Stakeholder communication"
                                }[key];
                                
                                return (
                                  <tr key={key}>
                                    <td>{actionName}</td>
                                    <td>{value}</td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </Table>
                      </div>
                    )}
                    
                    {responseOptions.executiveSummary && (
                      <div className="mb-3">
                        <h6>Executive Summary</h6>
                        <div className="p-3 bg-light border">
                          <p style={{ whiteSpace: 'pre-line' }}>{responseOptions.executiveSummary}</p>
                        </div>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              )}
              
              {worksheetProgress.worksheet4 > 0 && (
                <Card className="mb-4">
                  <Card.Header as="h5" className="bg-light">
                    Exercise 4: IOC Volume Management
                  </Card.Header>
                  <Card.Body>
                    <Table bordered size="sm">
                      <tbody>
                        <tr>
                          <th width="30%">Prioritization Method:</th>
                          <td>{iocManagement.prioritizationMethod || "Not specified"}</td>
                        </tr>
                        <tr>
                          <th>Automation Level:</th>
                          <td>
                            {iocManagement.automationLevel}/5 - {{
                              1: "Minimal Automation",
                              2: "Partial Automation",
                              3: "Balanced Approach",
                              4: "Highly Automated",
                              5: "Fully Automated"
                            }[iocManagement.automationLevel] || "Not specified"}
                          </td>
                        </tr>
                        <tr>
                          <th>Enrichment Sources:</th>
                          <td>
                            {iocManagement.enrichmentSources.length > 0 ? (
                              <div className="d-flex flex-wrap">
                                {iocManagement.enrichmentSources.map(source => (
                                  <Badge 
                                    key={source} 
                                    bg="info" 
                                    className="me-1 mb-1 p-1"
                                  >
                                    {source}
                                  </Badge>
                                ))}
                              </div>
                            ) : "None selected"}
                          </td>
                        </tr>
                        <tr>
                          <th>Deprecation Strategy:</th>
                          <td>{iocManagement.deprecationStrategy || "Not specified"}</td>
                        </tr>
                        <tr>
                          <th>False Positive Handling:</th>
                          <td>{iocManagement.falsePositiveHandling || "Not specified"}</td>
                        </tr>
                        <tr>
                          <th>Scalability Approach:</th>
                          <td>{iocManagement.scalabilityApproach || "Not specified"}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              )}
              
              <div className="d-flex justify-content-between mt-4">
                <Button variant="secondary" onClick={() => navigate(-1)}>
                  Back
                </Button>
                <Button variant="primary" onClick={() => window.print()}>
                  Print Results
                </Button>
                <Button variant="outline-secondary" onClick={handleStartOver}>
                  Start Over
                </Button>
              </div>
            </Card.Body>
            <Card.Footer className="text-center text-muted">
              <p className="mb-0">
                Thank you for participating in the Threat Intelligence Workshop!
                {userInfo.name && <span> - {userInfo.name}</span>}
                {userInfo.organization && <span> ({userInfo.organization})</span>}
              </p>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Results;
