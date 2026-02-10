import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  ProgressBar,
  Badge,
  Tab,
  Nav,
  Modal,
  Image,
  ListGroup,
  Accordion
} from 'react-bootstrap';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBriefcase,
  FaGraduationCap,
  FaLinkedin,
  FaGithub,
  FaGlobe,
  FaEdit,
  FaSave,
  FaTimes,
  FaCamera,
  FaChartLine,
  FaTrophy,
  FaCalendarAlt,
  FaCog,
  FaShieldAlt,
  FaBell,
  FaFileDownload,
  FaTrash,
  FaUpload,
  FaStar
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    personal: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: '',
      bio: ''
    },
    professional: {
      currentRole: '',
      company: '',
      yearsOfExperience: '',
      targetRole: '',
      industries: [],
      skills: []
    },
    education: {
      highestDegree: '',
      university: '',
      graduationYear: ''
    },
    social: {
      linkedin: '',
      github: '',
      portfolio: ''
    },
    preferences: {
      emailNotifications: true,
      pushNotifications: true,
      darkMode: false,
      language: 'en'
    }
  });

  const mockStats = {
    totalInterviews: 47,
    completedInterviews: 42,
    successRate: 88,
    averageScore: 8.9,
    rank: 'Top 15%',
    streakDays: 14,
    totalPracticeHours: 78
  };

  const recentAchievements = [
    { id: 1, title: 'Interview Master', description: 'Complete 40+ mock interviews', icon: '🏆', date: '2024-12-15', unlocked: true },
    { id: 2, title: 'Consistent Learner', description: '7-day practice streak', icon: '🔥', date: '2024-12-18', unlocked: true },
    { id: 3, title: 'Communication Pro', description: 'Score 9+ in communication', icon: '🎯', date: '2024-12-20', unlocked: true },
    { id: 4, title: 'Tech Wizard', description: 'Master 50+ technical questions', icon: '💻', date: '2024-12-22', unlocked: false },
    { id: 5, title: 'Quick Thinker', description: 'Answer 100 questions in under 2 mins', icon: '⚡', date: '', unlocked: false }
  ];

  const skillProgress = [
    { skill: 'Technical Knowledge', level: 85, target: 90 },
    { skill: 'Communication', level: 92, target: 95 },
    { skill: 'Problem Solving', level: 78, target: 85 },
    { skill: 'Leadership', level: 70, target: 80 },
    { skill: 'Time Management', level: 88, target: 90 }
  ];

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('professorX_token');
    const userData = localStorage.getItem('professorX_user');

    if (!token || !userData) {
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Mock user data - In production, fetch from API
      setFormData({
        personal: {
          firstName: 'John',
          lastName: 'Doe',
          email: parsedUser.email || 'john.doe@example.com',
          phone: '+1 (555) 123-4567',
          location: 'San Francisco, CA',
          bio: 'Senior Software Engineer with 8+ years of experience in full-stack development. Passionate about AI and machine learning.'
        },
        professional: {
          currentRole: 'Senior Software Engineer',
          company: 'TechCorp Inc.',
          yearsOfExperience: '8',
          targetRole: 'Principal Engineer',
          industries: ['Technology', 'Fintech', 'Healthcare'],
          skills: ['React', 'Node.js', 'Python', 'AWS', 'Docker', 'Machine Learning']
        },
        education: {
          highestDegree: 'Masters in Computer Science',
          university: 'Stanford University',
          graduationYear: '2016'
        },
        social: {
          linkedin: 'linkedin.com/in/johndoe',
          github: 'github.com/johndoe',
          portfolio: 'johndoe.dev'
        },
        preferences: {
          emailNotifications: true,
          pushNotifications: true,
          darkMode: false,
          language: 'en'
        }
      });
    } catch (error) {
      navigate('/login');
    }
  }, [navigate]);

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleArrayInput = (section, field, value, action = 'add') => {
    if (action === 'add' && value) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: [...prev[section][field], value]
        }
      }));
    } else if (action === 'remove') {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: prev[section][field].filter(item => item !== value)
        }
      }));
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update local storage
      const updatedUser = {
        ...user,
        name: `${formData.personal.firstName} ${formData.personal.lastName}`,
        email: formData.personal.email
      };
      localStorage.setItem('professorX_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      setSaveSuccess(true);
      setIsEditing(false);
      
      // Hide success message after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveAvatar = () => {
    if (avatarPreview) {
      // In production, upload to server
      alert('Avatar updated successfully!');
      setShowAvatarModal(false);
      setAvatarFile(null);
      setAvatarPreview(null);
    }
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(formData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'professorX-profile-data.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleDeleteAccount = () => {
    // In production, make API call to delete account
    localStorage.removeItem('professorX_token');
    localStorage.removeItem('professorX_user');
    navigate('/');
  };

  if (!user) {
    return (
      <Container className="d-flex align-items-center justify-content-center min-vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading profile...</p>
        </div>
      </Container>
    );
  }

  return (
    <>
      <Header />
      
      <Container fluid className="p-0">
        {/* Profile Header */}
        <div className="bg-dark text-white py-5">
          <Container>
            <Row className="align-items-center">
              <Col md={2} className="text-center mb-3 mb-md-0">
                <div className="position-relative" style={{ width: '150px', height: '150px', margin: '0 auto' }}>
                  <Image
                    src={avatarPreview || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
                    roundedCircle
                    fluid
                    className="border border-3 border-white"
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                  />
                  <Button
                    variant="light"
                    size="sm"
                    className="position-absolute bottom-0 end-0 rounded-circle"
                    onClick={() => setShowAvatarModal(true)}
                  >
                    <FaCamera />
                  </Button>
                </div>
              </Col>
              <Col md={8}>
                <h1 className="h2">
                  {formData.personal.firstName} {formData.personal.lastName}
                </h1>
                <p className="lead mb-2">
                  <FaBriefcase className="me-2" />
                  {formData.professional.currentRole} at {formData.professional.company}
                </p>
                <p className="mb-2">
                  <FaMapMarkerAlt className="me-2" />
                  {formData.personal.location}
                </p>
                <p className="mb-0">
                  <FaEnvelope className="me-2" />
                  {formData.personal.email}
                </p>
              </Col>
              <Col md={2} className="text-end">
                {isEditing ? (
                  <>
                    <Button
                      variant="success"
                      className="me-2"
                      onClick={handleSaveProfile}
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : <><FaSave className="me-2" /> Save</>}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setIsEditing(false)}
                    >
                      <FaTimes className="me-2" /> Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="light"
                    onClick={() => setIsEditing(true)}
                  >
                    <FaEdit className="me-2" /> Edit Profile
                  </Button>
                )}
              </Col>
            </Row>
          </Container>
        </div>

        <Container className="py-5">
          {saveSuccess && (
            <Alert variant="success" dismissible onClose={() => setSaveSuccess(false)}>
              Profile updated successfully!
            </Alert>
          )}

          <Row>
            {/* Left Column - Stats & Achievements */}
            <Col lg={4} className="mb-4">
              {/* Stats Card */}
              {/* <Card className="border-0 shadow mb-4">
                <Card.Header className="bg-white border-0">
                  <h5 className="mb-0">Your Stats</h5>
                </Card.Header>
                <Card.Body>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="border-0 d-flex justify-content-between">
                      <span><FaChartLine className="me-2 text-primary" /> Total Interviews</span>
                      <Badge bg="primary">{mockStats.totalInterviews}</Badge>
                    </ListGroup.Item>
                    <ListGroup.Item className="border-0 d-flex justify-content-between">
                      <span><FaTrophy className="me-2 text-warning" /> Success Rate</span>
                      <Badge bg="success">{mockStats.successRate}%</Badge>
                    </ListGroup.Item>
                    <ListGroup.Item className="border-0 d-flex justify-content-between">
                      <span><FaStar className="me-2 text-info" /> Average Score</span>
                      <Badge bg="info">{mockStats.averageScore}/10</Badge>
                    </ListGroup.Item>
                    <ListGroup.Item className="border-0 d-flex justify-content-between">
                      <span><FaCalendarAlt className="me-2 text-danger" /> Practice Streak</span>
                      <Badge bg="danger">{mockStats.streakDays} days</Badge>
                    </ListGroup.Item>
                    <ListGroup.Item className="border-0 d-flex justify-content-between">
                      <span>Global Rank</span>
                      <Badge bg="secondary">{mockStats.rank}</Badge>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card> */}

              {/* Achievements */}
              {/* <Card className="border-0 shadow mb-4">
                <Card.Header className="bg-white border-0">
                  <h5 className="mb-0">Achievements</h5>
                </Card.Header>
                <Card.Body>
                  {recentAchievements.map((achievement) => (
                    <div key={achievement.id} className={`d-flex align-items-center mb-3 p-2 rounded ${achievement.unlocked ? 'bg-light' : 'bg-light opacity-50'}`}>
                      <div className="me-3" style={{ fontSize: '24px' }}>
                        {achievement.icon}
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-1">{achievement.title}</h6>
                        <p className="small text-muted mb-1">{achievement.description}</p>
                        {achievement.date && (
                          <small className="text-muted">{achievement.date}</small>
                        )}
                      </div>
                      {achievement.unlocked ? (
                        <Badge bg="success">Unlocked</Badge>
                      ) : (
                        <Badge bg="secondary">Locked</Badge>
                      )}
                    </div>
                  ))}
                </Card.Body>
              </Card> */}

              {/* Skill Progress */}
              <Card className="border-0 shadow">
                <Card.Header className="bg-white border-0">
                  <h5 className="mb-0">Skill Progress</h5>
                </Card.Header>
                <Card.Body>
                  {skillProgress.map((skill, index) => (
                    <div key={index} className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span>{skill.skill}</span>
                        <span className="fw-bold">{skill.level}%</span>
                      </div>
                      <ProgressBar 
                        now={skill.level} 
                        max={skill.target}
                        variant="primary"
                        animated 
                      />
                      <small className="text-muted">Target: {skill.target}%</small>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            </Col>

            {/* Right Column - Profile Details */}
            <Col lg={8}>
              <Card className="border-0 shadow">
                <Card.Header className="bg-white border-0">
                  <Nav variant="tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                    <Nav.Item>
                      <Nav.Link eventKey="personal">
                        <FaUser className="me-2" />
                        Personal
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="professional">
                        <FaBriefcase className="me-2" />
                        Professional
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="education">
                        <FaGraduationCap className="me-2" />
                        Education
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="social">
                        <FaGlobe className="me-2" />
                        Social
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="preferences">
                        <FaCog className="me-2" />
                        Preferences
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="security">
                        <FaShieldAlt className="me-2" />
                        Security
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Card.Header>
                <Card.Body>
                  <Tab.Content>
                    {/* Personal Information Tab */}
                    <Tab.Pane active={activeTab === 'personal'}>
                      <Form>
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>First Name</Form.Label>
                              <Form.Control
                                type="text"
                                value={formData.personal.firstName}
                                onChange={(e) => handleInputChange('personal', 'firstName', e.target.value)}
                                disabled={!isEditing}
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label>Last Name</Form.Label>
                              <Form.Control
                                type="text"
                                value={formData.personal.lastName}
                                onChange={(e) => handleInputChange('personal', 'lastName', e.target.value)}
                                disabled={!isEditing}
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Form.Group className="mb-3">
                          <Form.Label>Email Address</Form.Label>
                          <Form.Control
                            type="email"
                            value={formData.personal.email}
                            onChange={(e) => handleInputChange('personal', 'email', e.target.value)}
                            disabled={!isEditing}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Phone Number</Form.Label>
                          <Form.Control
                            type="tel"
                            value={formData.personal.phone}
                            onChange={(e) => handleInputChange('personal', 'phone', e.target.value)}
                            disabled={!isEditing}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Location</Form.Label>
                          <Form.Control
                            type="text"
                            value={formData.personal.location}
                            onChange={(e) => handleInputChange('personal', 'location', e.target.value)}
                            disabled={!isEditing}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Bio</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={4}
                            value={formData.personal.bio}
                            onChange={(e) => handleInputChange('personal', 'bio', e.target.value)}
                            disabled={!isEditing}
                          />
                        </Form.Group>
                      </Form>
                    </Tab.Pane>

                    {/* Professional Information Tab */}
                    <Tab.Pane active={activeTab === 'professional'}>
                      <Form>
                        <Form.Group className="mb-3">
                          <Form.Label>Current Role</Form.Label>
                          <Form.Control
                            type="text"
                            value={formData.professional.currentRole}
                            onChange={(e) => handleInputChange('professional', 'currentRole', e.target.value)}
                            disabled={!isEditing}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Company</Form.Label>
                          <Form.Control
                            type="text"
                            value={formData.professional.company}
                            onChange={(e) => handleInputChange('professional', 'company', e.target.value)}
                            disabled={!isEditing}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Years of Experience</Form.Label>
                          <Form.Control
                            type="number"
                            value={formData.professional.yearsOfExperience}
                            onChange={(e) => handleInputChange('professional', 'yearsOfExperience', e.target.value)}
                            disabled={!isEditing}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Target Role</Form.Label>
                          <Form.Control
                            type="text"
                            value={formData.professional.targetRole}
                            onChange={(e) => handleInputChange('professional', 'targetRole', e.target.value)}
                            disabled={!isEditing}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Industries</Form.Label>
                          {isEditing ? (
                            <div>
                              <div className="d-flex mb-2">
                                <Form.Control
                                  type="text"
                                  placeholder="Add an industry"
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter' && e.target.value.trim()) {
                                      handleArrayInput('professional', 'industries', e.target.value.trim());
                                      e.target.value = '';
                                    }
                                  }}
                                />
                              </div>
                              <div className="d-flex flex-wrap gap-2">
                                {formData.professional.industries.map((industry, index) => (
                                  <Badge key={index} bg="primary" className="p-2">
                                    {industry}
                                    <Button
                                      variant="link"
                                      className="text-white p-0 ms-2"
                                      onClick={() => handleArrayInput('professional', 'industries', industry, 'remove')}
                                    >
                                      ×
                                    </Button>
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="d-flex flex-wrap gap-2">
                              {formData.professional.industries.map((industry, index) => (
                                <Badge key={index} bg="primary" className="p-2">
                                  {industry}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Skills</Form.Label>
                          {isEditing ? (
                            <div>
                              <div className="d-flex mb-2">
                                <Form.Control
                                  type="text"
                                  placeholder="Add a skill"
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter' && e.target.value.trim()) {
                                      handleArrayInput('professional', 'skills', e.target.value.trim());
                                      e.target.value = '';
                                    }
                                  }}
                                />
                              </div>
                              <div className="d-flex flex-wrap gap-2">
                                {formData.professional.skills.map((skill, index) => (
                                  <Badge key={index} bg="secondary" className="p-2">
                                    {skill}
                                    <Button
                                      variant="link"
                                      className="text-white p-0 ms-2"
                                      onClick={() => handleArrayInput('professional', 'skills', skill, 'remove')}
                                    >
                                      ×
                                    </Button>
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="d-flex flex-wrap gap-2">
                              {formData.professional.skills.map((skill, index) => (
                                <Badge key={index} bg="secondary" className="p-2">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </Form.Group>
                      </Form>
                    </Tab.Pane>

                    {/* Education Tab */}
                    <Tab.Pane active={activeTab === 'education'}>
                      <Form>
                        <Form.Group className="mb-3">
                          <Form.Label>Highest Degree</Form.Label>
                          <Form.Control
                            type="text"
                            value={formData.education.highestDegree}
                            onChange={(e) => handleInputChange('education', 'highestDegree', e.target.value)}
                            disabled={!isEditing}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>University</Form.Label>
                          <Form.Control
                            type="text"
                            value={formData.education.university}
                            onChange={(e) => handleInputChange('education', 'university', e.target.value)}
                            disabled={!isEditing}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Graduation Year</Form.Label>
                          <Form.Control
                            type="text"
                            value={formData.education.graduationYear}
                            onChange={(e) => handleInputChange('education', 'graduationYear', e.target.value)}
                            disabled={!isEditing}
                          />
                        </Form.Group>
                      </Form>
                    </Tab.Pane>

                    {/* Social Links Tab */}
                    <Tab.Pane active={activeTab === 'social'}>
                      <Form>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            <FaLinkedin className="me-2" />
                            LinkedIn Profile
                          </Form.Label>
                          <Form.Control
                            type="url"
                            value={formData.social.linkedin}
                            onChange={(e) => handleInputChange('social', 'linkedin', e.target.value)}
                            disabled={!isEditing}
                            placeholder="linkedin.com/in/username"
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            <FaGithub className="me-2" />
                            GitHub Profile
                          </Form.Label>
                          <Form.Control
                            type="url"
                            value={formData.social.github}
                            onChange={(e) => handleInputChange('social', 'github', e.target.value)}
                            disabled={!isEditing}
                            placeholder="github.com/username"
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            <FaGlobe className="me-2" />
                            Portfolio Website
                          </Form.Label>
                          <Form.Control
                            type="url"
                            value={formData.social.portfolio}
                            onChange={(e) => handleInputChange('social', 'portfolio', e.target.value)}
                            disabled={!isEditing}
                            placeholder="yourwebsite.com"
                          />
                        </Form.Group>
                      </Form>
                    </Tab.Pane>

                    {/* Preferences Tab */}
                    <Tab.Pane active={activeTab === 'preferences'}>
                      <Form>
                        <h6 className="mb-3">Notification Preferences</h6>
                        <Form.Group className="mb-3">
                          <Form.Check
                            type="checkbox"
                            label="Email Notifications"
                            checked={formData.preferences.emailNotifications}
                            onChange={(e) => handleInputChange('preferences', 'emailNotifications', e.target.checked)}
                            disabled={!isEditing}
                          />
                          <Form.Text className="text-muted">
                            Receive email updates about your progress and new features
                          </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Check
                            type="checkbox"
                            label="Push Notifications"
                            checked={formData.preferences.pushNotifications}
                            onChange={(e) => handleInputChange('preferences', 'pushNotifications', e.target.checked)}
                            disabled={!isEditing}
                          />
                          <Form.Text className="text-muted">
                            Get browser notifications for upcoming sessions and reminders
                          </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-4">
                          <Form.Check
                            type="checkbox"
                            label="Dark Mode"
                            checked={formData.preferences.darkMode}
                            onChange={(e) => handleInputChange('preferences', 'darkMode', e.target.checked)}
                            disabled={!isEditing}
                          />
                        </Form.Group>
                        
                        <h6 className="mb-3">Language</h6>
                        <Form.Group className="mb-3">
                          <Form.Select
                            value={formData.preferences.language}
                            onChange={(e) => handleInputChange('preferences', 'language', e.target.value)}
                            disabled={!isEditing}
                          >
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                            <option value="zh">Chinese</option>
                          </Form.Select>
                        </Form.Group>
                      </Form>
                    </Tab.Pane>

                    {/* Security Tab */}
                    <Tab.Pane active={activeTab === 'security'}>
                      <Accordion>
                        <Accordion.Item eventKey="0">
                          <Accordion.Header>Change Password</Accordion.Header>
                          <Accordion.Body>
                            <Form>
                              <Form.Group className="mb-3">
                                <Form.Label>Current Password</Form.Label>
                                <Form.Control type="password" placeholder="Enter current password" />
                              </Form.Group>
                              <Form.Group className="mb-3">
                                <Form.Label>New Password</Form.Label>
                                <Form.Control type="password" placeholder="Enter new password" />
                              </Form.Group>
                              <Form.Group className="mb-3">
                                <Form.Label>Confirm New Password</Form.Label>
                                <Form.Control type="password" placeholder="Confirm new password" />
                              </Form.Group>
                              <Button variant="primary">Update Password</Button>
                            </Form>
                          </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey="1">
                          <Accordion.Header>Data Management</Accordion.Header>
                          <Accordion.Body>
                            <p className="mb-3">Download a copy of your data or delete your account.</p>
                            <div className="d-flex gap-2">
                              <Button variant="outline-primary" onClick={handleExportData}>
                                <FaFileDownload className="me-2" />
                                Export Data
                              </Button>
                              <Button variant="outline-danger" onClick={() => setShowDeleteModal(true)}>
                                <FaTrash className="me-2" />
                                Delete Account
                              </Button>
                            </div>
                          </Accordion.Body>
                        </Accordion.Item>
                      </Accordion>
                    </Tab.Pane>
                  </Tab.Content>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </Container>

      {/* Avatar Upload Modal */}
      <Modal show={showAvatarModal} onHide={() => setShowAvatarModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Profile Picture</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center">
            <div className="mb-3">
              <Image
                src={avatarPreview || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
                roundedCircle
                fluid
                style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                className="border"
              />
            </div>
            <Form.Group>
              <Form.Label>Choose an image file</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
              />
              <Form.Text className="text-muted">
                Recommended: Square image, 500x500 pixels or larger
              </Form.Text>
            </Form.Group>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAvatarModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={saveAvatar} disabled={!avatarFile}>
            <FaUpload className="me-2" />
            Upload Photo
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Account Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">Delete Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="danger">
            <h6>Warning: This action cannot be undone!</h6>
            <p className="mb-0">
              All your data, including interview history, progress, and achievements will be permanently deleted.
            </p>
          </Alert>
          <Form.Group className="mb-3">
            <Form.Label>
              Please type <strong>DELETE</strong> to confirm
            </Form.Label>
            <Form.Control type="text" placeholder="Type DELETE here" />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteAccount}>
            <FaTrash className="me-2" />
            Delete Account Permanently
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </>
  );
}

export default Profile;