import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // 1. First check if user already exists
      const response = await axios.get('https://68e3d31b8e14f4523daec9c5.mockapi.io/api/v1/users');
      const existingUser = response.data.find(user => user.email === email);

      if (existingUser) {
        setError('⚠️ User already exists');
        return;
      }

      // 2. Register new user
      await axios.post('https://68e3d31b8e14f4523daec9c5.mockapi.io/api/v1/users', {
        email,
        password,
        role
      });

      alert("✅ Registration successful! Please login.");
      navigate('/login');

    } catch (err) {
      console.error("Registration Error:", err);
      setError('❌ Something went wrong. Please try again.');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="card-title text-center mb-4">Register</h3>
          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input 
                type="email" 
                className="form-control" 
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)} 
                required 
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input 
                type="password" 
                className="form-control" 
                id="password"
                value={password}
                onChange={e => setPassword(e.target.value)} 
                required 
              />
            </div>

            <div className="mb-3">
              <label htmlFor="role" className="form-label">Select Role</label>
              <select 
                className="form-select" 
                id="role" 
                value={role}
                onChange={e => setRole(e.target.value)}
              >
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {error && <div className="alert alert-danger py-2">{error}</div>}

            <div className="d-grid">
              <button type="submit" className="btn btn-primary">Register</button>
            </div>
          </form>

          <p className="mt-3 text-center">
            Already have an account? <a href="/login">Login here</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
