import React, { useState } from 'react';
import './Testers.css';
import AddTesters from './AddTesters';

const Testers = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [testers] = useState([
    { 
      id: 1, 
      name: 'John Doe', 
      email: 'john.doe@example.com',
      position: 'JUNIOR QA TRAINEE',
      createdDate: '2024-03-20',
      createdTime: '10:30 AM'
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      email: 'jane.smith@example.com',
      position: 'SENIOR QA ENGINEER',
      createdDate: '2024-03-19',
      createdTime: '02:15 PM'
    }
  ]);

  const handleAddTester = () => {
    setShowAddModal(true);
  };

  return (
    <div className="testers-container">
      <div className="testers-header">
        <h2>Testers</h2>
        <button className="add-tester-btn" onClick={handleAddTester}>
          + Add Tester
        </button>
      </div>

      <div className="testers-table-container">
        <table className="testers-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Position</th>
              <th>Created Date</th>
              <th>Created Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {testers.map((tester) => (
              <tr key={tester.id}>
                <td>{tester.name}</td>
                <td>{tester.email}</td>
                <td>{tester.position}</td>
                <td>{tester.createdDate}</td>
                <td>{tester.createdTime}</td>
                <td>
                  <button className="delete-btn">×</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <AddTesters
          onClose={() => setShowAddModal(false)}
          onTesterAdded={() => {
            setShowAddModal(false);
            // Refresh testers list here
          }}
        />
      )}
    </div>
  );
};

export default Testers;