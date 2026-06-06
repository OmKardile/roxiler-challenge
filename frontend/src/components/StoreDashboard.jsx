import { useState, useEffect } from 'react';
import axios from 'axios';

export default function StoreDashboard({ user }) {
  const [data, setData] = useState({ users: [], average_rating: 0 });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/store/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        alert('Error fetching store dashboard');
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div>
      <h2>Store Owner Dashboard</h2>
      <h3>Overall Average Rating: {Number(data.average_rating).toFixed(1)} / 5</h3>
      
      <h4>Users who rated your store:</h4>
      <table border="1" cellPadding="10" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead style={{ background: '#f4f4f4' }}>
          <tr>
            <th>User Name</th>
            <th>Email</th>
            <th>Rating Given</th>
          </tr>
        </thead>
        <tbody>
          {data.users.length === 0 ? (
            <tr><td colSpan="3">No ratings yet.</td></tr>
          ) : (
            data.users.map((u, i) => (
              <tr key={i}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.rating}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}