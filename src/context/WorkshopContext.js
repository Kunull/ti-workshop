import React, { createContext, useState, useContext } from 'react';

// Create the context
const WorkshopContext = createContext();

// Custom hook to use the workshop context
export const useWorkshop = () => useContext(WorkshopContext);

// Provider component
export const WorkshopProvider = ({ children }) => {
  // Exercise 1: Morning Briefing & Threat Landscape Overview (AI-Driven Threat Summarization)
  const [threatLandscape, setThreatLandscape] = useState({
    aiSummary: '',
    userAssessment: '',
    emergingThreats: [],
    priorityThreats: []
  });

  // Exercise 2: Prioritization & Tasking (AI-Assisted Threat Prioritization)
  const [threatPrioritization, setThreatPrioritization] = useState({
    threatA: { relevance: 0, urgency: 0, impact: 0, confidence: 0 },
    threatB: { relevance: 0, urgency: 0, impact: 0, confidence: 0 },
    threatC: { relevance: 0, urgency: 0, impact: 0, confidence: 0 },
  });
  const [aiJustifications, setAiJustifications] = useState({
    threatA: '',
    threatB: '',
    threatC: ''
  });
  const [userValidation, setUserValidation] = useState('');

  // Exercise 3: Deep Dive Investigation & Analysis (AI-Enhanced IOC Analysis)
  const [iocAnalysis, setIocAnalysis] = useState({
    extractedIocs: [],
    enrichmentResults: {},
    userInsights: ''
  });
  const [unstructuredReport, setUnstructuredReport] = useState({
    aiExtractedInfo: {},
    userValidation: false,
    additionalNotes: ''
  });
  const [responseOptions, setResponseOptions] = useState({
    detectionSystems: [],
    detectionRule: '',
    responseActions: {},
    executiveSummary: '',
    mitreMapping: {}
  });

  // Exercise 4: Threat Actor Understanding & TTP Chaining (AI-Assisted Profiling)
  const [actorProfile, setActorProfile] = useState({
    motivation: '',
    capabilities: [],
    ttps: [],
    relationshipToOtherActors: '',
    attributionConfidence: 1
  });
  const [ttpChain, setTtpChain] = useState({
    attackFlow: [],
    userAssessment: ''
  });
  const [iocManagement, setIocManagement] = useState({
    prioritizationMethod: '',
    automationLevel: 1,
    enrichmentSources: [],
    deprecationStrategy: '',
    falsePositiveHandling: '',
    scalabilityApproach: ''
  });

  // Exercise 5: Proactive Threat Hunting & Detection (AI-Guided Detection Engineering)
  const [threatHunting, setThreatHunting] = useState({
    aiSuggestedHypotheses: [],
    selectedHypothesis: '',
    selectedIncidentType: '',
    selectedRuleTypes: {
      YARA: false,
      SIGMA: false,
      SPLUNK: false,
      SNORT: false,
      ELASTIC: false,
      SURICATA: false,
      MICROSOFT_DEFENDER: false,
      CROWDSTRIKE: false,
      SENTINEL_ONE: false,
      WAZUH: false
    },
    detectionRules: {
      yaraRule: '',
      sigmaRule: '',
      customRules: []
    },
    userFeedback: ''
  });

  // Exercise 6: Reporting & Knowledge Sharing (AI-Enhanced Reports)
  const [reportGeneration, setReportGeneration] = useState({
    aiGeneratedReport: '',
    userRefinements: '',
    targetAudience: '',
    finalReport: ''
  });

  // Progress tracking
  const [worksheetProgress, setWorksheetProgress] = useState({
    worksheet1: 0, // Analysis
    worksheet2: 0, // Detection Rules
    worksheet3: 0, // Automated Response
    worksheet4: 0  // Intelligence Sharing
  });

  // User information
  const [userInfo, setUserInfo] = useState({
    name: '',
    organization: '',
    role: ''
  });

  // Values to be provided to consumers
  const value = {
    // Exercise 1: Morning Briefing
    threatLandscape,
    setThreatLandscape,
    
    // Exercise 2: Prioritization & Tasking
    threatPrioritization,
    setThreatPrioritization,
    aiJustifications,
    setAiJustifications,
    userValidation,
    setUserValidation,
    
    // Exercise 3: Deep Dive Investigation
    iocAnalysis,
    setIocAnalysis,
    unstructuredReport,
    setUnstructuredReport,
    responseOptions,
    setResponseOptions,
    
    // Exercise 4: Threat Actor Understanding
    actorProfile,
    setActorProfile,
    ttpChain,
    setTtpChain,
    iocManagement,
    setIocManagement,
    
    // Exercise 5: Proactive Threat Hunting
    threatHunting,
    setThreatHunting,
    
    // Exercise 6: Reporting & Knowledge Sharing
    reportGeneration,
    setReportGeneration,
    
    // Progress tracking
    worksheetProgress,
    setWorksheetProgress,
    
    // User info
    userInfo,
    setUserInfo
  };

  return (
    <WorkshopContext.Provider value={value}>
      {children}
    </WorkshopContext.Provider>
  );
};
