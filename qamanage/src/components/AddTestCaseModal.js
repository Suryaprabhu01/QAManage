import React, { useState } from 'react';
import './AddTestCaseModal.css';

const AddTestCaseModal = ({ onClose, onAddTestCase }) => {
  const [newTestCase, setNewTestCase] = useState({
    testCaseId: '',
    caseType: '',
    description: '',
    expectedResult: '',
    testCaseData: '',
    steps: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const testCase = {
      ...newTestCase,
      _id: Date.now().toString(),
      createdBy: {
        name: 'Surya Prabhu T',
        date: new Date().toLocaleDateString('en-US', {
          month: 'long',
          day: '2-digit',
          year: 'numeric'
        })
      },
      testedBy: {
        name: 'Surya Prabhu T',
        date: new Date().toLocaleDateString('en-US', {
          month: 'long',
          day: '2-digit',
          year: 'numeric'
        })
      },
      status: 'Untested'
    };
    onAddTestCase(testCase);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="add-modal-content">
        <h2>Add New Case</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Test Case ID</label>
              <input
                type="text"
                placeholder="Enter the Test case ID"
                value={newTestCase.testCaseId}
                onChange={(e) => setNewTestCase({
                  ...newTestCase,
                  testCaseId: e.target.value
                })}
              />
            </div>
            <div className="form-group">
              <label>Test Case Type</label>
              <select
                value={newTestCase.caseType}
                onChange={(e) => setNewTestCase({
                  ...newTestCase,
                  caseType: e.target.value
                })}
              >
                <option value="">Choose the Test case Type</option>
                <option value="Positive">Positive</option>
                <option value="Negative">Negative</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Test Case Description</label>
            <textarea
              placeholder="Enter the Test case description"
              value={newTestCase.description}
              onChange={(e) => setNewTestCase({
                ...newTestCase,
                description: e.target.value
              })}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Expected Result</label>
              <textarea
                placeholder="Enter the Expected Result"
                value={newTestCase.expectedResult}
                onChange={(e) => setNewTestCase({
                  ...newTestCase,
                  expectedResult: e.target.value
                })}
              />
            </div>
            <div className="form-group">
              <label>Test Case Data</label>
              <textarea
                placeholder="Enter the test case data"
                value={newTestCase.testCaseData}
                onChange={(e) => setNewTestCase({
                  ...newTestCase,
                  testCaseData: e.target.value
                })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Steps</label>
            <textarea
              placeholder="Enter the steps to Test"
              value={newTestCase.steps}
              onChange={(e) => setNewTestCase({
                ...newTestCase,
                steps: e.target.value
              })}
            />
          </div>

          <div className="add-case-actions">
            <button type="submit" className="add-case-submit">
              <span>+</span> Add Case
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTestCaseModal; 