import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Spinner, Alert, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useWorkshop } from '../context/WorkshopContext';
import axios from 'axios';

const Worksheet7 = () => {
  // useWorkshop hook - progress tracking removed
  const { } = useWorkshop();

  // State for user input
  const [industryType, setIndustryType] = useState('');
  const [customIndustry, setCustomIndustry] = useState('');
  const [ttpsData, setTtpsData] = useState(null);
  
  // State for API response handling
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // State for processing steps
  const [currentStep, setCurrentStep] = useState('');
  const [processingSteps, setProcessingSteps] = useState([]);
  
  // Industry options with exact keys needed for the API request
  const industryOptions = [
    'finance',
    'healthcare',
    'manufacturing',
    'retail',
    'energy',
    'transportation'
  ];

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate input
    if (industryType === 'Other' && !customIndustry.trim()) {
      setError('Please specify your industry');
      return;
    }
    
    if (industryType === '' && !customIndustry.trim()) {
      setError('Please select an industry');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Determine which industry to use
      const selectedIndustry = industryType === 'Other' ? customIndustry : industryType;
      
      // Use the correct API endpoint as provided
      const apiEndpoint = `https://cwsotaf35h.execute-api.us-east-2.amazonaws.com/v1/scenario-2/worksheet1?industry=${selectedIndustry}`;
      
      // Log the exact URL being used
      console.log('API URL:', apiEndpoint);
      
      console.log(`Making API request to: ${apiEndpoint}`);
      
      // Make the actual API call
      const response = await axios.get(apiEndpoint);
      console.log('API Response:', response.data);
      
      // Add a delay with processing steps for better user experience
      console.log('Processing response with steps...');
      
      // Create an array of processing steps to show with longer delays
      const processingSteps = [
        'Analyzing industry-specific threat data...',
        'Identifying common TTPs for selected sector...',
        'Correlating with known threat actors...',
        'Prioritizing results by prevalence...',
        'Generating final report...'
      ];
      
      // Show each processing step with a longer delay (total 12-15 seconds)
      setCurrentStep(processingSteps[0]);
      setProcessingSteps([processingSteps[0]]);
      await new Promise(resolve => setTimeout(resolve, 3000)); // 3 seconds for first step
      
      // Middle steps with varying delays to appear more realistic
      setCurrentStep(processingSteps[1]);
      setProcessingSteps(prev => [...prev, processingSteps[1]]);
      await new Promise(resolve => setTimeout(resolve, 2500)); // 2.5 seconds
      
      setCurrentStep(processingSteps[2]);
      setProcessingSteps(prev => [...prev, processingSteps[2]]);
      await new Promise(resolve => setTimeout(resolve, 3500)); // 3.5 seconds
      
      setCurrentStep(processingSteps[3]);
      setProcessingSteps(prev => [...prev, processingSteps[3]]);
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 seconds
      
      // Final step with a slightly longer delay
      setCurrentStep(processingSteps[4]);
      setProcessingSteps(prev => [...prev, processingSteps[4]]);
      await new Promise(resolve => setTimeout(resolve, 3000)); // 3 seconds for final step
      
      // Process the response data
      const apiResponseData = response.data;
      
      // Transform the API response to match our expected format
      const formattedData = {
        industry: selectedIndustry,
        ttps: []
      };
      
      // Check if we have the expected data structure
      if (apiResponseData && Array.isArray(apiResponseData)) {
        // Map the API response to our expected format
        formattedData.ttps = apiResponseData.map(item => {
          return {
            id: item["MITRE ATK Tactic"] || '',
            name: item["Attack Phase"] || '',
            description: item["Description/Examples"] || '',
            prevalence: item["Common Techniques (Technique ID)"] ? 'High' : 'Medium',
            mitreTactic: item["Attack Phase"] || '',
            commonActors: item["Common Techniques (Technique ID)"] ? 
              item["Common Techniques (Technique ID)"].split(',').map(t => t.trim()) : []
          };
        });
      }
      
      setTtpsData(formattedData);
      setIsLoading(false);
      setSuccess(true);
      
    } catch (error) {
      console.error('Error fetching TTPs:', error);
      setError('There was an error retrieving TTPs for your industry. Please try again later.');
      setIsLoading(false);
    }
  };

  // Function to handle industry selection
  const handleIndustryChange = (e) => {
    setIndustryType(e.target.value);
    if (e.target.value !== 'Other') {
      setCustomIndustry('');
    }
  };

  return (
    <Container className="my-4">
      <h1 className="mb-4">Worksheet 1: Identify Sector-Specific TTPs</h1>
      
      <Card className="mb-4">
        <Card.Header>
          <h4>Step 1: Identify Sector-Specific TTPs</h4>
        </Card.Header>
        <Card.Body>
          <div className="mb-4">
            <h5>Overview</h5>
            <p>
              In this worksheet, you'll identify the top Tactics, Techniques, and Procedures (TTPs) 
              that are commonly used to target your industry sector. This intelligence will form the 
              foundation for your threat hunting activities.
            </p>
          </div>
          
          {!ttpsData ? (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Select Your Industry</Form.Label>
                <Form.Select
                  id="industryType"
                  value={industryType}
                  onChange={handleIndustryChange}
                  className="mb-3"
                  required
                >
                  <option value="">Select Industry</option>
                  {industryOptions.map((industry, index) => (
                    <option key={index} value={industry}>
                      {industry.charAt(0).toUpperCase() + industry.slice(1)}
                    </option>
                  ))}
                  <option value="Other">Other</option>
                </Form.Select>
              </Form.Group>
              
              {industryType === 'Other' && (
                <Form.Group className="mb-3">
                  <Form.Label>Specify Your Industry</Form.Label>
                  <Form.Control
                    type="text"
                    value={customIndustry}
                    onChange={(e) => setCustomIndustry(e.target.value)}
                    placeholder="Enter your industry..."
                  />
                </Form.Group>
              )}
              
              {error && (
                <Alert variant="danger" className="mt-3">
                  {error}
                </Alert>
              )}
              
              {isLoading && processingSteps.length > 0 && (
                <div className="mt-3 mb-3">
                  <h6>Processing:</h6>
                  <ul className="list-group">
                    {processingSteps.map((step, index) => (
                      <li key={index} className="list-group-item">
                        {index === processingSteps.length - 1 ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                              className="me-2"
                            />
                            {step}
                          </>
                        ) : (
                          <>
                            <span className="text-success me-2">✓</span>
                            {step}
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="d-flex justify-content-end">
                <Button 
                  type="submit" 
                  variant="primary"
                  disabled={isLoading}
                >
                  {isLoading && processingSteps.length === 0 ? (
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
                  ) : (
                    'Use AI'
                  )}
                </Button>
              </div>
            </Form>
          ) : (
            <div>
              <Alert variant="success" className="mb-4">
                <Alert.Heading>TTPs Retrieved Successfully</Alert.Heading>
                <p>
                  We've identified the top TTPs targeting the {ttpsData.industry} industry.
                  These TTPs can be used to develop hunting hypotheses in the next step.
                </p>
              </Alert>
              
              <h5 className="mb-3">Top TTPs Targeting {ttpsData.industry}</h5>
              
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Prevalence</th>
                    <th>MITRE Tactic</th>
                    <th>Common Actors</th>
                  </tr>
                </thead>
                <tbody>
                  {ttpsData.ttps.map((ttp, index) => (
                    <tr key={index}>
                      <td>{ttp.id}</td>
                      <td>{ttp.name}</td>
                      <td>{ttp.description}</td>
                      <td>
                        <span className={`badge bg-${ttp.prevalence === 'High' ? 'danger' : ttp.prevalence === 'Medium' ? 'warning' : 'info'}`}>
                          {ttp.prevalence}
                        </span>
                      </td>
                      <td>{ttp.mitreTactic}</td>
                      <td>{ttp.commonActors.join(', ')}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              
              <div className="d-flex justify-content-end mt-4">
                <Button 
                  variant="secondary" 
                  onClick={() => {
                    setTtpsData(null);
                    setSuccess(false);
                  }}
                  className="me-2"
                >
                  Reset
                </Button>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>
      
      <div className="d-flex justify-content-between mt-3">
        <Link to="/" className="btn btn-secondary">Back to Home</Link>
        <Link to="/scenario2/worksheet2" className="btn btn-primary">Next: Craft Hunt Hypothesis</Link>
      </div>
    </Container>
  );
};

export default Worksheet7;
