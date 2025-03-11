import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Activity.css';

const Activity = () => {
  const [logs, setLogs] = useState([]);
  const { projectId } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace this with your actual API call when backend is ready
    const fetchLogs = async () => {
      try {
        const response = await fetch(`/api/projects/${projectId}/logs`);
        const data = await response.json();
        setLogs(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching logs:', error);
        setLoading(false);
      }
    };

    fetchLogs();
  }, [projectId]);

  // For demo purposes - remove this when connecting to real backend
  useEffect(() => {
    const demoLogs = [
      {
        id: '0000001',
        label: 'Case',
        location: 'Project name 1/SpanPeople_01/SpanPeople_01_TS_01',
        dateTime: '2024-03-06T10:54:51',
        message: 'Created Project TestBandits',
        username: 'dhyaneshwaran.k@sportstechnologyservices.com'
      },
      {
        id: '0000002',
        label: 'Scenario',
        location: 'Project name 1/SpanPeople_01/SpanPeople_01_TS_01',
        dateTime: '2024-03-06T10:54:51',
        message: 'Created Scenario SpanPeople_01_TS_01',
        username: 'dhyaneshwaran.k@sportstechnologyservices.com'
      },
      // Add more demo logs as needed
    ];
    setLogs(demoLogs);
    setLoading(false);
  }, []);

  return (
    <div className="activity-container">
      <div className="activity-header">
        <div className="breadcrumb">Project name / Logs</div>
        <div className="search-filters">
          <input 
            type="text" 
            placeholder="Search by Log ID / Log Message / Username"
            className="search-input"
          />
          <select className="filter-select">
            <option value="all">All Labels</option>
            <option value="case">Case</option>
            <option value="scenario">Scenario</option>
            <option value="module">Module</option>
            <option value="project">Project</option>
          </select>
          <select className="filter-select">
            <option value="thisMonth">This Month</option>
            <option value="lastMonth">Last Month</option>
            <option value="custom">Custom</option>
          </select>
        </div>
      </div>

      <div className="logs-table">
        <table>
          <thead>
            <tr>
              <th>Log ID</th>
              <th>Label</th>
              <th>Location</th>
              <th>Date & Time</th>
              <th>Log message</th>
              <th>Username</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="loading">Loading...</td>
              </tr>
            ) : (
              logs.map(log => (
                <tr key={log.id}>
                  <td>{log.id}</td>
                  <td>
                    <span className={`label label-${log.label.toLowerCase()}`}>
                      {log.label}
                    </span>
                  </td>
                  <td>{log.location}</td>
                  <td>{new Date(log.dateTime).toLocaleString()}</td>
                  <td>{log.message}</td>
                  <td>{log.username}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Activity; 