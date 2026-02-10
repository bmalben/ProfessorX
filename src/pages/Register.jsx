import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaUser, FaEnvelope, FaLock, FaGoogle, FaGithub } from 'react-icons/fa';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(formData.password)) {
      newErrors.password = 'Password must include uppercase, lowercase, number, and special character';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
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
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Save user data (in production, this would be an API call)
      localStorage.setItem('professorX_token', 'demo_token');
      localStorage.setItem('professorX_user', JSON.stringify({
        name: formData.name,
        email: formData.email
      }));
      
      setSuccess('Registration successful! Redirecting to dashboard...');
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (error) {
      setErrors({ general: 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialRegister = (provider) => {
    alert(`Register with ${provider} (Integration required)`);
  };

  return (
    <>
      {/* <Header /> */}
      <Container className="d-flex align-items-center justify-content-center min-vh-100">
        <Row className="w-100">
          <Col md={8} lg={6} className="mx-auto">
            <Card className="shadow-lg border-0">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold">Join Professor X</h2>
                  <p className="text-muted">Create your account to start AI-powered interview preparation</p>
                </div>

                {success && (
                  <Alert variant="success">
                    {success}
                  </Alert>
                )}

                {errors.general && (
                  <Alert variant="danger" dismissible onClose={() => setErrors({...errors, general: ''})}>
                    {errors.general}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formName">
                    <Form.Label>Full Name</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaUser />
                      </span>
                      <Form.Control
                        type="text"
                        name="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                        isInvalid={!!errors.name}
                      />
                    </div>
                    <Form.Control.Feedback type="invalid">
                      {errors.name}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email Address</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaEnvelope />
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

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="formPassword">
                        <Form.Label>Password</Form.Label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <FaLock />
                          </span>
                          <Form.Control
                            type="password"
                            name="password"
                            placeholder="Create password"
                            value={formData.password}
                            onChange={handleChange}
                            isInvalid={!!errors.password}
                          />
                        </div>
                        <Form.Control.Feedback type="invalid">
                          {errors.password}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="formConfirmPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <FaLock />
                          </span>
                          <Form.Control
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            isInvalid={!!errors.confirmPassword}
                          />
                        </div>
                        <Form.Control.Feedback type="invalid">
                          {errors.confirmPassword}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-4" controlId="formTerms">
                    <Form.Check
                      type="checkbox"
                      name="acceptTerms"
                      label={
                        <>
                          I agree to the{' '}
                          <Link to="/terms" className="text-decoration-none">
                            Terms of Service
                          </Link>{' '}
                          and{' '}
                          <Link to="/privacy" className="text-decoration-none">
                            Privacy Policy
                          </Link>
                        </>
                      }
                      checked={formData.acceptTerms}
                      onChange={handleChange}
                      isInvalid={!!errors.acceptTerms}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.acceptTerms}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>

                  <div className="text-center mb-3">
                    <span className="text-muted">Or sign up with</span>
                  </div>

                  <div className="d-grid gap-2 mb-4">
                    <Button
                      variant="outline-danger"
                      onClick={() => handleSocialRegister('Google')}
                    >
                      <FaGoogle className="me-2" />
                      Google
                    </Button>
                    <Button
                      variant="outline-dark"
                      onClick={() => handleSocialRegister('GitHub')}
                    >
                      <FaGithub className="me-2" />
                      GitHub
                    </Button>
                  </div>

                  <div className="text-center">
                    <p className="mb-0">
                      Already have an account?{' '}
                      <Link to="/login" className="text-decoration-none fw-bold">
                        Sign in
                      </Link>
                    </p>
                  </div>
                </Form>
              </Card.Body>
            </Card>

            <Card className="mt-4 border-0 shadow-sm">
              <Card.Body className="p-3">
                <div className="text-center">
                  <h6 className="mb-2">Start your journey with Professor X</h6>
                  <p className="small text-muted mb-0">
                    • AI-powered mock interviews • Real-time feedback • Performance analytics • Industry-specific preparation
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      {/* <Footer /> */}
    </>
  );
}

export default Register;