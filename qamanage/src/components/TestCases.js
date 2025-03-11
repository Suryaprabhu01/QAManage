import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TestCases.css';
import './common.css';
import TestCaseModal from './TestCaseModal';

const TestCases = () => {
  const { projectId, moduleId, scenarioId } = useParams();
  const navigate = useNavigate();
  const [testCases, setTestCases] = useState([]);
  const [scenarioDetails, setScenarioDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTestCase, setNewTestCase] = useState({
    testCaseName: '',
    description: '',
    expectedResult: '',
    priority: 'Medium',
    status: 'Active'
  });
  const [viewingTestCase, setViewingTestCase] = useState(null);
  const [modalState, setModalState] = useState({
    isOpen: false,
    mode: null, // 'view', 'edit', or 'add'
    testCase: null
  });

  const API_BASE_URL = 'http://localhost:5000/api';

  // Add these dummy test cases
  const dummyTestCases = [
    {
      _id: '1',
      testCaseId: 'SpanPeople_SS_TS001_TC001',
      description: 'Verify the user able to request the Timeoff on Past and Future saturdays.',
      expectedResult: 'User should be able to request timeoff for past and future Saturdays',
      steps: '1. Login to the application\n2. Navigate to timeoff section\n3. Select a past Saturday\n4. Submit request\n5. Select a future Saturday\n6. Submit request',
      createdBy: {
        name: 'Surya Prabhu T',
        date: 'March 05 2023'
      },
      testedBy: {
        name: 'Surya Prabhu T',
        date: 'March 05 2023'
      },
      caseType: 'Positive',
      status: 'Pass',
      testRegion: 'Production',
      comments: 'Test executed successfully',
      reference: '',
      bugReferenceId: '',
      bugPriority: 'Medium'
    },
    {
      _id: '2',
      testCaseId: 'SpanPeople_SS_TS001_TC001',
      description: 'Verify the user able to request the Timeoff on Past and Future saturdays.',
      createdBy: {
        name: 'Surya Prabhu T',
        date: 'March 05 2023'
      },
      testedBy: {
        name: 'Surya Prabhu T',
        date: 'March 05 2023'
      },
      caseType: 'Negative',
      status: 'Fail'
    },
    {
      _id: '3',
      testCaseId: 'SpanPeople_SS_TS001_TC001',
      description: 'Verify the user able to request the Timeoff on Past and Future saturdays.',
      createdBy: {
        name: 'Surya Prabhu T',
        date: 'March 05 2023'
      },
      testedBy: {
        name: 'Surya Prabhu T',
        date: 'March 05 2023'
      },
      caseType: 'Positive',
      status: 'Untested'
    }
  ];

  // Modify the useEffect to include dummy data if no data is fetched
  useEffect(() => {
    if (scenarioId) {
      fetchScenarioDetails();
      fetchTestCases();
    }
    // Add dummy data if no test cases are loaded
    if (testCases.length === 0) {
      setTestCases(dummyTestCases);
    }
  }, [scenarioId]);

  const fetchScenarioDetails = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/scenarios/detail/${scenarioId}`);
      if (response.data.success) {
        setScenarioDetails(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching scenario details:', error);
    }
  };

  const fetchTestCases = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/testcases/${scenarioId}`);
      
      if (response.data.success) {
        setTestCases(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching test cases:', error);
      setError('Error fetching test cases. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTestCase = (newTestCase) => {
    setTestCases([newTestCase, ...testCases]);
  };

  const handleBackClick = () => {
    navigate(-1); // Goes back to scenarios
  };

  const handleViewClick = (testCase) => {
    setModalState({
      isOpen: true,
      mode: 'view',
      testCase
    });
  };

  const handleEditClick = (testCase) => {
    setModalState({
      isOpen: true,
      mode: 'edit',
      testCase
    });
  };

  const handleAddClick = () => {
    setModalState({
      isOpen: true,
      mode: 'add',
      testCase: null
    });
  };

  const handleModalClose = () => {
    setModalState({
      isOpen: false,
      mode: null,
      testCase: null
    });
  };

  const handleModalSave = (newTestCase) => {
    if (modalState.mode === 'add') {
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
        status: 'Untested'
      };
      setTestCases([testCase, ...testCases]);
    }
    handleModalClose();
  };

  const filteredTestCases = testCases.filter(testCase =>
    testCase.testCaseId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    testCase.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading test cases...</div>;
  }

  return (
    <div className="testcases-container">
      <div className="top-section">
        <div className="breadcrumb-section">
        </div>
        <div className="profile-section">
          
        </div>
      </div>

      <div className="search-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search By Test Case ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="add-case-btn" onClick={handleAddClick}>
          + Add Case
        </button>
      </div>

      <div className="testcases-table">
        <table>
          <thead>
            <tr>
              <th>Test Case ({testCases.length})</th>
              <th>Created By</th>
              <th>Tested By</th>
              <th>Case Type</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTestCases.map((testCase) => (
              <tr key={testCase._id}>
                <td>
                  <div className="test-case-info">
                    <div className="test-case-id">{testCase.testCaseId}</div>
                    <div className="test-case-desc">{testCase.description}</div>
                  </div>
                </td>
                <td>
                  <div className="user-info">
                    <div className="name">{testCase.createdBy.name}</div>
                    <div className="date">{testCase.createdBy.date}</div>
                  </div>
                </td>
                <td>
                  <div className="user-info">
                    <div className="name">{testCase.testedBy?.name || '-'}</div>
                    <div className="date">{testCase.testedBy?.date || ''}</div>
                  </div>
                </td>
                <td>
                  <span className={`case-type-badge ${testCase.caseType?.toLowerCase()}`}>
                    {testCase.caseType}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${testCase.status?.toLowerCase()}`}>
                    {testCase.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="edit-btn" title="Edit">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button 
                      className="view-btn" 
                      title="View"
                      onClick={() => handleViewClick(testCase)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalState.isOpen && (
        <TestCaseModal
          testCase={modalState.testCase}
          mode={modalState.mode}
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
};

export default TestCases; 