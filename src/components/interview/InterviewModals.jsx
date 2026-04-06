import React from 'react';
import { Modal, Button, Alert, Row, Col, Card, ListGroup, ProgressBar, Form } from 'react-bootstrap';
import { FaThumbsUp, FaRegFrown, FaDownload } from 'react-icons/fa';

function InterviewModals({
  showExitModal, setShowExitModal, endInterview, questions, interviewState,
  showResultsModal, setShowResultsModal, results, exportTranscript, saveInterview,
  showSettingsModal, setShowSettingsModal, settings, setSettings, saveSettings
}) {
  return (
    <>
      {/* Exit Confirmation Modal */}
      <Modal show={showExitModal} onHide={() => setShowExitModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>End Interview?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to end this interview? Your progress will be saved.
          {interviewState.currentQuestionIndex > 0 && (
            <Alert variant="info" className="mt-3">
              You've answered {interviewState.currentQuestionIndex} out of {questions.length} questions.
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowExitModal(false)}>
            Continue Interview
          </Button>
          <Button variant="primary" onClick={endInterview}>
            End Interview & Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Results Modal */}
      <Modal show={showResultsModal} onHide={() => setShowResultsModal(false)} size="lg">
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title>Interview Results</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-4">
            <div className="display-4 fw-bold text-success">{results.overallScore}%</div>
            <p className="lead">Overall Score</p>
          </div>
          
          <Row>
            <Col md={6}>
              <Card className="mb-3">
                <Card.Body>
                  <h5>Strengths</h5>
                  <ListGroup variant="flush">
                    {results.strengths.map((strength, idx) => (
                      <ListGroup.Item key={idx}>
                        <FaThumbsUp className="text-success me-2" />
                        {strength}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="mb-3">
                <Card.Body>
                  <h5>Areas for Improvement</h5>
                  <ListGroup variant="flush">
                    {results.areasForImprovement.map((area, idx) => (
                      <ListGroup.Item key={idx}>
                        <FaRegFrown className="text-warning me-2" />
                        {area}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          <Card className="mb-3">
            <Card.Body>
              <h5>Category Scores</h5>
              {Object.entries(results.categoryScores).map(([category, score]) => (
                <div key={category} className="mb-2">
                  <div className="d-flex justify-content-between">
                    <span>{category}</span>
                    <span>{score}%</span>
                  </div>
                  <ProgressBar
                    now={score}
                    variant={score > 80 ? 'success' : score > 60 ? 'warning' : 'danger'}
                  />
                </div>
              ))}
            </Card.Body>
          </Card>
          
          <div className="d-flex justify-content-between">
            <Button variant="outline-primary" onClick={exportTranscript}>
              <FaDownload className="me-2" />
              Export Transcript
            </Button>
            <Button variant="success" onClick={saveInterview}>
              Save to History
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Settings Modal */}
      <Modal show={showSettingsModal} onHide={() => setShowSettingsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Interview Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Enable AI Voice"
                checked={settings.enableVoice}
                onChange={(e) => setSettings(prev => ({ ...prev, enableVoice: e.target.checked }))}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Real-time Feedback"
                checked={settings.enableRealTimeFeedback}
                onChange={(e) => setSettings(prev => ({ ...prev, enableRealTimeFeedback: e.target.checked }))}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Show Timer"
                checked={settings.showTimer}
                onChange={(e) => setSettings(prev => ({ ...prev, showTimer: e.target.checked }))}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Difficulty Level</Form.Label>
              <Form.Select
                value={settings.difficulty}
                onChange={(e) => setSettings(prev => ({ ...prev, difficulty: e.target.value }))}
              >
                <option value="adaptive">Adaptive</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Speech Rate</Form.Label>
              <Form.Range
                min="0.5"
                max="2"
                step="0.1"
                value={settings.speechRate}
                onChange={(e) => setSettings(prev => ({ ...prev, speechRate: parseFloat(e.target.value) }))}
              />
              <Form.Text>{settings.speechRate.toFixed(1)}x speed</Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSettingsModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={saveSettings}>
            Save Settings
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default InterviewModals;