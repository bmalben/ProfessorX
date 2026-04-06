import React from 'react';
import { Card, Row, Col, Badge, Button, Form, Spinner } from 'react-bootstrap';
import { FaRobot, FaClock, FaMicrophone, FaComments, FaMicrophoneSlash, FaStop, FaArrowRight, FaRedo } from 'react-icons/fa';

function AIInterviewerCard({
  aiResponse,
  interviewState,
  currentQuestion,
  answerMode,
  toggleAnswerMode,
  userInput,
  setUserInput,
  recording,
  toggleRecording,
  submitAnswer,
  clearAnswer,
  formatTime
}) {
  return (
    <Card className="border-0 shadow mb-4">
      <Card.Header className="bg-primary text-white">
        <Row className="align-items-center">
          <Col xs={2} className="text-center">
            <div className="ai-avatar">
              <FaRobot size={40} />
              <div className={`emotion-indicator ${aiResponse.avatarEmotion}`}></div>
            </div>
          </Col>
          <Col xs={10}>
            <h5 className="mb-0">
              <FaRobot className="me-2" />
              Professor X AI Interviewer
              {aiResponse.isSpeaking && (
                <span className="speaking-indicator ms-2">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </span>
              )}
            </h5>
            <small>Senior Interview Coach</small>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body>
        <div className="ai-message p-3 mb-3 rounded bg-light">
          <p className="mb-0">{aiResponse.text}</p>
        </div>
        
        {/* Current Question */}
        {interviewState.isActive && !interviewState.isPaused && (
          <Card className="border-primary">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Question {interviewState.currentQuestionIndex + 1}</h5>
            </Card.Header>
            <Card.Body>
              <div className="question-display mb-4">
                <h4 className="mb-3">{currentQuestion.text}</h4>
                <div className="d-flex justify-content-between mb-3">
                  <Badge bg="secondary">{currentQuestion.category}</Badge>
                  <Badge bg={currentQuestion.difficulty === 'Easy' ? 'success' : 
                            currentQuestion.difficulty === 'Medium' ? 'warning' : 'danger'}>
                    {currentQuestion.difficulty}
                  </Badge>
                  <Badge bg="info">
                    <FaClock className="me-1" />
                    {currentQuestion.timeLimit}s
                  </Badge>
                </div>
                
                <div className="keywords mb-3">
                  <small className="text-muted">Keywords to include:</small>
                  <div className="mt-1">
                    {currentQuestion.keywords.map((keyword, idx) => (
                      <Badge key={idx} bg="light" text="dark" className="me-2">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Answer Input */}
              <div className="answer-section">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5>Your Answer:</h5>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={toggleAnswerMode}
                  >
                    {answerMode === 'text' ? (
                      <>
                        <FaMicrophone className="me-1" />
                        Switch to Voice
                      </>
                    ) : (
                      <>
                        <FaComments className="me-1" />
                        Switch to Text
                      </>
                    )}
                  </Button>
                </div>

                {answerMode === 'text' ? (
                  <Form.Group className="mb-3">
                    <Form.Control
                      as="textarea"
                      rows={6}
                      placeholder="Type your answer here..."
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      disabled={interviewState.isProcessing}
                    />
                    <Form.Text className="text-muted">
                      Tip: Use the STAR method (Situation, Task, Action, Result) for behavioral questions.
                    </Form.Text>
                  </Form.Group>
                ) : (
                  <Card className="border-warning">
                    <Card.Body className="text-center">
                      {recording.isRecording ? (
                        <>
                          <div className="recording-animation mb-3">
                            <FaMicrophone className="text-danger" size={48} />
                            <div className="pulse-ring"></div>
                          </div>
                          <h5 className="text-danger">Recording...</h5>
                          <p>{formatTime(recording.recordingTime)}</p>
                          <Button
                            variant="danger"
                            size="lg"
                            onClick={toggleRecording}
                          >
                            <FaStop className="me-2" />
                            Stop Recording
                          </Button>
                        </>
                      ) : (
                        <>
                          <FaMicrophoneSlash className="text-muted mb-3" size={48} />
                          <h5>Voice Answer</h5>
                          <p className="text-muted">Click below to start recording your answer</p>
                          <Button
                            variant="success"
                            size="lg"
                            onClick={toggleRecording}
                            disabled={interviewState.isProcessing}
                          >
                            <FaMicrophone className="me-2" />
                            Start Recording
                          </Button>
                        </>
                      )}
                    </Card.Body>
                  </Card>
                )}

                {/* Submit Button */}
                <div className="text-center mt-4">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={submitAnswer}
                    disabled={interviewState.isProcessing || (!userInput.trim() && !recording.audioBlob)}
                  >
                    {interviewState.isProcessing ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Processing Answer...
                      </>
                    ) : (
                      <>
                        Submit Answer
                        <FaArrowRight className="ms-2" />
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="lg"
                    className="ms-3"
                    onClick={clearAnswer}
                  >
                    <FaRedo /> Clear
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        )}
      </Card.Body>
    </Card>
  );
}

export default AIInterviewerCard;