import React from 'react';
import { Card, ListGroup, Badge, Accordion } from 'react-bootstrap';
import { FaLightbulb, FaCheck } from 'react-icons/fa';

function RightSidebar({ interview, interviewState, questions }) {
  return (
    <>
      {/* Interview Info */}
      <Card className="border-0 shadow mb-4">
        <Card.Header className="bg-secondary text-white">
          <h5 className="mb-0">Interview Details</h5>
        </Card.Header>
        <Card.Body>
          <ListGroup variant="flush">
            <ListGroup.Item className="d-flex justify-content-between">
              <span>Position:</span>
              <strong>{interview.position}</strong>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between">
              <span>Company:</span>
              <strong>{interview.company}</strong>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between">
              <span>Difficulty:</span>
              <Badge bg={interview.difficulty === 'Easy' ? 'success' : 
                        interview.difficulty === 'Medium' ? 'warning' : 'danger'}>
                {interview.difficulty}
              </Badge>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between">
              <span>Duration:</span>
              <span>{interview.duration} minutes</span>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between">
              <span>Questions:</span>
              <span>{interview.totalQuestions} total</span>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between">
              <span>Status:</span>
              <Badge bg={interviewState.isActive ? 
                        (interviewState.isPaused ? 'warning' : 'success') : 
                        'secondary'}>
                {interviewState.isActive ? 
                  (interviewState.isPaused ? 'Paused' : 'Active') : 
                  'Not Started'}
              </Badge>
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>

      {/* Quick Tips */}
      <Card className="border-0 shadow mb-4">
        <Card.Header className="bg-success text-white">
          <h5 className="mb-0">
            <FaLightbulb className="me-2" />
            Quick Tips
          </h5>
        </Card.Header>
        <Card.Body>
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Answer Structure</Accordion.Header>
              <Accordion.Body>
                Use the STAR method for behavioral questions:
                <ul className="mt-2 mb-0">
                  <li><strong>S</strong>ituation: Describe the context</li>
                  <li><strong>T</strong>ask: Explain your responsibility</li>
                  <li><strong>A</strong>ction: Detail what you did</li>
                  <li><strong>R</strong>esult: Share the outcome</li>
                </ul>
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>Voice Tips</Accordion.Header>
              <Accordion.Body>
                <ul className="mb-0">
                  <li>Speak clearly and at a moderate pace</li>
                  <li>Pause briefly between thoughts</li>
                  <li>Vary your tone to show enthusiasm</li>
                  <li>Avoid filler words (um, ah, like)</li>
                </ul>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Card.Body>
      </Card>

      {/* Answer History */}
      <Card className="border-0 shadow">
        <Card.Header className="bg-warning text-dark">
          <h5 className="mb-0">Answer History</h5>
        </Card.Header>
        <Card.Body style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {questions.map((q, idx) => (
            <div key={q.id} className={`mb-3 pb-3 ${idx < questions.length - 1 ? 'border-bottom' : ''}`}>
              <div className="d-flex justify-content-between align-items-start mb-1">
                <strong className={idx === interviewState.currentQuestionIndex ? 'text-primary' : ''}>
                  Q{idx + 1}: {q.category}
                </strong>
                {q.aiFeedback?.score && (
                  <Badge bg={q.aiFeedback.score > 80 ? 'success' : 
                            q.aiFeedback.score > 60 ? 'warning' : 'danger'}>
                    {q.aiFeedback.score}%
                  </Badge>
                )}
              </div>
              <small className="text-muted d-block mb-1">{q.text.substring(0, 50)}...</small>
              {q.userAnswer && (
                <small className="text-success">
                  <FaCheck className="me-1" />
                  Answered
                </small>
              )}
            </div>
          ))}
        </Card.Body>
      </Card>
    </>
  );
}

export default RightSidebar;