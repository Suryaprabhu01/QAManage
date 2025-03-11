import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Logs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { projectId } = useParams();
  const [filter, setFilter] = useState({
    timeRange: 'This Month',
    labels: 'All Labels'
  });

  useEffect(() => {
    fetchLogs();
  }, [projectId, filter]);

  const fetchLogs = async () => {
    try {
      // Replace this with your actual API call
      const response = await fetch(`/api/projects/${projectId}/logs?timeRange=${filter.timeRange}&labels=${filter.labels}`);
      const data = await response.json();
      setLogs(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching logs:', error);
      setLoading(false);
    }
  };

  const getLabelStyle = (label) => {
    const styles = {
      'Case': { background: '#F2E8CF' },
      'Scenario': { background: '#E3F2F9' },
      'Module': { background: '#E9E9E9' },
      'Project': { background: '#E8F5E9' }
    };
    return styles[label] || { background: '#E9E9E9' };
  };

  return (
    <div className="logs-container">
      <div className="logs-header">
        <div className="search-filters">
          <input 
            type="text" 
            placeholder="Search by Log ID / Log Message / Username"
            className="search-input"
          />
          <select 
            value={filter.labels} 
            onChange={(e) => setFilter({...filter, labels: e.target.value})}
            className="label-filter"
          >
            <option value="All Labels">All Labels</option>
            <option value="Case">Case</option>
            <option value="Scenario">Scenario</option>
            <option value="Module">Module</option>
            <option value="Project">Project</option>
          </select>
          <select 
            value={filter.timeRange} 
            onChange={(e) => setFilter({...filter, timeRange: e.target.value})}
            className="time-filter"
          >
            <option value="This Month">This Month</option>
            <option value="Last Month">Last Month</option>
            <option value="Custom">Custom</option>
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
              <tr><td colSpan="6">Loading...</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan="6">No logs found</td></tr>
            ) : (
              logs.map(log => (
                <tr key={log.id}>
                  <td>{log.logId}</td>
                  <td>
                    <span className="label" style={getLabelStyle(log.label)}>
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

export default Logs;
