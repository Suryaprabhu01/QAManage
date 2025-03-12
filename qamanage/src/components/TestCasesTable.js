import React, { useState } from 'react';
import TestCaseModal from './TestCaseModal';
import './TestCasesTable.css';

const TestCasesTable = ({ testCases, onUpdateTestCase }) => {
  const [selectedTestCase, setSelectedTestCase] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [activeTestCaseId, setActiveTestCaseId] = useState(null);

  // Define status options
  const statusOptions = [
    { value: 'Pass', label: 'Pass', color: '#28a745' },
    { value: 'Fail', label: 'Fail', color: '#dc3545' },
    { value: 'Untested', label: 'Untested', color: '#6c757d' }
  ];

  const handleEditClick = (testCase) => {
    setSelectedTestCase(testCase);
    setShowEditModal(true);
  };

  const handleSaveEdit = (updatedTestCase) => {
    // Preserve the original ID and metadata
    const finalUpdatedTestCase = {
      ...selectedTestCase,
      ...updatedTestCase,
      _id: selectedTestCase._id,
      createdBy: selectedTestCase.createdBy
    };
    onUpdateTestCase(finalUpdatedTestCase);
    setShowEditModal(false);
    setSelectedTestCase(null);
  };

  const handleStatusClick = (testCaseId) => {
    setActiveTestCaseId(activeTestCaseId === testCaseId ? null : testCaseId);
    setShowStatusDropdown(!showStatusDropdown);
  };

  const handleStatusChange = (testCase, newStatus) => {
    const updatedTestCase = {
      ...testCase,
      status: newStatus,
      testedBy: {
        name: 'Surya Prabhu T',
        date: new Date().toLocaleDateString()
      }
    };
    onUpdateTestCase(updatedTestCase);
    setActiveTestCaseId(null);
    setShowStatusDropdown(false);
  };

  return (
    <>
      <table className="test-cases-table">
        <thead>
          <tr>
            <th>Test Case (1)</th>
            <th>Created By</th>
            <th>Tested By</th>
            <th>Case Type</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {testCases.map((testCase) => (
            <tr key={testCase._id || testCase.testCaseId}>
              <td>{testCase.testCaseId || '1'}</td>
              <td>
                {testCase.createdBy?.name}
                <div className="date">{testCase.createdBy?.date}</div>
              </td>
              <td>
                {testCase.testedBy?.name}
                <div className="date">{testCase.testedBy?.date}</div>
              </td>
              <td>
                <span className={`case-type-badge ${testCase.caseType?.toLowerCase()}`}>
                  {testCase.caseType}
                </span>
              </td>
              <td>
                <div className="status-wrapper">
                  <select
                    value={testCase.status || 'Untested'}
                    onChange={(e) => handleStatusChange(testCase, e.target.value)}
                    className={`status-select ${(testCase.status || 'untested').toLowerCase()}`}
                  >
                    <option value="Untested">Untested</option>
                    <option value="Pass">Pass</option>
                    <option value="Fail">Fail</option>
                  </select>
                </div>
              </td>
              <td>
                <div className="action-buttons">
                  <button 
                    className="edit-btn"
                    onClick={() => handleEditClick(testCase)}
                  >
                    ✏️
                  </button>
                  <button className="view-btn">👁️</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showEditModal && selectedTestCase && (
        <TestCaseModal
          testCase={selectedTestCase}
          mode="edit"
          onClose={() => {
            setShowEditModal(false);
            setSelectedTestCase(null);
          }}
          onSave={handleSaveEdit}
        />
      )}
    </>
  );
};

export default TestCasesTable; 