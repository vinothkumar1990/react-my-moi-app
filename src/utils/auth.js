// src/utils/auth.js
import axios from 'axios';

const API_URL = 'https://68e3d31b8e14f4523daec9c5.mockapi.io/api/v1/users';

// Session expiry time (5 minutes = 300000 ms)
const SESSION_EXPIRY_TIME = 2 * 60 * 60 * 1000; 

/**
 * 🔐 LOGIN FUNCTION
 */
export const loginUser = async (email, password, navigate) => {
  try {
    const res = await axios.get(API_URL);
    const users = res.data;

    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      // Save user
      localStorage.setItem('loggedInUser', JSON.stringify(user));

      // Save login timestamp
      localStorage.setItem('loginTime', Date.now());

      // Notify app
      window.dispatchEvent(new Event('userChanged'));

      // Navigate to home
      navigate('/');
      return true;
    }

    return false;
  } catch (err) {
    console.error('Login error:', err);
    return false;
  }
};

/**
 * ⏳ SESSION VALIDATION FUNCTION
 */
export const isSessionValid = () => {
  const loginTime = localStorage.getItem('loginTime');
  if (!loginTime) return false;

  const currentTime = Date.now();
  const diff = currentTime - loginTime;

  // Return true only if within 5 minutes
  return diff <= SESSION_EXPIRY_TIME;
};

/**
 * 🔒 CHECK AUTHENTICATION + SESSION EXPIRY
 */
export const isAuthenticated = () => {
  const user = localStorage.getItem('loggedInUser');
  if (!user) return false;

  // If session expired → logout user
  if (!isSessionValid()) {
    logoutUser();
    return false;
  }

  return true;
};

/**
 * 🎭 GET USER ROLE
 */
export const getUserRole = () => {
  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  return user?.role || null;
};

/**
 * 🅰️ GET USER INITIALS
 */
export const getUserInitials = () => {
  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  if (user?.name) {
    return user.name.substring(0, 2).toUpperCase();
  }
  return '';
};

/**
 * 🚪 LOGOUT FUNCTION
 */
export const logoutUser = () => {
  localStorage.removeItem('loggedInUser');
  localStorage.removeItem('loginTime');
  window.dispatchEvent(new Event('userChanged'));
};
