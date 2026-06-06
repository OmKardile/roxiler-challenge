import { useState, useEffect } from 'react';
import axios from 'axios';

export default function NormalDashboard({ user }) {
  const [stores, setStores] = useState([]);
  const [ratingInput, setRatingInput] = useState({});
  const [search, setSearch] = useState('');

  const fetchStores = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/stores', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStores(res.data);
    } catch (err) {
      alert('Error fetching stores');
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const submitRating = async (storeId) => {
    const rating = parseInt(ratingInput[storeId]);
    if (!rating || rating < 1 || rating > 5) return alert('Rating must be 1-5');
    
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/ratings', {
        store_id: storeId,
        rating: rating
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Rating submitted successfully!');
      fetchStores(); // Refresh ratings
    } catch (err) {
      alert('Error submitting rating');
    }
  };

  // Search filter
  const filteredStores = stores.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2>User Dashboard</h2>
      <input 
        type="text" 
        placeholder="Search by name or address..." 
        value={search} 
        onChange={e => setSearch(e.target.value)} 
        style={{ marginBottom: '10px', padding: '5px' }}
      />

      <table border="1" cellPadding="10" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
        <thead style={{ background: '#f4f4f4' }}>
          <tr>
            <th>Store Name</th>
            <th>Address</th>
            <th>Overall Rating</th>
            <th>Your Rating</th>
            <th>Submit/Modify Rating</th>
          </tr>
        </thead>
        <tbody>
          {filteredStores.map(s => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.address}</td>
              <td>{Number(s.overall_rating).toFixed(1)}</td>
              <td>{s.user_submitted_rating ? s.user_submitted_rating : 'Not Rated'}</td>
              <td>
                <input 
                  type="number" min="1" max="5" 
                  value={ratingInput[s.id] || ''}
                  onChange={e => setRatingInput({...ratingInput, [s.id]: e.target.value})} 
                  style={{ width: '50px', marginRight: '5px' }}
                />
                <button onClick={() => submitRating(s.id)}>Rate</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}