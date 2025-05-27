import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useWorkshop } from '../context/WorkshopContext';
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
  const [isPolling, setIsPolling] = useState(false);
  const [messageId, setMessageId] = useState(null);
  const [pollCount, setPollCount] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [processingSteps, setProcessingSteps] = useState([]);
  
  // State for raw response data display
  const [pollResponses, setPollResponses] = useState([]);
  const [extractedData, setExtractedData] = useState(null);
  const [researchQuery, setResearchQuery] = useState('');
  const [researchReport, setResearchReport] = useState(null);
  const [extractedResearchData, setExtractedResearchData] = useState(null);
  const [collectedRules, setCollectedRules] = useState([]);
  
  // State for view mode (input or output)
  const [viewMode, setViewMode] = useState('input');
  
  // Helper function to create a delay
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  // Function to make a single poll request
  const makePollRequest = async (msgId) => {
    const pollEndpoint = 'https://r90guxvefb.execute-api.us-east-2.amazonaws.com/v1/poll';
    
    try {
      // Log the request being made (similar to what's shown in the screenshot)
      console.log(`Polling for results with messageId: ${msgId}, attempt ${pollCount + 1}`);
      
      const response = await axios.get(pollEndpoint, {
        params: { messageId: msgId }
      });
      
      // Log the response as seen in the TDL creator frontend
      console.log('Poll response:', response.data);
      
      // Store the poll response for display
      setPollResponses(prev => [...prev, response.data]);
      
      // Check for the "Still processing, continuing to poll..." scenario
      if (response.data.status === 'PROCESSING' || 
          (response.data.currentStep && 
           response.data.currentStep !== 'research_started')) {
        console.log('Still processing, continuing to poll...');
      }
      
      // Extract data if available
      if (response.data.extractedData) {
        setExtractedData(response.data.extractedData);
      }
      
      // Store research query if available
      if (response.data.researchQuery) {
        setResearchQuery(response.data.researchQuery);
      }
      
      // Store research report if available
      if (response.data.researchResults) {
        setResearchReport(response.data.researchResults);
      }
      
      // Store extracted research data if available
      if (response.data.extractedResearchData) {
        setExtractedResearchData(response.data.extractedResearchData);
      }
      
      // Check for rules in the response - these are the actual rules we want to display
      if (response.data.rules && response.data.rules.length > 0) {
        console.log('Found rules in poll response:', response.data.rules);
        
        // Simply update the API response with the rules from this response
        setApiResponse(prevResponse => {
          // If we don't have a previous response, create a new one
          if (!prevResponse) {
            return {
              status: 'PROCESSING',
              rules: response.data.rules
            };
          }
          
          // Otherwise, replace the rules with the new ones
          return {
            ...prevResponse,
            rules: response.data.rules
          };
        });
      }
      
      // Check for rule decisions in the response - just log them, don't display
      if (response.data.ruleDecisions && response.data.ruleDecisions.length > 0) {
        console.log('Found rule decisions in poll response:', response.data.ruleDecisions);
        // Don't display rule decisions, they're just indicators
      }
      
      return response.data;
    } catch (error) {
      console.error('Error during polling:', error);
      return null;
    }
  };
  
  // Function to poll for results
  const pollForResults = async (msgId) => {
    // Set up polling state
    setIsPolling(true);
    setMessageId(msgId);
    setPollCount(0);
    setProcessingSteps([]);
    setPollResponses([]);
    setCollectedRules([]);
    
    // Set initial current step
    setCurrentStep('Starting polling...');
    
    let maxPolls = 30; // Maximum number of polling attempts
    let pollInterval = 3000; // Polling interval in ms
    let currentPoll = 0;
    let timeoutId = null;
    
    // Function to perform a single poll cycle
    const pollCycle = async () => {
      currentPoll++;
      setPollCount(currentPoll);
      
      try {
        // Make the poll request
        const data = await makePollRequest(msgId);
        
        if (data) {
          // Update current step if available
          if (data.currentStep) {
            setCurrentStep(data.currentStep);
            
            // Add to processing steps if not already there
            setProcessingSteps(prev => {
              if (!prev.includes(data.currentStep)) {
                return [...prev, data.currentStep];
              }
              return prev;
            });
          }
          
          // Process the response and update UI
          const isDone = processResponseAndUpdateUI(data);
          
          // If polling is complete, stop
          if (isDone) {
            console.log('Polling complete after', currentPoll, 'attempts');
            setIsPolling(false);
            setIsLoading(false);
            return;
          }
        }
        
        // Check if we've reached the maximum number of polls
        if (currentPoll >= maxPolls) {
          console.log('Reached maximum number of polls:', maxPolls);
          setIsPolling(false);
          setIsLoading(false);
          return;
        }
        
        // Schedule the next poll
        timeoutId = setTimeout(pollCycle, pollInterval);
      } catch (error) {
        console.error('Error during poll cycle:', error);
        // setCurrentStep(`Error during polling attempt ${currentPoll}, retrying...`);
        
        // Continue polling despite errors
        timeoutId = setTimeout(pollCycle, pollInterval);
      }
    };
    
    // Process response and update UI immediately with any new rules
    const processResponseAndUpdateUI = (data) => {
      // Handle case where data might be directly in the response
      if (!data) return false;
      
      // Check for rule decisions directly in the data - just log them, don't display
      if (data.ruleDecisions && data.ruleDecisions.length > 0) {
        console.log('Found rule decisions in processResponseAndUpdateUI:', data.ruleDecisions);
        // Don't display rule decisions, they're just indicators
      }
      
      // Handle rules in the data
      if (data.rules && data.rules.length > 0) {
        // Standard format with rules array
        // Add new rules to our collection if they don't already exist
        const newRules = data.rules.filter(newRule => 
          !collectedRules.some(existingRule => 
            JSON.stringify(existingRule) === JSON.stringify(newRule)
          )
        );
        
        if (newRules.length > 0) {
          // Update our collection with the new rules
          const updatedRules = [...collectedRules, ...newRules];
          setCollectedRules(updatedRules);
          
          // Update the UI immediately with the new rules
          setApiResponse({
            ...data,
            rules: updatedRules
          });
          
          // Set the first YARA rule if available
          const yaraRule = newRules.find(r => r.rule_type === 'YARA');
          if (yaraRule) {
            setYaraRule(yaraRule.rule_content || yaraRule.rule || '');
          }
        }
        
        // Only stop polling if we have a COMPLETED status
        if (data.status === 'COMPLETED') {
          return true; // Polling complete
        }
        return false; // Continue polling
      } else if (data.rule) {
        // Format with a single rule
        setYaraRule(data.rule);
        setApiResponse(data);
        
        // Only stop polling if we have a COMPLETED status
        if (data.status === 'COMPLETED') {
          return true; // Polling complete
        }
        return false; // Continue polling
      } else {
        // If we don't have rules in the expected format, just show what we got
        // Don't generate a sample rule
        setApiResponse(data);
        
        // Continue polling instead of showing a sample rule
        return false; // Indicate polling should continue
      }
      
      // If we've reached here, continue polling
      return false;
    };
    
    // Start the first poll cycle
    pollCycle();
    
    // Clean up on unmount
    return () => {
      clearTimeout(timeoutId);
    };
  };

  // Helper function to generate a sample YARA rule based on user input and malware name
  const generateSampleRule = (content, malwareName = '') => {
    // Extract potential keywords from the content
    const keywords = content.split(/\\s+/)
      .filter(word => word.length > 4)
      .filter(word => !['and', 'the', 'that', 'with', 'from', 'this', 'these', 'those', 'they', 'their'].includes(word.toLowerCase()))
      .slice(0, 5);
    
    // Get current date for the rule
    const date = new Date().toISOString().split('T')[0];
    
    // Generate a rule name based on malware name or default
    const ruleName = malwareName ? 
      `${malwareName.replace(/[^a-zA-Z0-9]/g, '_')}_Detection` : 
      'Demo_Detection_Rule';
    
    return `rule ${ruleName} {
meta:
    author = "Threat Intel Workshop"
    description = "Demo rule generated from user content"
    date = "${date}"
    reference = "https://example.com/threat-intel"
    
strings:
    $str1 = "${keywords[0] || 'malware'}" nocase
    $str2 = "${keywords[1] || 'threat'}" nocase
    $str3 = "${keywords[2] || 'attack'}" nocase
    
    // Binary pattern example
    $hex1 = { 4D 5A 90 00 03 00 00 00 }
    
condition:
    uint16(0) == 0x5A4D and // PE file check
    filesize < 1MB and
    (2 of ($str*) or $hex1)
}`;
  };

  // Function to handle the "Use AI" button click
  const handleUseAI = async (e) => {
    e.preventDefault();
    
    if (!securityContent.trim()) {
      setError('Please enter security content to generate detection rules.');
      return;
    }
    
    // Check if at least one rule type is selected
    const selectedTypes = Object.keys(selectedRuleTypes).filter(type => selectedRuleTypes[type]);
    if (selectedTypes.length === 0) {
      setError('Please select at least one rule type.');
      return;
    }
    
    // Reset all states and switch to output view
    setIsLoading(true);
    setError(null);
    setApiResponse(null);
    setYaraRule('');
    setPollResponses([]);
    setExtractedData(null);
    setResearchQuery('');
    setResearchReport(null);
    setExtractedResearchData(null);
    setCollectedRules([]);
    setProcessingSteps([]);
    setCurrentStep('');
    
    // Clear any stored rule contents
    window.ruleContentsSet = new Set();
    
    setViewMode('output');
    
    try {
      // Log the submission (as seen in the screenshot)
      console.log('Submitting content directly to API Gateway...');
      
      // Make the initial API call to request rule generation
      const apiEndpoint = 'https://r90guxvefb.execute-api.us-east-2.amazonaws.com/v1/detection-rules';
      
      const response = await axios.post(apiEndpoint, {
        security_content: securityContent,
        user_rule_preference: selectedTypes.join(',')
      });
      
      // Log the response as seen in the TDL creator frontend
      console.log('API response received:', response.data);
      console.log('Response data:', response.data);
      
      console.log('Initial API response:', response.data);
      
      // Check response format and handle accordingly
      if (response.data.messageSent === true && response.data.messageId) {
        // Asynchronous processing - we got a messageId for polling
        const messageId = response.data.messageId;
        console.log(`Request accepted with message ID: ${messageId}`);
        
        // Start polling for results
        console.log(`Starting to poll for results with message ID: ${messageId}`);
        
        // Use the polling function to get updates
        pollForResults(messageId);
      } else if (response.data.rule || (response.data.rules && response.data.rules.length > 0)) {
        // Immediate response with rule(s)
        setApiResponse(response.data);
        
        if (response.data.rule) {
          setYaraRule(response.data.rule);
        } else if (response.data.rules) {
          const yaraRule = response.data.rules.find(r => r.rule_type === 'YARA');
          if (yaraRule) {
            setYaraRule(yaraRule.rule_content || yaraRule.rule || '');
          }
        }
        
        setIsLoading(false);
      } else {
        // Unexpected response format
        throw new Error('Unexpected API response format');
      }
    } catch (error) {
      console.error('Error in initial request:', error);
      
      // Show the error and allow the user to try again
      setError('Error connecting to the rule generation service: ' + 
              (error.response?.data?.message || error.message));
      setIsLoading(false);
      setViewMode('input'); // Return to input view to let the user try again
    }
  };
  
  // Update progress when YARA rule content or security content changes
  useEffect(() => {
    let progress = 0;
    
    // Calculate progress based on content
    if (securityContent.length > 10) progress += 50;
    if (yaraRule.length > 50) progress += 50;
    
    // Only update if progress has changed
    if (worksheetProgress.worksheet2 !== progress) {
      setWorksheetProgress({
        ...worksheetProgress,
        worksheet2: progress
      });
    }
  }, [securityContent, yaraRule, worksheetProgress, setWorksheetProgress]);
  
  // Function to handle rule type selection
  const handleRuleTypeChange = (ruleType) => {
    setSelectedRuleTypes({
      ...selectedRuleTypes,
      [ruleType]: !selectedRuleTypes[ruleType]
    });
  };
  
  return (
    <Container className="my-4">
      {viewMode === 'input' ? (
        <Card className="mb-4">
          <Card.Header className="bg-primary text-white">
            <h4>Worksheet 2: Detection Rule Generation</h4>
          </Card.Header>
          <Card.Body>
            <p>
              In this worksheet, you'll learn how to generate detection rules from security content using AI.
              Enter security information about a threat, and the system will generate appropriate detection rules.
            </p>
            
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
          <Card.Header className="bg-primary text-white">
            <h4>Detection Rules Output</h4>
          </Card.Header>
          <Card.Body>
            {isLoading ? (
              <div className="text-center my-5">
                <Spinner animation="border" role="status" variant="primary">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
                <div className="mt-3">
                  <h5>Generating detection rules...</h5>
                  {currentStep && (
                    <p className="text-muted">{currentStep}</p>
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
              </div>
            )}
          </Card.Body>
        </Card>
      )}
      
      <div className="d-flex justify-content-between">
        <Link to="/worksheet-1" className="btn btn-secondary">Previous: Analysis</Link>
        <Link to="/worksheet-3" className="btn btn-primary">Next: Automated Response</Link>
      </div>
    </Container>
  );
};

export default Worksheet2;
