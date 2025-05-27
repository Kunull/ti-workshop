import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useWorkshop } from '../context/WorkshopContext';

const Worksheet1 = () => {

  const { 
    threatLandscape,
    setThreatLandscape,
    worksheetProgress,
    setWorksheetProgress
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
  
  // Calculate progress
  useEffect(() => {
    // Calculate completion percentage based on filled fields
    let completedTasks = 0;
    if (ttpAnalysis.trim()) completedTasks++;
    if (iocAnalysis.trim()) completedTasks++;
    if (threatActorAnalysis.trim()) completedTasks++;
    
    const percentComplete = Math.round((completedTasks / 3) * 100);
    
    // Update progress in context
    setWorksheetProgress(prevProgress => ({
      ...prevProgress,
      worksheet1: percentComplete
    }));
  }, [ttpAnalysis, iocAnalysis, threatActorAnalysis, setWorksheetProgress]);

  return (
    <Container className="mt-4 mb-5">
      <h1 className="mb-4">Worksheet 1: Analysis</h1>
      
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
              <div className="mt-3">
                <div className="p-3" style={{ backgroundColor: '#e6f7ff', borderRadius: '4px', color: '#0d47a1' }}>
                  <h5>MITRE ATT&CK TTPs</h5>
                  {ttpApiResponse && (ttpApiResponse.MITRE_TTPs || (ttpApiResponse.body && ttpApiResponse.body.MITRE_TTPs)) ? (
                    <>
                      <p>The AI has identified the following TTPs:</p>
                      {Object.entries(ttpApiResponse.MITRE_TTPs || (ttpApiResponse.body && ttpApiResponse.body.MITRE_TTPs) || {}).map(([category, techniques]) => (
                        <div key={category} className="mb-3">
                          <h6 className="fw-bold" style={{ color: '#0d47a1' }}>{category}</h6>
                          <div className="p-2" style={{ backgroundColor: '#d4e8ff', borderRadius: '4px' }}>
                            {techniques.map((technique, index) => (
                              <div key={index} className="p-2 mb-1" style={{ backgroundColor: '#e6f7ff', borderRadius: '4px' }}>{technique}</div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <p>No specific TTPs were identified. Please provide more detailed information.</p>
                  )}
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
              <div className="mt-3">
                <div className="p-3" style={{ backgroundColor: '#e6f7ff', borderRadius: '4px', color: '#0d47a1' }}>
                  <h5>Registry Modifications</h5>
                  
                  <h6 className="mt-3" style={{ color: '#0d47a1' }}>Registry Keys Created:</h6>
                  <div className="p-2" style={{ backgroundColor: '#d4e8ff', borderRadius: '4px' }}>
                    {iocApiResponse.registry_modifications.keys_created.map((key, index) => (
                      <div key={`key-${index}`} className="p-2 mb-1" style={{ backgroundColor: '#e6f7ff', borderRadius: '4px' }}><code>{key}</code></div>
                    ))}
                  </div>
                  
                  <h6 className="mt-3" style={{ color: '#0d47a1' }}>Registry Values Created:</h6>
                  <div className="p-2" style={{ backgroundColor: '#d4e8ff', borderRadius: '4px' }}>
                    {iocApiResponse.registry_modifications.key_values_modified.map((value, index) => (
                      <div key={`mod-${index}`} className="p-2 mb-1" style={{ backgroundColor: '#e6f7ff', borderRadius: '4px' }}>
                        <div><strong>Key Path:</strong> <code>{value.key_path}</code></div>
                        <div><strong>Name:</strong> {value.name}</div>
                        <div><strong>Type:</strong> {value.type}</div>
                        <div>
                          <strong>Data:</strong> {value.type === 'binary' ? (
                            <div>
                              <div><strong>Old:</strong> <small className="text-muted">[Binary data]</small></div>
                              <div><strong>New:</strong> <small className="text-muted">[Binary data]</small></div>
                            </div>
                          ) : (
                            <>
                              <div><strong>Old:</strong> <code>{value.old_data}</code></div>
                              <div><strong>New:</strong> <code>{value.new_data}</code></div>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
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
              <div className="mt-3">
                <div className="p-3" style={{ backgroundColor: '#e6f7ff', borderRadius: '4px', color: '#0d47a1' }}>
                  <h5>AI Analysis</h5>
                  <p>The AI has identified the following threat actor:</p>
                  
                  {(threatActorApiResponse.body?.threat_actor || threatActorApiResponse.threat_actor) && (
                    <div className="mt-2">
                      <h6 style={{ color: '#0d47a1' }}>Threat Actor Profile:</h6>
                      <div className="p-2" style={{ backgroundColor: '#d4e8ff', borderRadius: '4px' }}>
                        <div className="p-2 mb-1" style={{ backgroundColor: '#e6f7ff', borderRadius: '4px' }}><strong>Alias:</strong> {(threatActorApiResponse.body?.threat_actor || threatActorApiResponse.threat_actor).alias}</div>
                        <div className="p-2 mb-1" style={{ backgroundColor: '#e6f7ff', borderRadius: '4px' }}><strong>Developer of:</strong> {(threatActorApiResponse.body?.threat_actor || threatActorApiResponse.threat_actor).developer_of}</div>
                        <div className="p-2 mb-1" style={{ backgroundColor: '#e6f7ff', borderRadius: '4px' }}><strong>First observed:</strong> {(threatActorApiResponse.body?.threat_actor || threatActorApiResponse.threat_actor).first_observed_advertising}</div>
                        <div className="p-2 mb-1" style={{ backgroundColor: '#e6f7ff', borderRadius: '4px' }}><strong>Motive:</strong> {(threatActorApiResponse.body?.threat_actor || threatActorApiResponse.threat_actor).motive}</div>
                      </div>
                      
                      <h6 style={{ color: '#0d47a1' }}>Communication Channels:</h6>
                      <div className="p-2" style={{ backgroundColor: '#d4e8ff', borderRadius: '4px' }}>
                        {(threatActorApiResponse.body?.threat_actor || threatActorApiResponse.threat_actor).current_communication_channels.map((channel, index) => (
                          <div key={index} className="p-2 mb-1" style={{ backgroundColor: '#e6f7ff', borderRadius: '4px' }}>{channel}</div>
                        ))}
                      </div>
                      
                      <h6 style={{ color: '#0d47a1' }}>Aliases Used on Forums:</h6>
                      <div className="p-2" style={{ backgroundColor: '#d4e8ff', borderRadius: '4px' }}>
                        {Object.entries((threatActorApiResponse.body?.threat_actor || threatActorApiResponse.threat_actor).aliases_used_on_forums).map(([forum, alias], index) => (
                          <div key={index} className="p-2 mb-1" style={{ backgroundColor: '#e6f7ff', borderRadius: '4px' }}><strong>{forum}:</strong> {alias}</div>
                        ))}
                      </div>
                      
                      <h6 style={{ color: '#0d47a1' }}>Malware Characteristics:</h6>
                      <div className="p-2" style={{ backgroundColor: '#d4e8ff', borderRadius: '4px' }}>
                        {(threatActorApiResponse.body?.threat_actor || threatActorApiResponse.threat_actor).malware_characteristics_developed.map((characteristic, index) => (
                          <div key={index} className="p-2 mb-1" style={{ backgroundColor: '#e6f7ff', borderRadius: '4px' }}>{characteristic}</div>
                        ))}
                      </div>
                      
                      <h6 style={{ color: '#0d47a1' }}>Geographical Targeting:</h6>
                      <div className="p-2" style={{ backgroundColor: '#d4e8ff', borderRadius: '4px' }}>
                        <div className="p-2 mb-1" style={{ backgroundColor: '#e6f7ff', borderRadius: '4px' }}>{(threatActorApiResponse.body?.threat_actor || threatActorApiResponse.threat_actor).geographical_targeting_preference}</div>
                      </div>
                    </div>
                  )}
                </div>
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
      
      <div className="d-flex justify-content-between">
        <Link to="/" className="btn btn-secondary">Back to Home</Link>
        <Link to="/worksheet-2" className="btn btn-primary">Next: Detection Rules</Link>
      </div>
    </Container>
  );
};

export default Worksheet1;
