// Settings.jsx (fixed version)
import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { FaUserCog, FaSave } from 'react-icons/fa';
import Header from '../components/Header';

const Settings = () => {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Header />
      
      <Container fluid style={{ marginTop: '80px', padding: '20px' }}>
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="mb-1">
                  <FaUserCog className="me-2" style={{ color: '#0d6efd' }} />
                  Settings
                </h2>
                <p className="text-muted mb-0">
                  Manage your account preferences
                </p>
              </div>
              <Button variant="primary" onClick={handleSave}>
                <FaSave className="me-2" />
                Save Changes
              </Button>
            </div>
          </Col>
        </Row>

        {saved && (
          <Alert variant="success" className="mb-4">
            Settings saved successfully!
          </Alert>
        )}

        <Row>
          <Col lg={9}>
            <Card className="shadow-sm">
              <Card.Body>
                <h5>General Settings</h5>
                <p>Settings content will appear here...</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Settings;