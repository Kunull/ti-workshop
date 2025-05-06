import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, ProgressBar, Badge, Table } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useWorkshop } from '../context/WorkshopContext';

const Worksheet4 = () => {
  const navigate = useNavigate();
  const { 
    iocManagement, 
    setIocManagement,
    worksheetProgress,
    setWorksheetProgress
  } = useWorkshop();

  const [currentStep, setCurrentStep] = useState(1);

  // IOC volume management data and options
  const scenarioData = {
    title: "Managing High-Volume IOC Feeds",
    description: `
      Your organization receives more than 100,000 new IOCs per day from various threat intelligence sources.
      These include IP addresses, domains, URLs, file hashes, and various other indicator types.
      
      Key challenges:
      
      1. The sheer volume is overwhelming your security tools and analysts
      2. Many IOCs are low-quality or irrelevant to your organization
      3. Existing IOCs aren't being deprecated properly, leading to performance issues
      4. False positives are causing alert fatigue among your security team
      5. You need to determine how to effectively process, prioritize, and operationalize these indicators
    `,
    statistics: [
      { category: "IP Addresses", count: 45000, percentage: 45 },
      { category: "Domains", count: 25000, percentage: 25 },
      { category: "File Hashes", count: 20000, percentage: 20 },
      { category: "URLs", count: 8000, percentage: 8 },
      { category: "Other", count: 2000, percentage: 2 }
    ]
  };

  // Options for prioritization methods
  const prioritizationOptions = [
    "Risk-based scoring (threat, exposure, asset value)",
    "Relevance to your industry/sector",
    "Source reliability and reputation",
    "Age of indicators (freshness)",
    "Contextual factors (campaigns targeting your region/industry)",
    "Hybrid approach combining multiple factors"
  ];

  // Options for enrichment sources
  const enrichmentOptions = [
    "WHOIS data",
    "Passive DNS",
    "Reputation services",
    "Sandboxing results",
    "Community/peer intelligence sharing",
    "Open-source intelligence (OSINT)",
    "Internal historical alerts and incidents",
    "Vendor threat reports"
  ];

  // Options for IOC deprecation strategies
  const deprecationOptions = [
    "Time-based expiration (fixed TTL for all indicators)",
    "Adaptive TTL based on indicator type and context",
    "Continuous relevance scoring with threshold-based removal",
    "Regular review cycles with manual approval",
    "Risk-based deprecation (lower risk indicators expire sooner)"
  ];

  // Options for false positive handling
  const falsePositiveOptions = [
    "Pre-filtering based on environmental context",
    "Approval workflows for high-impact blocking",
    "Graduated response (monitor first, then block)",
    "Machine learning for pattern recognition",
    "Peer validation through intelligence sharing communities"
  ];

  // Options for scalability approaches
  const scalabilityOptions = [
    "Distributed processing architecture",
    "Cloud-based elastic processing",
    "Strategic sampling and analysis",
    "Tiered storage with hot/warm/cold zones",
    "Data lake approach with optimized query capabilities",
    "Automated lifecycle management"
  ];

  // Calculate progress
  useEffect(() => {
    let progress = 0;
    
    // Prioritization method selected
    if (iocManagement.prioritizationMethod) progress += 20;
    
    // Automation level set
    if (iocManagement.automationLevel > 1) progress += 20;
    
    // Enrichment sources selected
    if (iocManagement.enrichmentSources.length > 0) progress += 20;
    
    // Deprecation strategy selected
    if (iocManagement.deprecationStrategy) progress += 20;
    
    // False positive handling selected
    if (iocManagement.falsePositiveHandling) progress += 10;
    
    // Scalability approach selected
    if (iocManagement.scalabilityApproach) progress += 10;
    
    setWorksheetProgress({
      ...worksheetProgress,
      worksheet4: progress
    });
  }, [iocManagement, setWorksheetProgress, worksheetProgress]);

  // Handle selection changes
  const handleSelectionChange = (field, value) => {
    setIocManagement({
      ...iocManagement,
      [field]: value
    });
  };

  // Handle enrichment sources selection
  const handleEnrichmentSelection = (source) => {
    const updatedSources = [...iocManagement.enrichmentSources];
    
    if (updatedSources.includes(source)) {
      // Remove if already selected
      const index = updatedSources.indexOf(source);
      updatedSources.splice(index, 1);
    } else {
      // Add if not already selected
      updatedSources.push(source);
    }
    
    setIocManagement({
      ...iocManagement,
      enrichmentSources: updatedSources
    });
  };

  // Handle navigation
  const handleNextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/worksheet-5');
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      // Make sure we navigate to worksheet 3
      navigate('/worksheet-3');
    }
  };
  
  // Direct navigation for fallback
  const goToWorksheet3 = () => {
    navigate('/worksheet-3');
  };

  return (
    <Container>
      <Row className="justify-content-md-center mt-4 mb-5">
        <Col md={10}>
          <Card className="shadow">
            <Card.Header as="h4" className="bg-primary text-white">
              Worksheet 4: IOC Volume Management
            </Card.Header>
            <Card.Body>
              <div className="mb-4 p-3 bg-light border">
                <h5>{scenarioData.title}</h5>
                <p style={{ whiteSpace: 'pre-line' }}>{scenarioData.description}</p>
                
                <h6 className="mt-3 mb-2">Daily IOC Distribution:</h6>
                <Row>
                  <Col lg={7}>
                    <Table bordered size="sm" className="mb-3">
                      <thead>
                        <tr>
                          <th>IOC Type</th>
                          <th>Daily Count</th>
                          <th>Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {scenarioData.statistics.map((stat, index) => (
                          <tr key={index}>
                            <td>{stat.category}</td>
                            <td>{stat.count.toLocaleString()}</td>
                            <td>{stat.percentage}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Col>
                  <Col lg={5}>
                    <div className="p-3 border h-100 d-flex flex-column justify-content-center">
                      {scenarioData.statistics.map((stat, index) => (
                        <div key={index} className="mb-2">
                          <div className="d-flex justify-content-between mb-1">
                            <small>{stat.category}</small>
                            <small>{stat.percentage}%</small>
                          </div>
                          <ProgressBar 
                            now={stat.percentage} 
                            style={{ height: '8px' }}
                            variant={
                              index === 0 ? "primary" : 
                              index === 1 ? "info" : 
                              index === 2 ? "success" : 
                              index === 3 ? "warning" : "secondary"
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </Col>
                </Row>
              </div>
              
              {currentStep === 1 && (
                <>
                  <h5>1. IOC Prioritization Strategy</h5>
                  <p>Select the approach you would use to prioritize the most important indicators:</p>
                  
                  <Form.Group className="mb-4">
                    {prioritizationOptions.map((option) => (
                      <Form.Check
                        key={option}
                        type="radio"
                        id={`prioritization-${option}`}
                        label={option}
                        name="prioritizationMethod"
                        checked={iocManagement.prioritizationMethod === option}
                        onChange={() => handleSelectionChange('prioritizationMethod', option)}
                        className="mb-2"
                      />
                    ))}
                  </Form.Group>
                  
                  <h5>2. Automation Level</h5>
                  <p>What level of automation would you implement for processing this volume of indicators?</p>
                  
                  <Form.Group className="mb-4">
                    <div className="px-2">
                      <Form.Range
                        min={1}
                        max={5}
                        value={iocManagement.automationLevel}
                        onChange={(e) => handleSelectionChange('automationLevel', parseInt(e.target.value))}
                      />
                      
                      <div className="d-flex justify-content-between mt-2">
                        <small>1: Mostly manual review</small>
                        <small>3: Balanced approach</small>
                        <small>5: Fully automated</small>
                      </div>
                      
                      <div className="text-center mt-3">
                        <Badge 
                          bg={iocManagement.automationLevel < 3 ? "danger" : 
                             iocManagement.automationLevel === 3 ? "warning" : "success"}
                          className="px-3 py-2"
                        >
                          Level {iocManagement.automationLevel}: {
                            iocManagement.automationLevel === 1 ? "Minimal Automation" :
                            iocManagement.automationLevel === 2 ? "Partial Automation" :
                            iocManagement.automationLevel === 3 ? "Balanced Approach" :
                            iocManagement.automationLevel === 4 ? "Highly Automated" :
                            "Fully Automated"
                          }
                        </Badge>
                      </div>
                    </div>
                  </Form.Group>
                  
                  <h5>3. IOC Enrichment</h5>
                  <p>Which data sources would you use to enrich incoming indicators? (Select all that apply)</p>
                  
                  <Form.Group className="mb-4">
                    <Row>
                      {enrichmentOptions.map((option) => (
                        <Col md={6} key={option}>
                          <Form.Check
                            type="checkbox"
                            id={`enrichment-${option}`}
                            label={option}
                            checked={iocManagement.enrichmentSources.includes(option)}
                            onChange={() => handleEnrichmentSelection(option)}
                            className="mb-2"
                          />
                        </Col>
                      ))}
                    </Row>
                  </Form.Group>
                </>
              )}
              
              {currentStep === 2 && (
                <>
                  <h5>4. IOC Deprecation Strategy</h5>
                  <p>Select the best approach for expiring and removing outdated indicators:</p>
                  
                  <Form.Group className="mb-4">
                    {deprecationOptions.map((option) => (
                      <Form.Check
                        key={option}
                        type="radio"
                        id={`deprecation-${option}`}
                        label={option}
                        name="deprecationStrategy"
                        checked={iocManagement.deprecationStrategy === option}
                        onChange={() => handleSelectionChange('deprecationStrategy', option)}
                        className="mb-2"
                      />
                    ))}
                  </Form.Group>
                  
                  <h5>5. False Positive Mitigation</h5>
                  <p>How would you handle the inevitable false positives with this volume of indicators?</p>
                  
                  <Form.Group className="mb-4">
                    {falsePositiveOptions.map((option) => (
                      <Form.Check
                        key={option}
                        type="radio"
                        id={`falsepositive-${option}`}
                        label={option}
                        name="falsePositiveHandling"
                        checked={iocManagement.falsePositiveHandling === option}
                        onChange={() => handleSelectionChange('falsePositiveHandling', option)}
                        className="mb-2"
                      />
                    ))}
                  </Form.Group>
                  
                  <h5>6. Scalability Approach</h5>
                  <p>How would you ensure your infrastructure can scale to handle this volume of indicators?</p>
                  
                  <Form.Group className="mb-4">
                    {scalabilityOptions.map((option) => (
                      <Form.Check
                        key={option}
                        type="radio"
                        id={`scalability-${option}`}
                        label={option}
                        name="scalabilityApproach"
                        checked={iocManagement.scalabilityApproach === option}
                        onChange={() => handleSelectionChange('scalabilityApproach', option)}
                        className="mb-2"
                      />
                    ))}
                  </Form.Group>
                  
                  <div className="mt-4 p-3 bg-light">
                    <h5>Your IOC Management Strategy Summary</h5>
                    <Table bordered size="sm">
                      <tbody>
                        <tr>
                          <th width="30%">Prioritization Method:</th>
                          <td>{iocManagement.prioritizationMethod || "Not specified"}</td>
                        </tr>
                        <tr>
                          <th>Automation Level:</th>
                          <td>
                            {iocManagement.automationLevel}/5 - {
                              iocManagement.automationLevel === 1 ? "Minimal Automation" :
                              iocManagement.automationLevel === 2 ? "Partial Automation" :
                              iocManagement.automationLevel === 3 ? "Balanced Approach" :
                              iocManagement.automationLevel === 4 ? "Highly Automated" :
                              "Fully Automated"
                            }
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
                  </div>
                </>
              )}
              
              <div className="d-flex justify-content-between mt-4">
                {currentStep === 1 ? (
                  <Button 
                    variant="secondary" 
                    onClick={() => window.location.href = '/worksheet-3'}
                  >
                    Previous Exercise
                  </Button>
                ) : (
                  <Button variant="secondary" onClick={handlePrevStep}>
                    Previous Step
                  </Button>
                )}
                
                {currentStep === 2 ? (
                  <Button 
                    variant="primary" 
                    onClick={() => window.location.href = '/worksheet-5'}
                  >
                    Next Exercise
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
                <div>Step {currentStep} of 2</div>
                <div>Worksheet Progress: {worksheetProgress.worksheet4}%</div>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Worksheet4;
