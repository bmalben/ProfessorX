import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  ProgressBar,
  Badge,
  Modal,
  Alert,
  Form,
  InputGroup,
  ListGroup,
  Accordion,
  Spinner
} from 'react-bootstrap';
import {
  FaPlay,
  FaPause,
  FaStop,
  FaMicrophone,
  FaMicrophoneSlash,
  FaRedo,
  FaArrowRight,
  FaRobot,
  FaUser,
  FaClock,
  FaChartLine,
  FaLightbulb,
  FaThumbsUp,
  FaThumbsDown,
  FaVolumeUp,
  FaVolumeMute,
  FaDownload,
  FaShare,
  FaQuestionCircle,
  FaCog,
  FaBrain,
  FaComments,
  FaRegSmile,
  FaRegFrown,
  FaStar,
  FaRegStar,
  FaCheck
} from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Interview() {
  const { id } = useParams(); // For specific interview sessions
  const navigate = useNavigate();
  
  // Refs
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const speechRef = useRef('');
  const timerRef = useRef(null);
  
  // Interview states
  const [interviewState, setInterviewState] = useState({
    isActive: false,
    isPaused: false,
    isRecording: false,
    isProcessing: false,
    isComplete: false,
    currentQuestionIndex: 0,
    elapsedTime: 0,
    totalDuration: 1800, // 30 minutes in seconds
    volume: 80,
    isMuted: false
  });

  // Interview data
  const [interview, setInterview] = useState({
    id: id || 'new',
    type: 'Technical Interview',
    difficulty: 'Medium',
    position: 'Senior Software Engineer',
    company: 'Google',
    duration: 30,
    totalQuestions: 10
  });

  // Questions and answers
  const [questions, setQuestions] = useState([
    {
      id: 1,
      text: "Can you tell me about a challenging project you worked on and how you handled it?",
      category: 'Behavioral',
      difficulty: 'Medium',
      timeLimit: 120,
      userAnswer: '',
      aiFeedback: null,
      score: null,
      keywords: ['challenge', 'project', 'solution', 'results'],
      followUpQuestions: []
    },
    {
      id: 2,
      text: "Explain the concept of REST API and why it's important in modern web development.",
      category: 'Technical',
      difficulty: 'Easy',
      timeLimit: 90,
      userAnswer: '',
      aiFeedback: null,
      score: null,
      keywords: ['REST', 'API', 'HTTP', 'stateless', 'resources'],
      followUpQuestions: []
    },
    {
      id: 3,
      text: "How would you handle a situation where your team disagrees with your technical decision?",
      category: 'Leadership',
      difficulty: 'Hard',
      timeLimit: 150,
      userAnswer: '',
      aiFeedback: null,
      score: null,
      keywords: ['team', 'disagreement', 'communication', 'decision-making'],
      followUpQuestions: []
    }
  ]);

  // Real-time feedback
  const [realTimeFeedback, setRealTimeFeedback] = useState({
    confidence: 0,
    clarity: 0,
    relevance: 0,
    keywordsMatched: [],
    suggestions: []
  });

  // User input
  const [userInput, setUserInput] = useState('');
  const [answerMode, setAnswerMode] = useState('text'); // 'text' or 'voice'
  
  // Audio recording
  const [recording, setRecording] = useState({
    audioBlob: null,
    audioUrl: null,
    recordingTime: 0,
    isRecording: false
  });

  // AI responses
  const [aiResponse, setAiResponse] = useState({
    text: "Hello! I'm Professor X, your AI interview assistant. I'll be asking you questions and providing feedback throughout this session. Are you ready to begin?",
    isSpeaking: false,
    avatarEmotion: 'neutral'
  });

  // Results
  const [results, setResults] = useState({
    overallScore: null,
    categoryScores: {},
    strengths: [],
    areasForImprovement: [],
    transcript: '',
    duration: 0
  });

  // Modals
  const [showExitModal, setShowExitModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Settings
  const [settings, setSettings] = useState({
    enableVoice: true,
    enableRealTimeFeedback: true,
    showTimer: true,
    difficulty: 'adaptive',
    language: 'en-US',
    speechRate: 1.0
  });

  // Timer
  useEffect(() => {
    if (interviewState.isActive && !interviewState.isPaused) {
      timerRef.current = setInterval(() => {
        setInterviewState(prev => ({
          ...prev,
          elapsedTime: prev.elapsedTime + 1
        }));
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [interviewState.isActive, interviewState.isPaused]);

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start interview
  const startInterview = () => {
    setInterviewState(prev => ({ ...prev, isActive: true }));
    toast.success('Interview started! Good luck!', {
      position: "top-right",
      autoClose: 3000,
      icon: "🎤"
    });
    speakAIResponse("Let's begin! Here's your first question.");
  };

  // Pause/Resume interview
  const togglePause = () => {
    setInterviewState(prev => ({ ...prev, isPaused: !prev.isPaused }));
    if (interviewState.isPaused) {
      toast.info('Interview resumed.', {
        position: "top-right",
        autoClose: 2000,
        icon: "▶️"
      });
      speakAIResponse("Interview resumed.");
    } else {
      toast.warning('Interview paused.', {
        position: "top-right",
        autoClose: 2000,
        icon: "⏸️"
      });
      speakAIResponse("Interview paused.");
    }
  };

  // Stop interview
  const stopInterview = () => {
    setShowExitModal(true);
  };

  // Submit answer
  const submitAnswer = () => {
    const currentQuestion = questions[interviewState.currentQuestionIndex];
    const answer = userInput.trim() || speechRef.current;

    if (!answer) {
      toast.error('Please provide an answer before submitting.', {
        position: "top-center",
        autoClose: 3000,
        icon: "⚠️"
      });
      return;
    }

    // Simulate AI processing
    setInterviewState(prev => ({ ...prev, isProcessing: true }));
    
    // Show processing toast
    const processingToast = toast.info('Processing your answer...', {
      position: "top-center",
      autoClose: false,
      isLoading: true,
      icon: "🤖"
    });
    
    // Update question with user answer
    const updatedQuestions = [...questions];
    updatedQuestions[interviewState.currentQuestionIndex] = {
      ...currentQuestion,
      userAnswer: answer,
      aiFeedback: {
        score: Math.floor(Math.random() * 30) + 70, // Random score 70-100
        feedback: "Good answer! You covered the main points well. Consider providing more specific examples next time.",
        strengths: ["Clear communication", "Relevant experience mentioned"],
        improvements: ["Add more metrics", "Structure with STAR method"]
      }
    };
    setQuestions(updatedQuestions);

    // Simulate AI thinking
    setTimeout(() => {
      setInterviewState(prev => ({ ...prev, isProcessing: false }));
      
      // Update toast to success
      toast.update(processingToast, {
        render: 'Answer submitted successfully!',
        type: toast.TYPE.SUCCESS,
        autoClose: 2000,
        isLoading: false,
        icon: "✅"
      });
      
      // Show score toast
      const score = updatedQuestions[interviewState.currentQuestionIndex].aiFeedback.score;
      toast.success(`Score: ${score}%`, {
        position: "top-right",
        autoClose: 3000,
        icon: score > 80 ? "🎯" : score > 60 ? "👍" : "📝"
      });
      
      // Move to next question or end
      if (interviewState.currentQuestionIndex < questions.length - 1) {
        setInterviewState(prev => ({
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1
        }));
        setUserInput('');
        speechRef.current = '';
        
        // Get next question
        const nextQuestion = updatedQuestions[interviewState.currentQuestionIndex + 1];
        speakAIResponse(`Next question: ${nextQuestion.text}`);
      } else {
        endInterview();
      }
    }, 2000);
  };

  // End interview
  const endInterview = () => {
    clearInterval(timerRef.current);
    setInterviewState(prev => ({ ...prev, isActive: false, isComplete: true }));
    
    // Calculate results
    const scores = questions.map(q => q.aiFeedback?.score || 0);
    const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    
    setResults({
      overallScore: Math.round(averageScore),
      categoryScores: {
        Behavioral: 85,
        Technical: 92,
        Leadership: 78
      },
      strengths: ["Technical knowledge", "Communication skills"],
      areasForImprovement: ["Time management", "Example specificity"],
      transcript: questions.map(q => `Q: ${q.text}\nA: ${q.userAnswer}`).join('\n\n'),
      duration: interviewState.elapsedTime
    });
    
    setShowResultsModal(true);
    
    // Show completion toast
    toast.success('Interview completed! View your results.', {
      position: "top-center",
      autoClose: 5000,
      icon: "🏆",
      onClick: () => setShowResultsModal(true)
    });
    
    speakAIResponse("Interview completed! Let's review your results.");
  };

  // AI speech synthesis
  const speakAIResponse = (text) => {
    if (!settings.enableVoice) return;

    setAiResponse(prev => ({ ...prev, isSpeaking: true, text }));
    
    // In a real app, use Web Speech API
    // const utterance = new SpeechSynthesisUtterance(text);
    // utterance.rate = settings.speechRate;
    // speechSynthesis.speak(utterance);
    
    // Simulate speaking duration
    setTimeout(() => {
      setAiResponse(prev => ({ ...prev, isSpeaking: false }));
    }, text.length * 50); // Rough estimate
  };

  // Toggle recording
  const toggleRecording = () => {
    if (recording.isRecording) {
      // Stop recording
      setRecording(prev => ({ ...prev, isRecording: false }));
      toast.success('Recording stopped. Ready to submit!', {
        position: "top-right",
        autoClose: 2000,
        icon: "⏹️"
      });
      // In real app, process audio here
    } else {
      // Start recording
      setRecording(prev => ({ ...prev, isRecording: true, recordingTime: 0 }));
      toast.info('Recording started. Speak now!', {
        position: "top-right",
        autoClose: 2000,
        icon: "🎤"
      });
      
      // Simulate recording timer
      const recordTimer = setInterval(() => {
        setRecording(prev => {
          if (prev.recordingTime >= 180) { // 3 minute max
            clearInterval(recordTimer);
            toast.warning('Recording time limit reached (3 minutes).', {
              position: "top-right",
              autoClose: 3000,
              icon: "⏱️"
            });
            return { ...prev, isRecording: false };
          }
          return { ...prev, recordingTime: prev.recordingTime + 1 };
        });
      }, 1000);
    }
  };

  // Toggle answer mode
  const toggleAnswerMode = () => {
    setAnswerMode(prev => prev === 'text' ? 'voice' : 'text');
    toast.info(`Switched to ${answerMode === 'text' ? 'voice' : 'text'} answer mode`, {
      position: "top-right",
      autoClose: 2000,
      icon: answerMode === 'text' ? "🎤" : "📝"
    });
  };

  // Save interview
  const saveInterview = () => {
    const interviewData = {
      id: Date.now(),
      date: new Date().toISOString(),
      type: interview.type,
      duration: interviewState.elapsedTime,
      questions: questions,
      results: results
    };

    // Save to localStorage
    const savedInterviews = JSON.parse(localStorage.getItem('professorX_interviews') || '[]');
    savedInterviews.push(interviewData);
    localStorage.setItem('professorX_interviews', JSON.stringify(savedInterviews));

    toast.success('Interview saved to history!', {
      position: "top-center",
      autoClose: 3000,
      icon: "💾",
      onClick: () => navigate('/history')
    });
  };

  // Export transcript
  const exportTranscript = () => {
    const element = document.createElement('a');
    const file = new Blob([results.transcript], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `interview-transcript-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    
    toast.success('Transcript downloaded successfully!', {
      position: "top-right",
      autoClose: 3000,
      icon: "📥"
    });
  };

  // Save settings
  const saveSettings = () => {
    setShowSettingsModal(false);
    toast.success('Settings saved successfully!', {
      position: "top-right",
      autoClose: 2000,
      icon: "⚙️"
    });
  };

  // Clear answer
  const clearAnswer = () => {
    setUserInput('');
    speechRef.current = '';
    toast.info('Answer cleared.', {
      position: "top-right",
      autoClose: 1500,
      icon: "🧹"
    });
  };

  // Current question
  const currentQuestion = questions[interviewState.currentQuestionIndex];

  // Progress percentage
  const progressPercentage = ((interviewState.currentQuestionIndex + 1) / questions.length) * 100;
  const timePercentage = (interviewState.elapsedTime / interviewState.totalDuration) * 100;

  return (
    <>
      <Header />
      
      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{ marginTop: '60px' }}
      />
      
      <Container fluid className="p-0 interview-container">
        {/* Top Control Bar */}
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

        <Container className="py-4">
          <Row>
            {/* Left Column - Question & Answer */}
            <Col lg={8}>
              {/* AI Interviewer */}
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

              {/* Real-time Feedback */}
              {settings.enableRealTimeFeedback && interviewState.isActive && (
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
              )}
            </Col>

            {/* Right Column - Info & Controls */}
            <Col lg={4}>
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
            </Col>
          </Row>
        </Container>
      </Container>

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

      <style jsx>{`
        .interview-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        }
        
        .ai-avatar {
          position: relative;
          display: inline-block;
        }
        
        .emotion-indicator {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid white;
        }
        
        .emotion-indicator.neutral { background: #6c757d; }
        .emotion-indicator.happy { background: #ffc107; }
        .emotion-indicator.serious { background: #0d6efd; }
        .emotion-indicator.encouraging { background: #198754; }
        
        .speaking-indicator {
          display: inline-flex;
          align-items: center;
        }
        
        .speaking-indicator .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #20c997;
          margin: 0 2px;
          animation: bounce 1.4s infinite ease-in-out both;
        }
        
        .speaking-indicator .dot:nth-child(1) { animation-delay: -0.32s; }
        .speaking-indicator .dot:nth-child(2) { animation-delay: -0.16s; }
        
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
        
        .recording-animation {
          position: relative;
        }
        
        .pulse-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100px;
          height: 100px;
          border: 5px solid rgba(220, 53, 69, 0.3);
          border-radius: 50%;
          animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
          0% { transform: translate(-50%, -50%) scale(0.8); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1.3); opacity: 0; }
        }
        
        .confidence-meter, .clarity-meter, .relevance-meter, .keywords-meter {
          padding: 15px;
          border-radius: 10px;
          background: #f8f9fa;
        }
        
        .confidence-score, .clarity-score, .relevance-score, .keywords-score {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 5px;
        }
      `}</style>

      <Footer />
    </>
  );
}

export default Interview;