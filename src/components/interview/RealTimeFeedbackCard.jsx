import React from 'react';
import { Card, Row, Col, ProgressBar, Alert } from 'react-bootstrap';
import { FaChartLine, FaLightbulb } from 'react-icons/fa';

function RealTimeFeedbackCard({
  settings,
  realTimeFeedback,
  currentQuestion,
  interviewState
}) {
  if (!settings.enableRealTimeFeedback || !interviewState.isActive) {
    return null;
  }

  return (
    <Card className="border-0 shadow mb-4">
      <Card.Header className="bg-info text-white">
        <h5 className="mb-0">
          <FaChartLine className="me-2" />
          Real-time Feedback
        </h5>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={3} className="text-center">
            <div className="confidence-meter">
              <div className="confidence-score">
                {realTimeFeedback.confidence}%
              </div>
              <small>Confidence</small>
              <ProgressBar
                now={realTimeFeedback.confidence}
                variant={realTimeFeedback.confidence > 70 ? "success" : "warning"}
                className="mt-2"
              />
            </div>
          </Col>
          <Col md={3} className="text-center">
            <div className="clarity-meter">
              <div className="clarity-score">
                {realTimeFeedback.clarity}%
              </div>
              <small>Clarity</small>
              <ProgressBar
                now={realTimeFeedback.clarity}
                variant={realTimeFeedback.clarity > 70 ? "success" : "warning"}
                className="mt-2"
              />
            </div>
          </Col>
          <Col md={3} className="text-center">
            <div className="relevance-meter">
              <div className="relevance-score">
                {realTimeFeedback.relevance}%
              </div>
              <small>Relevance</small>
              <ProgressBar
                now={realTimeFeedback.relevance}
                variant={realTimeFeedback.relevance > 70 ? "success" : "warning"}
                className="mt-2"
              />
            </div>
          </Col>
          <Col md={3} className="text-center">
            <div className="keywords-meter">
              <div className="keywords-score">
                {realTimeFeedback.keywordsMatched.length}/{currentQuestion.keywords.length}
              </div>
              <small>Keywords</small>
              <ProgressBar
                now={(realTimeFeedback.keywordsMatched.length / currentQuestion.keywords.length) * 100}
                variant="info"
                className="mt-2"
              />
            </div>
          </Col>
        </Row>
        
        {realTimeFeedback.suggestions.length > 0 && (
          <Alert variant="light" className="mt-3">
            <h6><FaLightbulb className="me-2" />Suggestions:</h6>
            <ul className="mb-0">
              {realTimeFeedback.suggestions.map((suggestion, idx) => (
                <li key={idx}>{suggestion}</li>
              ))}
            </ul>
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
}

export default RealTimeFeedbackCard;