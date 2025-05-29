import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useWorkshop } from '../context/WorkshopContext';
import MalwareAnalysisHeader from '../components/MalwareAnalysisHeader';
import axios from 'axios';

const Worksheet2 = () => {
  // useWorkshop hook - progress tracking removed
  const { } = useWorkshop();

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
            
            // Process the response
            if (pollResponse.data && pollResponse.data.status === 'COMPLETED') {
              // Processing complete, update state
              setApiResponse(pollResponse.data);
              setIsLoading(false);
              
              // Extract any additional data
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
              
              // Add a processing step for completion
              setCurrentStep('Detection rules generated successfully!');
              setProcessingSteps(prev => [...prev, 'Detection rules generated successfully!']);
              
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
              // Error occurred
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
      } else {
        // No message ID, handle the response directly
        setApiResponse(response.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error in handleUseAI:', error);
      setError('There was an error connecting to the API. Please try again later.');
      setIsLoading(false);
    }
  };
  
  // Update progress when YARA rule content or security content changes
  useEffect(() => {
    // Progress tracking removed
  }, [securityContent, yaraRule]);

  return (
    <Container className="my-4">
      <h1 className="mb-4">Worksheet 2: Detection Rules</h1>
      
      <MalwareAnalysisHeader />
      
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
              <div className="p-4">
                <div className="text-center mb-4">
                  <h5>Generating Detection Rules...</h5>
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
        <Link to="/scenario1/worksheet1" className="btn btn-secondary">Previous: Analysis</Link>
        <Link to="/scenario1/worksheet3" className="btn btn-primary">Next: Automated Response</Link>
      </div>
    </Container>
  );
};

export default Worksheet2;
