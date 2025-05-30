import React, { useState } from 'react';
import { Container, Card, Form, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useWorkshop } from '../context/WorkshopContext';
import MalwareAnalysisHeader from '../components/MalwareAnalysisHeader';
import axios from 'axios';

const Worksheet4 = () => {
  // useWorkshop hook - progress tracking removed
  const { } = useWorkshop();
  
  const [executiveSummary, setExecutiveSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to handle the "Use AI" button click
  const handleUseAI = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Example prompt for generating an executive summary about Lumma Stealer
      const prompt = `Create a concise executive summary about the Lumma Stealer malware campaign. Include:
      1. Brief overview of the threat
      2. Key findings from analysis
      3. Potential business impact
      4. Recommended actions for leadership
      5. Timeline for remediation`;
      
      // You can use the same API endpoint as in Worksheet2 or a different one
      const response = await axios.post('https://r90guxvefb.execute-api.us-east-2.amazonaws.com/v1/detection-rules', {
        security_content: prompt,
        summary_request: true
      });
      
      // Check if we have a summary in the response
      if (response.data && response.data.summary) {
        setExecutiveSummary(response.data.summary);
      } else if (response.data && response.data.messageSent) {
        // If we got a messageId, we could poll for results
        // For simplicity, we'll just show a placeholder
        setExecutiveSummary('Executive Summary for Lumma Stealer Campaign:\n\n' +
          'Overview:\n' +
          'Lumma Stealer is a sophisticated malware-as-a-service (MaaS) offering that emerged in 2022 as a successor to RedLine Stealer. It is primarily designed to harvest sensitive information from infected systems, including credentials, cryptocurrency wallets, and browser data.\n\n' +
          'Key Findings:\n' +
          '- Lumma Stealer is distributed through phishing emails, malicious advertisements, and compromised software downloads\n' +
          '- The malware employs advanced evasion techniques to avoid detection by security solutions\n' +
          '- Stolen data is exfiltrated to command and control servers controlled by threat actors\n' +
          '- Recent campaigns have targeted financial institutions and e-commerce platforms\n\n' +
          'Business Impact:\n' +
          '- Potential data breaches leading to financial losses and regulatory penalties\n' +
          '- Compromise of customer information damaging brand reputation and trust\n' +
          '- Operational disruption during incident response and remediation efforts\n' +
          '- Possible intellectual property theft if research or proprietary data is compromised\n\n' +
          'Recommended Actions:\n' +
          '1. Implement enhanced email filtering to block phishing attempts\n' +
          '2. Deploy endpoint detection and response (EDR) solutions across all systems\n' +
          '3. Conduct security awareness training focusing on social engineering tactics\n' +
          '4. Enforce multi-factor authentication for all critical systems and applications\n' +
          '5. Review and update incident response plans to address information-stealing malware\n\n' +
          'Timeline for Remediation:\n' +
          '- Immediate (0-48 hours): Deploy emergency patches and implement email filtering rules\n' +
          '- Short-term (1-2 weeks): Complete security awareness training and EDR deployment\n' +
          '- Medium-term (1 month): Implement multi-factor authentication and review security policies\n' +
          '- Long-term (3 months): Conduct tabletop exercises and penetration testing to validate defenses');
      } else {
        throw new Error('Unexpected API response format');
      }
    } catch (error) {
      console.error('Error generating executive summary:', error);
      setError('Failed to generate executive summary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Progress tracking removed
  };

  return (
    <Container className="my-4">
      <h1 className="mb-4">Worksheet 4: Executive Summary</h1>
      
      <MalwareAnalysisHeader />
      
      <Card className="mb-4">
        <Card.Header as="h5">Overview</Card.Header>
        <Card.Body>
          <p>
            In this worksheet, you will create an executive summary of the Lumma Stealer campaign for sharing 
            with senior management and other stakeholders. Your summary should be concise, non-technical, and 
            highlight the key findings, business impact, and recommended actions.
          </p>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Header as="h5">Task: Create an Executive Summary</Card.Header>
        <Card.Body>
          <p>
            Create an executive summary that includes:
          </p>
          <ul>
            <li>Brief overview of the threat (Lumma Stealer)</li>
            <li>Key findings from your analysis</li>
            <li>Potential business impact</li>
            <li>Recommended actions for leadership</li>
            <li>Timeline for remediation</li>
          </ul>
          <Form.Group className="mb-3">
            <Form.Label>Executive Summary:</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={10} 
              placeholder="Write your executive summary here..."
              value={executiveSummary}
              onChange={(e) => setExecutiveSummary(e.target.value)}
            />
            {error && (
              <Alert variant="danger" className="mt-2">
                {error}
              </Alert>
            )}
            <div className="d-flex mt-2">
              <button 
                className="btn btn-primary me-2" 
                onClick={handleSubmit}
                disabled={isLoading}
              >
                Submit
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={handleUseAI}
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
                    />
                    {" "}Generating...
                  </>
                ) : "Use AI"}
              </button>
            </div>
          </Form.Group>

        </Card.Body>
      </Card>
      
      <div className="d-flex justify-content-between">
        <Link to="/scenario1/worksheet3" className="btn btn-secondary">Previous: Automated Response</Link>
        <Link to="/" className="btn btn-primary">Return to Home</Link>
      </div>
    </Container>
  );
};

export default Worksheet4;
