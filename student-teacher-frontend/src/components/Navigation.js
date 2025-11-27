import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navigation = () => {
  const { user, logoutUser, isTeacher } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav style={{ 
      backgroundColor: '#2c3e50', 
      color: 'white', 
      padding: '1rem 2rem', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center' 
    }}>
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
        Student Teacher Management
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ 
          background: '#34495e', 
          padding: '0.5rem 1rem', 
          borderRadius: '20px', 
          fontSize: '0.9rem' 
        }}>
          Welcome, {user?.email} ({isTeacher() ? 'Teacher' : 'Student'})
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
  );
};

export default Navigation;