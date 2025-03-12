import React, { useState, useRef } from 'react';
import './TestCaseModal.css';

const TestCaseModal = ({ testCase, onClose, onSave, mode = 'view' }) => {
  const [editedCase, setEditedCase] = useState(testCase || {
    testCaseId: '',
    caseType: '',
    description: '',
    expectedResult: '',
    testCaseData: '',
    steps: '',
    results: []
  });

  const [newResult, setNewResult] = useState({
    testRegion: '',
    testStatus: '',
    comments: '',
    reference: '',
    bugReferenceId: '',
    bugPriority: ''
  });

  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState(null);

  // Define status options with their colors
  const statusOptions = [
    { value: 'Pass', label: 'Pass', color: '#28a745' },
    { value: 'Fail', label: 'Fail', color: '#dc3545' },
    { value: 'Untested', label: 'Untested', color: '#6c757d' }
  ];

  // Define case type options
  const caseTypeOptions = [
    { value: 'Positive', label: 'Positive', color: '#28a745' },
    { value: 'Negative', label: 'Negative', color: '#dc3545' }
  ];

  const handleAddResult = () => {
    const updatedResults = [...(editedCase.results || []), {
      ...newResult,
      testedBy: 'Surya Prabhu T',
      date: new Date().toLocaleDateString()
    }];

    setEditedCase({
      ...editedCase,
      results: updatedResults
    });

    // Clear the form after adding
    setNewResult({
      testRegion: '',
      testStatus: '',
      comments: '',
      reference: '',
      bugReferenceId: '',
      bugPriority: ''
    });
  };

  const handleSaveResult = () => {
    handleAddResult();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedCase);
    onClose();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is image or video
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        setSelectedFile(file);
        setFileType(file.type.startsWith('image/') ? 'image' : 'video');
        setNewResult({
          ...newResult,
          reference: file.name,
          referenceType: file.type.startsWith('image/') ? 'image' : 'video'
        });
      } else {
        alert('Please select an image or video file');
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const renderFilePreview = () => {
    if (!selectedFile) return null;

    if (fileType === 'video') {
      return (
        <div className="file-preview video-preview">
          <video
            src={URL.createObjectURL(selectedFile)}
            controls
            className="preview-video"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    return (
      <div className="file-preview image-preview">
        <img
          src={URL.createObjectURL(selectedFile)}
          alt="Preview"
          className="preview-image"
        />
      </div>
    );
  };

  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';
  const isAddMode = mode === 'add';

  if (isAddMode) {
    return (
      <div className="modal-overlay">
        <div className="add-modal-content">
          <div className="modal-header">
            <h2>Add New Case</h2>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Test Case ID</label>
                <input
                  type="text"
                  placeholder="Enter the Test case ID"
                  value={editedCase.testCaseId}
                  onChange={(e) => setEditedCase({
                    ...editedCase,
                    testCaseId: e.target.value
                  })}
                />
              </div>
              <div className="form-group">
                <label>Test Case Type</label>
                <select
                  value={editedCase.caseType}
                  onChange={(e) => setEditedCase({
                    ...editedCase,
                    caseType: e.target.value
                  })}
                  className={`case-type-select ${editedCase.caseType?.toLowerCase()}`}
                >
                  <option value="">Choose the Test Case Type</option>
                  {caseTypeOptions.map(option => (
                    <option
                      key={option.value}
                      value={option.value}
                      className={`case-type-option ${option.value.toLowerCase()}`}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Test Case Description</label>
              <textarea
                placeholder="Enter the Test case description"
                value={editedCase.description}
                onChange={(e) => setEditedCase({
                  ...editedCase,
                  description: e.target.value
                })}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Expected Result</label>
                <textarea
                  placeholder="Enter the Expected Result"
                  value={editedCase.expectedResult}
                  onChange={(e) => setEditedCase({
                    ...editedCase,
                    expectedResult: e.target.value
                  })}
                />
              </div>
              <div className="form-group">
                <label>Test Case Data</label>
                <textarea
                  placeholder="Enter the test case data"
                  value={editedCase.testCaseData}
                  onChange={(e) => setEditedCase({
                    ...editedCase,
                    testCaseData: e.target.value
                  })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Steps</label>
              <textarea
                placeholder="Enter the steps to Test"
                value={editedCase.steps}
                onChange={(e) => setEditedCase({
                  ...editedCase,
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
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{isAddMode ? 'Add New Case' : 'Test Case Details'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="test-details-section">
              <div className="form-row">
                <div className="form-group">
                  <label>Test Case ID</label>
                  <input
                    type="text"
                    placeholder="Enter the Test case ID"
                    value={editedCase.testCaseId || ''}
                    onChange={(e) => setEditedCase({
                      ...editedCase,
                      testCaseId: e.target.value
                    })}
                    disabled={isViewMode}
                  />
                </div>
                <div className="form-group">
                  <label>Test Case Type</label>
                  <select
                    value={editedCase.caseType || ''}
                    onChange={(e) => setEditedCase({
                      ...editedCase,
                      caseType: e.target.value
                    })}
                    disabled={isViewMode}
                    className={`case-type-select ${editedCase.caseType?.toLowerCase()}`}
                  >
                    <option value="">Choose the Test Case Type</option>
                    {caseTypeOptions.map(option => (
                      <option
                        key={option.value}
                        value={option.value}
                        className={`case-type-option ${option.value.toLowerCase()}`}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Test Case Description</label>
                <textarea
                  placeholder="Enter the Test case description"
                  value={editedCase.description || ''}
                  onChange={(e) => setEditedCase({
                    ...editedCase,
                    description: e.target.value
                  })}
                  disabled={isViewMode}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Expected Result</label>
                  <textarea
                    placeholder="Enter the Expected Result"
                    value={editedCase.expectedResult || ''}
                    onChange={(e) => setEditedCase({
                      ...editedCase,
                      expectedResult: e.target.value
                    })}
                    disabled={isViewMode}
                  />
                </div>
                <div className="form-group">
                  <label>Test Case Data</label>
                  <textarea
                    placeholder="Enter the test case data"
                    value={editedCase.testCaseData || ''}
                    onChange={(e) => setEditedCase({
                      ...editedCase,
                      testCaseData: e.target.value
                    })}
                    disabled={isViewMode}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Steps</label>
                <textarea
                  placeholder="Enter the steps to Test"
                  value={editedCase.steps || ''}
                  onChange={(e) => setEditedCase({
                    ...editedCase,
                    steps: e.target.value
                  })}
                  disabled={isViewMode}
                />
              </div>

              {!isAddMode && (
                <div className="results-section">
                  <h3>Results</h3>
                  {(editedCase.results || []).map((result, index) => (
                    <div key={index} className="result-item">
                      <div className="result-header">
                        <div className="tester-info">
                          <span>{result.testedBy}</span>
                          <span className="date">{result.date}</span>
                        </div>
                      </div>

                      <div className="result-form">
                        <div className="form-row">
                          <div className="form-group">
                            <label>Test Region</label>
                            <select value={result.testRegion} disabled>
                              <option>Choose the Test Region</option>
                              <option value="Production">Production</option>
                              <option value="Staging">Staging</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label>Test Status</label>
                            <select value={result.testStatus} disabled>
                              <option>Choose the Test Status</option>
                              <option value="Pass">Pass</option>
                              <option value="Fail">Fail</option>
                            </select>
                          </div>
                        </div>

                        <div className="form-group">
                          <label>Comments</label>
                          <textarea
                            placeholder="Enter the Test Region"
                            value={result.comments}
                            disabled
                          />
                        </div>

                        <div className="form-group">
                          <label>Reference</label>
                          <div className="reference-input">
                            <input
                              type="text"
                              placeholder="Image or Video"
                              value={result.reference}
                              disabled
                            />
                            <button type="button" className="attach-btn" disabled>📎</button>
                          </div>
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <label>Bug Reference ID</label>
                            <input
                              type="text"
                              placeholder="Enter the Bug Ref ID"
                              value={result.bugReferenceId}
                              disabled
                            />
                          </div>
                          <div className="form-group">
                            <label>Bug Priority</label>
                            <select value={result.bugPriority} disabled>
                              <option>Choose the Bug Priority</option>
                              <option value="High">High</option>
                              <option value="Medium">Medium</option>
                              <option value="Low">Low</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {(isEditMode || isViewMode) && (
                    <div className="add-result-form">
                      <div className="form-row">
                        <div className="form-group">
                          <label>Test Region</label>
                          <select
                            value={newResult.testRegion}
                            onChange={(e) => setNewResult({
                              ...newResult,
                              testRegion: e.target.value
                            })}
                          >
                            <option value="">Choose the Test Region</option>
                            <option value="Production">Production</option>
                            <option value="Staging">Staging</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Test Status</label>
                          <select
                            value={newResult.testStatus}
                            onChange={(e) => setNewResult({
                              ...newResult,
                              testStatus: e.target.value
                            })}
                            className={`status-select ${newResult.testStatus?.toLowerCase()}`}
                          >
                            <option value="">Choose the Test Status</option>
                            {statusOptions.map(option => (
                              <option
                                key={option.value}
                                value={option.value}
                                className={`status-option ${option.value.toLowerCase()}`}
                              >
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Comments</label>
                        <textarea
                          placeholder="Enter the Test Region"
                          value={newResult.comments}
                          onChange={(e) => setNewResult({
                            ...newResult,
                            comments: e.target.value
                          })}
                        />
                      </div>

                      <div className="form-group">
                        <label>Reference</label>
                        <div className="reference-input">
                          <input
                            type="text"
                            placeholder="Image or Video"
                            value={newResult.reference}
                            readOnly
                          />
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            accept="image/*,video/*,.mp4,.mov,.avi,.mkv"
                            style={{ display: 'none' }}
                          />
                          <button
                            type="button"
                            className="attach-btn"
                            onClick={handleUploadClick}
                            title="Upload Image/Video"
                          >
                            📎
                          </button>
                          {selectedFile && (
                            <button
                              type="button"
                              className="clear-btn"
                              onClick={() => {
                                setSelectedFile(null);
                                setFileType(null);
                                setNewResult({
                                  ...newResult,
                                  reference: '',
                                  referenceType: null
                                });
                              }}
                              title="Remove file"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                        {selectedFile && renderFilePreview()}
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Bug Reference ID</label>
                          <input
                            type="text"
                            placeholder="Enter the Bug Ref ID"
                            value={newResult.bugReferenceId}
                            onChange={(e) => setNewResult({
                              ...newResult,
                              bugReferenceId: e.target.value
                            })}
                          />
                        </div>
                        <div className="form-group">
                          <label>Bug Priority</label>
                          <select
                            value={newResult.bugPriority}
                            onChange={(e) => setNewResult({
                              ...newResult,
                              bugPriority: e.target.value
                            })}
                          >
                            <option value="">Choose the Bug Priority</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="modal-actions">
              {(isEditMode || isViewMode) && (
                <button
                  type="button"
                  className="add-result-btn"
                  onClick={handleAddResult}
                >
                  + Add Result
                </button>
              )}
              <button
                type="button"
                className="save-result-btn"
                onClick={handleSaveResult}
              >
                Save Result
              </button>
              <button
                type="button"
                className="edit-case-btn"
                onClick={() => onSave(editedCase)}
              >
                Edit Case
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TestCaseModal; 