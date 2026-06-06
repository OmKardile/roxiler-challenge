import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  
  // New user/store state
  const [formData, setFormData] = useState({ name: '', email: '', password: '', address: '', role: 'normal' });

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [usersRes, storesRes] = await Promise.all([
        axios.get('https://roxiler-challenge.onrender.com/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('https://roxiler-challenge.onrender.com/api/stores', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setUsers(usersRes.data);
      setStores(storesRes.data);
    } catch (err) {
      alert('Error fetching admin data');
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('https://roxiler-challenge.onrender.com/api/admin/users', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('User/Store added successfully!');
      setFormData({ name: '', email: '', password: '', address: '', role: 'normal' });
      fetchData();
    } catch (err) {
      alert('Error adding user');
    }
  };

  return (
    <div>
      <h2>System Administrator Dashboard</h2>
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ padding: '10px', background: '#e3f2fd', flex: 1 }}>
          <h3>Total Users (All types): {users.length}</h3>
          <h3>Total Stores: {stores.length}</h3>
        </div>
        
        <div style={{ padding: '10px', background: '#fce4ec', flex: 1 }}>
          <h3>Add New User or Store</h3>
          <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input type="text" placeholder="Name (20-60 chars)" required minLength="20" maxLength="60" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            <input type="email" placeholder="Email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            <input type="password" placeholder="Password (8-16 chars)" required minLength="8" maxLength="16" pattern="^(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,16}$" title="Must contain at least 1 uppercase, 1 special character" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
            <input type="text" placeholder="Address (max 400 chars)" required maxLength="400" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
            <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
              <option value="normal">Normal User</option>
              <option value="store_owner">Store Owner</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit">Create</button>
          </form>
        </div>
      </div>

      <h3>All Registered Users & Stores</h3>
      <table border="1" cellPadding="10" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead style={{ background: '#f4f4f4' }}>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Role</th>
            <th>Store Rating (If Store)</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => {
            const storeData = stores.find(s => s.id === u.id);
            return (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.address}</td>
                <td>{u.role}</td>
                <td>{u.role === 'store_owner' ? Number(storeData?.overall_rating || 0).toFixed(1) : 'N/A'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}