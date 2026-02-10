import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaUser, FaLock, FaGoogle, FaGithub } from 'react-icons/fa';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setLoading(true);
    setLoginError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any valid email/password combination
      // In production, this would be an actual API call
      localStorage.setItem('professorX_token', 'demo_token');
      localStorage.setItem('professorX_user', JSON.stringify({
        email: formData.email,
        name: formData.email.split('@')[0]
      }));
      
      navigate('/dashboard');
    } catch (error) {
      setLoginError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    alert(`Logging in with ${provider} (Integration required)`);
  };

  return (
    <>
      {/* <Header /> */}
      <Container className="d-flex align-items-center justify-content-center min-vh-100">
        <Row className="w-100">
          <Col md={6} className="mx-auto">
            <Card className="shadow-lg border-0">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold">Welcome Back</h2>
                  <p className="text-muted">Sign in to your Professor X account</p>
                </div>

                {loginError && (
                  <Alert variant="danger" dismissible onClose={() => setLoginError('')}>
                    {loginError}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email Address</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaUser />
                      </span>
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        isInvalid={!!errors.email}
                      />
                    </div>
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaLock />
                      </span>
                      <Form.Control
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        isInvalid={!!errors.password}
                      />
                    </div>
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                    <div className="text-end mt-2">
                      <Link to="/forgot-password" className="text-decoration-none">
                        Forgot Password?
                      </Link>
                    </div>
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>

                  <div className="text-center mb-3">
                    <span className="text-muted">Or continue with</span>
                  </div>

                  <div className="d-grid gap-2 mb-4">
                    <Button
                      variant="outline-danger"
                      onClick={() => handleSocialLogin('Google')}
                    >
                      <FaGoogle className="me-2" />
                      Google
                    </Button>
                    <Button
                      variant="outline-dark"
                      onClick={() => handleSocialLogin('GitHub')}
                    >
                      <FaGithub className="me-2" />
                      GitHub
                    </Button>
                  </div>

                  <div className="text-center">
                    <p className="mb-0">
                      Don't have an account?{' '}
                      <Link to="/register" className="text-decoration-none fw-bold">
                        Sign up
                      </Link>
                    </p>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      {/* <Footer /> */}
    </>
  );
}

export default Login;