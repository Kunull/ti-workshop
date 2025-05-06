import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Table } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useWorkshop } from '../context/WorkshopContext';

const Worksheet1 = () => {
  const navigate = useNavigate();
  const { 
    threatLandscape,
    setThreatLandscape,
    worksheetProgress,
    setWorksheetProgress
  } = useWorkshop();
  
  // Initialize local state to replace old context variables
  const [feedScores, setFeedScores] = useState({
    feedA: { reliability: 0, relevance: 0, actionability: 0, timeliness: 0 },
    feedB: { reliability: 0, relevance: 0, actionability: 0, timeliness: 0 },
    feedC: { reliability: 0, relevance: 0, actionability: 0, timeliness: 0 },
  });
  const [priorityMatrix, setPriorityMatrix] = useState({
    highRelevanceHighReliability: [],
    highRelevanceLowReliability: [],
    lowRelevanceHighReliability: [],
    lowRelevanceLowReliability: []
  });
  const [topFeedJustification, setTopFeedJustification] = useState('');

  // Local state for drag and drop functionality
  const [draggingFeed, setDraggingFeed] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Feed data
  const feedData = {
    feedA: {
      name: "DarkWeb Intel Feed",
      description: "Provides indicators from dark web forums and marketplaces focusing on stolen credentials and zero-day exploits.",
      frequency: "Daily updates",
      format: "STIX 2.1"
    },
    feedB: {
      name: "Industry ISAC Feed",
      description: "Sector-specific intelligence sharing from peers in your industry with focus on current campaigns targeting your sector.",
      frequency: "Weekly digests with real-time critical alerts",
      format: "TAXII 2.1"
    },
    feedC: {
      name: "Vendor Threat Reports",
      description: "Commercial security vendor reports focusing on nation-state actors with comprehensive analysis but sometimes delayed disclosures.",
      frequency: "Monthly detailed reports",
      format: "PDF Reports + CSV indicator lists"
    }
  };

  // Calculate progress
  useEffect(() => {
    let progress = 0;
    
    // Check feed scoring completion
    const scoresDone = Object.values(feedScores).every(feed => 
      Object.values(feed).every(score => score > 0)
    );
    
    if (scoresDone) progress += 33;
    
    // Check matrix completion
    const matrixDone = Object.values(priorityMatrix).some(quadrant => quadrant.length > 0);
    if (matrixDone) progress += 33;
    
    // Check justification completion
    if (topFeedJustification.length > 10) progress += 34;
    
    // Save feed scoring data to threatLandscape for new context structure
    // This bridges old worksheet with new context structure
    if (progress > 0) {
      setThreatLandscape({
        ...threatLandscape,
        aiSummary: 'AI analysis suggests monitoring emerging threats in the financial sector.',
        userAssessment: topFeedJustification,
        priorityThreats: getHighestScoringFeed() ? [getHighestScoringFeed()] : []
      });
    }
    
    setWorksheetProgress({
      ...worksheetProgress,
      worksheet1: progress
    });
  }, [feedScores, priorityMatrix, topFeedJustification, threatLandscape, setThreatLandscape, worksheetProgress, setWorksheetProgress]);

  // Handle score changes
  const handleScoreChange = (feed, criterion, value) => {
    setFeedScores({
      ...feedScores,
      [feed]: {
        ...feedScores[feed],
        [criterion]: parseInt(value)
      }
    });
  };

  // Handle drag start
  const handleDragStart = (feed) => {
    setDraggingFeed(feed);
  };

  // Handle drop in quadrant
  const handleDrop = (quadrant) => {
    if (!draggingFeed) return;
    
    // Remove feed from any existing quadrant
    const updatedMatrix = {
      highRelevanceHighReliability: priorityMatrix.highRelevanceHighReliability.filter(f => f !== draggingFeed),
      highRelevanceLowReliability: priorityMatrix.highRelevanceLowReliability.filter(f => f !== draggingFeed),
      lowRelevanceHighReliability: priorityMatrix.lowRelevanceHighReliability.filter(f => f !== draggingFeed),
      lowRelevanceLowReliability: priorityMatrix.lowRelevanceLowReliability.filter(f => f !== draggingFeed)
    };
    
    // Add to new quadrant
    updatedMatrix[quadrant] = [...updatedMatrix[quadrant], draggingFeed];
    
    setPriorityMatrix(updatedMatrix);
    setDraggingFeed(null);
  };

  // Handle justification change
  const handleJustificationChange = (e) => {
    setTopFeedJustification(e.target.value);
  };

  // Handle next step
  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save final data to new context structure before navigating
      setThreatLandscape({
        ...threatLandscape,
        aiSummary: 'AI analysis suggests monitoring emerging threats in the financial sector.',
        userAssessment: topFeedJustification,
        priorityThreats: getHighestScoringFeed() ? [getHighestScoringFeed()] : [],
        emergingThreats: ['APT-X', 'Ransomware-Y', 'Malware-Z']
      });
      navigate('/worksheet-2');
    }
  };

  // Handle previous step
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/');
    }
  };

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

  return (
    <Container>
      <Row className="justify-content-md-center mt-4 mb-5">
        <Col md={10}>
          <Card className="shadow">
            <Card.Header as="h4" className="bg-primary text-white">
              Worksheet 1: Intelligence Feed Prioritization
            </Card.Header>
            <Card.Body>
              {currentStep === 1 && (
                <>
                  <h5>Part 1: Feed Assessment</h5>
                  <p>Score each intelligence feed on a scale of 1-5 for the following attributes:</p>
                  
                  <Table bordered hover responsive>
                    <thead>
                      <tr>
                        <th>Feed</th>
                        <th>Description</th>
                        <th>Reliability (1-5)</th>
                        <th>Relevance (1-5)</th>
                        <th>Actionability (1-5)</th>
                        <th>Timeliness (1-5)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(feedData).map(([feedKey, feed]) => (
                        <tr key={feedKey}>
                          <td><strong>{feed.name}</strong><br/><small>{feed.frequency}</small></td>
                          <td>{feed.description}</td>
                          <td>
                            <Form.Select 
                              value={feedScores[feedKey].reliability} 
                              onChange={(e) => handleScoreChange(feedKey, 'reliability', e.target.value)}
                              required
                            >
                              <option value="0">Select</option>
                              {[1, 2, 3, 4, 5].map(num => (
                                <option key={num} value={num}>{num}</option>
                              ))}
                            </Form.Select>
                          </td>
                          <td>
                            <Form.Select 
                              value={feedScores[feedKey].relevance} 
                              onChange={(e) => handleScoreChange(feedKey, 'relevance', e.target.value)}
                              required
                            >
                              <option value="0">Select</option>
                              {[1, 2, 3, 4, 5].map(num => (
                                <option key={num} value={num}>{num}</option>
                              ))}
                            </Form.Select>
                          </td>
                          <td>
                            <Form.Select 
                              value={feedScores[feedKey].actionability} 
                              onChange={(e) => handleScoreChange(feedKey, 'actionability', e.target.value)}
                              required
                            >
                              <option value="0">Select</option>
                              {[1, 2, 3, 4, 5].map(num => (
                                <option key={num} value={num}>{num}</option>
                              ))}
                            </Form.Select>
                          </td>
                          <td>
                            <Form.Select 
                              value={feedScores[feedKey].timeliness} 
                              onChange={(e) => handleScoreChange(feedKey, 'timeliness', e.target.value)}
                              required
                            >
                              <option value="0">Select</option>
                              {[1, 2, 3, 4, 5].map(num => (
                                <option key={num} value={num}>{num}</option>
                              ))}
                            </Form.Select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </>
              )}
              
              {currentStep === 2 && (
                <div>
                  <h5>Part 2: Prioritization Matrix</h5>
                  <p>Drag and drop each feed into the appropriate quadrant of the matrix based on its reliability and relevance.</p>
                  
                  <div className="mb-4">
                    <div className="d-flex justify-content-center mb-3">
                      <div className="me-4 p-2 border" style={{ cursor: 'move' }}>
                        {Object.entries(feedData).map(([feedKey, feed]) => (
                          <div 
                            key={feedKey}
                            className="p-2 my-1 bg-light"
                            draggable
                            onDragStart={() => handleDragStart(feedKey)}
                          >
                            {feed.name}
                          </div>
                        ))}
                      </div>
                      
                      <div style={{ width: '500px', height: '300px' }}>
                        <div className="d-flex h-100">
                          <div className="d-flex flex-column w-50">
                            <div 
                              className="border border-success h-50 p-2"
                              style={{ backgroundColor: '#e8f5e9' }}
                              onDragOver={(e) => e.preventDefault()}
                              onDrop={() => handleDrop('highRelevanceHighReliability')}
                            >
                              <div className="text-center mb-2"><strong>High Relevance<br/>High Reliability</strong></div>
                              {priorityMatrix.highRelevanceHighReliability.map(feedKey => (
                                <div key={feedKey} className="p-1 my-1 bg-white border">
                                  {feedData[feedKey].name}
                                </div>
                              ))}
                            </div>
                            <div 
                              className="border h-50 p-2"
                              style={{ backgroundColor: '#fff3e0' }}
                              onDragOver={(e) => e.preventDefault()}
                              onDrop={() => handleDrop('lowRelevanceHighReliability')}
                            >
                              <div className="text-center mb-2"><strong>Low Relevance<br/>High Reliability</strong></div>
                              {priorityMatrix.lowRelevanceHighReliability.map(feedKey => (
                                <div key={feedKey} className="p-1 my-1 bg-white border">
                                  {feedData[feedKey].name}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="d-flex flex-column w-50">
                            <div 
                              className="border h-50 p-2"
                              style={{ backgroundColor: '#e3f2fd' }}
                              onDragOver={(e) => e.preventDefault()}
                              onDrop={() => handleDrop('highRelevanceLowReliability')}
                            >
                              <div className="text-center mb-2"><strong>High Relevance<br/>Low Reliability</strong></div>
                              {priorityMatrix.highRelevanceLowReliability.map(feedKey => (
                                <div key={feedKey} className="p-1 my-1 bg-white border">
                                  {feedData[feedKey].name}
                                </div>
                              ))}
                            </div>
                            <div 
                              className="border h-50 p-2"
                              style={{ backgroundColor: '#ffebee' }}
                              onDragOver={(e) => e.preventDefault()}
                              onDrop={() => handleDrop('lowRelevanceLowReliability')}
                            >
                              <div className="text-center mb-2"><strong>Low Relevance<br/>Low Reliability</strong></div>
                              {priorityMatrix.lowRelevanceLowReliability.map(feedKey => (
                                <div key={feedKey} className="p-1 my-1 bg-white border">
                                  {feedData[feedKey].name}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {currentStep === 3 && (
                <div>
                  <h5>Part 3: Justification</h5>
                  <p>
                    Based on your assessment, the highest scoring feed is:&nbsp;
                    <strong>{feedData[getHighestScoringFeed()].name}</strong>
                  </p>
                  <p>Provide justification for why this feed should be prioritized:</p>
                  
                  <Form.Group className="mb-3">
                    <Form.Control
                      as="textarea"
                      rows={4}
                      value={topFeedJustification}
                      onChange={handleJustificationChange}
                      placeholder="Explain why this feed deserves priority..."
                    />
                  </Form.Group>
                </div>
              )}
              
              <div className="d-flex justify-content-between mt-4">
                {currentStep === 1 ? (
                  <Button 
                    variant="secondary" 
                    onClick={() => window.location.href = '/'}
                  >
                    Back to Home
                  </Button>
                ) : (
                  <Button variant="secondary" onClick={handlePrevStep}>Previous Step</Button>
                )}
                
                {currentStep === 3 ? (
                  <Button 
                    variant="primary" 
                    onClick={() => window.location.href = '/worksheet-2'}
                    disabled={!topFeedJustification}
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
                <div>Step {currentStep} of 3</div>
                <div>Worksheet Progress: {worksheetProgress.worksheet1}%</div>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Worksheet1;
