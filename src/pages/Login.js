import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert, Container, Row, Col, Tabs, Tab } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  // State for login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // State for registration form
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  
  // State for form handling
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('login');
  
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check URL parameters to determine which tab to show
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('register') === 'true') {
      setActiveTab('register');
    } else {
      setActiveTab('login');
    }
  }, [location]);
  
  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      setLoginError('');
      setLoading(true);
      await login(loginEmail, loginPassword);
      setMessage('Login successful!');
      navigate('/'); // Redirect to home page after successful login
    } catch (err) {
      // Handle specific error codes with user-friendly messages
      console.log('Login error:', err.message);
      if (err.message.includes('User not found')) {
        setLoginError('Email not found. Please check your email or register for a new account.');
      } else if (err.message.includes('Incorrect password')) {
        setLoginError('Incorrect password. Please try again.');
      } else {
        setLoginError('Failed to log in: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Handle registration form submission
  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (registerPassword !== confirmPassword) {
      return setRegisterError('Passwords do not match');
    }
    
    // Validate password strength
    if (registerPassword.length < 8) {
      return setRegisterError('Password must be at least 8 characters long');
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerEmail)) {
      return setRegisterError('Please enter a valid email address');
    }
    
    try {
      setRegisterError('');
      setLoading(true);
      // Register the user with email, password, and display name
      await register(registerEmail, registerPassword, displayName);
      // Only navigate after successful registration
      setMessage('Registration successful! You are now logged in.');
      navigate('/'); // Redirect to home page after successful registration
    } catch (err) {
      // Handle specific error codes with user-friendly messages
      console.log('Registration error:', err.message);
      if (err.message.includes('Email already in use')) {
        setRegisterError('Email already in use. Please use a different email or login to your existing account.');
      } else {
        setRegisterError('Failed to create an account: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Header className="bg-primary text-white">
              <h2 className="text-center mb-0">Threat Intel Workshop</h2>
            </Card.Header>
            <Card.Body>
              <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
                <Tab eventKey="login" title="Login">
                  {loginError && <Alert variant="danger">{loginError}</Alert>}
                  {message && <Alert variant="success">{message}</Alert>}
                  
                  <Form onSubmit={handleLogin}>
                    <Form.Group className="mb-3" controlId="loginEmail">
                      <Form.Label>Email</Form.Label>
                      <Form.Control 
                        type="email" 
                        value={loginEmail} 
                        onChange={(e) => setLoginEmail(e.target.value)} 
                        required 
                        placeholder="Enter your email"
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3" controlId="loginPassword">
                      <Form.Label>Password</Form.Label>
                      <Form.Control 
                        type="password" 
                        value={loginPassword} 
                        onChange={(e) => setLoginPassword(e.target.value)} 
                        required 
                      />
                    </Form.Group>
                    
                    <Button 
                      variant="primary" 
                      type="submit" 
                      className="w-100" 
                      disabled={loading}
                    >
                      {loading ? 'Logging in...' : 'Login'}
                    </Button>
                  </Form>
                </Tab>
                
                <Tab eventKey="register" title="Register">
                  {registerError && <Alert variant="danger">{registerError}</Alert>}
                  {message && <Alert variant="success">{message}</Alert>}
                  
                  <Form onSubmit={handleRegister}>
                    <Form.Group className="mb-3" controlId="registerEmail">
                      <Form.Label>Email</Form.Label>
                      <Form.Control 
                        type="email" 
                        value={registerEmail} 
                        onChange={(e) => setRegisterEmail(e.target.value)} 
                        required 
                        placeholder="Enter your email"
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3" controlId="displayName">
                      <Form.Label>Display Name (optional)</Form.Label>
                      <Form.Control 
                        type="text" 
                        value={displayName} 
                        onChange={(e) => setDisplayName(e.target.value)} 
                        placeholder="Choose a display name"
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3" controlId="registerPassword">
                      <Form.Label>Password</Form.Label>
                      <Form.Control 
                        type="password" 
                        value={registerPassword} 
                        onChange={(e) => setRegisterPassword(e.target.value)} 
                        required 
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3" controlId="confirmPassword">
                      <Form.Label>Confirm Password</Form.Label>
                      <Form.Control 
                        type="password" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        required 
                      />
                    </Form.Group>
                    
                    <Button 
                      variant="primary" 
                      type="submit" 
                      className="w-100" 
                      disabled={loading}
                    >
                      {loading ? 'Registering...' : 'Register'}
                    </Button>
                  </Form>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
