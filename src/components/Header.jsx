import React, { useState, useEffect } from 'react';
import { Container, Nav, Navbar, Dropdown, Button, Badge, Modal } from 'react-bootstrap';
import { 
  FaUser, 
  FaBell, 
  FaCog, 
  FaSignOutAlt, 
  FaHome,
  FaChartLine,
  FaComments,
  FaBrain,
  FaQuestionCircle,
  FaEnvelope,
  FaTimes,
  FaSearch,
  FaMoon,
  FaSun
} from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import titleImage from '../assets/Logo.png';
import logImg from '../assets/loginperson.png';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Interview Completed', message: 'Your technical interview has been analyzed', time: '2 hours ago', read: false, type: 'success' },
    { id: 2, title: 'New Achievement', message: 'You unlocked "Quick Thinker" badge', time: '1 day ago', read: false, type: 'achievement' },
    { id: 3, title: 'AI Tip', message: 'Practice STAR method for better results', time: '2 days ago', read: true, type: 'tip' },
    { id: 4, title: 'Weekly Report', message: 'Your performance improved by 15% this week', time: '3 days ago', read: true, type: 'report' }
  ]);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('professorX_token');
    const userData = localStorage.getItem('professorX_user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    // Check for dark mode preference
    const savedDarkMode = localStorage.getItem('professorX_darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.body.classList.add('dark-mode');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('professorX_darkMode', newDarkMode.toString());
    
    if (newDarkMode) {
      document.body.classList.add('dark-mode');
      toast.info('Dark mode enabled', {
        position: "top-right",
        autoClose: 2000,
        icon: "🌙"
      });
    } else {
      document.body.classList.remove('dark-mode');
      toast.info('Light mode enabled', {
        position: "top-right",
        autoClose: 2000,
        icon: "☀️"
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('professorX_token');
    localStorage.removeItem('professorX_user');
    setShowLogoutModal(false);
    
    toast.info('Logged out successfully. See you soon! 👋', {
      position: "top-center",
      autoClose: 3000,
      icon: "🚪"
    });
    
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    toast.success('All notifications marked as read', {
      position: "top-right",
      autoClose: 2000,
      icon: "✓"
    });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'success': return '✅';
      case 'achievement': return '🏆';
      case 'tip': return '💡';
      case 'report': return '📊';
      default: return '📢';
    }
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <FaHome /> },
    { path: '/interview', label: 'Interview', icon: <FaComments /> },
    { path: '/analytics', label: 'Analytics', icon: <FaChartLine /> },
    { path: '/profile', label: 'Profile', icon: <FaUser /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <Navbar bg={darkMode ? "dark" : "light"} variant={darkMode ? "dark" : "light"} expand="lg" className="shadow-sm" sticky="top">
        <Container fluid>
          {/* Brand/Logo */}
          <Navbar.Brand 
            href="/dashboard" 
            className="d-flex align-items-center fw-bold"
            style={{ 
              color: darkMode ? '#fff' : '#333',
              fontSize: '1.5rem'
            }}
          >
            <FaBrain className="me-2" style={{ color: '#0d6efd' }} />
            <span style={{ color: '#0d6efd' }}>Professor</span>
            <span style={{ color: darkMode ? '#fff' : '#333' }}><img src={titleImage} height={'35px'} alt=""  /></span>
          </Navbar.Brand>

          {/* Toggle for mobile */}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          
          <Navbar.Collapse id="basic-navbar-nav">
            {/* Navigation Links - Center */}
            <Nav className="mx-auto">
              {navItems.map((item) => (
                <Nav.Link
                  key={item.path}
                  href={item.path}
                  className={`mx-2 ${isActive(item.path) ? 'active fw-bold' : ''}`}
                  style={{
                    color: isActive(item.path) ? '#0d6efd' : (darkMode ? '#ccc' : '#666'),
                    borderBottom: isActive(item.path) ? '2px solid #0d6efd' : 'none',
                    paddingBottom: '5px'
                  }}
                >
                  <span className="d-none d-md-inline">{item.icon} </span>
                  {item.label}
                </Nav.Link>
              ))}
            </Nav>

            {/* Right side icons/buttons */}
            <Nav className="ms-auto align-items-center">
              {/* Dark/Light Mode Toggle */}
              <Button
                variant="outline-secondary"
                size="sm"
                className="me-2"
                onClick={toggleDarkMode}
                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {darkMode ? <FaSun /> : <FaMoon />}
              </Button>

              {/* Search Button (Optional)
              <Button
                variant="outline-secondary"
                size="sm"
                className="me-2 d-none d-md-block"
                title="Search"
              >
                <FaSearch />
              </Button> */}

              {/* Notifications Dropdown */}
              <Dropdown className="me-2">
                <Dropdown.Toggle
                  variant="outline-secondary"
                  size="sm"
                  id="dropdown-notifications"
                  className="position-relative"
                >
                  <FaBell />
                  {unreadCount > 0 && (
                    <Badge
                      bg="danger"
                      pill
                      className="position-absolute"
                      style={{
                        top: '-5px',
                        left: '-5px',
                        fontSize: '0.6rem'
                      }}
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </Dropdown.Toggle>

                <Dropdown.Menu style={{ minWidth: '300px' }} >
                  <div className="px-3 py-2 d-flex justify-content-between align-items-center border-bottom dropdown-menu-start">
                    <h6 className="mb-0">Notifications</h6>
                    {unreadCount > 0 && (
                      <Button
                        variant="link"
                        size="sm"
                        className="p-0"
                        onClick={markAllAsRead}
                      >
                        Mark all as read
                      </Button>
                    )}
                  </div>
                  
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <Dropdown.Item
                          key={notification.id}
                          className={`py-3 ${!notification.read ? 'bg-light' : ''}`}
                          onClick={() => markNotificationAsRead(notification.id)}
                        >
                          <div className="d-flex">
                            <div className="me-3" style={{ fontSize: '1.2rem' }}>
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-grow-1">
                              <div className="d-flex justify-content-between">
                                <strong>{notification.title}</strong>
                                {!notification.read && (
                                  <Badge bg="primary" pill size="sm">New</Badge>
                                )}
                              </div>
                              <p className="mb-1 small">{notification.message}</p>
                              <small className="text-muted">{notification.time}</small>
                            </div>
                          </div>
                        </Dropdown.Item>
                      ))
                    ) : (
                      <Dropdown.Item disabled className="text-center py-3">
                        No notifications
                      </Dropdown.Item>
                    )}
                  </div>
                  
                  <div className="px-3 py-2 border-top">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="w-100"
                      onClick={() => navigate('/notifications')}
                    >
                      View All Notifications
                    </Button>
                  </div>
                </Dropdown.Menu>
              </Dropdown>

              {/* User Profile Dropdown */}
              {user ? (
                <Dropdown>
                  <Dropdown.Toggle
                    variant="outline-secondary"
                    size="sm"
                    id="dropdown-user"
                    className="d-flex align-items-center "
                  >
                    <img
                      src={logImg}
                      alt="Profile"
                      height="30"
                      width="30"
                      className="rounded-circle me-2"
                    />
                    <span className="d-none d-md-inline">
                      {user.name?.split(' ')[0] || user.email?.split('@')[0] || 'User'}
                    </span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Header>
                      <div className="d-flex align-items-center">
                        <img
                          src={logImg}
                          alt="Profile"
                          height="40"
                          width="40"
                          className="rounded-circle me-2"
                        />
                        <div>
                          <strong>{user.name || 'User'}</strong>
                          <div className="small text-muted">{user.email || ''}</div>
                        </div>
                      </div>
                    </Dropdown.Header>
                    
                    <Dropdown.Divider />
                    
                    <Dropdown.Item onClick={() => navigate('/profile')}>
                      <FaUser className="me-2" /> My Profile
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => navigate('/settings')}>
                      <FaCog className="me-2" /> Settings
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => navigate('/help')}>
                      <FaQuestionCircle className="me-2" /> Help & Support
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => navigate('/feedback')}>
                      <FaEnvelope className="me-2" /> Send Feedback
                    </Dropdown.Item>
                    
                    <Dropdown.Divider />
                    
                    <Dropdown.Item onClick={() => setShowLogoutModal(true)}>
                      <FaSignOutAlt className="me-2" /> Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/home')}
                >
                  Login
                </Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Logout Confirmation Modal */}
      <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to logout from Professor X?</p>
          <div className="alert alert-info">
            <FaBrain className="me-2" />
            Your progress and data will be saved automatically.
          </div>
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

      {/* Add CSS for dark mode */}
      <style jsx>{`
        .dark-mode {
          background-color: #121212;
          color: #ffffff;
        }

        
        .dark-mode .navbar {
          background-color: #1a1a1a !important;
        }
        
        .dark-mode .dropdown-menu {
          background-color: #2d2d2d;
          color: #ffffff;
        }
        
        .dark-mode .dropdown-item {
          color: #ffffff;
        }
        
        .dark-mode .dropdown-item:hover {
          background-color: #3d3d3d;
        }
        
        .dark-mode .text-muted {
          color: #aaaaaa !important;
        }
        
        .notification-item:hover {
          background-color: #f8f9fa;
        }
        
        .dark-mode .notification-item:hover {
          background-color: #3d3d3d;
        }
        
        .active {
          color: #0d6efd !important;
        }
        
        @media (max-width: 768px) {
          .navbar-brand {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </>
  );
}

export default Header;