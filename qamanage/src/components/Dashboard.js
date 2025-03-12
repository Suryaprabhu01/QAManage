import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';
import AddProjectModal from './AddProjectModal';
import AddModuleModal from './AddModuleModal';
import TestScenarios from './TestScenarios';
import Modules from './Modules';
import AddDocumentModal from './AddDocumentModal';
import UsersManagement from './users/UsersManagement';
import TestRuns from './TestRuns/TestRuns'; // Import the new TestRuns component

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

  const API_BASE_URL = 'http://localhost:5000/api';

  const [activeMenuItem, setActiveMenuItem] = useState('modules');

  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [documents, setDocuments] = useState([]);

  const [quickLinksMenuOpen, setQuickLinksMenuOpen] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedQuickLink, setSelectedQuickLink] = useState(null);

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showUsersPage, setShowUsersPage] = useState(false);

  const profileRef = useRef(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchModules();
    }
  }, [selectedProject]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  const handleMenuClick = (menuItem) => {
    setActiveMenuItem(menuItem);
    switch(menuItem) {
      case 'modules':
        navigate('/modules');
        break;
      case 'activity':
        if (selectedProject) {
          navigate(`/projects/${selectedProject._id}/activity`);
        }
        break;
      case 'testruns':
        navigate('/testruns');
        break;
      case 'metrics':
        navigate('/metrics');
        break;
      case 'testers':
        navigate('/testers');
        break;
      default:
        break;
    }
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
    navigate(`/projects/${selectedProject}/activity`);
  };

  const handleAddDocument = (newDocument) => {
    setQuickLinks([...quickLinks, {
      name: newDocument.name,
      url: newDocument.link
    }]);
  };

  const handleQuickLinkOptions = (e, link, index) => {
    e.stopPropagation();
    setQuickLinksMenuOpen(index);
    setSelectedQuickLink(link);
  };

  const handleDeleteQuickLink = () => {
    setDeleteConfirmOpen(true);
    setQuickLinksMenuOpen(null);
  };

  const handleConfirmDelete = () => {
    const newQuickLinks = quickLinks.filter(link => link !== selectedQuickLink);
    setQuickLinks(newQuickLinks);
    setDeleteConfirmOpen(false);
    setSelectedQuickLink(null);
  };

  const renderSidebar = () => {
    return (
      <div className="sidebar">
        <div className="logo-section">
          <img src="/verify360-logo.png" alt="Verify 360" className="logo" />
        </div>

        <div className="project-dropdown-container">
          <div className="project-header" onClick={() => setShowDropdown(!showDropdown)}>
            <img src="/project-icon.png" alt="" className="project-icon" />
            <span className="project-name">
              {selectedProject ? selectedProject.projectName : 'Select Project'}
            </span>
            <span className={`dropdown-arrow ${showDropdown ? 'open' : ''}`}>▼</span>
          </div>
          
          {showDropdown && (
            <div className="project-dropdown">
              <button className="add-project-btn" onClick={() => {
                setShowAddProjectModal(true);
                setShowDropdown(false);
              }}>
                + Add Project
              </button>
              <div className="projects-list">
                {projects.map((project) => (
                  <div key={project._id} className="project-item">
                    <div className="project-item-content" onClick={() => handleProjectSelect(project)}>
                      <img src={project.logo || '/default-project-icon.png'} alt="" className="project-icon" />
                      <span>{project.projectName}</span>
                    </div>
                    <button 
                      className="project-menu-btn"
                      onClick={(e) => handleMenuClick(e, project._id)}
                    >
                      ⋮
                    </button>
                    {activeMenu === project._id && (
                      <div className="project-menu-dropdown">
                        <button onClick={(e) => handleMenuOption(e, 'edit', project)}>Edit</button>
                        <button onClick={(e) => handleMenuOption(e, 'delete', project)}>Delete</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <nav className="nav-menu">
          <ul>
            <li 
              className={activeMenuItem === 'modules' ? 'active' : ''}
              onClick={() => handleMenuClick('modules')}
            >
              <span className="nav-icon">📋</span>
              <span>Modules</span>
            </li>
            <li 
              className={activeMenuItem === 'testruns' ? 'active' : ''}
              onClick={() => handleMenuClick('testruns')}
            >
              <span className="nav-icon">🔄</span>
              <span>Test Runs</span>
            </li>
            <li 
              className={activeMenuItem === 'metrics' ? 'active' : ''}
              onClick={() => handleMenuClick('metrics')}
            >
              <span className="nav-icon">📊</span>
              <span>Metrics</span>
            </li>
            <li 
              className={activeMenuItem === 'testers' ? 'active' : ''}
              onClick={() => handleMenuClick('testers')}
            >
              <span className="nav-icon">👥</span>
              <span>Testers</span>
            </li>
            <li 
              className={activeMenuItem === 'activity' ? 'active' : ''}
              onClick={() => handleMenuClick('activity')}
            >
              <span className="nav-icon">📋</span>
              <span>Activity</span>
            </li>
          </ul>
        </nav>

        <div className="quick-links">
          <div className="quick-links-header">
            <span>Quick Links</span>
            <button className="add-link" onClick={() => setShowDocumentModal(true)}>
              +
            </button>
          </div>
          <ul className="quick-links-list">
            {quickLinks.map((link, index) => (
              <li key={index} className="quick-link-item">
                <span>{link.name}</span>
                <div className="quick-link-menu">
                  <button 
                    className="more-options"
                    onClick={(e) => handleQuickLinkOptions(e, link, index)}
                  >
                    ⋮
                  </button>
                  {quickLinksMenuOpen === index && (
                    <div className="quick-link-dropdown">
                      <button onClick={() => console.log('Edit')}>Edit</button>
                      <button onClick={handleDeleteQuickLink}>Remove</button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {deleteConfirmOpen && (
          <div className="modal-overlay">
            <div className="modal-content delete-confirm-modal">
              <div className="modal-header">
                <span className="warning-icon">⚠️</span>
                <h3>Confirm Remove Document</h3>
              </div>
              <p className="confirm-message">
                Are you sure you want to remove this document named
                <br />
                <strong>{selectedQuickLink?.name}</strong>?
              </p>
              <p className="warning-text">This action cannot be undone.</p>
              <div className="modal-actions">
                <button 
                  className="cancel-btn"
                  onClick={() => {
                    setDeleteConfirmOpen(false);
                    setSelectedQuickLink(null);
                  }}
                >
                  Cancel
                </button>
                <button 
                  className="remove-btn"
                  onClick={handleConfirmDelete}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      {renderSidebar()}

      <div className="main-content">
        <div className="header-top">
          <div className="breadcrumb">Project name / {/* Add your dynamic breadcrumb */}</div>
          <div className="profile-section" ref={profileRef}>
            <div className="profile-info" onClick={() => setShowProfileMenu(!showProfileMenu)}>
              <div className="profile-circle">
                <img 
                  src="/default-profile-icon.png"
                  alt="Profile" 
                  className="profile-image"
                />
              </div>
              <div className="user-info">
                <div className="user-name">SURYA PRABHU</div>
                <div className="user-role">JUNIOR QA TRAINEE</div>
              </div>
            </div>
            {showProfileMenu && (
              <div className="profile-dropdown">
                <button onClick={() => {
                  setShowUsersPage(true);
                  setShowProfileMenu(false);
                }}>Add Users</button>
                <button onClick={() => console.log('Settings')}>Settings</button>
                <button onClick={() => console.log('Logout')}>Logout</button>
              </div>
            )}
          </div>
        </div>
        <Routes>
          <Route path="/testruns" element={<TestRuns />} />
          {/* Add other routes here */}
        </Routes>
        {showUsersPage ? (
          <UsersManagement />
        ) : (
          selectedProject ? (
            children
          ) : (
            <div className="no-project-selected">
              <h2>Select a Project</h2>
              <p>Please select a project from the dropdown to view its modules</p>
            </div>
          )
        )}
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
                <label> Project Logo</label>
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

      {showDocumentModal && (
        <AddDocumentModal
          onClose={() => setShowDocumentModal(false)}
          onAddDocument={handleAddDocument}
        />
      )}
    </div>
  );
};

export default Dashboard;