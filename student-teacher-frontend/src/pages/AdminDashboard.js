import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  
  const [roles, setRoles] = useState(['Admin', 'Teacher', 'Student']);
  const [selectedRole, setSelectedRole] = useState('Admin');
  const [permissions, setPermissions] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('roles');
  const [loading, setLoading] = useState(false);

  const allPermissions = [
    'ManageUsers', 'ManageRoles', 'ManagePermissions',
    'CreateAssignment', 'EditAssignment', 'DeleteAssignment', 
    'GradeAssignment', 'ViewStudentSubmissions', 'ViewAssignments',
    'SubmitAssignment', 'ViewGrades'
  ];

  
  const defaultPermissions = {
    'Admin': ['ManageUsers', 'ManageRoles', 'ManagePermissions', 'CreateAssignment', 'EditAssignment', 'DeleteAssignment', 'GradeAssignment', 'ViewStudentSubmissions', 'ViewAssignments'],
    'Teacher': ['CreateAssignment', 'EditAssignment', 'DeleteAssignment', 'GradeAssignment', 'ViewStudentSubmissions', 'ViewAssignments'],
    'Student': ['ViewAssignments', 'SubmitAssignment', 'ViewGrades']
  };

  useEffect(() => {
    loadRoles();
    loadRealUsers(); 
  }, []);

  const loadRoles = async () => {
    setRoles(['Admin', 'Teacher', 'Student']);
    setSelectedRole('Admin');
    setPermissions(defaultPermissions['Admin']);
  };

  const loadRealUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/Admin/users', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const realUsers = await response.json();
        console.log('Real users loaded:', realUsers);
        setUsers(realUsers);
      } else {
  
        await loadUsersFromAlternativeAPI();
      }
    } catch (error) {
      console.error('Error loading real users:', error);
      await loadUsersFromAlternativeAPI();
    } finally {
      setLoading(false);
    }
  };

  const loadUsersFromAlternativeAPI = async () => {
    try {
      // جرب API آخر أو استخدم بيانات افتراضية
      const response = await fetch('/api/Account/users', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const usersData = await response.json();
        setUsers(usersData);
      } else {
        setUsers([
          { id: '1', email: 'admin@test.com', fullName: 'System Administrator', roles: ['Admin'] },
          { id: '2', email: 'teacher@test.com', fullName: 'Demo Teacher', roles: ['Teacher'] },
          { id: '3', email: 'student@test.com', fullName: 'Demo Student', roles: ['Student'] }
        ]);
      }
    } catch (error) {
      console.error('Error loading alternative users:', error);
      setUsers([
        { id: '1', email: 'admin@test.com', fullName: 'System Administrator', roles: ['Admin'] },
        { id: '2', email: 'teacher@test.com', fullName: 'Demo Teacher', roles: ['Teacher'] },
        { id: '3', email: 'student@test.com', fullName: 'Demo Student', roles: ['Student'] }
      ]);
    }
  };

  const loadRolePermissions = async (roleName) => {
    setPermissions(defaultPermissions[roleName] || []);
  };

  const handlePermissionChange = (permission, isChecked) => {
    if (isChecked) {
      setPermissions([...permissions, permission]);
    } else {
      setPermissions(permissions.filter(p => p !== permission));
    }
  };

  const savePermissions = async () => {
    console.log(`Saving permissions for ${selectedRole}:`, permissions);
    alert(`✅ Permissions for ${selectedRole} updated successfully!\n\nChanges saved in demo mode.`);
  };

  useEffect(() => {
    if (selectedRole) {
      loadRolePermissions(selectedRole);
    }
  }, [selectedRole]);

  return (
    <div>
      <nav style={{ backgroundColor: '#2c3e50', color: 'white', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Admin Dashboard</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ background: '#34495e', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.9rem' }}>
            Welcome, {user?.email}
          </span>
          <button onClick={() => navigate('/teacher')} style={{ background: '#3498db', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>
            Teacher View
          </button>
          <button onClick={logoutUser} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </nav>

      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>Admin Dashboard</h1>
        
        {/* Tabs */}
        <div style={{ marginBottom: '2rem' }}>
          <button
            onClick={() => setActiveTab('roles')}
            style={{
              backgroundColor: activeTab === 'roles' ? '#3498db' : '#ecf0f1',
              color: activeTab === 'roles' ? 'white' : '#2c3e50',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px 0 0 4px',
              cursor: 'pointer'
            }}
          >
            Role Management
          </button>
          <button
            onClick={() => setActiveTab('users')}
            style={{
              backgroundColor: activeTab === 'users' ? '#3498db' : '#ecf0f1',
              color: activeTab === 'users' ? 'white' : '#2c3e50',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '0 4px 4px 0',
              cursor: 'pointer'
            }}
          >
            User Management ({users.length})
          </button>
        </div>

        {/* Role Management */}
        {activeTab === 'roles' && (
          <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h2>Role Permissions Management</h2>
            
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Select Role:</label>
              <select 
                value={selectedRole} 
                onChange={(e) => setSelectedRole(e.target.value)}
                style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', width: '200px' }}
              >
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            <div>
              <h3>Permissions for {selectedRole}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                {allPermissions.map(permission => (
                  <div key={permission} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={permissions.includes(permission)}
                      onChange={(e) => handlePermissionChange(permission, e.target.checked)}
                    />
                    <label>{permission}</label>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={savePermissions}
              style={{
                backgroundColor: '#27ae60',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '4px',
                cursor: 'pointer',
                marginTop: '2rem'
              }}
            >
              Save Permissions
            </button>
          </div>
        )}

        {/* User Management */}
        {activeTab === 'users' && (
          <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h2>User Management</h2>
            
            {loading ? (
              <p>Loading users...</p>
            ) : users.length === 0 ? (
              <p>No users found.</p>
            ) : (
              <div>
                <div style={{ marginBottom: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '4px' }}>
                  <p style={{ margin: 0, fontWeight: 'bold' }}>
                    Total Users: {users.length} 
                    {users.filter(u => u.roles?.includes('Student')).length > 0 && 
                      ` (${users.filter(u => u.roles?.includes('Student')).length} Students)`
                    }
                    {users.filter(u => u.roles?.includes('Teacher')).length > 0 && 
                      ` (${users.filter(u => u.roles?.includes('Teacher')).length} Teachers)`
                    }
                  </p>
                </div>

                {users.map(user => (
                  <div key={user.id} style={{ padding: '1rem', border: '1px solid #eee', borderRadius: '4px', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong>{user.email}</strong>
                        <div>{user.fullName || 'No name'}</div>
                        <div style={{ fontSize: '0.9rem', color: '#666' }}>
                          Roles: {user.roles?.join(', ') || 'No roles'}
                        </div>
                      </div>
                      <div>
                        {user.roles?.includes('Student') && (
                          <span style={{ background: '#3498db', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                            Student
                          </span>
                        )}
                        {user.roles?.includes('Teacher') && (
                          <span style={{ background: '#e74c3c', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                            Teacher
                          </span>
                        )}
                        {user.roles?.includes('Admin') && (
                          <span style={{ background: '#27ae60', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                            Admin
                          </span>
                        )}
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

export default AdminDashboard;