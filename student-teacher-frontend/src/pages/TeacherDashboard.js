import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  getAssignments, 
  createAssignment, 
  editAssignment, 
  deleteAssignment,
  getSubmissions,
  gradeSubmission
} from '../api/api';

const TeacherDashboard = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [loading, setLoading] = useState(false); 
  const [gradeInputs, setGradeInputs] = useState({});

  const [assignmentForm, setAssignmentForm] = useState({
    title: '',
    description: ''
  });

  useEffect(() => {
    loadAssignments();
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

  const loadSubmissions = async (assignment) => {
    try {
      const data = await getSubmissions(assignment.id);
      setSubmissions(data);
      setSelectedAssignment(assignment);
      setShowSubmissions(true);
      setGradeInputs({}); 
    } catch (error) {
      console.error('Error loading submissions:', error);
      alert('Error loading submissions');
    }
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createAssignment(assignmentForm);
      setShowAssignmentForm(false);
      setAssignmentForm({ title: '', description: '' });
      loadAssignments();
      alert('Assignment created successfully!Emails sent to students.');
    } catch (error) {
      console.error('Error creating assignment:', error);
      alert('Error creating assignment');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAssignment = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await editAssignment(selectedAssignment.id, assignmentForm);
      setSelectedAssignment(null);
      setAssignmentForm({ title: '', description: '' });
      loadAssignments();
      setShowAssignmentForm(false);
      alert('Assignment updated successfully!');
    } catch (error) {
      console.error('Error updating assignment:', error);
      alert('Error updating assignment');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        await deleteAssignment(assignmentId);
        loadAssignments();
        alert('Assignment deleted successfully!');
      } catch (error) {
        console.error('Error deleting assignment:', error);
        alert('Error deleting assignment');
      }
    }
  };

  const handleGradeSubmission = async (submissionId) => {
    const gradeValue = gradeInputs[submissionId]?.grade;
    const feedbackValue = gradeInputs[submissionId]?.feedback;
    
    if (!gradeValue) {
      alert('Please enter a grade');
      return;
    }
    
    const grade = parseInt(gradeValue);
    if (grade < 0 || grade > 100) {
        alert('Grade must be between 0 and 100');
        return;
    }

    try {
      await gradeSubmission(submissionId, { 
        grade, 
        feedback: feedbackValue || 'No feedback provided' 
      });
      alert('Grade submitted successfully!');
      if (selectedAssignment) {
        loadSubmissions(selectedAssignment);
      }
    } catch (error) {
      console.error('Error grading submission:', error);
      alert('Error grading submission');
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const startEditAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setAssignmentForm({
      title: assignment.title,
      description: assignment.description || ''
    });
    setShowAssignmentForm(true);
  };

  return (
    <div>
      {/* Navigation */}
      <nav style={{ backgroundColor: '#2c3e50', color: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Teacher Dashboard</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ background: '#34495e', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.9rem' }}>
            Welcome, {user?.email}
          </span>
          <button onClick={handleLogout} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </nav>

      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1>Teacher Dashboard</h1>
          {!showSubmissions && (
            <button 
                onClick={() => {
                    setShowAssignmentForm(true);
                    setSelectedAssignment(null);
                    setAssignmentForm({ title: '', description: '' });
                }}
                style={{ backgroundColor: '#3498db', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '4px', cursor: 'pointer', fontSize: '1rem' }}
            >
                Create New Assignment
            </button>
          )}
        </div>

        {/* Assignment Form */}
        {showAssignmentForm && (
          <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
            <h3>{selectedAssignment ? 'Edit Assignment' : 'Create New Assignment'}</h3>
            <form onSubmit={selectedAssignment ? handleUpdateAssignment : handleCreateAssignment}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Title:</label>
                <input
                  type="text"
                  value={assignmentForm.title}
                  onChange={(e) => setAssignmentForm({...assignmentForm, title: e.target.value})}
                  required
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem' }}
                />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Description:</label>
                <textarea
                  value={assignmentForm.description}
                  onChange={(e) => setAssignmentForm({...assignmentForm, description: e.target.value})}
                  rows="4"
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem', resize: 'vertical' }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="submit" disabled={loading} style={{ backgroundColor: '#27ae60', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '4px', cursor: 'pointer' }}>
                  {loading ? 'Saving...' : (selectedAssignment ? 'Update' : 'Create')}
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setShowAssignmentForm(false);
                    setSelectedAssignment(null);
                    setAssignmentForm({ title: '', description: '' });
                  }}
                  style={{ backgroundColor: '#95a5a6', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Submissions View */}
        {showSubmissions ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <button 
                onClick={() => setShowSubmissions(false)}
                style={{ backgroundColor: '#95a5a6', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
              >
                ← Back to Assignments
              </button>
              <h2>Submissions for: {selectedAssignment?.title}</h2>
            </div>
            
            {submissions.length === 0 ? (
              <p>No submissions yet.</p>
            ) : (
              <div>
                {submissions.map(submission => (
                  <div key={submission.id} style={{ background: 'white', padding: '1.5rem', marginBottom: '1rem', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                    <h4>Submission from: {submission.student?.email}</h4>
                    <p><strong>Content:</strong> {submission.content}</p>
                    <p><strong>Submitted:</strong> {new Date(submission.submittedAt).toLocaleString()}</p>
                    
            
                    {submission.grade != null ? (
                      <div>
                        <p style={{ color: '#27ae60', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>
                          Grade: {submission.grade}/100
                        </p>
                        {submission.feedback && (
                          <p style={{ margin: '0', padding: '0.5rem', background: '#f8f9fa', borderRadius: '4px' }}>
                            <strong>Feedback:</strong> {submission.feedback}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div style={{ marginTop: '10px' }}>
                        <div style={{ marginBottom: '0.5rem' }}>
                          <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>
                            Grade (0-100):
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={gradeInputs[submission.id]?.grade || ''}
                            onChange={(e) => setGradeInputs({
                              ...gradeInputs,
                              [submission.id]: {
                                ...gradeInputs[submission.id],
                                grade: e.target.value
                              }
                            })}
                            style={{ 
                              padding: '0.5rem', 
                              border: '1px solid #ddd', 
                              borderRadius: '4px', 
                              width: '100px' 
                            }}
                          />
                        </div>
                        
                        <div style={{ marginBottom: '0.5rem' }}>
                          <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>
                            Feedback:
                          </label>
                          <textarea
                            value={gradeInputs[submission.id]?.feedback || ''}
                            onChange={(e) => setGradeInputs({
                              ...gradeInputs,
                              [submission.id]: {
                                ...gradeInputs[submission.id],
                                feedback: e.target.value
                              }
                            })}
                            rows="3"
                            placeholder="Provide feedback to the student..."
                            style={{ 
                              width: '100%', 
                              padding: '0.5rem', 
                              border: '1px solid #ddd', 
                              borderRadius: '4px',
                              resize: 'vertical'
                            }}
                          />
                        </div>
                        
                        <button
                          onClick={() => handleGradeSubmission(submission.id)}
                          style={{ 
                            backgroundColor: '#3498db', 
                            color: 'white', 
                            border: 'none', 
                            padding: '0.5rem 1rem', 
                            borderRadius: '4px', 
                            cursor: 'pointer' 
                          }}
                        >
                          Submit Grade & Feedback
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
        /* Assignments List */
<div>
  <h2>Your Assignments ({assignments.length})</h2>
  
  {assignments.some(a => a.ungradedCount > 0) && (
    <div style={{
      background: '#fff3cd',
      border: '1px solid #ffeaa7',
      padding: '1rem',
      borderRadius: '8px',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    }}>
      <span style={{ fontSize: '1.2rem' }}>⚠️</span>
      <div>
        <strong>Attention Needed!</strong>
        <p>You have {assignments.reduce((sum, a) => sum + (a.ungradedCount || 0), 0)} submissions waiting to be graded.</p>
      </div>
    </div>
  )}
  
  {assignments.length === 0 ? (
    <p>No assignments created yet. Create your first assignment!</p>
  ) : (
    <div>
      {assignments.map(assignment => (
        <div key={assignment.id} style={{ background: 'white', padding: '1.5rem', marginBottom: '1rem', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50' }}>{assignment.title}</h3>
              <p style={{ margin: '0 0 1rem 0', color: '#666' }}>{assignment.description}</p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{
                  background: assignment.submissionCount > 0 ? '#e74c3c' : '#95a5a6',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  {assignment.submissionCount > 0 ? '📥' : '📭'} 
                  {assignment.submissionCount || 0} Submissions
                </span>
                
                {assignment.ungradedCount > 0 && (
                  <span style={{
                    background: '#f39c12',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>
                    ⭐ {assignment.ungradedCount} Need Grading
                  </span>
                )}
                
                {assignment.submissionCount > 0 && assignment.ungradedCount === 0 && (
                  <span style={{
                    background: '#27ae60',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold'
                  }}>
                    ✅ All Graded
                  </span>
                )}
              </div>
              
              <small style={{ color: '#999' }}>Created by: {assignment.createdBy?.email}</small>
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => loadSubmissions(assignment)}
                style={{ 
                  backgroundColor: '#3498db', 
                  color: 'white', 
                  border: 'none', 
                  padding: '0.5rem 1rem', 
                  borderRadius: '4px', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                📋 View Submissions
                {assignment.submissionCount > 0 && (
                  <span style={{
                    background: 'white',
                    color: '#3498db',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    fontSize: '0.7rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold'
                  }}>
                    {assignment.submissionCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => startEditAssignment(assignment)}
                style={{ backgroundColor: '#f39c12', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteAssignment(assignment.id)}
                style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
              >
                Delete
              </button>
            </div>
          </div>
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

export default TeacherDashboard;