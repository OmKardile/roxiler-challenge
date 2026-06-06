import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Login from './components/Login';
import Signup from './components/Signup';
import AdminDashboard from './components/AdminDashboard';
import NormalDashboard from './components/NormalDashboard';
import StoreDashboard from './components/StoreDashboard';

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <Router>
      <div style={{ padding: '20px', fontFamily: 'sans-serif', margin: '0 auto', maxWidth: '1000px' }}>
        {user && (
          <div style={{ background: '#eee', padding: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>
              Logged in as: <b>{user.name}</b> ({user.role})
            </span>
            <button onClick={handleLogout} style={{ padding: '5px 15px', background: '#ff4d4f', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
              Logout
            </button>
          </div>
        )}

        <Routes>
          <Route path="/" element={!user ? <Login setUser={setUser} /> : 
            user.role === 'admin' ? <Navigate to="/admin" /> :
            user.role === 'store_owner' ? <Navigate to="/store" /> :
            <Navigate to="/user" />
          } />
          
          <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
          <Route path="/admin" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
          <Route path="/user" element={user?.role === 'normal' ? <NormalDashboard user={user} /> : <Navigate to="/" />} />
          <Route path="/store" element={user?.role === 'store_owner' ? <StoreDashboard user={user} /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;