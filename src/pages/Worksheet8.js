import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Spinner, Alert, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useWorkshop } from '../context/WorkshopContext';
import axios from 'axios';

const Worksheet8 = () => {
  // useWorkshop hook - progress tracking removed
  const { } = useWorkshop();

  // State for user input
  const [selectedTtp, setSelectedTtp] = useState('');
  const [hypothesisStatement, setHypothesisStatement] = useState('');
  const [savedHypotheses, setSavedHypotheses] = useState([]);
  
  // State for API response handling
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [aiSuggestion, setAiSuggestion] = useState('');
  
  // Mock TTP options based on previous worksheet
  const ttpOptions = [
    { id: 'T1566', name: 'Phishing', tactic: 'Initial Access' },
    { id: 'T1486', name: 'Data Encrypted for Impact', tactic: 'Impact' },
    { id: 'T1059.001', name: 'PowerShell', tactic: 'Execution' },
    { id: 'T1053.005', name: 'Scheduled Task', tactic: 'Persistence' },
    { id: 'T1027', name: 'Obfuscated Files or Information', tactic: 'Defense Evasion' }
  ];

  // Function to generate AI suggestion
  const generateAiSuggestion = async () => {
    if (!selectedTtp) {
      setError('Please select a TTP first');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Find the selected TTP details
      const ttp = ttpOptions.find(t => t.id === selectedTtp);
      
      // Mock API call - in a real implementation, this would call an AI service
      setTimeout(() => {
        // Generate different suggestions based on the selected TTP
        let suggestion = '';
        
        switch(selectedTtp) {
          case 'T1566':
            suggestion = `Adversaries may be using phishing emails with malicious attachments to target our organization. We should look for unusual email attachments, especially Office documents with macros, and suspicious link patterns that lead to credential harvesting sites.`;
            break;
          case 'T1486':
            suggestion = `Adversaries may be attempting to encrypt our data for ransomware attacks. We should hunt for suspicious encryption activities, especially processes that rapidly access and modify many files across network shares.`;
            break;
          case 'T1059.001':
            suggestion = `Adversaries may be using PowerShell for execution of malicious code. We should hunt for unusual PowerShell command lines, especially those with encoded commands, execution policy bypasses, or connections to external domains.`;
            break;
          case 'T1053.005':
            suggestion = `Adversaries may be creating scheduled tasks for persistence. We should hunt for newly created scheduled tasks, especially those with unusual command lines, running as SYSTEM, or connecting to external IPs.`;
            break;
          case 'T1027':
            suggestion = `Adversaries may be using obfuscation techniques to hide their malicious code. We should hunt for signs of obfuscated files or scripts, especially those with unusual entropy levels, base64 encoded content, or string manipulation techniques.`;
            break;
          default:
            suggestion = `Based on the selected TTP (${ttp.id}: ${ttp.name}), we should look for unusual activities related to ${ttp.tactic} tactics that might indicate adversary presence.`;
        }
        
        setAiSuggestion(suggestion);
        setIsLoading(false);
      }, 1500);
      
    } catch (error) {
      console.error('Error generating suggestion:', error);
      setError('There was an error generating a hypothesis suggestion. Please try again later.');
      setIsLoading(false);
    }
  };

  // Function to save hypothesis
  const saveHypothesis = () => {
    if (!hypothesisStatement.trim()) {
      setError('Please enter a hypothesis statement');
      return;
    }
    
    if (!selectedTtp) {
      setError('Please select a TTP');
      return;
    }
    
    // Find the selected TTP details
    const ttp = ttpOptions.find(t => t.id === selectedTtp);
    
    // Create new hypothesis object
    const newHypothesis = {
      id: Date.now(),
      ttpId: selectedTtp,
      ttpName: ttp.name,
      statement: hypothesisStatement,
      dateCreated: new Date().toISOString()
    };
    
    // Add to saved hypotheses
    setSavedHypotheses([...savedHypotheses, newHypothesis]);
    
    // Clear form
    setHypothesisStatement('');
    setAiSuggestion('');
    setError(null);
    
    // Progress tracking removed
  };

  // Function to delete a hypothesis
  const deleteHypothesis = (id) => {
    setSavedHypotheses(savedHypotheses.filter(h => h.id !== id));
    
    // Progress tracking removed
  };

  // Progress tracking removed

  return (
    <Container className="my-4">
      <h1 className="mb-4">Worksheet 2: Craft Hunt Hypothesis</h1>
      
      <Card className="mb-4">
        <Card.Header>
          <h4>Step 2: Craft Hunt Hypothesis</h4>
        </Card.Header>
        <Card.Body>
          <div className="mb-4">
            <h5>Overview</h5>
            <p>
              In this worksheet, you'll develop testable hunting hypotheses based on the TTPs 
              identified in the previous step. A good hypothesis should be specific, measurable, 
              and focused on potential adversary behaviors in your environment.
            </p>
          </div>
          
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Select a TTP to Focus On</Form.Label>
              <Form.Select 
                value={selectedTtp}
                onChange={(e) => setSelectedTtp(e.target.value)}
                aria-label="Select TTP"
              >
                <option value="">Select a TTP...</option>
                {ttpOptions.map((ttp) => (
                  <option key={ttp.id} value={ttp.id}>
                    {ttp.id}: {ttp.name} ({ttp.tactic})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            
            <div className="d-flex justify-content-end mb-4">
              <Button 
                variant="outline-primary"
                onClick={generateAiSuggestion}
                disabled={isLoading || !selectedTtp}
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
                    Generating...
                  </>
                ) : (
                  'Get AI Suggestion'
                )}
              </Button>
            </div>
            
            {aiSuggestion && (
              <Alert variant="info" className="mb-4">
                <Alert.Heading>AI-Generated Hypothesis Suggestion</Alert.Heading>
                <p>{aiSuggestion}</p>
              </Alert>
            )}
            
            <Form.Group className="mb-3">
              <Form.Label>Hypothesis Statement</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={hypothesisStatement}
                onChange={(e) => setHypothesisStatement(e.target.value)}
                placeholder="Write your hunting hypothesis here..."
              />
              <Form.Text className="text-muted">
                A good hypothesis should be specific and testable. Example: "Adversaries are using PowerShell with encoded commands to execute malicious code and establish persistence."
              </Form.Text>
            </Form.Group>
            
            {error && (
              <Alert variant="danger" className="mt-3">
                {error}
              </Alert>
            )}
            
            <div className="d-flex justify-content-end">
              <Button 
                variant="primary"
                onClick={saveHypothesis}
              >
                Save Hypothesis
              </Button>
            </div>
          </Form>
          
          {savedHypotheses.length > 0 && (
            <div className="mt-5">
              <h5 className="mb-3">Saved Hypotheses</h5>
              <ListGroup>
                {savedHypotheses.map((hypothesis) => (
                  <ListGroup.Item key={hypothesis.id} className="mb-2">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <div className="mb-1">
                          <span className="badge bg-primary me-2">{hypothesis.ttpId}</span>
                          <strong>{hypothesis.ttpName}</strong>
                        </div>
                        <p className="mb-1">{hypothesis.statement}</p>
                        <small className="text-muted">
                          Created: {new Date(hypothesis.dateCreated).toLocaleString()}
                        </small>
                      </div>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => deleteHypothesis(hypothesis.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          )}
        </Card.Body>
      </Card>
      
      <div className="d-flex justify-content-between mt-3">
        <Link to="/scenario2/worksheet1" className="btn btn-secondary">Previous: Identify Sector-Specific TTPs</Link>
        <Link to="/scenario2/worksheet3" className="btn btn-primary">Next: Translate to Queries</Link>
      </div>
    </Container>
  );
};

export default Worksheet8;
