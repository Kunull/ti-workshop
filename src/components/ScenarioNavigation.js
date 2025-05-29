import React from 'react';
import { Card, Badge, Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const ScenarioNavigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Define the worksheets for Scenario 1
  const worksheets = [
    { path: '/worksheet-1', name: 'AI-Powered Extraction of IOCs & TTPs' },
    { path: '/worksheet-2', name: 'Formulate Actions & Detection' },
    { path: '/worksheet-3', name: 'Contextualization & Maliciousness Assessment' },
    { path: '/worksheet-4', name: 'Relational TTP Analysis' }
  ];

  return (
    <Card className="mb-4 border-primary">
      <Card.Header className="bg-primary text-white d-flex align-items-center">
        <div className="me-2">
          <Badge bg="light" text="primary" className="rounded-circle p-2">1</Badge>
        </div>
        <h5 className="mb-0">Scenario 1: From Sandbox to Action – Malware Incident Analysis</h5>
      </Card.Header>
      <Card.Body className="p-0">
        <Nav variant="tabs" className="flex-column flex-md-row">
          {worksheets.map((worksheet, index) => (
            <Nav.Item key={index}>
              <Nav.Link 
                as={Link} 
                to={worksheet.path}
                active={currentPath === worksheet.path}
                className="d-flex align-items-center"
              >
                <Badge bg={currentPath === worksheet.path ? "primary" : "secondary"} className="me-2">
                  {index + 1}
                </Badge>
                <span className="d-none d-md-inline">{worksheet.name}</span>
                <span className="d-inline d-md-none">WS {index + 1}</span>
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
      </Card.Body>
    </Card>
  );
};

export default ScenarioNavigation;
