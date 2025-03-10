import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';
import AddProjectModal from './AddProjectModal';
import AddModuleModal from './AddModuleModal';
import TestScenarios from './TestScenarios';
import Modules from './Modules';
import LogList from './LogList'; // Import LogList component

const DEFAULT_QUICK_LINKS = [
  {
    name: 'Data Quality Standards',
    url: 'https://coda.io/d/SPAN-Data-Quality-Standards_diggZGrWc8s/Index_sumNp#_luGLX'
  },
  {
    name: 'Design Standards',
    url: 'https://coda.io/d/SPAN-UI-UX-Quality-Standard_dGUnN9xQ9Qp/TaxBandits-UI-UX-Standards_suAF7'
  },
  {
    name: 'Security Standards',
    url: 'https://coda.io/d/SPAN-Security-Standards_dD0NPKTIL0j/SPAN-Security-Standards_supqB#_lu3Cv'
  }
];

const Dashboard = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState(null);
  const [modules, setModules] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quickLinks, setQuickLinks] = useState(DEFAULT_QUICK_LINKS);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [showAddModuleModal, setShowAddModuleModal] = useState(false);
  const [view, setView] = useState('modules');
  const [selectedModule, setSelectedModule] = useState(null);
  const [showLogs, setShowLogs] = useState(false); // State to show logs

  const API_BASE_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchModules();
    }
  }, [selectedProject]);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/projects`);
      if (response.data.success) {
        setProjects(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchModules = async () => {
    try {
      const response = await axios.get('/api/modules');
      const data = await response.data;
      setModules(data);
    } catch (error) {
      console.error('Error fetching modules:', error);
    }
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/projects`, newProject);
      if (response.data.success) {
        setProjects([response.data.data, ...projects]);
        setShowAddProjectModal(false);
        setNewProject({ projectName: '', description: '' });
      }
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    setShowDropdown(false);
    navigate(`/modules?projectId=${project._id}`);
  };

  const handleNavClick = (tab) => {
    setActiveTab(tab);
  };

  const handleDelete = async (projectId) => {
    try {
      await axios.delete(`http://localhost:5000/api/projects/${projectId}`);
      setProjects(projects.filter(p => p._id !== projectId));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleMenuClick = (e, projectId) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === projectId ? null : projectId);
  };

  const handleMenuOption = (e, option, project) => {
    e.stopPropagation();
    switch(option) {
      case 'edit':
        console.log('Edit project:', project.name);
        break;
      case 'delete':
        console.log('Delete project:', project.name);
        break;
      default:
        break;
    }
    setActiveMenu(null);
  };

  const handleModuleAdded = (newModule) => {
    console.log('New module added:', newModule);
    setModules(prevModules => [newModule, ...prevModules]);
  };

  const handleQuickLinkClick = (url) => {
    window.open(url, '_blank');
  };

  const handleModuleClick = (module) => {
    setSelectedModule(module);
    setView('scenarios');
  };

  const isActivePath = (path) => {
    return location.pathname.startsWith(path);
  };

  const [newProject, setNewProject] = useState({
    projectName: '',
    description: ''
  });

  const handleActivityClick = () => {
    setShowLogs(true);
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        {/* Logo Section */}
        <div className="logo-section">
          <img src="/verify360-logo.png" alt="VERIFY 360" className="logo" />
        </div>

        {/* Project Dropdown */}
        <div className="project-dropdown-container">
          <div 
            className="project-header"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {selectedProject ? (
              <>
                <span className="project-icon">📁</span>
                <span className="project-name">{selectedProject.projectName}</span>
              </>
            ) : (
              <span className="select-project">Select Project</span>
            )}
          </div>

          {showDropdown && (
            <div className="project-dropdown">
              <button 
                className="add-project-btn"
                onClick={() => setShowAddProjectModal(true)}
              >
                + Add Project
              </button>
              <div className="projects-list">
                {projects.map(project => (
                  <div 
                    key={project._id}
                    className="project-item"
                    onClick={() => handleProjectSelect(project)}
                  >
                    <span className="project-icon">📁</span>
                    <span className="project-name">{project.projectName}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="nav-menu">
          <div 
            className={`nav-item ${isActivePath('/modules') ? 'active' : ''}`}
            onClick={() => navigate('/modules')}
          >
            <span className="nav-icon">📊</span>
            <span>Modules</span>
          </div>
          <div 
            className={`nav-item ${isActivePath('/test-runs') ? 'active' : ''}`}
            onClick={() => navigate('/test-runs')}
          >
            <span className="nav-icon">📋</span>
            <span>Test Runs</span>
          </div>
          <div 
            className={`nav-item ${isActivePath('/metrics') ? 'active' : ''}`}
            onClick={() => navigate('/metrics')}
          >
            <span className="nav-icon">📈</span>
            <span>Metrics</span>
          </div>
          <div 
            className={`nav-item ${isActivePath('/testers') ? 'active' : ''}`}
            onClick={() => navigate('/testers')}
          >
            <span className="nav-icon">👥</span>
            <span>Testers</span>
          </div>
          <div 
            className={`nav-item ${isActivePath('/activity') ? 'active' : ''}`}
            onClick={handleActivityClick} // Update to handle click
          >
            <span className="nav-icon">📝</span>
            <span>Activity</span>
          </div>
        </nav>

        {/* Quick Links */}
        <div className="quick-links">
          <div className="quick-links-header">
            <span>Quick Links</span>
            <button 
              className="add-link"
              onClick={() => console.log('Add quick link clicked')}
            >
              +
            </button>
          </div>
          <ul className="quick-links-list">
            {quickLinks.map((link, index) => (
              <li 
                key={index} 
                className="quick-link-item"
                onClick={() => handleQuickLinkClick(link.url)}
              >
                <span>{link.name}</span>
                <button className="more-options">⋮</button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        {showLogs ? <LogList /> : children} {/* Conditionally render LogList */}
      </div>

      {/* Add Project Modal */}
      {showAddProjectModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add New Project</h2>
            <form onSubmit={handleAddProject}>
              <div className="form-group">
                <label>Project Name</label>
                <input
                  type="text"
                  value={newProject.projectName}
                  onChange={(e) => setNewProject({
                    ...newProject,
                    projectName: e.target.value
                  })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({
                    ...newProject,
                    description: e.target.value
                  })}
                />
              </div>
              <div className="modal-actions">
                <button 
                  type="button" 
                  onClick={() => setShowAddProjectModal(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Add Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Module Modal */}
      {showAddModuleModal && (
        <AddModuleModal
          onClose={() => setShowAddModuleModal(false)}
          onModuleAdded={handleModuleAdded}
        />
      )}
    </div>
  );
};

export default Dashboard;