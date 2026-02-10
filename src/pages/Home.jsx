import React, { useState } from 'react'
import { Button, Col, Row, Card, Container, Modal, Navbar } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import titleImage from '../assets/Logo.png'
import { FaBrain } from 'react-icons/fa'


function Home() {
  const navigateByUrl = useNavigate()
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Navbar bg="light" variant="light" expand="lg" className="shadow-sm" sticky="top">
        <Container fluid>
          {/* Logo on the left */}
          <Navbar.Brand 
            href="/dashboard" 
            className="d-flex align-items-center fw-bold"
            style={{ fontSize: '1.5rem' }}
          >
            <FaBrain className="ms-5 me-2" style={{ color: '#0d6efd' }} />
            <span style={{ color: '#0d6efd' }}>Professor</span>
            <span style={{ color: '#333' }}>
              <img src={titleImage} height={'35px'} alt="Professor X Logo" />
            </span>
          </Navbar.Brand>
        </Container>
      </Navbar>
      
      {/* Hero Section */}
      <div className="containerflex">
        <div className="imagegif"></div>
        <div className="text">
          <h1>Welcome to Professor X</h1>
          <p>
            Your personal AI-powered interview assistant. Prepare for your dream job with intelligent, 
            adaptive mock interviews, real-time feedback, and performance analytics.
          </p>
          <Button 
            variant="primary" 
            style={{boxShadow:"none"}} 
            onClick={()=>navigateByUrl('/login')}
          >
            Get Started
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <Container className="mb-5 mt-5 d-flex align-items-center justify-content-center flex-column">
        <h2 className="mb-4">Why Choose Professor X?</h2>
        <Row className="mb-5 mt-5 w-100 d-flex justify-content-around">
          <Col xs={12} md={6} lg={4} className="d-flex justify-content-center mb-4">
            <Card style={{ width: '22rem', backgroundColor: '#f8f9fa' }} className="p-4 shadow">
              <Card.Img 
                variant="top" 
                height="250px" 
                src="https://miro.medium.com/0*onal3DYCeqP_nR2W.gif" 
                alt="AI-Powered Interviews"
              />
              <Card.Body>
                <Card.Title>AI-Powered Mock Interviews</Card.Title>
                <Card.Text>
                  Practice with our intelligent AI that adapts to your responses and provides 
                  realistic interview scenarios across various industries and roles.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} md={6} lg={4} className="d-flex justify-content-center mb-4">
            <Card style={{ width: '22rem', backgroundColor: '#f8f9fa' }} className="p-4 shadow">
              <Card.Img 
                variant="top" 
                height="250px" 
                src="https://cdn.dribbble.com/userupload/27415727/file/original-b6a0d494d6ea9043e56dffd584c3a60a.gif" 
                alt="Real-time Feedback"
              />
              <Card.Body>
                <Card.Title>Real-time Feedback</Card.Title>
                <Card.Text>
                  Get instant feedback on your answers, communication skills, and body language 
                  with detailed analysis and improvement suggestions.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} md={6} lg={4} className="d-flex justify-content-center mb-4">
            <Card style={{ width: '22rem', backgroundColor: '#f8f9fa' }} className="p-4 shadow">
              <Card.Img 
                variant="top" 
                height="250px" 
                src="https://miro.medium.com/0*TMvhLMMOy0NHzNIy.gif" 
                alt="Performance Analytics"
              />
              <Card.Body>
                <Card.Title>Performance Analytics</Card.Title>
                <Card.Text>
                  Track your progress with comprehensive analytics, identify strengths and weaknesses, 
                  and monitor your improvement over time.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* How It Works Section */}
      <div className='container border rounded p-5 border-light mb-5 d-flex align-items-center justify-content-between w-100 bg-light'>
        <div className="col-lg-5">
          <h3 className='mb-4'>Master Your Interview Skills</h3>
          <h6 className='mb-3'><span className='fw-bolder'>Personalized Practice</span>: Professor X customizes interview questions based on your target role, experience level, and industry. Our AI learns from your responses to provide increasingly relevant challenges.</h6>
          <h6 className='mb-3'><span className='fw-bolder'>Comprehensive Analysis</span>: Beyond just answers, we analyze your speech patterns, response timing, confidence level, and provide actionable insights to improve your interview performance.</h6>
          <h6 className='mb-3'><span className='fw-bolder'>Industry-Specific Preparation</span>: Whether you're interviewing for tech, finance, healthcare, or creative roles, Professor X has specialized modules to prepare you for industry-specific questions and scenarios.</h6>
          {/* <Button 
            variant="success" 
            className='mt-3'
            onClick={()=>navigateByUrl('/login')}
          >
            Start Free Trial
          </Button> */}
        </div>
        <div className="video col-lg-5 col-md-8 col-xs-12">
          <div className='bg-primary' style={{width: "100%", height: "315px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: "white"}}>
            <div className="text-center">
              <h4>Professor X Demo</h4>
              <p>AI Interview Assistant in Action</p>
              <Button 
                variant="light" 
                onClick={handleShow}
              >
                Watch Preview
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <Container className="mb-5">
        <h2 className="text-center mb-4">Success Stories</h2>
        <Row className="justify-content-center">
          <Col xs={12} md={4} className="mb-4">
            <Card className="text-center p-3 shadow">
              <Card.Body>
                <Card.Text className="fst-italic">
                  "Professor X helped me land my dream job at Google. The mock interviews were incredibly realistic!"
                </Card.Text>
                <Card.Subtitle className="mt-2 text-muted">- Sarah M., Software Engineer</Card.Subtitle>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={4} className="mb-4">
            <Card className="text-center p-3 shadow">
              <Card.Body>
                <Card.Text className="fst-italic">
                  "The feedback was so detailed and helpful. I improved my interview skills by 200% in just 2 weeks."
                </Card.Text>
                <Card.Subtitle className="mt-2 text-muted">- James K., Product Manager</Card.Subtitle>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={4} className="mb-4">
            <Card className="text-center p-3 shadow">
              <Card.Body>
                <Card.Text className="fst-italic">
                  "Best investment in my career. The AI adapts to your level and pushes you to improve."
                </Card.Text>
                <Card.Subtitle className="mt-2 text-muted">- Priya R., Data Scientist</Card.Subtitle>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* CTA Section */}
      <div className="bg-primary text-white py-5">
        <Container className="text-center">
          <h2 className="mb-3">Ready to Ace Your Next Interview?</h2>
          <p className="mb-4">Join thousands of professionals who have transformed their interview skills with Professor X</p>
          <Button 
            variant="light" 
            size="lg" 
            className="me-3"
            onClick={()=>navigateByUrl('/login')}
          >
            Start for Free
          </Button>
          <Button 
            variant="outline-light" 
            size="lg"
            onClick={handleShow}
          >
            See Demo
          </Button>
        </Container>
      </div>

      {/* Login Modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Body className='d-flex align-items-center justify-content-center mt-3'>
          <div className="text-center">
            <h4>Access Professor X</h4>
            <p>Login to start your AI-powered interview preparation journey</p>
          </div>
        </Modal.Body>
        <div className='d-flex mb-5 mt-2 align-items-center justify-content-center'>
          <Button style={{marginRight:'5px'}} variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button style={{marginLeft:'5px'}} variant="primary" onClick={()=>navigateByUrl('/login')}>
            Login / Sign Up
          </Button>
        </div>
      </Modal>
      
      <Footer />
    </>
  )
}

export default Home