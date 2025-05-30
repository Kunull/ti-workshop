import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Spinner, Alert, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useWorkshop } from '../context/WorkshopContext';
import MalwareAnalysisHeader from '../components/MalwareAnalysisHeader';

const Worksheet1 = () => {

  const { 
    threatLandscape,
    setThreatLandscape
  } = useWorkshop();
  
  // Initialize state for analysis fields
  const [ttpAnalysis, setTtpAnalysis] = useState('');
  const [iocAnalysis, setIocAnalysis] = useState('');
  const [threatActorAnalysis, setThreatActorAnalysis] = useState('');
  
  // State for API response handling
  const [threatActorApiResponse, setThreatActorApiResponse] = useState(null);
  const [isLoadingThreatActors, setIsLoadingThreatActors] = useState(false);
  const [threatActorError, setThreatActorError] = useState(null);
  
  // State for IOCs API response handling
  const [iocApiResponse, setIocApiResponse] = useState(null);
  const [isLoadingIocs, setIsLoadingIocs] = useState(false);
  const [iocError, setIocError] = useState(null);
  
  // State for TTPs API response handling
  const [ttpApiResponse, setTtpApiResponse] = useState(null);
  const [isLoadingTtps, setIsLoadingTtps] = useState(false);
  const [ttpError, setTtpError] = useState(null);
  

  // Helper function to create a delay
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Function to fetch extracted TTPs data from API
  const fetchExtractedTtps = async () => {
    setIsLoadingTtps(true);
    setTtpError(null);
    
    try {
      const response = await fetch('https://cwsotaf35h.execute-api.us-east-2.amazonaws.com/v1/worksheet1/extract-ttps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ttpAnalysis
        })
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      console.log('TTP API response:', data);
      
      // Parse the stringified JSON in the body property if it exists
      if (data && data.body && typeof data.body === 'string') {
        try {
          const parsedBody = JSON.parse(data.body);
          setTtpApiResponse(parsedBody);
        } catch (parseError) {
          console.error('Error parsing body:', parseError);
          setTtpApiResponse(data);
        }
      } else {
        // Add a delay of 10-20 seconds before setting the response
        const delayTime = Math.floor(Math.random() * 10000) + 10000; // Random delay between 10-20 seconds
        await delay(delayTime);
        setTtpApiResponse(data);
      }
    } catch (error) {
      console.error('Error in fetchExtractedTtps:', error);
      setTtpError(
        'There was an error connecting to the API. Please try again later or contact support if the issue persists.'
      );
    } finally {
      setIsLoadingTtps(false);
    }
  };
  
  // Function to fetch extracted IOCs data from API
  const fetchExtractedIocs = async () => {
    setIsLoadingIocs(true);
    setIocError(null);
    
    try {
      const response = await fetch('https://cwsotaf35h.execute-api.us-east-2.amazonaws.com/v1/worksheet1/extracted-iocs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          iocAnalysis
        })
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      console.log('IOC API response:', data);
      
      // Parse the stringified JSON in the body property if it exists
      if (data && data.body && typeof data.body === 'string') {
        try {
          const parsedBody = JSON.parse(data.body);
          setIocApiResponse(parsedBody);
        } catch (parseError) {
          console.error('Error parsing body:', parseError);
          setIocApiResponse(data);
        }
      } else {
        // Add a delay of 10-20 seconds before setting the response
        const delayTime = Math.floor(Math.random() * 10000) + 10000; // Random delay between 10-20 seconds
        await delay(delayTime);
        setIocApiResponse(data);
      }
    } catch (error) {
      console.error('Error in fetchExtractedIocs:', error);
      setIocError(
        'There was an error connecting to the API. Please try again later or contact support if the issue persists.'
      );
    } finally {
      setIsLoadingIocs(false);
    }
  };
  
  // Function to fetch threat actor data from API
  const fetchThreatActorData = async () => {
    setIsLoadingThreatActors(true);
    setThreatActorError(null);
    
    try {
      const response = await fetch('https://cwsotaf35h.execute-api.us-east-2.amazonaws.com/v1/worksheet1/identify-threat-actors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          threatActorAnalysis
        })
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Threat Actor API response:', data);
      
      // Parse the stringified JSON in the body property if it exists
      if (data && data.body && typeof data.body === 'string') {
        try {
          const parsedBody = JSON.parse(data.body);
          setThreatActorApiResponse({ body: parsedBody });
        } catch (parseError) {
          console.error('Error parsing body:', parseError);
          setThreatActorApiResponse(data);
        }
      } else {
        // Add a delay of 10-20 seconds before setting the response
        const delayTime = Math.floor(Math.random() * 10000) + 10000; // Random delay between 10-20 seconds
        await delay(delayTime);
        setThreatActorApiResponse(data);
      }
    } catch (error) {
      console.error('Error in fetchThreatActorData:', error);
      setThreatActorError(
        'There was an error connecting to the API. Please try again later or contact support if the issue persists.'
      );
    } finally {
      setIsLoadingThreatActors(false);
    }
  };
  
  return (
    <Container className="my-4">
      
      <h1 className="mb-4">Worksheet 1: Analysis</h1>
      
      <MalwareAnalysisHeader />
      
      <Card className="mb-4">
        <Card.Header as="h5">Overview</Card.Header>
        <Card.Body>
          <p>
            In this worksheet, you will analyze threat intelligence to identify Tactics, Techniques, and Procedures (TTPs),
            Indicators of Compromise (IOCs), and Threat Actors. This analysis forms the foundation for developing effective
            detection rules and response strategies in later worksheets.
          </p>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Header as="h5">Task 1: Document TTPs</Card.Header>
        <Card.Body>
          <p>
            Analyze the threat intelligence reports and identify the Tactics, Techniques, and Procedures (TTPs) used by the threat actors.
            Use the MITRE ATT&CK framework to categorize the TTPs where possible.
          </p>
          <Form.Group className="mb-3">
            <Form.Label>Document the TTPs identified in the threat intelligence:</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={5} 
              placeholder="Enter TTPs here..."
              value={ttpAnalysis}
              onChange={(e) => setTtpAnalysis(e.target.value)}
            />
            <div className="d-flex mt-2">
              <button className="btn btn-primary me-2">Submit</button>
              {ttpApiResponse ? (
                <button 
                  className="btn btn-warning"
                  onClick={() => {
                    setTtpApiResponse(null);
                  }}
                >
                  Clear AI Response
                </button>
              ) : (
                <button 
                  className="btn btn-secondary"
                  onClick={fetchExtractedTtps}
                  disabled={isLoadingTtps}
                >
                  {isLoadingTtps ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Loading...
                    </>
                  ) : 'Use AI'}
                </button>
              )}
            </div>
            
            {/* Display TTP API response or error */}
            {ttpApiResponse && (
              <div className="mt-4">
                <Alert variant="success" className="mb-4">
                  <Alert.Heading>TTPs Identified Successfully</Alert.Heading>
                  <p>
                    We've identified the following TTPs based on your analysis. These can be used to develop detection rules in the next step.
                  </p>
                </Alert>
                
                <h5 className="mb-3">Identified MITRE ATT&CK TTPs</h5>
                
                {ttpApiResponse && (ttpApiResponse.MITRE_TTPs || (ttpApiResponse.body && ttpApiResponse.body.MITRE_TTPs)) ? (
                  <Table striped bordered hover responsive className="mt-3">
                    <thead className="table-primary">
                      <tr>
                        <th width="25%">Tactic</th>
                        <th width="75%">Technique</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(ttpApiResponse.MITRE_TTPs || (ttpApiResponse.body && ttpApiResponse.body.MITRE_TTPs) || {}).flatMap(([category, techniques]) => 
                        techniques.map((technique, index) => {
                          // Extract ID if available (format: T1234 or T1234.001)
                          const idMatch = technique.match(/T\d+(\.\d+)?/);
                          
                          // Format the technique with the ID as a badge if present
                          let displayTechnique = technique;
                          if (idMatch) {
                            const id = idMatch[0];
                            const cleanTechnique = technique.replace(idMatch[0], '').trim();
                            displayTechnique = (
                              <>
                                <span className="badge bg-secondary me-2">{id}</span>
                                {cleanTechnique}
                              </>
                            );
                          }
                          
                          return (
                            <tr key={`${category}-${index}`}>
                              <td>
                                <strong>{category}</strong>
                                <br />
                                <span className="text-muted small">{category === 'Discovery' ? 'TA0007' : 
                                                                    category === 'Defense Evasion' ? 'TA0005' : 
                                                                    category === 'Credential Access' ? 'TA0006' : ''}</span>
                              </td>
                              <td>{displayTechnique}</td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </Table>
                ) : (
                  <Alert variant="warning">
                    <div className="d-flex">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16">
                        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                      </svg>
                      <div>
                        No specific TTPs were identified. Please provide more detailed information about the threat actor's tactics and techniques.
                      </div>
                    </div>
                  </Alert>
                )}
                
                <div className="d-flex justify-content-end mt-4">
                  <Button 
                    variant="secondary" 
                    onClick={() => setTtpApiResponse(null)}
                    className="me-2"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            )}
            
            {ttpError && (
              <div className="mt-3">
                <div className="p-3" style={{ backgroundColor: '#ffebee', borderRadius: '4px' }}>
                  <h5 className="text-danger">Error</h5>
                  <p>{ttpError}</p>
                </div>
              </div>
            )}
          </Form.Group>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Header as="h5">Task 2: Identify IOCs</Card.Header>
        <Card.Body>
          <p>
            Extract all IOCs related to registry modifications made by the malware.
          </p>
          <Form.Group className="mb-3">
            <Form.Label>Document the IOCs identified in the threat intelligence:</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={5} 
              placeholder="Enter IOCs here..."
              value={iocAnalysis}
              onChange={(e) => setIocAnalysis(e.target.value)}
            />
            <div className="d-flex mt-2">
              <button className="btn btn-primary me-2">Submit</button>
              {iocApiResponse ? (
                <button 
                  className="btn btn-warning"
                  onClick={() => {
                    setIocApiResponse(null);
                  }}
                >
                  Clear AI Response
                </button>
              ) : (
                <button 
                  className="btn btn-secondary"
                  onClick={fetchExtractedIocs}
                  disabled={isLoadingIocs}
                >
                  {isLoadingIocs ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Loading...
                    </>
                  ) : 'Use AI'}
                </button>
              )}
            </div>
            
            {/* Display IOC API response or error */}
            {iocApiResponse && (
              <div className="mt-4">
                <Alert variant="success" className="mb-4">
                  <Alert.Heading>Registry Modifications Identified</Alert.Heading>
                  <p>
                    We've identified the following registry modifications made by the malware. These can be used as indicators of compromise for detection.
                  </p>
                </Alert>
                
                <h5 className="mb-3">Registry Keys Created</h5>
                <Table striped bordered hover responsive className="mt-3 mb-4">
                  <thead className="table-primary">
                    <tr>
                      <th width="10%">#</th>
                      <th width="90%">Registry Key</th>
                    </tr>
                  </thead>
                  <tbody>
                    {iocApiResponse.registry_modifications.keys_created.map((key, index) => (
                      <tr key={`key-${index}`}>
                        <td className="text-center">{index + 1}</td>
                        <td>
                          <code className="text-danger">{key}</code>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                
                <h5 className="mb-3">Registry Values Modified</h5>
                {iocApiResponse.registry_modifications.key_values_modified.map((value, index) => (
                  <Card key={`mod-${index}`} className="mb-3 border-primary">
                    <Card.Header className="bg-light">
                      <strong>Registry Value #{index + 1}</strong>
                    </Card.Header>
                    <Card.Body>
                      <Table striped bordered hover responsive className="mb-0">
                        <tbody>
                          <tr>
                            <td width="20%"><strong>Key Path</strong></td>
                            <td width="80%">
                              <code className="text-danger">{value.key_path}</code>
                            </td>
                          </tr>
                          <tr>
                            <td><strong>Name</strong></td>
                            <td>{value.name}</td>
                          </tr>
                          <tr>
                            <td><strong>Type</strong></td>
                            <td>
                              <span className="badge bg-secondary">{value.type}</span>
                            </td>
                          </tr>
                          {value.type === 'binary' ? (
                            <>
                              <tr>
                                <td><strong>Old Value</strong></td>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <span className="badge bg-secondary me-2">Binary</span>
                                    <code className="text-muted">{value.old_data || "[No data]"}</code>
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td><strong>New Value</strong></td>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <span className="badge bg-secondary me-2">Binary</span>
                                    <code className="text-muted">{value.new_data || "[No data]"}</code>
                                  </div>
                                </td>
                              </tr>
                            </>
                          ) : (
                            <>
                              <tr>
                                <td><strong>Old Value</strong></td>
                                <td><code>{value.old_data}</code></td>
                              </tr>
                              <tr>
                                <td><strong>New Value</strong></td>
                                <td><code>{value.new_data}</code></td>
                              </tr>
                            </>
                          )}
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                ))}
                
                <div className="d-flex justify-content-end mt-4">
                  <Button 
                    variant="secondary" 
                    onClick={() => setIocApiResponse(null)}
                    className="me-2"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            )}
            
            {iocError && (
              <div className="mt-3">
                <div className="p-3" style={{ backgroundColor: '#ffebee', borderRadius: '4px' }}>
                  <h5 className="text-danger">Error</h5>
                  <p>{iocError}</p>
                </div>
              </div>
            )}
          </Form.Group>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Header as="h5">Task 3: Identify Threat Actors</Card.Header>
        <Card.Body>
          <p>
          Find details about the threat actors associated with the development of the malware.
          </p>
          <Form.Group className="mb-3">
            <Form.Label>Based on the TTPs and IOCs identified, document information about the threat actors involved.
            Include details about their motivations, capabilities, and any known attribution:</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={5} 
              placeholder="Enter Threat Actor information here..."
              value={threatActorAnalysis}
              onChange={(e) => setThreatActorAnalysis(e.target.value)}
            />
            <div className="d-flex mt-2">
              <button className="btn btn-primary me-2">Submit</button>
              {threatActorApiResponse ? (
                <button 
                  className="btn btn-warning"
                  onClick={() => {
                    setThreatActorApiResponse(null);
                  }}
                >
                  Clear AI Response
                </button>
              ) : (
                <button 
                  className="btn btn-secondary"
                  onClick={fetchThreatActorData}
                  disabled={isLoadingThreatActors}
                >
                  {isLoadingThreatActors ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Loading...
                    </>
                  ) : 'Use AI'}
                </button>
              )}
            </div>
            
            {/* Display API response or error */}
            {threatActorApiResponse && (
              <div className="mt-4">
                <Alert variant="success" className="mb-4">
                  <Alert.Heading>Threat Actor Identified Successfully</Alert.Heading>
                  <p>
                    We've identified the following threat actor based on your analysis. This information can help with attribution and understanding the threat landscape.
                  </p>
                </Alert>
                
                <h5 className="mb-3">Threat Actor Profile</h5>
                
                {(threatActorApiResponse.body?.threat_actor || threatActorApiResponse.threat_actor) && (
                  <>
                    <Table striped bordered hover responsive className="mt-3 mb-4">
                      <thead className="table-primary">
                        <tr>
                          <th width="30%">Attribute</th>
                          <th width="70%">Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><strong>Alias</strong></td>
                          <td>
                            <span className="badge bg-dark me-2">
                              {(threatActorApiResponse.body?.threat_actor || threatActorApiResponse.threat_actor).alias}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td><strong>Developer of</strong></td>
                          <td>{(threatActorApiResponse.body?.threat_actor || threatActorApiResponse.threat_actor).developer_of}</td>
                        </tr>
                        <tr>
                          <td><strong>First observed</strong></td>
                          <td>{(threatActorApiResponse.body?.threat_actor || threatActorApiResponse.threat_actor).first_observed_advertising}</td>
                        </tr>
                        <tr>
                          <td><strong>Motive</strong></td>
                          <td>
                            <span className="badge bg-danger me-2">
                              {(threatActorApiResponse.body?.threat_actor || threatActorApiResponse.threat_actor).motive}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td><strong>Geographical Targeting</strong></td>
                          <td>{(threatActorApiResponse.body?.threat_actor || threatActorApiResponse.threat_actor).geographical_targeting_preference}</td>
                        </tr>
                      </tbody>
                    </Table>
                    
                    <h5 className="mb-3">Communication Channels</h5>
                    <Table striped bordered hover responsive className="mt-3 mb-4">
                      <thead className="table-primary">
                        <tr>
                          <th>Channel</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(threatActorApiResponse.body?.threat_actor || threatActorApiResponse.threat_actor).current_communication_channels.map((channel, index) => (
                          <tr key={index}>
                            <td>
                              <i className="bi bi-chat-dots me-2"></i>
                              {channel}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    
                    <h5 className="mb-3">Forum Aliases</h5>
                    <Table striped bordered hover responsive className="mt-3 mb-4">
                      <thead className="table-primary">
                        <tr>
                          <th width="30%">Forum</th>
                          <th width="70%">Alias</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries((threatActorApiResponse.body?.threat_actor || threatActorApiResponse.threat_actor).aliases_used_on_forums).map(([forum, alias], index) => (
                          <tr key={index}>
                            <td><strong>{forum}</strong></td>
                            <td>{alias}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    
                    <h5 className="mb-3">Malware Characteristics</h5>
                    <Table striped bordered hover responsive className="mt-3">
                      <thead className="table-primary">
                        <tr>
                          <th>Characteristic</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(threatActorApiResponse.body?.threat_actor || threatActorApiResponse.threat_actor).malware_characteristics_developed.map((characteristic, index) => (
                          <tr key={index}>
                            <td>
                              <i className="bi bi-bug me-2"></i>
                              {characteristic}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    
                    <div className="d-flex justify-content-end mt-4">
                      <Button 
                        variant="secondary" 
                        onClick={() => setThreatActorApiResponse(null)}
                        className="me-2"
                      >
                        Reset
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
            
            {threatActorError && (
              <div className="mt-3">
                <div className="p-3" style={{ backgroundColor: '#ffebee', borderRadius: '4px' }}>
                  <h5 className="text-danger">Error</h5>
                  <p>{threatActorError}</p>
                </div>
              </div>
            )}
          </Form.Group>
        </Card.Body>
      </Card>
      
      <div className="d-flex justify-content-between mt-3">
        <Link to="/" className="btn btn-secondary">Back to Home</Link>
        <Link to="/scenario1/worksheet2" className="btn btn-primary">Next: Detection Rules</Link>
      </div>
    </Container>
  );
};

export default Worksheet1;
