import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedStudentRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('studentLoggedIn') === 'true';
  
  return isAuthenticated ? children : <Navigate to="/student/login" />;
};

export default ProtectedStudentRoute;
