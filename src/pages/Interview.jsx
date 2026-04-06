import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

// New Subcomponents
import TopControlBar from '../components/interview/TopControlBar';
import AIInterviewerCard from '../components/interview/AIInterviewerCard';
import RealTimeFeedbackCard from '../components/interview/RealTimeFeedbackCard';
import RightSidebar from '../components/interview/RightSidebar';
import InterviewModals from '../components/interview/InterviewModals';
import { saveInterviewAPI } from '../Services/allAPI';

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
  const [realTimeFeedback] = useState({
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
  const saveInterview = async () => {
    const interviewData = {
      id: Date.now(),
      date: new Date().toISOString(),
      type: interview.type,
      difficulty: interview.difficulty,
      duration: interviewState.elapsedTime,
      questions: questions,
      results: results
    };

    try {
      const response = await saveInterviewAPI(interviewData);
      
      if (response.status === 200) {
        toast.success('Interview saved securely to your account!', {
          position: "top-center",
          autoClose: 3000,
          icon: "💾",
          onClick: () => navigate('/history')
        });
      } else {
        console.warn('API Warning - Falling back to local storage', response);
        // Save to localStorage fallback
        const savedInterviews = JSON.parse(localStorage.getItem('professorX_interviews') || '[]');
        savedInterviews.push(interviewData);
        localStorage.setItem('professorX_interviews', JSON.stringify(savedInterviews));

        toast.warning('Saved locally (Login required for cloud save)', {
          position: "top-center",
          autoClose: 3000,
          icon: "⚠️",
          onClick: () => navigate('/history')
        });
      }
    } catch (err) {
      console.error(err);
      toast.error('Error connecting to backend.', {
        position: "top-center",
        autoClose: 3000,
        icon: "❌"
      });
    }
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
        <TopControlBar
          interview={interview}
          interviewState={interviewState}
          questions={questions}
          formatTime={formatTime}
          togglePause={togglePause}
          stopInterview={stopInterview}
          startInterview={startInterview}
          setShowSettingsModal={setShowSettingsModal}
          progressPercentage={progressPercentage}
          timePercentage={timePercentage}
        />

        <Container className="py-4">
          <Row>
            {/* Left Column - Question & Answer */}
            <Col lg={8}>
              <AIInterviewerCard
                aiResponse={aiResponse}
                interviewState={interviewState}
                currentQuestion={currentQuestion}
                answerMode={answerMode}
                toggleAnswerMode={toggleAnswerMode}
                userInput={userInput}
                setUserInput={setUserInput}
                recording={recording}
                toggleRecording={toggleRecording}
                submitAnswer={submitAnswer}
                clearAnswer={clearAnswer}
                formatTime={formatTime}
              />

              <RealTimeFeedbackCard
                settings={settings}
                realTimeFeedback={realTimeFeedback}
                currentQuestion={currentQuestion}
                interviewState={interviewState}
              />
            </Col>

            {/* Right Column - Info & Controls */}
            <Col lg={4}>
              <RightSidebar
                interview={interview}
                interviewState={interviewState}
                questions={questions}
              />
            </Col>
          </Row>
        </Container>
      </Container>

      <InterviewModals
        showExitModal={showExitModal}
        setShowExitModal={setShowExitModal}
        endInterview={endInterview}
        questions={questions}
        interviewState={interviewState}
        showResultsModal={showResultsModal}
        setShowResultsModal={setShowResultsModal}
        results={results}
        exportTranscript={exportTranscript}
        saveInterview={saveInterview}
        showSettingsModal={showSettingsModal}
        setShowSettingsModal={setShowSettingsModal}
        settings={settings}
        setSettings={setSettings}
        saveSettings={saveSettings}
      />

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