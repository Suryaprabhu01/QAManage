import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Scenarios.css';
import './common.css';

const Scenarios = () => {
  const { projectId, moduleId } = useParams();
  const navigate = useNavigate();
  const [scenarios, setScenarios] = useState([]);
  const [moduleDetails, setModuleDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newScenario, setNewScenario] = useState({
    scenarioName: '',
    description: '',
    priority: 'Medium',
    status: 'Active'
  });

  const API_BASE_URL = 'http://localhost:5000/api';

  useEffect(() => {
    console.log('Current moduleId:', moduleId);
  }, [moduleId]);

  useEffect(() => {
    if (moduleId) {
      fetchModuleDetails();
      fetchScenarios();
    }
  }, [moduleId]);

  const fetchModuleDetails = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/modules/${moduleId}`);
      setModuleDetails(response.data);
    } catch (error) {
      console.error('Error fetching module details:', error);
    }
  };

  const fetchScenarios = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching scenarios for moduleId:', moduleId);
      
      const response = await axios.get(`${API_BASE_URL}/scenarios/${moduleId}`);
      console.log('Scenarios response:', response.data);
      
      if (response.data.success) {
        setScenarios(response.data.data);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching scenarios:', error);
      setError('Error fetching scenarios. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddScenario = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const scenarioData = {
        moduleId,
        ...newScenario
      };
      
      console.log('Sending scenario data:', scenarioData);
      
      const response = await axios.post(`${API_BASE_URL}/scenarios`, scenarioData);
      console.log('Add scenario response:', response.data);

      if (response.data.success) {
        setScenarios([response.data.data, ...scenarios]);
        setShowAddModal(false);
        setNewScenario({
          scenarioName: '',
          description: '',
          priority: 'Medium',
          status: 'Active'
        });
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Error adding scenario:', error.response?.data || error);
      setError(error.response?.data?.message || 'Error adding scenario. Please try again.');
    }
  };

  const handleScenarioClick = (scenarioId) => {
    navigate(`/modules/scenarios/testcases/${scenarioId}`);
  };

  const handleBackClick = () => {
    navigate('/modules');
  };

  const filteredScenarios = scenarios.filter(scenario =>
    scenario.scenarioName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scenario.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scenario.scenarioId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading scenarios...</div>;
  }

  return (
    <div className="scenarios-container">
      <div className="scenarios-header">
       { /* <button 
          className="back-button"
          onClick={handleBackClick}
        >
          ← Back to Modules
        </button>*/}
        {moduleDetails && (
          <div className="module-info">
            <h2>{moduleDetails.moduleName}</h2>
            <p className="submodule-name">{moduleDetails.subModuleName}</p>
          </div>
        )}
      </div>

      <div className="actions-container">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search scenarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="button-container">
          <button className="add-button" onClick={() => setShowAddModal(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add Scenario
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="scenarios-table">
        <table>
          <thead>
            <tr>
              <th>Scenario ID</th>
              <th>Scenario Name</th>
              <th>Description</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Created Date</th>
              <th>Cases Count</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredScenarios.map((scenario) => (
              <tr key={scenario._id} className="scenario-row">
                <td>
                  <span 
                    className="clickable-id"
                    onClick={() => handleScenarioClick(scenario._id)}
                  >
                    {scenario.scenarioId}
                  </span>
                </td>
                <td>{scenario.scenarioName}</td>
                <td>
                  <div className="description-text">{scenario.description}</div>
                </td>
                <td>
                  <span className={`priority-badge ${scenario.priority.toLowerCase()}`}>
                    {scenario.priority}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${scenario.status.toLowerCase()}`}>
                    {scenario.status}
                  </span>
                </td>
                <td>
                  <div className="date-text">
                    {new Date(scenario.createdAt).toLocaleDateString()}
                  </div>
                </td>
                <td>{scenario.casesCount}</td>
                <td>
                  <button className="action-btn">⋮</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add New Scenario</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleAddScenario}>
              <div className="form-group">
                <label>Scenario Name</label>
                <input
                  type="text"
                  value={newScenario.scenarioName}
                  onChange={(e) => setNewScenario({
                    ...newScenario,
                    scenarioName: e.target.value
                  })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newScenario.description}
                  onChange={(e) => setNewScenario({
                    ...newScenario,
                    description: e.target.value
                  })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select
                  value={newScenario.priority}
                  onChange={(e) => setNewScenario({
                    ...newScenario,
                    priority: e.target.value
                  })}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={newScenario.status}
                  onChange={(e) => setNewScenario({
                    ...newScenario,
                    status: e.target.value
                  })}
                >
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
              <div className="modal-actions">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Add Scenario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scenarios;