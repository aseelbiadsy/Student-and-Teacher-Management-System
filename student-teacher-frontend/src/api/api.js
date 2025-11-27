import axios from "axios";

const API_URL = "http://localhost:5208/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  },
});

// Authentication
export const login = async (credentials) => {
  try {
    const response = await api.post("/Account/login", credentials);
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post("/Account/register", userData);
    return response.data;
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await api.post("/Account/logout");
    return response.data;
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get("/Account/user");
    return response.data;
  } catch (error) {
    console.error("Get current user error:", error);
    throw error;
  }
};

// Assignments
export const getAssignments = async () => {
  try {
    const response = await api.get("/Assignments");
    return response.data;
  } catch (error) {
    console.error("Get Assignments error:", error);
    throw error;
  }
};

// Create / Edit / Delete assignments (Teacher)
export const createAssignment = async (assignment) => {
  const response = await api.post("/Assignments", assignment);
  return response.data;
};

export const editAssignment = async (id, assignment) => {
  const response = await api.put(`/Assignments/${id}`, assignment);
  return response.data;
};

export const deleteAssignment = async (id) => {
  const response = await api.delete(`/Assignments/${id}`);
  return response.data;
};

// Submissions (Student)
// export const submitAssignment = async (assignmentId, submission) => {
//   const response = await api.post(`/Assignments/${assignmentId}/submit`, submission);
//   return response.data;
// };


export const submitAssignment = async (assignmentId, submission) => {
  try {
    console.log('Submitting assignment:', { assignmentId, submission });
    const response = await api.post(`/Assignments/${assignmentId}/submit`, submission);
    console.log('Submission successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Submit assignment error details:');
    console.error('URL:', `/Assignments/${assignmentId}/submit`);
    console.error('Data:', submission);
    console.error('Error response:', error.response?.data);
    console.error('Status:', error.response?.status);
    console.error('Headers:', error.response?.headers);
    throw error;
  }
};


export const getSubmissions = async (assignmentId) => {
  try {
    const response = await api.get(`/Assignments/${assignmentId}/submissions`);
    return response.data;
  } catch (error) {
    console.error('Error fetching submissions for assignment:', assignmentId);
    console.error('Error details:', error.response?.data || error.message);
    throw error;
  }
};


// Grade submission (Teacher)
export const gradeSubmission = async (submissionId, gradeData) => {
  const response = await api.post(`/Assignments/grade/${submissionId}`, gradeData);
  return response.data;
};

// Get student grades
export const getMyGrades = async () => {
  const response = await api.get("/Assignments/my-grades");
  return response.data;
};

export default api;