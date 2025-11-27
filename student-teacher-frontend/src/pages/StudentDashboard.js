import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getAssignments, submitAssignment, getMyGrades } from '../api/api';

const StudentDashboard = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  
  const [assignments, setAssignments] = useState([]);
  const [myGrades, setMyGrades] = useState([]);
  const [submittingAssignment, setSubmittingAssignment] = useState(null);
  const [submissionContent, setSubmissionContent] = useState('');
  const [activeTab, setActiveTab] = useState('assignments');  

  useEffect(() => {
    loadAssignments();
    loadMyGrades();
  }, []);

  const loadAssignments = async () => {
    try {
      const data = await getAssignments();
      setAssignments(data);
    } catch (error) {
      console.error('Error loading assignments:', error);
      alert('Error loading assignments');
    }
  };

  const loadMyGrades = async () => {
    try {
      const data = await getMyGrades();
      setMyGrades(data);
    } catch (error) {
      console.error('Error loading grades:', error);
      alert('Error loading grades');
    }
  };

  const handleSubmitAssignment = async (assignmentId) => {
    if (!submissionContent.trim()) {
      alert('Please enter your submission content');
      return;
    }

    try {
      await submitAssignment(assignmentId, { content: submissionContent });
      setSubmittingAssignment(null);
      setSubmissionContent('');
      loadMyGrades(); 
      alert('Assignment submitted successfully!');
    } catch (error) {
      console.error('Error submitting assignment:', error);
      alert('Error submitting assignment');
    }
  };

  const getSubmissionForAssignment = (assignmentId) => {
    return myGrades.find(grade => grade.assignmentId === assignmentId);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div>
      {/* Navigation */}
      <nav style={{ 
        backgroundColor: '#2c3e50', 
        color: 'white', 
        padding: '1rem 2rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          Student Dashboard
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ 
            background: '#34495e', 
            padding: '0.5rem 1rem', 
            borderRadius: '20px', 
            fontSize: '0.9rem' 
          }}>
            Welcome, {user?.email}
          </span>
          <button 
            onClick={handleLogout} 
            style={{ 
              background: '#e74c3c', 
              color: 'white', 
              border: 'none', 
              padding: '0.5rem 1rem', 
              borderRadius: '4px', 
              cursor: 'pointer' 
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>Student Dashboard</h1>
        
        {/* Tabs */}
        <div style={{ marginBottom: '2rem' }}>
          <button
            onClick={() => setActiveTab('assignments')}
            style={{
              backgroundColor: activeTab === 'assignments' ? '#3498db' : '#ecf0f1',
              color: activeTab === 'assignments' ? 'white' : '#2c3e50',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px 0 0 4px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Assignments
          </button>
          <button
            onClick={() => setActiveTab('grades')}
            style={{
              backgroundColor: activeTab === 'grades' ? '#3498db' : '#ecf0f1',
              color: activeTab === 'grades' ? 'white' : '#2c3e50',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '0 4px 4px 0',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            My Grades
          </button>
        </div>

        {/* Assignments Tab */}
        {activeTab === 'assignments' && (
          <div>
            <h2>Available Assignments</h2>
            
            {assignments.length === 0 ? (
              <p>No assignments available at the moment.</p>
            ) : (
              <div>
                {assignments.map(assignment => {
                  const submission = getSubmissionForAssignment(assignment.id);
                  
                  return (
                    <div key={assignment.id} style={{
                      background: 'white',
                      padding: '1.5rem',
                      marginBottom: '1rem',
                      borderRadius: '8px',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50' }}>
                            {assignment.title}
                          </h3>
                          <p style={{ margin: '0 0 1rem 0', color: '#666' }}>
                            {assignment.description}
                          </p>
                          
                          {submission && (
                            <div style={{
                              padding: '0.5rem',
                              background: '#ecf0f1',
                              borderRadius: '4px',
                              marginTop: '1rem'
                            }}>
                              <strong>
                                Status: {submission.grade != null ? 'Graded' : 'Submitted'}
                              </strong>
                              {submission.grade != null && (
                                <span style={{ 
                                  marginLeft: '1rem', 
                                  color: '#27ae60',
                                  fontWeight: 'bold'
                                }}>
                                  Grade: {submission.grade}/100
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div>
                          {!submission ? (
                            <button
                              onClick={() => setSubmittingAssignment(assignment.id)}
                              style={{
                                backgroundColor: '#27ae60',
                                color: 'white',
                                border: 'none',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '4px',
                                cursor: 'pointer'
                              }}
                            >
                              Submit Assignment
                            </button>
                          ) : (
                            <button 
                              disabled
                              style={{
                                backgroundColor: '#bdc3c7',
                                color: '#7f8c8d',
                                border: 'none',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '4px',
                                cursor: 'not-allowed'
                              }}
                            >
                              Already Submitted
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Submission Form */}
                      {submittingAssignment === assignment.id && (
                        <div style={{
                          marginTop: '1rem',
                          paddingTop: '1rem',
                          borderTop: '1px solid #eee'
                        }}>
                          <h4>Submit Your Work</h4>
                          <textarea
                            value={submissionContent}
                            onChange={(e) => setSubmissionContent(e.target.value)}
                            placeholder="Enter your submission content here..."
                            rows="4"
                            style={{
                              width: '100%',
                              padding: '0.75rem',
                              border: '1px solid #ddd',
                              borderRadius: '4px',
                              fontSize: '1rem',
                              resize: 'vertical',
                              marginBottom: '1rem'
                            }}
                          />
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => handleSubmitAssignment(assignment.id)}
                              style={{
                                backgroundColor: '#3498db',
                                color: 'white',
                                border: 'none',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '4px',
                                cursor: 'pointer'
                              }}
                            >
                              Submit
                            </button>
                            <button
                              onClick={() => {
                                setSubmittingAssignment(null);
                                setSubmissionContent('');
                              }}
                              style={{
                                backgroundColor: '#95a5a6',
                                color: 'white',
                                border: 'none',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '4px',
                                cursor: 'pointer'
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Grades Tab */}
        {activeTab === 'grades' && (
          <div>
            <h2>My Grades</h2>
            
            {myGrades.length === 0 ? (
              <p>No submissions yet. Submit your first assignment to see grades here!</p>
            ) : (
              <div>
                {myGrades.map(submission => (
                  <div key={submission.id} style={{
                    background: 'white',
                    padding: '1.5rem',
                    marginBottom: '1rem',
                    borderRadius: '8px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                  }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50' }}>
                      {submission.assignment?.title}
                    </h3>
                    <p style={{ margin: '0 0 0.5rem 0' }}>
                      <strong>Your Submission:</strong> {submission.content}
                    </p>
                    <p style={{ margin: '0 0 0.5rem 0', color: '#666' }}>
                      <strong>Submitted:</strong> {new Date(submission.submittedAt).toLocaleString()}
                    </p>
                    
                    {submission.grade != null ? (
                      <div>
                        <p style={{ 
                          margin: '0', 
                          fontSize: '1.2rem',
                          color: submission.grade >= 70 ? '#27ae60' : '#e74c3c',
                          fontWeight: 'bold'
                        }}>
                          Grade: {submission.grade}/100
                        </p>
                        {submission.feedback && (
                          <p style={{ margin: '0.5rem 0 0 0' }}>
                            <strong>Feedback:</strong> {submission.feedback}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p style={{ 
                        margin: '0', 
                        color: '#f39c12',
                        fontStyle: 'italic'
                      }}>
                        Not graded yet
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;