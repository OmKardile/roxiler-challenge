import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', address: '' });
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://roxiler-challenge.onrender.com/api/signup', formData);
      alert('Registration successful! You can now login.');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.error || 'Registration failed.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
      <h2>Normal User Registration</h2>
      <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input type="text" placeholder="Full Name (20-60 chars)" required minLength="20" maxLength="60" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
        <input type="email" placeholder="Email Address" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
        <input type="text" placeholder="Address (Max 400 chars)" required maxLength="400" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
        <input type="password" placeholder="Password (8-16 chars)" required minLength="8" maxLength="16" pattern="^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,16}$" title="Must contain at least 1 uppercase, 1 special character" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
        <button type="submit">Sign Up</button>
      </form>
      <p style={{ marginTop: '20px' }}>
        Already have an account? <Link to="/">Login here</Link>
      </p>
    </div>
  );
}
