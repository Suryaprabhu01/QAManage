import React, { useState } from 'react';
import './AddDocumentModal.css';

const AddDocumentModal = ({ onClose, onAddDocument }) => {
  const [document, setDocument] = useState({
    name: '',
    link: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddDocument(document);
    onClose();
  };

  return (
    <div className="document-modal-overlay">
      <div className="document-modal-content">
        <h2>Add New Document</h2>
        <form onSubmit={handleSubmit}>
          <div className="document-form-group">
            <label>Document Name</label>
            <input
              type="text"
              placeholder="Enter the document name"
              value={document.name}
              onChange={(e) => setDocument({ ...document, name: e.target.value })}
              required
            />
          </div>
          <div className="document-form-group">
            <label>Enter Document Link</label>
            <input
              type="url"
              placeholder="Enter the document name"
              value={document.link}
              onChange={(e) => setDocument({ ...document, link: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="add-document-btn">
            <span className="plus-icon">+</span>
            Add Document
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDocumentModal; 