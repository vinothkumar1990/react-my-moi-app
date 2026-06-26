// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

/**
 * 🔒 PrivateRoute Component
 * Protects routes from unauthenticated access.
 * If user is logged in → render the child component.
 * Otherwise → redirect to /login.
 */
const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
