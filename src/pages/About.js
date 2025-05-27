import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const About = () => {
  return (
    <Container className="py-5">
      <Row className="mb-5">
        <Col>
          <h1 className="mb-4">About</h1>
          <p>
            This application guides users through a comprehensive workshop that covers the entire
            threat intelligence lifecycle - from initial data collection to actionable intelligence and defensive measures.
          </p>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col>
          <h2 className="mb-4">Workshop Structure</h2>
          <p>
            The workshop is divided into six interactive worksheets, each focusing on a different aspect
            of the threat intelligence process:
          </p>
          
          <div className="d-flex flex-wrap gap-4 mt-4">
            <Card className="shadow-sm" style={{ width: '18rem' }}>
              <Card.Body>
                <Card.Title>1. Morning Briefing</Card.Title>
                <Card.Text>
                  Learn to analyze and prioritize threat feeds to identify relevant threats to your organization.
                </Card.Text>
              </Card.Body>
            </Card>
            
            <Card className="shadow-sm" style={{ width: '18rem' }}>
              <Card.Body>
                <Card.Title>2. Prioritization & Tasking</Card.Title>
                <Card.Text>
                  Develop skills to prioritize threats and assign appropriate resources for investigation.
                </Card.Text>
              </Card.Body>
            </Card>
            
            <Card className="shadow-sm" style={{ width: '18rem' }}>
              <Card.Body>
                <Card.Title>3. Deep Dive Investigation</Card.Title>
                <Card.Text>
                  Conduct thorough investigations into threats using various intelligence sources and tools.
                </Card.Text>
              </Card.Body>
            </Card>
            
            <Card className="shadow-sm" style={{ width: '18rem' }}>
              <Card.Body>
                <Card.Title>4. Threat Actor Profiling</Card.Title>
                <Card.Text>
                  Learn to create comprehensive profiles of threat actors, including TTPs and motivations.
                </Card.Text>
              </Card.Body>
            </Card>
            
            <Card className="shadow-sm" style={{ width: '18rem' }}>
              <Card.Body>
                <Card.Title>5. Threat Hunting</Card.Title>
                <Card.Text>
                  Develop proactive threat hunting techniques and create detection rules based on intelligence.
                </Card.Text>
              </Card.Body>
            </Card>
            
            <Card className="shadow-sm" style={{ width: '18rem' }}>
              <Card.Body>
                <Card.Title>6. Reporting & Sharing</Card.Title>
                <Card.Text>
                  Create effective intelligence reports and learn best practices for information sharing.
                </Card.Text>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <h2 className="mb-4">About Cyware</h2>
          <p>
            Cyware helps enterprise cybersecurity teams build platform-agnostic cyber fusion centers by delivering 
            cyber threat intelligence and next-generation SOAR solutions. As a result, organizations can increase 
            speed and accuracy while reducing costs and analyst burnout.
          </p>
          <p>
            Cyware's Cyber Fusion solutions make secure collaboration, information sharing, and enhanced threat 
            visibility a reality for enterprises, sharing communities (ISAC/ISAO), MSSPs, and government agencies 
            of all sizes and needs.
          </p>
          <p className="text-muted mt-4">
            © {new Date().getFullYear()} Cyware Labs. All rights reserved.
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default About;
