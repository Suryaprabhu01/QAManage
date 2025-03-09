import React, { useState } from 'react';
import './AddProjectModal.css';

const AddProjectModal = ({ onClose, onAddProject }) => {
  const [projectName, setProjectName] = useState('');
  const [projectLogo, setProjectLogo] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddProject({ name: projectName, logo: projectLogo });
    onClose();
  };

  const handleLogoAttach = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProjectLogo(file);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Project</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Project Name</label>
            <input
              type="text"
              placeholder="Enter the document name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Project logo</label>
            <div className="logo-input">
              <input
                type="text"
                placeholder="Attach the logo"
                readOnly
                value={projectLogo ? projectLogo.name : ''}
              />
              <label className="attach-button">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoAttach}
                  hidden
                />
                📎
              </label>
            </div>
          </div>

          <button type="submit" className="add-project-button">
            <span className="plus-icon">+</span> Add Project
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProjectModal; 