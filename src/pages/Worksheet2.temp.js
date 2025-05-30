import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useWorkshop } from '../context/WorkshopContext';
import ScenarioNavigation from '../components/ScenarioNavigation';
import axios from 'axios';

const Worksheet2 = () => {
  const { 
    worksheetProgress,
    setWorksheetProgress
  } = useWorkshop();

  // State for user input
  const [securityContent, setSecurityContent] = useState('');
  const [yaraRule, setYaraRule] = useState('');
  
  // State for rule type selection
  const [selectedRuleTypes, setSelectedRuleTypes] = useState({
    YARA: true,
    SIGMA: false,
    SNORT: false,
    SURICATA: false
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
  
  // Function to handle rule type selection
  const handleRuleTypeChange = (ruleType) => {
    setSelectedRuleTypes({
      ...selectedRuleTypes,
      [ruleType]: !selectedRuleTypes[ruleType]
    });
  };
  
  // Function to handle the "Use AI" button click
  const handleUseAI = async (e) => {
    e.preventDefault();
    
    // Validate input
    if (!securityContent.trim()) {
      setError('Please enter security content to generate detection rules.');
      return;
    }
    
    // Check if at least one rule type is selected
    if (!Object.values(selectedRuleTypes).some(Boolean)) {
      setError('Please select at least one rule type.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setApiResponse(null);
    setViewMode('output');
    
    try {
      // Get selected rule types as a comma-separated string
      const selectedTypes = Object.keys(selectedRuleTypes).filter(key => selectedRuleTypes[key]);
      
      // Log the submission
      console.log('Submitting content to API Gateway...');
      console.log('Security Content:', securityContent);
      console.log('Selected Rule Types:', selectedTypes);
      
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
        let pollCount = 0;
        let maxPolls = 20; // Maximum number of polling attempts
        let pollInterval = 3000; // Initial polling interval (3 seconds)
        
        const pollForResults = async () => {
          if (pollCount >= maxPolls) {
            setError('Polling timeout. Please try again later.');
            setIsLoading(false);
            return;
          }
          
          try {
            pollCount++;
            console.log(`Polling attempt ${pollCount}...`);
            
            const pollEndpoint = 'https://r90guxvefb.execute-api.us-east-2.amazonaws.com/v1/poll';
            const pollResponse = await axios.get(pollEndpoint, {
              params: { messageId }
            });
            
            console.log('Poll response:', pollResponse.data);
            
            // Process the response
            if (pollResponse.data.rules && pollResponse.data.rules.length > 0) {
              // We have rules, update the UI
              setApiResponse(pollResponse.data);
              setIsLoading(false);
              
              // Update progress
              setWorksheetProgress({
                ...worksheetProgress,
                worksheet2: 100
              });
              
              return; // Stop polling
            } else if (pollResponse.data.status === 'PROCESSING') {
              // Still processing, update UI with current step if available
              if (pollResponse.data.currentStep) {
                setCurrentStep(pollResponse.data.currentStep);
                setProcessingSteps(prev => {
                  if (!prev.includes(pollResponse.data.currentStep)) {
                    return [...prev, pollResponse.data.currentStep];
                  }
                  return prev;
                });
              }
              
              // Continue polling with increasing interval
              setTimeout(pollForResults, pollInterval);
              pollInterval = Math.min(pollInterval * 1.5, 10000); // Increase interval up to 10 seconds
            } else {
              // Unknown status or error
              setError('Unexpected response from server. Please try again.');
              setIsLoading(false);
            }
          } catch (error) {
            console.error('Error polling for results:', error);
            setError('Error polling for results. Please try again later.');
            setIsLoading(false);
          }
        };
        
        // Start the polling process
        setTimeout(pollForResults, 1000);
      } else {
        // No message ID, handle the response directly
        setApiResponse(response.data);
        setIsLoading(false);
        
        // Update progress
        if (response.data && response.data.rules && response.data.rules.length > 0) {
          setWorksheetProgress({
            ...worksheetProgress,
            worksheet2: 100
          });
        }
      }
    } catch (error) {
      console.error('Error in handleUseAI:', error);
      setError('There was an error connecting to the API. Please try again later.');
      setIsLoading(false);
    }
  };
  
  // Update progress when YARA rule content or security content changes
  useEffect(() => {
    let progress = 0;
    
    // Calculate progress based on content
    if (securityContent.length > 10) progress += 50;
    if (yaraRule.length > 10) progress += 50;
    
    // Update progress in context
    if (progress !== worksheetProgress.worksheet2) {
      setWorksheetProgress({
        ...worksheetProgress,
        worksheet2: progress
      });
    }
  }, [securityContent, yaraRule, worksheetProgress, setWorksheetProgress]);

  return (
    <Container className="my-4">
      <ScenarioNavigation />
      
      <h1 className="mb-4">Worksheet 2: Detection Rules</h1>
      
      {viewMode === 'input' ? (
        <Card className="mb-4">
          <Card.Header>
            <h4>Worksheet 2: Detection Rule Generation</h4>
          </Card.Header>
          <Card.Body>
            <div className="mb-4">
              <h5>Overview</h5>
              <p>In this worksheet, you'll learn how to generate detection rules from security content using AI. Enter security information about a threat, and the system will generate appropriate detection rules.</p>
            </div>
            
            <Form onSubmit={handleUseAI}>
              <Form.Group className="mb-3">
                <Form.Label>Security Content</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={6}
                  value={securityContent}
                  onChange={(e) => setSecurityContent(e.target.value)}
                  placeholder="Enter security content, threat information, or malware details here..."
                />
                <Form.Text className="text-muted">
                  The more detailed information you provide, the better the detection rules will be.
                </Form.Text>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Rule Types</Form.Label>
                <div>
                  {Object.keys(selectedRuleTypes).map(ruleType => (
                    <Form.Check
                      key={ruleType}
                      inline
                      type="checkbox"
                      id={`rule-type-${ruleType}`}
                      label={ruleType}
                      checked={selectedRuleTypes[ruleType]}
                      onChange={() => handleRuleTypeChange(ruleType)}
                    />
                  ))}
                </div>
                <Form.Text className="text-muted">
                  Select the types of detection rules you want to generate.
                </Form.Text>
              </Form.Group>
              
              {error && (
                <Alert variant="danger" className="mt-3">
                  {error}
                </Alert>
              )}
              
              <div className="d-flex justify-content-end">
                <button type="submit" className="btn btn-primary">
                  Use AI to Generate Rules
                </button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      ) : (
        <Card className="mb-4">
          <Card.Header>
            <h4>Detection Rules Output</h4>
          </Card.Header>
          <Card.Body>
            {isLoading ? (
              <div className="text-center my-5">
                <Spinner animation="border" role="status" variant="primary">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p className="mt-3">Generating detection rules...</p>
                
                {currentStep && (
                  <div className="mt-3">
                    <p className="mb-2">Current step: {currentStep}</p>
                    <div className="progress mb-3">
                      <div 
                        className="progress-bar" 
                        role="progressbar" 
                        style={{ width: `${(pollCount / 20) * 100}%` }}
                        aria-valuenow={pollCount * 5} 
                        aria-valuemin="0" 
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>
                )}
                
                {processingSteps.length > 0 && (
                  <div className="mt-3 text-start">
                    <h6>Processing Steps:</h6>
                    <ul className="list-group">
                      {processingSteps.map((step, index) => (
                        <li key={index} className="list-group-item">
                          {step}
                        </li>
                      ))}
                    </ul>
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
                
                {/* Display rules as they are received from the API */}
                {apiResponse && apiResponse.rules && apiResponse.rules.length > 0 && (
                  <div className="mb-3">
                    <h6>Generated Rules:</h6>
                    {apiResponse.rules.map((rule, index) => {
                      // Extract rule content and type
                      const ruleContent = typeof rule === 'string' ? rule : 
                                        rule.rule_content ? rule.rule_content : 
                                        rule.rule ? rule.rule : 
                                        JSON.stringify(rule, null, 2);
                      
                      const ruleType = rule.rule_type || 'YARA';
                      
                      return (
                        <div key={index} className="mb-3">
                          <h6>{ruleType} Rule {index + 1}</h6>
                          <pre className="bg-light p-3 rounded" style={{ 
                            whiteSpace: 'pre', 
                            overflow: 'auto', 
                            maxHeight: '300px', 
                            margin: 0,
                            fontFamily: 'monospace',
                            fontSize: '14px',
                            padding: '15px',
                            backgroundColor: '#f8f9fa',
                            border: '1px solid #eaecef',
                            borderRadius: '6px'
                          }}>
                            <code>{ruleContent}</code>
                          </pre>
                        </div>
                      );
                    })}
                  </div>
                )}
                
                <div className="d-flex justify-content-end">
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => setViewMode('input')}
                  >
                    Back to Input
                  </button>
                </div>
              </div>
            )}
          </Card.Body>
        </Card>
      )}
      
      <div className="d-flex justify-content-between mt-3">
        <Link to="/worksheet-1" className="btn btn-secondary">Previous: Analysis</Link>
        <Link to="/worksheet-3" className="btn btn-primary">Next: Automated Response</Link>
      </div>
    </Container>
  );
};

export default Worksheet2;
