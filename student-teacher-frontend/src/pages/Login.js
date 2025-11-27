import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Login.css"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { loginUser } = useAuth();
  const navigate = useNavigate();

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  const credentials = {
    email,     
    password,
    rememberMe: false   
  };

  try {
    const response = await loginUser(credentials);
    console.log("Login successful:", response);
    
     
    let userData;
    
    if (response.user) {
      userData = response.user;
    } else if (response.User) {
      userData = response.User;
    } else {
      userData = response;
    }
    
    console.log("User data:", userData);
    
    const userRoles = userData.roles || userData.Roles || [];
    console.log("User roles:", userRoles);
    
    if (userRoles.includes('Admin') || userRoles.includes('admin')) {
      navigate('/admin');
    } else if (userRoles.includes('Teacher') || userRoles.includes('teacher')) {
      navigate('/teacher');
    } else if (userRoles.includes('Student') || userRoles.includes('student')) {
      navigate('/student');
    } else {
      console.error("No valid roles found:", userRoles);
      setError("Unknown user role. Please contact administrator.");
    }
    
  } catch (err) {
    console.error("Login error:", err);
    setError("Login failed! Please check your credentials.");
  } finally {
    setLoading(false);
  }
};

  const fillDemoCredentials = (role) => {
  if (role === 'admin') {
    setEmail('admin@test.com');
    setPassword('Admin123!');
    console.log("Filled admin credentials");
  } else if (role === 'teacher') {
    setEmail('teacher@test.com');
    setPassword('Password123!');
  } else {
    setEmail('student@test.com');
    setPassword('Password123!');
  }
};

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-card">
          {/* Header Section */}
          <div className="login-header">
            <div className="logo">
              <div className="logo-icon">🎓</div>
              <h1>EduManage</h1>
            </div>
            <p className="login-subtitle">Student & Teacher Management System</p>
          </div>

          {/* Login Form */}
          <div className="login-form-section">
            <h2>Welcome Back</h2>
            <p className="form-subtitle">Sign in to your account</p>
            
            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  className="form-input"
                  placeholder="Enter your email"
                  required 
                />
              </div>
              
              <div className="form-group">
                <div className="password-label-container">
                  <label className="form-label">Password</label>
                  <a href="#" className="forgot-password">Forgot password?</a>
                </div>
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  className="form-input"
                  placeholder="Enter your password"
                  required 
                />
              </div>
              
              <button 
                type="submit" 
                disabled={loading} 
                className={`login-btn ${loading ? 'loading' : ''}`}
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Demo Credentials */}
          <div className="demo-section">
            <div className="demo-divider">
              <span>Quick Access</span>
            </div>
            
            <div className="demo-buttons">

              <button 
                type="button" 
                onClick={() => fillDemoCredentials('admin')}  
                className="demo-btn admin-demo"
              >
                <div className="demo-btn-content">
                  <span className="demo-icon">👨‍💼</span>
                  <div className="demo-text">
                    <strong>Admin Account</strong>
                    <span>admin@test.com</span>
                  </div>
                </div>
              </button>
              
              <button 
                type="button" 
                onClick={() => fillDemoCredentials('teacher')}
                className="demo-btn teacher-demo"
              >
                <div className="demo-btn-content">
                  <span className="demo-icon">👨‍🏫</span>
                  <div className="demo-text">
                    <strong>Teacher Account</strong>
                    <span>teacher@test.com</span>
                  </div>
                </div>
              </button>
              
              <button 
                type="button" 
                onClick={() => fillDemoCredentials('student')}
                className="demo-btn student-demo"
              >
                <div className="demo-btn-content">
                  <span className="demo-icon">👨‍🎓</span>
                  <div className="demo-text">
                    <strong>Student Account</strong>
                    <span>student@test.com</span>
                  </div>
                </div>
              </button>
            </div>
            
            <div className="demo-note">
              <span className="lock-icon">🔒</span>
              Passwords: <strong>Admin123!</strong> (Admin) / <strong>Password123!</strong> (Teacher/Student)
            </div>
          </div>

            {/* Footer */}
            <div className="login-footer">
              <p>Don't have an account? <a href="#" className="signup-link">Contact administrator</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;