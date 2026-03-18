import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axios from 'axios';

function Login() {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  // handle input change
  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  };

  // API call
  const loginAPI = async (data) => {
    return await axios.post("http://localhost:3000/login", data);
  };

  // handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = userData;

    if (!email || !password) {
      toast.info("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const result = await loginAPI(userData);

      if (result.status === 200) {
        sessionStorage.setItem("userName", result.data.existingUser.userName);
        sessionStorage.setItem("token", result.data.token);

        toast.success("Login successful");
        navigate("/dashboard");

        setUserData({ email: "", password: "" });
      }
    } catch (err) {
      setLoginError(err.response?.data || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <Row className="w-100">
        <Col md={6} className="mx-auto">
          <Card className="shadow-lg border-0">
            <Card.Body className="p-5">

              <div className="text-center mb-4">
                <h2 className="fw-bold">Welcome Back</h2>
              </div>

              {loginError && (
                <Alert variant="danger">{loginError}</Alert>
              )}

              <Form onSubmit={handleLogin}>
                
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text"><FaUser /></span>
                    <Form.Control
                      type="email"
                      name="email"
                      value={userData.email}
                      onChange={handleChange}
                      placeholder="Enter email"
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text"><FaLock /></span>
                    <Form.Control
                      type="password"
                      name="password"
                      value={userData.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                    />
                  </div>
                </Form.Group>

                <Button type="submit" className="w-100" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                </Button>

                <div className="text-center mt-3">
                  <p>
                    Don’t have an account? <Link to="/register">Sign up</Link>
                  </p>
                </div>

              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;