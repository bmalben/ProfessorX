import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  ProgressBar, 
  ListGroup, 
  Badge,
  Dropdown,
  Modal,
  Alert
} from 'react-bootstrap';
import { 
  FaUser, 
  FaChartLine, 
  FaCalendarAlt, 
  FaTrophy, 
  FaClock, 
  FaBrain,
  FaVideo,
  FaBell,
  FaCog,
  FaSignOutAlt,
  FaPlayCircle,
  FaStar,
  FaFileAlt,
  FaComments,
  FaCheck
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [stats, setStats] = useState({
    totalInterviews: 0,
    completed: 0,
    successRate: 0,
    avgScore: 0,
    streakDays: 0
  });

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('professorX_token');
    const userData = localStorage.getItem('professorX_user');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }
    
    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Load stats from localStorage or use defaults
      const savedStats = JSON.parse(localStorage.getItem('professorX_stats') || '{}');
      const savedInterviews = JSON.parse(localStorage.getItem('professorX_interviews') || '[]');
      
      // Calculate actual stats from saved interviews
      const totalInterviews = savedInterviews.length;
      const completedInterviews = savedInterviews.filter(i => i.results?.overallScore).length;
      const avgScore = savedInterviews.length > 0 
        ? savedInterviews.reduce((sum, i) => sum + (i.results?.overallScore || 0), 0) / savedInterviews.length 
        : 0;
      
      setStats({
        totalInterviews: totalInterviews || savedStats.totalInterviews || 0,
        completed: completedInterviews || savedStats.completed || 0,
        successRate: savedStats.successRate || 0,
        avgScore: avgScore || savedStats.avgScore || 0,
        streakDays: savedStats.streakDays || 0
      });
      
    } catch (error) {
      toast.error('Error loading user data. Please login again.', {
        position: "top-center",
        autoClose: 3000,
        icon: "⚠️"
      });
      navigate('/login');
    }
    
    // Mock upcoming interviews data
    setUpcomingInterviews([
      {
        id: 1,
        type: 'Technical Interview',
        company: 'Google',
        date: '2024-12-20',
        time: '10:00 AM',
        duration: '45 mins',
        status: 'scheduled'
      },
      {
        id: 2,
        type: 'Behavioral Interview',
        company: 'Microsoft',
        date: '2024-12-22',
        time: '2:30 PM',
        duration: '30 mins',
        status: 'scheduled'
      },
      {
        id: 3,
        type: 'System Design',
        company: 'Amazon',
        date: '2024-12-25',
        time: '11:00 AM',
        duration: '60 mins',
        status: 'preparing'
      }
    ]);
    
    // Show welcome toast on first visit
    const hasSeenWelcome = localStorage.getItem('professorX_welcome_shown');
    if (!hasSeenWelcome && user) {
      setTimeout(() => {
        toast.success(`Welcome back, ${user.name || 'User'}! 🎉`, {
          position: "top-right",
          autoClose: 4000,
          icon: "👋"
        });
        localStorage.setItem('professorX_welcome_shown', 'true');
      }, 1000);
    }
  }, [navigate]);

  const recentPerformance = [
    { category: 'Technical Skills', score: 8.5, improvement: 12 },
    { category: 'Communication', score: 9.2, improvement: 8 },
    { category: 'Problem Solving', score: 8.8, improvement: 15 },
    { category: 'Confidence Level', score: 8.0, improvement: 20 }
  ];

  const quickActions = [
    {
      title: 'Start New Interview',
      icon: <FaPlayCircle size={30} />,
      description: 'Begin a mock interview',
      variant: 'primary',
      action: () => navigate('/interview')
    },
    {
      title: 'Review Previous',
      icon: <FaFileAlt size={30} />,
      description: 'Analyze past performances',
      variant: 'secondary',
      action: () => navigate('/history')
    },
    {
      title: 'AI Coach',
      icon: <FaBrain size={30} />,
      description: 'Get personalized tips',
      variant: 'success',
      action: () => {
        toast.info('AI Coach feature coming soon!', {
          position: "top-center",
          autoClose: 3000,
          icon: "🤖"
        });
      }
    },
    {
      title: 'Practice Questions',
      icon: <FaComments size={30} />,
      description: 'Study common questions',
      variant: 'info',
      action: () => {
        toast.info('Practice Questions feature coming soon!', {
          position: "top-center",
          autoClose: 3000,
          icon: "📚"
        });
      }
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('professorX_token');
    localStorage.removeItem('professorX_user');
    
    toast.info('Logged out successfully. See you soon! 👋', {
      position: "top-center",
      autoClose: 3000,
      icon: "🚪"
    });
    
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  const startQuickInterview = (type) => {
    toast.success(`Starting ${type} interview session...`, {
      position: "top-center",
      autoClose: 2000,
      icon: "🎤",
      onClose: () => navigate('/interview')
    });
  };

  const handlePrepareSession = (interview) => {
    toast.info(`Preparing for ${interview.type} with ${interview.company}...`, {
      position: "top-right",
      autoClose: 3000,
      icon: "🎯"
    });
  };

  const handleScheduleSession = () => {
    toast.info('Schedule feature coming soon!', {
      position: "top-center",
      autoClose: 3000,
      icon: "📅"
    });
  };

  const handleViewDetails = () => {
    toast.info('Opening detailed analytics...', {
      position: "top-right",
      autoClose: 2000,
      icon: "📊",
      onClose: () => navigate('/analytics')
    });
  };

  const handleNotificationClick = () => {
    const notificationCount = 3; // Mock count
    toast.info(`You have ${notificationCount} new notifications`, {
      position: "top-center",
      autoClose: 3000,
      icon: "🔔"
    });
  };

  const handleAchievementClick = () => {
    toast.success('🎉 Achievement unlocked: Dashboard Explorer!', {
      position: "top-center",
      autoClose: 4000,
      icon: "🏆"
    });
  };

  if (!user) {
    return (
      <Container className="d-flex align-items-center justify-content-center min-vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading dashboard...</p>
        </div>
      </Container>
    );
  }

  return (
    <>
    <Header/>
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
      
      {/* <Header /> */}
      
        <Container className="py-4">
          {/* Welcome Section */}
          <Row className="mb-4">
            <Col>
              <Card className="border-0 shadow">
                <Card.Body className="bg-primary text-white rounded">
                  <Row className="align-items-center">
                    <Col md={8}>
                      <h2>Welcome back, {user.name || 'User'}! 👋</h2>
                      <p className="mb-0">
                        Ready for your next interview practice? Your AI coach has prepared personalized sessions based on your progress.
                      </p>
                      {stats.streakDays > 0 && (
                        <Badge bg="light" text="dark" className="mt-2">
                          <FaTrophy className="me-1" />
                          {stats.streakDays} day streak 🔥
                        </Badge>
                      )}
                    </Col>
                    <Col md={4} className="text-end">
                      <Button 
                        variant="light" 
                        size="lg"
                        onClick={() => startQuickInterview('Quick')}
                        className="fw-bold"
                      >
                        <FaPlayCircle className="me-2" />
                        Start Quick Practice
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Stats Cards */}
          <Row className="mb-4">
            <Col md={3} sm={6} className="mb-3">
              <Card 
                className="h-100 border-0 shadow stats-card"
                onClick={() => {
                  toast.info(`${stats.totalInterviews} total interviews completed`, {
                    position: "top-center",
                    autoClose: 2000,
                    icon: "📈"
                  });
                }}
                style={{ cursor: 'pointer' }}
              >
                <Card.Body className="text-center">
                  <div className="display-4 fw-bold text-primary">{stats.totalInterviews}</div>
                  <Card.Text>Total Interviews</Card.Text>
                  <FaVideo className="text-muted" size={30} />
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6} className="mb-3">
              <Card 
                className="h-100 border-0 shadow stats-card"
                onClick={() => {
                  toast.success(`Your success rate is ${stats.successRate}%`, {
                    position: "top-center",
                    autoClose: 2000,
                    icon: "🎯"
                  });
                }}
                style={{ cursor: 'pointer' }}
              >
                <Card.Body className="text-center">
                  <div className="display-4 fw-bold text-success">{stats.successRate}%</div>
                  <Card.Text>Success Rate</Card.Text>
                  <FaTrophy className="text-muted" size={30} />
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6} className="mb-3">
              <Card 
                className="h-100 border-0 shadow stats-card"
                onClick={() => {
                  toast.info(`Average score: ${stats.avgScore.toFixed(1)}/10`, {
                    position: "top-center",
                    autoClose: 2000,
                    icon: "⭐"
                  });
                }}
                style={{ cursor: 'pointer' }}
              >
                <Card.Body className="text-center">
                  <div className="display-4 fw-bold text-warning">{stats.avgScore.toFixed(1)}/10</div>
                  <Card.Text>Average Score</Card.Text>
                  <FaStar className="text-muted" size={30} />
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6} className="mb-3">
              <Card 
                className="h-100 border-0 shadow stats-card"
                onClick={() => {
                  if (stats.streakDays > 0) {
                    toast.success(`Keep it up! ${stats.streakDays} day streak`, {
                      position: "top-center",
                      autoClose: 2000,
                      icon: "🔥"
                    });
                  } else {
                    toast.info('Start your practice streak today!', {
                      position: "top-center",
                      autoClose: 2000,
                      icon: "🎯"
                    });
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                <Card.Body className="text-center">
                  <div className="display-4 fw-bold text-info">{stats.streakDays} days</div>
                  <Card.Text>Practice Streak</Card.Text>
                  <FaCalendarAlt className="text-muted" size={30} />
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mb-4">
            {/* Quick Actions */}
            <Col lg={8}>
              <Card className="border-0 shadow mb-4">
                <Card.Header className="bg-white border-0">
                  <h5 className="mb-0">Quick Actions</h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    {quickActions.map((action, index) => (
                      <Col md={3} sm={6} key={index} className="mb-3">
                        <Card 
                          className={`border-0 shadow-sm text-center h-100 action-card`}
                          style={{ cursor: 'pointer' }}
                          onClick={action.action}
                        >
                          <Card.Body>
                            <div className={`text-${action.variant} mb-3`}>
                              {action.icon}
                            </div>
                            <Card.Title className="h6">{action.title}</Card.Title>
                            <Card.Text className="small text-muted">
                              {action.description}
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>

              {/* Performance Metrics */}
              <Card className="border-0 shadow">
                <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Performance Metrics</h5>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={handleViewDetails}
                  >
                    View Details
                  </Button>
                </Card.Header>
                <Card.Body>
                  {recentPerformance.map((metric, index) => (
                    <div 
                      key={index} 
                      className="mb-3"
                      onClick={() => {
                        toast.info(`${metric.category}: ${metric.score}/10 (+${metric.improvement}%)`, {
                          position: "top-center",
                          autoClose: 2000,
                          icon: "📊"
                        });
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="d-flex justify-content-between mb-1">
                        <span>{metric.category}</span>
                        <span className="fw-bold">{metric.score}/10 
                          <Badge bg="success" className="ms-2">
                            +{metric.improvement}%
                          </Badge>
                        </span>
                      </div>
                      <ProgressBar 
                        now={metric.score * 10} 
                        variant="primary"
                        animated 
                      />
                    </div>
                  ))}
                </Card.Body>
              </Card>
            </Col>

            {/* Right Sidebar */}
            <Col lg={4}>
              {/* Upcoming Interviews */}
              <Card className="border-0 shadow mb-4">
                <Card.Header className="bg-white border-0 d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Upcoming Sessions</h5>
                  <FaClock className="text-primary" />
                </Card.Header>
                <Card.Body>
                  {upcomingInterviews.length > 0 ? (
                    <ListGroup variant="flush">
                      {upcomingInterviews.map((interview) => (
                        <ListGroup.Item 
                          key={interview.id} 
                          className="border-0 px-0 py-3"
                          style={{ cursor: 'pointer' }}
                          onClick={() => handlePrepareSession(interview)}
                        >
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h6 className="mb-1">{interview.type}</h6>
                              <small className="text-muted">
                                {interview.company} • {interview.date} at {interview.time}
                              </small>
                              <br />
                              <Badge bg={interview.status === 'scheduled' ? 'primary' : 'warning'}>
                                {interview.status}
                              </Badge>
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline-primary"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePrepareSession(interview);
                              }}
                            >
                              Prepare
                            </Button>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  ) : (
                    <Alert variant="info">
                      No upcoming interviews scheduled. Start a new practice session!
                    </Alert>
                  )}
                  <Button 
                    variant="outline-secondary" 
                    className="w-100 mt-3"
                    onClick={handleScheduleSession}
                  >
                    <FaCalendarAlt className="me-2" />
                    Schedule New Session
                  </Button>
                </Card.Body>
              </Card>

              {/* AI Recommendations */}
              <Card 
                className="border-0 shadow"
                onClick={handleAchievementClick}
                style={{ cursor: 'pointer' }}
              >
                <Card.Header className="bg-white border-0">
                  <h5 className="mb-0">AI Recommendations</h5>
                </Card.Header>
                <Card.Body>
                  <div className="mb-3">
                    <h6><FaChartLine className="me-2 text-info" /> Focus Area</h6>
                    <p className="small">Based on your performance, work on system design questions</p>
                  </div>
                  <div className="mb-3">
                    <h6><FaBrain className="me-2 text-primary" /> Smart Tip</h6>
                    <p className="small">Practice STAR method for behavioral questions to improve by 25%</p>
                  </div>
                  <div>
                    <h6><FaTrophy className="me-2 text-warning" /> Achievement</h6>
                    <p className="small">You're in the top 20% of users for communication skills!</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Recent Activity */}
          <Row>
            <Col>
              <Card className="border-0 shadow">
                <Card.Header className="bg-white border-0">
                  <h5 className="mb-0">Recent Activity</h5>
                </Card.Header>
                <Card.Body>
                  <ListGroup variant="flush">
                    <ListGroup.Item 
                      className="border-0"
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        toast.success('Viewing interview details...', {
                          position: "top-right",
                          autoClose: 2000,
                          icon: "📋"
                        });
                      }}
                    >
                      <div className="d-flex">
                        <FaFileAlt className="text-success me-3 mt-1" />
                        <div>
                          <h6 className="mb-1">Completed Mock Interview</h6>
                          <small className="text-muted">Technical Interview with Google • Score: 8.5/10</small>
                          <small className="text-muted d-block">2 hours ago</small>
                        </div>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item 
                      className="border-0"
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        toast.info('Viewing AI feedback...', {
                          position: "top-right",
                          autoClose: 2000,
                          icon: "🤖"
                        });
                      }}
                    >
                      <div className="d-flex">
                        <FaBrain className="text-primary me-3 mt-1" />
                        <div>
                          <h6 className="mb-1">AI Feedback Received</h6>
                          <small className="text-muted">Improved communication score by 15%</small>
                          <small className="text-muted d-block">1 day ago</small>
                        </div>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item 
                      className="border-0"
                      style={{ cursor: 'pointer' }}
                      onClick={handleAchievementClick}
                    >
                      <div className="d-flex">
                        <FaTrophy className="text-warning me-3 mt-1" />
                        <div>
                          <h6 className="mb-1">New Achievement Unlocked</h6>
                          <small className="text-muted">"Consistent Learner" - 7-day practice streak</small>
                          <small className="text-muted d-block">2 days ago</small>
                        </div>
                      </div>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      {/* </Container> */}

      {/* Logout Modal */}
      <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to logout from Professor X?
          <Alert variant="info" className="mt-3">
            <FaCheck className="me-2" />
            Your progress will be saved automatically.
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleLogout}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx>{`
        .stats-card:hover {
          transform: translateY(-5px);
          transition: transform 0.2s ease-in-out;
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
        
        .action-card:hover {
          transform: translateY(-3px);
          transition: transform 0.2s ease-in-out;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1) !important;
        }
        
        .min-vh-100 {
          min-height: 100vh;
        }
        
        .cursor-pointer {
          cursor: pointer;
        }
      `}</style>

      <Footer />
    </>
  );
}

export default Dashboard;