import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useWorkshop } from '../context/WorkshopContext';
import axios from 'axios';

const Worksheet9 = () => {
  // useWorkshop hook - progress tracking removed
  const { } = useWorkshop();

  // State for user input
  const [securityContent, setSecurityContent] = useState('');
  
  // State for query type selection
  const [selectedQueryTypes, setSelectedQueryTypes] = useState({
    SPLUNK: true,
    KQL: false,
    EQL: false,
    SQL: false
  });
  
  // State for API response handling
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);
  
  // State for polling
  const [pollCount, setPollCount] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [processingSteps, setProcessingSteps] = useState([]);
  
  // State for raw response data display
  const [extractedData, setExtractedData] = useState(null);
  const [researchQuery, setResearchQuery] = useState('');
  const [researchReport, setResearchReport] = useState(null);
  const [extractedResearchData, setExtractedResearchData] = useState(null);
  const [collectedRules, setCollectedRules] = useState([]);
  
  // State for view mode (input or output)
  const [viewMode, setViewMode] = useState('input');

  // Helper function to create a delay
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  // Function to handle query type selection
  const handleQueryTypeChange = (queryType) => {
    setSelectedQueryTypes({
      ...selectedQueryTypes,
      [queryType]: !selectedQueryTypes[queryType]
    });
  };
  
  // Function to handle the "Use AI" button click
  const handleUseAI = async (e) => {
    e.preventDefault();
    
    // Validate input
    if (!securityContent.trim()) {
      setError('Please enter a hunting hypothesis to generate detection queries.');
      return;
    }
    
    // Check if at least one query type is selected
    if (!Object.values(selectedQueryTypes).some(Boolean)) {
      setError('Please select at least one query type.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setApiResponse(null);
    setViewMode('output');
    
    try {
      // Get selected query types as a comma-separated string
      const selectedTypes = Object.keys(selectedQueryTypes).filter(key => selectedQueryTypes[key]);
      
      // Log the submission
      console.log('Submitting content to API Gateway...');
      console.log('Hunting Hypothesis:', securityContent);
      console.log('Selected Query Types:', selectedTypes);
      
      // Make API request
      const apiEndpoint = 'https://r90guxvefb.execute-api.us-east-2.amazonaws.com/v1/detection-rules';
      
      const response = await axios.post(apiEndpoint, {
        security_content: securityContent,
        rule_types: selectedTypes.join(',')
      });
      
      console.log('API Response:', response.data);
      
      // Check if we have a message ID to poll
      if (response.data && response.data.messageId) {
        const messageId = response.data.messageId;
        console.log('Message ID for polling:', messageId);
        
        // Start polling for results
        setIsLoading(true);
        setPollCount(0);
        setProcessingSteps([]);
        setCurrentStep('Initializing...');
        
        // Add initial processing steps for better user experience
        setProcessingSteps([
          'Submitting content to API Gateway...',
          'Processing security content...',
          'Analyzing threat intelligence data...'
        ]);
        
        // Add a 10-second delay before starting polling
        const initialDelay = 10000; // 10 seconds
        console.log(`Waiting ${initialDelay/1000} seconds before starting to poll...`);
        
        // Wait for the initial delay before starting to poll
        await delay(initialDelay);
        
        // Use setInterval for polling instead of recursive calls
        let pollIntervalId = setInterval(async () => {
          try {
            // Increment poll count
            setPollCount(prev => {
              const newCount = prev + 1;
              console.log(`Polling attempt ${newCount}...`);
              return newCount;
            });
            
            // Poll for results using the message ID
            const pollEndpoint = `https://r90guxvefb.execute-api.us-east-2.amazonaws.com/v1/poll?messageId=${messageId}`;
            
            const pollResponse = await axios.get(pollEndpoint);
            console.log('Poll Response:', pollResponse.data);
            
            // Store the raw response data for display
            setExtractedData(pollResponse.data);
            
            // Extract specific fields from the response
            if (pollResponse.data.research_report) {
              setResearchReport(pollResponse.data.research_report);
            }
            
            if (pollResponse.data.research_query) {
              setResearchQuery(pollResponse.data.research_query);
            }
            
            if (pollResponse.data.research_data) {
              setExtractedResearchData(pollResponse.data.research_data);
            }
            
            // Check if processing is complete
            if (pollResponse.data && pollResponse.data.status === 'COMPLETED') {
              console.log('Processing completed!');
              
              // Set the API response
              setApiResponse(pollResponse.data);
              
              // Extract any additional data from the response
              if (pollResponse.data.data) {
                setExtractedData(pollResponse.data.data);
              }
              
              // Extract research query if available
              if (pollResponse.data.research_query) {
                setResearchQuery(pollResponse.data.research_query);
              }
              
              // Extract research report if available
              if (pollResponse.data.research_report) {
                setResearchReport(pollResponse.data.research_report);
              }
              
              // Extract research data if available
              if (pollResponse.data.research_data) {
                setExtractedResearchData(pollResponse.data.research_data);
              }
              
              // Set loading to false
              setIsLoading(false);
              
              // Add a processing step for completion
              setCurrentStep('Detection queries generated successfully!');
              setProcessingSteps(prev => [...prev, 'Detection queries generated successfully!']);
              
              // Clear the interval
              clearInterval(pollIntervalId);
            } else if (pollResponse.data && pollResponse.data.status === 'PROCESSING') {
              // Still processing, update the current step if available
              if (pollResponse.data.current_step) {
                setCurrentStep(pollResponse.data.current_step);
                setProcessingSteps(prev => {
                  if (!prev.includes(pollResponse.data.current_step)) {
                    return [...prev, pollResponse.data.current_step];
                  }
                  return prev;
                });
              }
            } else if (pollResponse.data && pollResponse.data.status === 'ERROR') {
              // Error occurred during processing
              setError(pollResponse.data.error || 'An error occurred during processing.');
              setIsLoading(false);
              
              // Clear the interval
              clearInterval(pollIntervalId);
            }
          } catch (error) {
            console.error('Error polling for results:', error);
            
            // Update the current step to show we're still working
            setCurrentStep('Waiting for results...');
            setProcessingSteps(prev => {
              if (!prev.includes('Waiting for results...')) {
                return [...prev, 'Waiting for results...'];
              }
              return prev;
            });
            
            // Don't clear the interval - keep polling
          }
        }, 3000); // Poll every 3 seconds
        
        // Cleanup function to clear interval if component unmounts
        return () => clearInterval(pollIntervalId);
      } else {
        // No message ID to poll, treat as immediate response
        setApiResponse(response.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error submitting content:', error);
      setError('Error submitting content. Please try again later.');
      setIsLoading(false);
    }
  };

  return (
    <Container className="my-4">
      <h1 className="mb-4">Worksheet 3: Translate to Queries</h1>
      
      {viewMode === 'input' ? (
        <Card className="mb-4">
          <Card.Header>
            <h4>Step 1: Translate Hypotheses to Detection Queries</h4>
          </Card.Header>
          <Card.Body>
            <div className="mb-4">
              <h5>Overview</h5>
              <p>
                In this worksheet, you'll translate your hunting hypotheses into specific queries for your detection tools.
                These queries will be used to search for evidence of the TTPs you've identified in your environment.
              </p>
            </div>
            
            <Form onSubmit={handleUseAI}>
              <Form.Group className="mb-4">
                <Form.Label>Enter Hunting Hypothesis</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={securityContent}
                  onChange={(e) => setSecurityContent(e.target.value)}
                  placeholder="Enter your hunting hypothesis here..."
                  disabled={isLoading}
                />
                <Form.Text className="text-muted">
                  Example: "Adversaries are using PowerShell with encoded commands to execute malicious code and establish persistence"
                </Form.Text>
              </Form.Group>
              
              <Form.Group className="mb-4">
                <Form.Label>Select Query Types</Form.Label>
                <div className="d-flex flex-wrap">
                  <Form.Check
                    type="checkbox"
                    id="SPLUNK"
                    label="SPLUNK"
                    className="me-3 mb-2"
                    checked={selectedQueryTypes.SPLUNK}
                    onChange={() => handleQueryTypeChange('SPLUNK')}
                    disabled={isLoading}
                  />
                  <Form.Check
                    type="checkbox"
                    id="KQL"
                    label="KQL (Microsoft Sentinel)"
                    className="me-3 mb-2"
                    checked={selectedQueryTypes.KQL}
                    onChange={() => handleQueryTypeChange('KQL')}
                    disabled={isLoading}
                  />
                  <Form.Check
                    type="checkbox"
                    id="EQL"
                    label="EQL (Elastic)"
                    className="me-3 mb-2"
                    checked={selectedQueryTypes.EQL}
                    onChange={() => handleQueryTypeChange('EQL')}
                    disabled={isLoading}
                  />
                  <Form.Check
                    type="checkbox"
                    id="SQL"
                    label="SQL"
                    className="me-3 mb-2"
                    checked={selectedQueryTypes.SQL}
                    onChange={() => handleQueryTypeChange('SQL')}
                    disabled={isLoading}
                  />
                </div>
              </Form.Group>
              
              {error && (
                <Alert variant="danger" className="mb-4">
                  {error}
                </Alert>
              )}
              
              <div className="d-flex justify-content-end">
                <Button 
                  type="submit" 
                  variant="primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Processing...
                    </>
                  ) : (
                    'Generate Detection Queries'
                  )}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      ) : (
        <Card className="mb-4">
          <Card.Header>
            <h4>Generated Detection Queries</h4>
            <p className="text-muted mb-0 small">AI-generated queries based on your hunting hypothesis</p>
          </Card.Header>
          <Card.Body>
            {isLoading ? (
              <div className="p-4">
                <div className="text-center mb-4">
                  <h5>Generating Detection Queries...</h5>
                  <p className="text-muted">This may take a moment...</p>
                </div>
                
                {/* Display direct raw response */}
                <div>
                  <h5>Latest Polling Response:</h5>
                  <pre className="bg-light p-3 rounded" style={{ maxHeight: '500px', overflow: 'auto' }}>
                    <code>{JSON.stringify(extractedData, null, 2)}</code>
                  </pre>
                </div>
                
                {/* Display research report if available */}
                {researchReport && (
                  <div className="mb-3 mt-4">
                    <h5>Research Report:</h5>
                    <div className="p-3 bg-light rounded" style={{ maxHeight: '300px', overflow: 'auto' }}>
                      <p style={{ whiteSpace: 'pre-wrap' }}>{researchReport}</p>
                    </div>
                  </div>
                )}
                
                {/* Display research query if available */}
                {researchQuery && (
                  <div className="mb-3 mt-4">
                    <h5>Research Query:</h5>
                    <p className="p-3 bg-light rounded">{researchQuery}</p>
                  </div>
                )}
                
                {/* Display extracted research data if available */}
                {extractedResearchData && (
                  <div className="mb-3 mt-4">
                    <h5>Extracted Research Data:</h5>
                    <pre className="bg-light p-3 rounded" style={{ maxHeight: '300px', overflow: 'auto' }}>
                      <code>{JSON.stringify(extractedResearchData, null, 2)}</code>
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <div>
                {error && (
                  <Alert variant="danger" className="mb-4">
                    {error}
                  </Alert>
                )}
                
                {extractedData && (
                  <div className="mb-3">
                    <h5>Extracted Data:</h5>
                    <pre className="bg-light p-3 rounded" style={{ maxHeight: '200px', overflow: 'auto' }}>
                      <code>{JSON.stringify(extractedData, null, 2)}</code>
                    </pre>
                  </div>
                )}
                
                {researchQuery && (
                  <div className="mb-3">
                    <h5>Research Query:</h5>
                    <p className="p-3 bg-light rounded">{researchQuery}</p>
                  </div>
                )}
                
                {researchReport && (
                  <div className="mb-3">
                    <h5>Research Report:</h5>
                    <div className="p-3 bg-light rounded" style={{ maxHeight: '300px', overflow: 'auto' }}>
                      <p style={{ whiteSpace: 'pre-wrap' }}>{researchReport}</p>
                    </div>
                  </div>
                )}
                
                {extractedResearchData && (
                  <div className="mb-3">
                    <h5>Extracted Research Data:</h5>
                    <pre className="bg-light p-3 rounded" style={{ maxHeight: '300px', overflow: 'auto' }}>
                      <code>{JSON.stringify(extractedResearchData, null, 2)}</code>
                    </pre>
                  </div>
                )}
                
                {/* Display queries as they are received from the API */}
                {apiResponse && apiResponse.rules && apiResponse.rules.length > 0 && (
                  <div className="mb-3">
                    <h6>Generated Detection Queries:</h6>
                    {apiResponse.rules.map((rule, index) => {
                      // Extract rule content and type
                      const ruleContent = typeof rule === 'string' ? rule : 
                                        rule.rule_content ? rule.rule_content : 
                                        rule.rule ? rule.rule : 
                                        JSON.stringify(rule, null, 2);
                      
                      const ruleType = rule.rule_type || 'SPLUNK';
                      
                      return (
                        <div key={index} className="mb-3">
                          <h6>{ruleType} Query {index + 1}</h6>
                          <pre className="p-3 rounded" style={{ 
                            whiteSpace: 'pre', 
                            overflow: 'auto', 
                            maxHeight: '300px', 
                            margin: 0,
                            fontFamily: 'monospace',
                            fontSize: '14px',
                            padding: '15px',
                            backgroundColor: '#f0f8ff',
                            border: '1px solid #cce5ff',
                            borderRadius: '6px',
                            color: '#004085'
                          }}>
                            <code>{ruleContent}</code>
                          </pre>
                        </div>
                      );
                    })}
                  </div>
                )}
                
                <div className="d-flex justify-content-end mt-4">
                  <Button 
                    variant="outline-primary" 
                    onClick={() => setViewMode('input')}
                  >
                    <i className="bi bi-arrow-left me-1"></i> Back to Input
                  </Button>
                </div>
              </div>
            )}
          </Card.Body>
        </Card>
      )}
      
      <div className="d-flex justify-content-between mt-3">
        <Link to="/scenario2/worksheet2" className="btn btn-secondary">Previous: Craft Hunt Hypothesis</Link>
        <Link to="/scenario2/worksheet4" className="btn btn-primary">Next: Perform Hunting</Link>
      </div>
    </Container>
  );
};

export default Worksheet9;
