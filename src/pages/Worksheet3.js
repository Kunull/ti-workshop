import React, { useState } from 'react';
import { Container, Card, Form, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Worksheet3 = () => {

  // Helper function to create a delay
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // State for incident response fields
  const [containmentSteps, setContainmentSteps] = useState('');
  const [eradicationSteps, setEradicationSteps] = useState('');
  const [recoverySteps, setRecoverySteps] = useState('');
  
  // State for API response handling
  const [containmentApiResponse, setContainmentApiResponse] = useState(null);
  const [isLoadingContainment, setIsLoadingContainment] = useState(false);
  const [containmentError, setContainmentError] = useState(null);
  
  // State for recovery plan API response handling
  const [recoveryApiResponse, setRecoveryApiResponse] = useState(null);
  const [isLoadingRecovery, setIsLoadingRecovery] = useState(false);
  const [recoveryError, setRecoveryError] = useState(null);
  
  // State for eradication strategy API response handling
  const [eradicationApiResponse, setEradicationApiResponse] = useState(null);
  const [isLoadingEradication, setIsLoadingEradication] = useState(false);
  const [eradicationError, setEradicationError] = useState(null);
  
  
  // Function to fetch containment strategy from API
  const fetchContainmentStrategy = async () => {
    setIsLoadingContainment(true);
    
    try {
      const response = await fetch('https://cwsotaf35h.execute-api.us-east-2.amazonaws.com/v1/worksheet3/containment-strategy', {
        method: 'POST'
      });
      
      const data = await response.json();
      console.log('Containment Strategy API response:', data);
      
      // Parse the stringified JSON in the body property if it exists
      if (data && data.body && typeof data.body === 'string') {
        try {
          const parsedBody = JSON.parse(data.body);
          setContainmentApiResponse(parsedBody);
        } catch (parseError) {
          console.error('Error parsing body:', parseError);
          setContainmentApiResponse(data);
        }
      } else {
        // Add a delay of 20-30 seconds before setting the response
        const delayTime = Math.floor(Math.random() * 10000) + 20000; // Random delay between 20-30 seconds
        await delay(delayTime);
        setContainmentApiResponse(data);
      }
    } catch (error) {
      console.error('Error fetching containment strategy:', error);
      setContainmentError('Failed to fetch data from API');
    } finally {
      setIsLoadingContainment(false);
    }
  };
  
  // Function to fetch recovery plan from API
  const fetchRecoveryPlan = async () => {
    setIsLoadingRecovery(true);
    
    try {
      const response = await fetch('https://cwsotaf35h.execute-api.us-east-2.amazonaws.com/v1/worksheet3/recovery-plan', {
        method: 'POST'
      });
      
      const data = await response.json();
      console.log('Recovery Plan API response:', data);
      
      // Parse the stringified JSON in the body property if it exists
      if (data && data.body && typeof data.body === 'string') {
        try {
          const parsedBody = JSON.parse(data.body);
          setRecoveryApiResponse(parsedBody);
        } catch (parseError) {
          console.error('Error parsing body:', parseError);
          setRecoveryApiResponse(data);
        }
      } else {
        // Add a delay of 20-30 seconds before setting the response
        const delayTime = Math.floor(Math.random() * 10000) + 20000; // Random delay between 20-30 seconds
        await delay(delayTime);
        setRecoveryApiResponse(data);
      }
    } catch (error) {
      console.error('Error fetching recovery plan:', error);
      setRecoveryError('Failed to fetch data from API');
    } finally {
      setIsLoadingRecovery(false);
    }
  };
  
  // Function to fetch eradication strategy from API
  const fetchEradicationStrategy = async () => {
    setIsLoadingEradication(true);
    
    try {
      const response = await fetch('https://cwsotaf35h.execute-api.us-east-2.amazonaws.com/v1/worksheet3/eradication-strategy', {
        method: 'POST'
      });
      
      const data = await response.json();
      console.log('Eradication Strategy API response:', data);
      
      // Parse the stringified JSON in the body property if it exists
      if (data && data.body && typeof data.body === 'string') {
        try {
          const parsedBody = JSON.parse(data.body);
          setEradicationApiResponse(parsedBody);
        } catch (parseError) {
          console.error('Error parsing body:', parseError);
          setEradicationApiResponse(data);
        }
      } else {
        // Add a delay of 20-30 seconds before setting the response
        const delayTime = Math.floor(Math.random() * 10000) + 20000; // Random delay between 20-30 seconds
        await delay(delayTime);
        setEradicationApiResponse(data);
      }
    } catch (error) {
      console.error('Error fetching eradication strategy:', error);
      setEradicationError('Failed to fetch data from API');
    } finally {
      setIsLoadingEradication(false);
    }
  };



  return (
    <Container className="mt-4 mb-5">
      <h1 className="mb-4">Worksheet 3: Automated Response</h1>
      
      <Card className="mb-4">
        <Card.Header as="h5">Overview</Card.Header>
        <Card.Body>
          <p>
            In this worksheet, you will create an incident response playbook and automation scripts to respond to 
            Lumma Stealer infections. You'll document containment, eradication, and recovery steps, and develop 
            a script to automate part of the response process.
          </p>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Header as="h5">Task 1: Containment Strategy</Card.Header>
        <Card.Body>
          <p>
            Document the steps you would take to contain a Lumma Stealer infection in your environment.
            Consider network isolation, account lockdowns, and other immediate actions to prevent lateral movement and data exfiltration.
          </p>
          <Form.Group className="mb-3">
            <Form.Label>Document your containment strategy:</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={5} 
              placeholder="Document steps to contain a Lumma Stealer infection..."
              value={containmentSteps}
              onChange={(e) => setContainmentSteps(e.target.value)}
            />
            <div className="d-flex mt-2">
              <button className="btn btn-primary me-2">Submit</button>
              {containmentApiResponse ? (
                <button 
                  className="btn btn-warning"
                  onClick={() => {
                    setContainmentApiResponse(null);
                  }}
                >
                  Clear AI Response
                </button>
              ) : (
                <button 
                  className="btn btn-secondary"
                  onClick={fetchContainmentStrategy}
                  disabled={isLoadingContainment}
                >
                  {isLoadingContainment ? (
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
            
            {/* Display API response */}
            {containmentApiResponse && (
              <div className="mt-3">
                <div className="p-3" style={{ backgroundColor: '#e6f7ff', borderRadius: '4px', color: '#0d47a1' }}>
                  <h5>Containment Strategy</h5>
                  {containmentApiResponse.containment_strategy ? (
                    <div className="p-2" style={{ backgroundColor: '#d4e8ff', borderRadius: '4px' }}>
                      {containmentApiResponse.containment_strategy.map((step, index) => (
                        <div key={index} className="p-2 mb-1" style={{ backgroundColor: '#e6f7ff', borderRadius: '4px' }}>{step}</div>
                      ))}
                    </div>
                  ) : (
                    <p>No specific containment strategy was identified. Please provide more detailed information.</p>
                  )}
                </div>
              </div>
            )}
            
            {/* Display error if any */}
            {containmentError && (
              <div className="mt-3">
                <div className="p-3" style={{ backgroundColor: '#ffebee', borderRadius: '4px' }}>
                  <h5 className="text-danger">Error</h5>
                  <p>{containmentError}</p>
                </div>
              </div>
            )}
            
            {containmentError && (
              <div className="mt-3">
                <div className="p-3" style={{ backgroundColor: '#ffebee', borderRadius: '4px' }}>
                  <h5 className="text-danger">Error</h5>
                  <p>{containmentError}</p>
                </div>
              </div>
            )}
          </Form.Group>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Header as="h5">Task 2: Eradication Procedures</Card.Header>
        <Card.Body>
          <p>
            Detail the procedures for completely removing Lumma Stealer from infected systems.
            Include steps for identifying all malware components, persistence mechanisms, and ensuring complete removal.
          </p>
          <Form.Group className="mb-3">
            <Form.Label>Document your eradication procedures:</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={5} 
              placeholder="Document steps to eradicate Lumma Stealer from the environment..."
              value={eradicationSteps}
              onChange={(e) => setEradicationSteps(e.target.value)}
            />
            <div className="d-flex mt-2">
              <button className="btn btn-primary me-2">Submit</button>
              {eradicationApiResponse ? (
                <button 
                  className="btn btn-warning"
                  onClick={() => {
                    setEradicationApiResponse(null);
                  }}
                >
                  Clear AI Response
                </button>
              ) : (
                <button 
                  className="btn btn-secondary"
                  onClick={fetchEradicationStrategy}
                  disabled={isLoadingEradication}
                >
                  {isLoadingEradication ? (
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
            
            {/* Display API response */}
            {eradicationApiResponse && (
              <div className="mt-3">
                <div className="p-3" style={{ backgroundColor: '#e6f7ff', borderRadius: '4px', color: '#0d47a1' }}>
                  <h5>Eradication Strategy</h5>
                  {eradicationApiResponse.eradication_steps ? (
                    <div className="p-2" style={{ backgroundColor: '#d4e8ff', borderRadius: '4px' }}>
                      {eradicationApiResponse.eradication_steps.map((step, index) => (
                        <div key={index} className="p-2 mb-1" style={{ backgroundColor: '#e6f7ff', borderRadius: '4px' }}>{step}</div>
                      ))}
                    </div>
                  ) : (
                    <p>No specific eradication strategy was identified. Please provide more detailed information.</p>
                  )}
                </div>
              </div>
            )}
            
            {/* Display error if any */}
            {eradicationError && (
              <div className="mt-3">
                <div className="p-3" style={{ backgroundColor: '#ffebee', borderRadius: '4px' }}>
                  <h5 className="text-danger">Error</h5>
                  <p>{eradicationError}</p>
                </div>
              </div>
            )}
            
            {eradicationError && (
              <div className="mt-3">
                <div className="p-3" style={{ backgroundColor: '#ffebee', borderRadius: '4px' }}>
                  <h5 className="text-danger">Error</h5>
                  <p>{eradicationError}</p>
                </div>
              </div>
            )}
          </Form.Group>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Header as="h5">Task 3: Recovery Plan</Card.Header>
        <Card.Body>
          <p>
            Outline the steps for recovering systems and data after a Lumma Stealer infection.
            Include verification procedures to ensure systems are clean, data restoration processes, and steps to return to normal operations.
          </p>
          <Form.Group className="mb-3">
            <Form.Label>Document your recovery plan:</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={5} 
              placeholder="Document steps to recover from a Lumma Stealer infection..."
              value={recoverySteps}
              onChange={(e) => setRecoverySteps(e.target.value)}
            />
            <div className="d-flex mt-2">
              <button className="btn btn-primary me-2">Submit</button>
              {recoveryApiResponse ? (
                <button 
                  className="btn btn-warning"
                  onClick={() => {
                    setRecoveryApiResponse(null);
                  }}
                >
                  Clear AI Response
                </button>
              ) : (
                <button 
                  className="btn btn-secondary"
                  onClick={fetchRecoveryPlan}
                  disabled={isLoadingRecovery}
                >
                  {isLoadingRecovery ? (
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
            
            {/* Display API response */}
            {recoveryApiResponse && (
              <div className="mt-3">
                <div className="p-3" style={{ backgroundColor: '#e6f7ff', borderRadius: '4px', color: '#0d47a1' }}>
                  <h5>Recovery Plan</h5>
                  {recoveryApiResponse.recovery_plan ? (
                    <div className="p-2" style={{ backgroundColor: '#d4e8ff', borderRadius: '4px' }}>
                      {recoveryApiResponse.recovery_plan.map((step, index) => (
                        <div key={index} className="p-2 mb-1" style={{ backgroundColor: '#e6f7ff', borderRadius: '4px' }}>{step}</div>
                      ))}
                    </div>
                  ) : (
                    <p>No specific recovery plan was identified. Please provide more detailed information.</p>
                  )}
                </div>
              </div>
            )}
            
            {/* Display error if any */}
            {recoveryError && (
              <div className="mt-3">
                <div className="p-3" style={{ backgroundColor: '#ffebee', borderRadius: '4px' }}>
                  <h5 className="text-danger">Error</h5>
                  <p>{recoveryError}</p>
                </div>
              </div>
            )}
            
            {recoveryError && (
              <div className="mt-3">
                <div className="p-3" style={{ backgroundColor: '#ffebee', borderRadius: '4px' }}>
                  <h5 className="text-danger">Error</h5>
                  <p>{recoveryError}</p>
                </div>
              </div>
            )}
          </Form.Group>
        </Card.Body>
      </Card>


      
      <div className="d-flex justify-content-between">
        <Link to="/worksheet-2" className="btn btn-secondary">Previous: Detection Rules</Link>
        <Link to="/worksheet-4" className="btn btn-primary">Next: Intelligence Sharing</Link>
      </div>
    </Container>
  );
};

export default Worksheet3;
