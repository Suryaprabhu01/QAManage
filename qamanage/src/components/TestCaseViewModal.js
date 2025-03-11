import React from 'react';
import './TestCaseViewModal.css';

const TestCaseViewModal = ({ testCase, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="view-modal-content">
        <div className="view-modal-header">
          <h2>Test Case Details</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="view-modal-body">
          <div className="form-group">
            <label>Test Case ID</label>
            <input type="text" value={testCase.testCaseId} disabled />
          </div>

          <div className="form-group">
            <label>Test Case Type</label>
            <select disabled defaultValue={testCase.caseType}>
              <option>Choose the Test Case Type</option>
              <option value="Positive">Positive</option>
              <option value="Negative">Negative</option>
            </select>
          </div>

          <div className="form-group">
            <label>Test Case Description</label>
            <textarea 
              placeholder="Enter the Test case description"
              value={testCase.description}
              disabled
            />
          </div>

          <div className="form-group">
            <label>Expected Result</label>
            <textarea 
              placeholder="Enter the Expected Result"
              value={testCase.expectedResult || ''}
              disabled
            />
          </div>

          <div className="form-group">
            <label>Steps</label>
            <textarea 
              placeholder="Enter the Steps to Test"
              value={testCase.steps || ''}
              disabled
            />
          </div>

          <div className="results-section">
            <h3>Results</h3>
            
            <div className="result-group">
              <div className="result-row">
                <div className="form-group">
                  <label>Tested By</label>
                  <input type="text" value={testCase.testedBy?.name || ''} disabled />
                  <span className="date-text">{testCase.testedBy?.date || ''}</span>
                </div>

                <div className="form-group">
                  <label>Test Region</label>
                  <select disabled>
                    <option>Choose the Test Region</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Test Status</label>
                  <select disabled>
                    <option>Choose the Test Status</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Comments</label>
                <textarea placeholder="Enter the Test Region" disabled />
              </div>

              <div className="form-group">
                <label>Reference</label>
                <div className="reference-input">
                  <input type="text" placeholder="Image or Video" disabled />
                  <button className="attach-btn" disabled>📎</button>
                </div>
              </div>

              <div className="bug-section">
                <div className="form-group">
                  <label>Bug Reference ID</label>
                  <input type="text" placeholder="Enter the Bug Ref ID" disabled />
                </div>

                <div className="form-group">
                  <label>Bug Priority</label>
                  <select disabled>
                    <option>Choose the Bug Priority</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button className="add-result-btn">+ Add Result</button>
            <button className="edit-case-btn">Edit Case</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestCaseViewModal; 