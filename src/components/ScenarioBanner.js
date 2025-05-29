import React from 'react';
import { Alert } from 'react-bootstrap';

const ScenarioBanner = ({ scenarioNumber, scenarioTitle }) => {
  return (
    <Alert variant="info" className="mb-4 d-flex align-items-center">
      <div className="scenario-icon me-3">
        <span className="fw-bold fs-4">{scenarioNumber}</span>
      </div>
      <div>
        <h5 className="mb-0">Scenario {scenarioNumber}: {scenarioTitle}</h5>
        <p className="mb-0 small">This worksheet is part of the {scenarioTitle} scenario</p>
      </div>
    </Alert>
  );
};

export default ScenarioBanner;
