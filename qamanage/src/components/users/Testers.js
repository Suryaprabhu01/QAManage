import React, { useState } from 'react';

const DUMMY_TESTERS = [
  {
    name: 'Dhyaneshwaran K',
    email: 'dhyaneshwaran.k@spantechnologyservices.com',
    createdDate: '06/03/2025',
    createdTime: '10:54:51',
    position: 'JUNIOR QA TRAINEE'
  },
  // Add more dummy data as needed
];

const Testers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(8);

  return (
    <div className="users-section">
      <div className="users-header">
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search By Tester ID / Tester Name / Tester Email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <table className="users-table">
        <thead>
          <tr>
            <th>User Name</th>
            <th>Created Date & Time</th>
            <th>Position</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {DUMMY_TESTERS.map((tester, index) => (
            <tr key={index}>
              <td>
                <div className="user-name">{tester.name}</div>
                <div className="user-email">{tester.email}</div>
              </td>
              <td>
                <div>{tester.createdDate}</div>
                <div className="time">{tester.createdTime}</div>
              </td>
              <td>{tester.position}</td>
              <td>
                <button className="delete-btn">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="table-footer">
        <div className="rows-per-page">
          Rows per page: 
          <select 
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
          >
            <option value={8}>8</option>
            <option value={16}>16</option>
            <option value={24}>24</option>
          </select>
        </div>
        <div className="pagination">
          <button className="prev-btn">←</button>
          <span>1</span>
          <button className="next-btn">→</button>
        </div>
      </div>
    </div>
  );
};

export default Testers; 