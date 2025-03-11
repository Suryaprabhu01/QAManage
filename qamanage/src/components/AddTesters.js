import React, { useState } from 'react';
import axios from 'axios';
import './AddTesters.css';
import './Dashboard.css';

const AddTesters = ({ onClose, onTesterAdded }) => {
  const [testerData, setTesterData] = useState({
    name: '',
    email: '',
    position: 'JUNIOR QA TRAINEE'
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post('http://localhost:5000/api/testers', testerData);

      if (response.data.success) {
        onTesterAdded(response.data.data);
        onClose();
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Error adding tester:', error);
      setError(error.response?.data?.message || 'Error adding tester');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Tester</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={testerData.name}
              onChange={(e) => setTesterData({ ...testerData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={testerData.email}
              onChange={(e) => setTesterData({ ...testerData, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Position</label>
            <select
              value={testerData.position}
              onChange={(e) => setTesterData({ ...testerData, position: e.target.value })}
            >
              <option value="JUNIOR QA TRAINEE">JUNIOR QA TRAINEE</option>
              <option value="SENIOR QA ENGINEER">SENIOR QA ENGINEER</option>
              <option value="QA LEAD">QA LEAD</option>
            </select>
          </div>
          <div className="modal-buttons">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="add-button" disabled={loading}>
              {loading ? 'Adding...' : 'Add Tester'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTesters;