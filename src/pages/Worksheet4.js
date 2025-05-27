import React from 'react';
import { Container, Card, Form, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useWorkshop } from '../context/WorkshopContext';

const Worksheet4 = () => {
  const { 
    worksheetProgress,
    setWorksheetProgress
  } = useWorkshop();
  


  return (
    <Container className="mt-4 mb-5">
      <h1 className="mb-4">Worksheet 4: Executive Summary</h1>
      
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

            />
            <div className="d-flex mt-2">
              <button className="btn btn-primary me-2">Submit</button>
              <button className="btn btn-secondary">Use AI</button>
            </div>
          </Form.Group>

        </Card.Body>
      </Card>
      
      <div className="d-flex justify-content-between">
        <Link to="/worksheet-3" className="btn btn-secondary">Previous: Automated Response</Link>
        <Link to="/" className="btn btn-primary">Return to Home</Link>
      </div>
    </Container>
  );
};

export default Worksheet4;
