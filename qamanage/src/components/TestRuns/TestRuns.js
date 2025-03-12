import React, { useState } from "react";
import { FaSearch, FaArrowRight } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './TestRuns.css';

const Modal = ({ onClose, children }) => {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export { Modal };

const TestRuns = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [testRegion, setTestRegion] = useState("Test Region");
  const [testStatus, setTestStatus] = useState("All Statuses");
  const [timePeriod, setTimePeriod] = useState("This Month");
  const [showModal, setShowModal] = useState(false);
  const [customDate, setCustomDate] = useState(null);

  const handleTimePeriodChange = (e) => {
    const value = e.target.value;
    setTimePeriod(value);
    if (value === "Custom") {
      setShowModal(true);
    }
  };

  const handleDateChange = (date) => {
    setCustomDate(date);
    setShowModal(false);
  };

  const testRunsData = [
    {
      taskId: "Task - 232",
      subTaskId: "Task - 232 - Sub - 001",
      scenario: "SpanPeople_SS_TS_01",
      description: "Verify the user able to request the Timeoff on Past and Future saturdays.",
      testedBy: "Surya Prabhu T",
      date: "March 05 2025",
      status: "Live",
      cases: 100,
      pass: 20,
      fail: 20,
      unexecuted: 20,
      testStatus: "Fail"
    },
    {
      taskId: "Task - 232",
      subTaskId: "Task - 232 - Sub - 001",
      scenario: "SpanPeople_SS_TS_01",
      description: "Verify the user able to request the Timeoff on Past and Future saturdays.",
      testedBy: "Surya Prabhu T",
      date: "March 05 2025",
      status: "Live",
      cases: 100,
      pass: 20,
      fail: 20,
      unexecuted: 20,
      testStatus: "Fail"
    },
    {
      taskId: "Task - 232",
      subTaskId: "Task - 232 - Sub - 001",
      scenario: "SpanPeople_SS_TS_01",
      description: "Verify the user able to request the Timeoff on Past and Future saturdays.",
      testedBy: "Surya Prabhu T",
      date: "March 05 2025",
      status: "Live",
      cases: 100,
      pass: 20,
      fail: 20,
      unexecuted: 20,
      testStatus: "Fail"
    },
    {
      taskId: "Task - 232",
      subTaskId: "Task - 232 - Sub - 001",
      scenario: "SpanPeople_SS_TS_01",
      description: "Verify the user able to request the Timeoff on Past and Future saturdays.",
      testedBy: "Surya Prabhu T",
      date: "March 05 2025",
      status: "Live",
      cases: 100,
      pass: 20,
      fail: 20,
      unexecuted: 20,
      testStatus: "Pass"
    }
  ];

  const filteredData = testRunsData.filter(
    (test) =>
      test.taskId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.testedBy.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="test-runs-container">
      <div className="search-filters-row">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by Task ID / Tester Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filters">
          <select value={testRegion} onChange={(e) => setTestRegion(e.target.value)}>
            <option>Test Region</option>
            <option>Sprint</option>
            <option>Staging</option>
            <option>UAT</option>
            <option>Live</option>
          </select>
          <select value={testStatus} onChange={(e) => setTestStatus(e.target.value)}>
            <option>All Statuses</option>
            <option>Completed</option>
            <option>In Progress</option>
            <option>Failed</option>
          </select>
          <select value={timePeriod} onChange={handleTimePeriodChange}>
            <option>This Month</option>
            <option>Last Month</option>
            <option>Last 3 Months</option>
            <option>Custom</option>
          </select>
        </div>
      </div>
      <table className="test-runs-table">
        <thead>
          <tr>
            <th>Task ID</th>
            <th>Sub Task ID</th>
            <th>Test Scenario</th>
            <th>Tested By</th>
            <th>Cases</th>
            <th>Pass | Fail | Unexecuted</th>
            <th>Test Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((test, index) => (
              <tr key={index}>
                <td>{test.taskId}</td>
                <td>{test.subTaskId}</td>
                <td>{test.scenario}</td>
                <td>
                  {test.testedBy}
                  <br />
                  {test.date}
                  <br />
                  <span className="status-badge">{test.status}</span>
                </td>
                <td>{test.cases}</td>
                <td>
                  <span className="pass">{test.pass}</span> | <span className="fail">{test.fail}</span> | <span className="unexecuted">{test.unexecuted}</span>
                </td>
                <td>
                  <span className={`test-status ${test.testStatus.toLowerCase()}`}>{test.testStatus}</span>
                </td>
                <td>
                  <FaArrowRight className="action-arrow" />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>No Test Runs Found</td>
            </tr>
          )}
        </tbody>
      </table>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <div className="datepicker-popup">
            <h2 className="text-lg font-bold mb-4">Select Custom Date</h2>
            <DatePicker selected={customDate} onChange={handleDateChange} inline />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default TestRuns;