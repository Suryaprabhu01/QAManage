import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import ProtectedRoute from './components/ProtectedRoute';
import AddAdmin from './components/AddAdmin';
import './App.css';
import Scenarios from './components/Scenarios';
import TestCases from './components/TestCases';
import Modules from './components/Modules';
import Activity from './components/Activity';
import TestRuns from './components/TestRuns/TestRuns'; // Import the TestRuns component

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/modules" element={<Dashboard><Modules /></Dashboard>} />
          <Route path="/modules/scenarios/:moduleId" element={<Dashboard><Scenarios /></Dashboard>} />
          <Route path="/modules/scenarios/testcases/:scenarioId" element={<Dashboard><TestCases /></Dashboard>} />
          <Route path="/projects/:projectId/activity" element={<Dashboard><Activity /></Dashboard>} />
          <Route path="/testruns" element={<Dashboard><TestRuns /></Dashboard>} /> {/* Add the TestRuns route */}
          <Route
            path="/add-admin"
            element={
              <ProtectedRoute allowedRoles={['superadmin']}>
                <AddAdmin />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
