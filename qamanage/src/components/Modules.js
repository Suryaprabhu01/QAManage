import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import AddModuleModal from './AddModuleModal';
import './Modules.css';
import './common.css';

// Dummy data for modules
const DUMMY_MODULES = [
  {
    moduleName: 'Module Name 1',
    moduleId: 'Mo_001',
    submoduleName: 'Submodule Name 1',
    submoduleId: 'Mo_001_Sub_001',
    lastTested: {
      user: 'Surya Prabhu T',
      date: 'March 05 2025'
    },
    scenarios: '50',
    cases: '500'
  },
  {
    moduleName: 'Module Name 1',
    moduleId: 'Mo_001',
    submoduleName: 'Submodule Name 1',
    submoduleId: 'Mo_001_Sub_001',
    lastTested: {
      user: 'Surya Prabhu T',
      date: 'March 05 2025'
    },
    scenarios: '50',
    cases: '500'
  },
  // Add more dummy data as needed
];

const Modules = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const projectId = queryParams.get('projectId');

  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newModule, setNewModule] = useState({
    moduleName: '',
    subModuleName: ''
  });
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [currentPage, setCurrentPage] = useState(1);

  const API_BASE_URL = 'http://localhost:5000/api';

  useEffect(() => {
    if (projectId) {
      fetchModules();
    }
  }, [projectId]);

  const fetchModules = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/modules?projectId=${projectId}`);
      if (response.data.success) {
        setModules(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching modules:', error);
      setError('Failed to fetch modules');
    } finally {
      setLoading(false);
    }
  };

  const handleModuleClick = (moduleId) => {
    navigate(`/modules/scenarios/${moduleId}`);
  };

  const handleAddModule = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/modules`, {
        ...newModule,
        projectId
      });

      if (response.data.success) {
        setModules([response.data.data, ...modules]);
        setShowAddModal(false);
        setNewModule({ moduleName: '', subModuleName: '' });
      }
    } catch (error) {
      console.error('Error adding module:', error);
      setError('Failed to add module');
    }
  };

  const handleModuleAdded = (newModule) => {
    setModules([newModule, ...modules]);
  };

  const filteredModules = modules.filter(module =>
    module.moduleName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    module.moduleId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    module.subModuleName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    module.submoduleId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Loading modules...</div>;

  if (!projectId) {
    return null; // Don't render anything if no project is selected
  }

  return (
    <div className="modules-container">
      <div className="modules-header">
        <div className="search-section">
          <input
            type="text"
            placeholder="Search By Module Name / Module ID / Submodule Name / Submodule ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="add-module-button" onClick={() => setShowAddModal(true)}>
            <span className="plus-icon">+</span> Add Module
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={fetchModules} className="retry-btn">
            Retry
          </button>
        </div>
      )}

      <div className="modules-table-container">
        <table className="modules-table">
          <thead>
            <tr>
              <th>Module Name</th>
              <th>Submodule Name</th>
              <th>Last Tested</th>
              <th>No of Scenarios</th>
              <th>No of Cases</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredModules.map((module, index) => (
              <tr 
                key={module._id}
                onClick={() => handleModuleClick(module._id)}
                className="module-row"
                style={{ cursor: 'pointer' }}
              >
                <td>
                  <div className="module-name">
                    {module.moduleName}
                    <div className="module-id">{module.moduleId}</div>
                  </div>
                </td>
                <td>
                  <div className="submodule-name">
                    {module.subModuleName}
                    <div className="submodule-id">{module.submoduleId}</div>
                  </div>
                </td>
                <td>
                  <div className="last-tested">
                    {module.lastTestedBy}
                    <div className="test-date">
                      {new Date(module.lastTested).toLocaleDateString()}
                    </div>
                  </div>
                </td>
                <td>{module.scenariosCount || 0}</td>
                <td>{module.casesCount || 0}</td>
                <td>
                  <button 
                    className="action-button"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent row click
                    }}
                  >
                    ⋮
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <div className="rows-per-page">
          Rows per page: 
          <select 
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
          >
            <option value={8}>8</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
        <div className="page-navigation">
          <button 
            className="nav-button"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          <span>{currentPage}</span>
          <button 
            className="nav-button"
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            &gt;
          </button>
        </div>
      </div>

      {showAddModal && (
        <AddModuleModal
          projectId={projectId}
          onClose={() => setShowAddModal(false)}
          onModuleAdded={handleModuleAdded}
        />
      )}
    </div>
  );
};

export default Modules;