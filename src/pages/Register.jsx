import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';

function Register() {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    userName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // handle input change
  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  };

  // API call
  const registerAPI = async (data) => {
    return await axios.post("http://localhost:3000/register", data);
  };

  // handle register
  const handleRegister = async (e) => {
    e.preventDefault();

    const { userName, email, password, confirmPassword } = userData;

    if (!userName || !email || !password || !confirmPassword) {
      toast.info("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.warning("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const result = await registerAPI({
        userName,
        email,
        password
      });

      if (result.status === 200) {
        toast.success("Registration successful");
        navigate("/login");

        setUserData({
          userName: "",
          email: "",
          password: "",
          confirmPassword: ""
        });
      }
    } catch (err) {
      const errorMessage =
        err.response?.data && typeof err.response.data === "string"
          ? err.response.data
          : err.response?.data?.message || "Registration failed";
      setError(errorMessage);
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
                <h2>Create Account</h2>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleRegister}>

                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text"><FaUser /></span>
                    <Form.Control
                      type="text"
                      name="userName"
                      value={userData.userName}
                      onChange={handleChange}
                      placeholder="Enter name"
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text"><FaEnvelope /></span>
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

                <Form.Group className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <div className="input-group">
                    <span className="input-group-text"><FaLock /></span>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={userData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm password"
                    />
                  </div>
                </Form.Group>

                <Button type="submit" className="w-100" disabled={loading}>
                  {loading ? "Creating..." : "Register"}
                </Button>

                <div className="text-center mt-3">
                  <p>
                    Already have an account? <Link to="/login">Login</Link>
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

export default Register;