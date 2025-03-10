import React, { useState } from 'react';
import axios from 'axios';
import './AddModuleModal.css';

const AddModuleModal = ({ projectId, onClose, onModuleAdded }) => {
  const [moduleData, setModuleData] = useState({
    moduleName: '',
    subModuleName: '',
    username: '' // Add username field
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post('http://localhost:5000/api/modules', {
        projectId,
        ...moduleData
      });

      if (response.data.success) {
        onModuleAdded(response.data.data);
        onClose();
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Error adding module:', error);
      setError(error.response?.data?.message || 'Error adding module');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Module</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Module Name</label>
            <input
              type="text"
              value={moduleData.moduleName}
              onChange={(e) => setModuleData({
                ...moduleData,
                moduleName: e.target.value
              })}
              required
            />
          </div>
          <div className="form-group">
            <label>Submodule Name</label>
            <input
              type="text"
              value={moduleData.subModuleName}
              onChange={(e) => setModuleData({
                ...moduleData,
                subModuleName: e.target.value
              })}
              required
            />
          </div>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={moduleData.username}
              onChange={(e) => setModuleData({
                ...moduleData,
                username: e.target.value
              })}
              required
            />
          </div>
          <div className="modal-buttons">
            <button className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button className="add-button" type="submit">
              Add Module
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddModuleModal;