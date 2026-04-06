import React from 'react';
import { Row, Col, Button, ProgressBar, Badge } from 'react-bootstrap';
import { FaBrain, FaClock, FaPlay, FaPause, FaStop, FaCog } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function TopControlBar({
  interview,
  interviewState,
  questions,
  formatTime,
  togglePause,
  stopInterview,
  startInterview,
  setShowSettingsModal,
  progressPercentage,
  timePercentage
}) {
  const navigate = useNavigate();

  return (
    <div className="bg-dark text-white py-3 px-4">
      <Row className="align-items-center">
        <Col md={4}>
          <div className="d-flex align-items-center">
            <FaBrain className="me-2" size={24} />
            <h4 className="mb-0">Interview</h4>
            <Badge bg="info" className="ms-3">{interview.type}</Badge>
          </div>
        </Col>
        
        <Col md={4} className="text-center">
          <div className="d-flex justify-content-center align-items-center">
            <FaClock className="me-2" />
            <span className="me-3">{formatTime(interviewState.elapsedTime)}</span>
            
            <div className="me-3">
              <Badge bg="light" text="dark">
                Q: {interviewState.currentQuestionIndex + 1}/{questions.length}
              </Badge>
            </div>
            
            {!interviewState.isComplete && (
              <>
                {interviewState.isActive ? (
                  <>
                    <Button
                      variant={interviewState.isPaused ? "success" : "warning"}
                      size="sm"
                      className="me-2"
                      onClick={togglePause}
                    >
                      {interviewState.isPaused ? <FaPlay /> : <FaPause />}
                      {interviewState.isPaused ? ' Resume' : ' Pause'}
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={stopInterview}
                    >
                      <FaStop /> End
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="success"
                    size="lg"
                    onClick={startInterview}
                  >
                    <FaPlay className="me-2" />
                    Start Interview
                  </Button>
                )}
              </>
            )}
          </div>
        </Col>
        
        <Col md={4} className="text-end">
          <Button
            variant="outline-light"
            size="sm"
            className="me-2"
            onClick={() => setShowSettingsModal(true)}
          >
            <FaCog /> Settings
          </Button>
          <Button
            variant="outline-light"
            size="sm"
            onClick={() => navigate('/dashboard')}
          >
            Exit to Dashboard
          </Button>
        </Col>
      </Row>
      
      {/* Progress Bars */}
      <Row className="mt-3">
        <Col>
          <div className="mb-2">
            <small className="text-light">Question Progress</small>
            <ProgressBar
              now={progressPercentage}
              variant="info"
              animated
              className="mb-2"
            />
          </div>
          <div>
            <small className="text-light">Time Elapsed</small>
            <ProgressBar
              now={timePercentage}
              variant={timePercentage > 90 ? "danger" : "success"}
              striped={timePercentage > 80}
              animated={timePercentage > 80}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default TopControlBar;
