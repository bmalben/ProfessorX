import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Dropdown,
  ProgressBar,
  Badge,
  Table,
  Tab,
  Tabs,
  Form,
  Alert
} from 'react-bootstrap';
import {
  FaChartLine,
  FaChartBar,
  FaChartPie,
  FaCalendarAlt,
  FaDownload,
  FaFilter,
  FaArrowUp,
  FaArrowDown,
  FaStar,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaBrain,
  FaMicrophone,
  FaComments,
  FaRobot
} from 'react-icons/fa';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import Header from '../components/Header';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showDetailedView, setShowDetailedView] = useState(false);

  // Performance data for line chart
  const performanceData = [
    { date: 'Jan 1', score: 6.5 },
    { date: 'Jan 8', score: 7.2 },
    { date: 'Jan 15', score: 7.8 },
    { date: 'Jan 22', score: 8.3 },
    { date: 'Jan 29', score: 8.7 },
    { date: 'Feb 5', score: 9.1 },
    { date: 'Feb 12', score: 8.9 },
  ];

  // Category-wise performance
  const categoryData = [
    { name: 'Technical', value: 8.7, color: '#8884d8' },
    { name: 'Behavioral', value: 8.2, color: '#82ca9d' },
    { name: 'System Design', value: 7.8, color: '#ffc658' },
    { name: 'Coding', value: 9.1, color: '#ff8042' },
    { name: 'Problem Solving', value: 8.5, color: '#0088fe' },
  ];

  // Interview types distribution
  const interviewTypeData = [
    { name: 'Technical', value: 12, color: '#8884d8' },
    { name: 'Behavioral', value: 8, color: '#82ca9d' },
    { name: 'System Design', value: 5, color: '#ffc658' },
    { name: 'Mock', value: 15, color: '#ff8042' },
  ];

  // Skill radar data
  const skillData = [
    { subject: 'Algorithm', A: 85, fullMark: 100 },
    { subject: 'DS', A: 78, fullMark: 100 },
    { subject: 'System Design', A: 65, fullMark: 100 },
    { subject: 'Communication', A: 90, fullMark: 100 },
    { subject: 'Problem Solving', A: 82, fullMark: 100 },
    { subject: 'Time Management', A: 75, fullMark: 100 },
  ];

  // Recent interviews table data
  const recentInterviews = [
    { id: 1, type: 'Technical', date: '2024-02-10', score: 8.9, duration: '45m', aiFeedback: 'Excellent problem-solving' },
    { id: 2, type: 'Behavioral', date: '2024-02-08', score: 8.2, duration: '30m', aiFeedback: 'Strong communication skills' },
    { id: 3, type: 'System Design', date: '2024-02-05', score: 7.8, duration: '60m', aiFeedback: 'Good architecture thinking' },
    { id: 4, type: 'Technical', date: '2024-02-01', score: 8.5, duration: '50m', aiFeedback: 'Fast implementation' },
    { id: 5, type: 'Mock', date: '2024-01-28', score: 9.1, duration: '55m', aiFeedback: 'Outstanding performance' },
  ];

  // Stats cards data
  const stats = [
    { title: 'Total Interviews', value: '40', icon: <FaComments />, change: '+12%', trend: 'up', color: '#8884d8' },
    { title: 'Avg Score', value: '8.3/10', icon: <FaChartLine />, change: '+0.4', trend: 'up', color: '#82ca9d' },
    { title: 'Success Rate', value: '85%', icon: <FaCheckCircle />, change: '+5%', trend: 'up', color: '#ffc658' },
    { title: 'Avg Duration', value: '45m', icon: <FaClock />, change: '-3m', trend: 'down', color: '#ff8042' },
  ];

  // Weak areas data
  const weakAreas = [
    { area: 'Dynamic Programming', progress: 65, improvement: 15 },
    { area: 'Distributed Systems', progress: 58, improvement: 8 },
    { area: 'Concurrency', progress: 62, improvement: 12 },
    { area: 'Database Design', progress: 70, improvement: 18 },
  ];

  const handleExportData = () => {
    alert('Exporting analytics data...');
    // Implement actual export logic here
  };

  const getTrendIcon = (trend) => {
    return trend === 'up' ? <FaArrowUp className="text-success" /> : <FaArrowDown className="text-danger" />;
  };

  return (
    <div className="analytics-page">
      <Header/>
      
      <Container fluid className="mt-4">
        {/* Header Section */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="mb-1">
                  <FaChartLine className="me-2" style={{ color: '#0d6efd' }} />
                  Analytics Dashboard
                </h2>
                <p className="text-muted mb-0">
                  Track your interview performance and improvement over time
                </p>
              </div>
              <div className="d-flex gap-2">
                <Dropdown>
                  <Dropdown.Toggle variant="outline-secondary">
                    <FaCalendarAlt className="me-2" />
                    {timeRange === 'week' ? 'Last Week' : 
                     timeRange === 'month' ? 'Last Month' : 
                     timeRange === 'quarter' ? 'Last Quarter' : 'Custom'}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setTimeRange('week')}>Last Week</Dropdown.Item>
                    <Dropdown.Item onClick={() => setTimeRange('month')}>Last Month</Dropdown.Item>
                    <Dropdown.Item onClick={() => setTimeRange('quarter')}>Last Quarter</Dropdown.Item>
                    <Dropdown.Item onClick={() => setTimeRange('custom')}>Custom Range</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                
                <Dropdown>
                  <Dropdown.Toggle variant="outline-secondary">
                    <FaFilter className="me-2" />
                    {categoryFilter === 'all' ? 'All Categories' : categoryFilter}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setCategoryFilter('all')}>All Categories</Dropdown.Item>
                    <Dropdown.Item onClick={() => setCategoryFilter('Technical')}>Technical</Dropdown.Item>
                    <Dropdown.Item onClick={() => setCategoryFilter('Behavioral')}>Behavioral</Dropdown.Item>
                    <Dropdown.Item onClick={() => setCategoryFilter('System Design')}>System Design</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                
                <Button variant="primary" onClick={handleExportData}>
                  <FaDownload className="me-2" />
                  Export
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        {/* Stats Cards */}
        <Row className="mb-4">
          {stats.map((stat, index) => (
            <Col key={index} md={3} sm={6} className="mb-3">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 className="text-muted mb-2">{stat.title}</h6>
                      <h3 className="mb-0">{stat.value}</h3>
                      <div className="d-flex align-items-center mt-2">
                        {getTrendIcon(stat.trend)}
                        <span className={`ms-1 ${stat.trend === 'up' ? 'text-success' : 'text-danger'}`}>
                          {stat.change}
                        </span>
                        <span className="text-muted ms-2">from last period</span>
                      </div>
                    </div>
                    <div style={{ color: stat.color, fontSize: '2rem' }}>
                      {stat.icon}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Main Charts Row */}
        <Row className="mb-4">
          {/* Performance Trend Chart */}
          <Col lg={8} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Header className="bg-white">
                <h5 className="mb-0">
                  <FaChartLine className="me-2" />
                  Performance Trend
                </h5>
              </Card.Header>
              <Card.Body>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 10]} />
                    <Tooltip 
                      formatter={(value) => [`${value}/10`, 'Score']}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#8884d8" 
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Interview Score"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="score" 
                      fill="#8884d8" 
                      fillOpacity={0.1}
                      strokeWidth={0}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>

          {/* Category Performance */}
          <Col lg={4} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Header className="bg-white">
                <h5 className="mb-0">
                  <FaChartPie className="me-2" />
                  Category Performance
                </h5>
              </Card.Header>
              <Card.Body>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}/10`, 'Score']} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-3">
                  {categoryData.map((item, index) => (
                    <div key={index} className="d-flex align-items-center mb-2">
                      <div 
                        style={{
                          width: '12px',
                          height: '12px',
                          backgroundColor: item.color,
                          borderRadius: '2px',
                          marginRight: '8px'
                        }}
                      />
                      <span className="me-2">{item.name}</span>
                      <Badge bg="light" text="dark" className="ms-auto">
                        {item.value}/10
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Second Row */}
        <Row className="mb-4">
          {/* Skills Radar Chart */}
          <Col lg={6} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Header className="bg-white">
                <h5 className="mb-0">
                  <FaBrain className="me-2" />
                  Skills Assessment
                </h5>
              </Card.Header>
              <Card.Body>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar
                      name="Your Score"
                      dataKey="A"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.6}
                    />
                    <Tooltip />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          </Col>

          {/* Weak Areas Progress */}
          <Col lg={6} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Header className="bg-white">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <FaChartBar className="me-2" />
                    Areas Needing Improvement
                  </h5>
                  <Badge bg="warning" text="dark">
                    Focus Areas
                  </Badge>
                </div>
              </Card.Header>
              <Card.Body>
                {weakAreas.map((area, index) => (
                  <div key={index} className="mb-4">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="fw-medium">{area.area}</span>
                      <span className="text-success">
                        <FaArrowUp className="me-1" />
                        +{area.improvement}%
                      </span>
                    </div>
                    <ProgressBar 
                      now={area.progress} 
                      label={`${area.progress}%`}
                      className="mb-3"
                      variant={area.progress < 70 ? "danger" : area.progress < 85 ? "warning" : "success"}
                    />
                  </div>
                ))}
                <Alert variant="info" className="mt-3">
                  <FaRobot className="me-2" />
                  <strong>AI Recommendation:</strong> Focus on Dynamic Programming practice. 
                  Our AI suggests 3 practice sessions per week to reach 80% proficiency.
                </Alert>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Recent Interviews Table */}
        <Row className="mb-4">
          <Col>
            <Card className="shadow-sm">
              <Card.Header className="bg-white">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <FaCalendarAlt className="me-2" />
                    Recent Interviews
                  </h5>
                  <Button 
                    variant="link" 
                    onClick={() => setShowDetailedView(!showDetailedView)}
                  >
                    {showDetailedView ? 'Show Less' : 'View All'}
                  </Button>
                </div>
              </Card.Header>
              <Card.Body>
                <Table hover responsive>
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Date</th>
                      <th>Score</th>
                      <th>Duration</th>
                      <th>AI Feedback</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentInterviews.map((interview) => (
                      <tr key={interview.id}>
                        <td>
                          <Badge 
                            bg={
                              interview.type === 'Technical' ? 'primary' : 
                              interview.type === 'Behavioral' ? 'success' : 
                              interview.type === 'System Design' ? 'warning' : 'info'
                            }
                          >
                            {interview.type}
                          </Badge>
                        </td>
                        <td>{interview.date}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <span className="fw-bold me-2">{interview.score}</span>
                            <FaStar className="text-warning" />
                          </div>
                        </td>
                        <td>{interview.duration}</td>
                        <td className="text-truncate" style={{ maxWidth: '200px' }}>
                          {interview.aiFeedback}
                        </td>
                        <td>
                          <Button variant="outline-primary" size="sm">
                            Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* AI Insights Section */}
        <Row className="mb-4">
          <Col>
            <Card className="shadow-sm border-primary">
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">
                  <FaRobot className="me-2" />
                  AI Coach Insights
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={4}>
                    <div className="text-center p-3">
                      <div className="display-4 text-primary mb-2">85%</div>
                      <p className="text-muted">Readiness Score</p>
                      <ProgressBar now={85} variant="primary" className="mb-3" />
                      <small>Based on your last 10 interviews</small>
                    </div>
                  </Col>
                  <Col md={8}>
                    <h6>Personalized Recommendations:</h6>
                    <ul className="list-unstyled">
                      <li className="mb-2">
                        <FaCheckCircle className="text-success me-2" />
                        <strong>Strengths:</strong> Excellent communication skills and problem-solving approach
                      </li>
                      <li className="mb-2">
                        <FaTimesCircle className="text-danger me-2" />
                        <strong>Improve:</strong> Practice more distributed system design questions
                      </li>
                      <li className="mb-2">
                        <FaBrain className="text-info me-2" />
                        <strong>Next Step:</strong> Schedule 2 mock interviews focused on system design
                      </li>
                      <li>
                        <FaMicrophone className="text-warning me-2" />
                        <strong>Tip:</strong> Use the STAR method consistently in behavioral interviews
                      </li>
                    </ul>
                    <Button variant="primary" className="mt-2">
                      Get Customized Practice Plan
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Custom CSS */}
      <style jsx>{`
        .analytics-page {
          min-height: 100vh;
          background-color: #f8f9fa;
        }
        
        .card {
          border: none;
          border-radius: 10px;
          transition: transform 0.2s;
        }
        
        .card:hover {
          transform: translateY(-2px);
        }
        
        .progress {
          height: 8px;
          border-radius: 4px;
        }
        
        .badge {
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
        }
        
        .table th {
          border-top: none;
          font-weight: 600;
          color: #6c757d;
        }
        
        @media (max-width: 768px) {
          .display-4 {
            font-size: 2rem;
          }
          
          .card-body {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Analytics;