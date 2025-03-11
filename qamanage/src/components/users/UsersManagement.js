import React, { useState } from 'react';
import Testers from './Testers';
import Admins from './Admins';
import SuperAdmin from './SuperAdmin';
import './Users.css';

const UsersManagement = () => {
  const [activeTab, setActiveTab] = useState('testers');

  return (
    <div className="users-management">
      <div className="breadcrumb">
        Project name / Profile / Users / {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
      </div>
      
      <div className="user-tabs">
        <button 
          className={`tab-btn ${activeTab === 'testers' ? 'active' : ''}`}
          onClick={() => setActiveTab('testers')}
        >
          Testers
        </button>
        <button 
          className={`tab-btn ${activeTab === 'admins' ? 'active' : ''}`}
          onClick={() => setActiveTab('admins')}
        >
          Admins
        </button>
        <button 
          className={`tab-btn ${activeTab === 'superadmin' ? 'active' : ''}`}
          onClick={() => setActiveTab('superadmin')}
        >
          Super Admin
        </button>
      </div>

      {activeTab === 'testers' && <Testers />}
      {activeTab === 'admins' && <Admins />}
      {activeTab === 'superadmin' && <SuperAdmin />}
    </div>
  );
};

export default UsersManagement;
