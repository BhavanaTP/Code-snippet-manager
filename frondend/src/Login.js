import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import axios from 'axios';

export default function Login() {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      login(res.data.token, res.data.username);
      navigate('/home');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-card">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={e => setForm({ ...form, username: e.target.value })}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>
        New user? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}