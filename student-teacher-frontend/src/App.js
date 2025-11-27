// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/" />;
  }

  const userRoles = user.roles || user.Roles || [];
  
  if (allowedRole && !userRoles.includes(allowedRole)) {
    return userRoles.includes('Teacher') 
      ? <Navigate to="/teacher" /> 
      : <Navigate to="/student" />;
  }

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route 
  path="/admin" 
  element={
    <ProtectedRoute allowedRole="Admin">
      <AdminDashboard />
    </ProtectedRoute>
  } 
/>
          <Route path="/" element={<Login />} />
          
          <Route 
            path="/student" 
            element={
              <ProtectedRoute allowedRole="Student">
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/teacher" 
            element={
              <ProtectedRoute allowedRole="Teacher">
                <TeacherDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;