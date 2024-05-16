import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import CProjectDetails from './C-ProjectDetails';
import Home from './S-Home';
import ViewSupervisor from './S-ViewSupervisor';
import ViewProject from './S-ViewProjectTitle';
import ViewGroup from './S-ViewGroup';
import RegisterStudent from './C-RegisterStudent';
import RegisterProject from './C-RegisterProject';
import AssignGroups from './C-AssignGroup';
import AssignRoles from './C-AssignRole';
import AssignSupervisor from './C-AssignSup';
import AssignPanel from './C-AssignPanel';
import AssignProject from './C-AssignProject';
import AssignDeadline from './C-AssignDeadline';
import ViewDeadline from './S-ViewDeadline';
import PanelMembers from './S-ViewPanel';
import SProjectDetails from './Sup-ViewProject';
import PprojectDetails from './P-ViewProjects';
import AssignGrade from './Sup-AssignGrade';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>}/> 
        <Route path="/C-RegisterStudent" element={<RegisterStudent/>} />
        <Route path="/C-ProjectDetails" element={<CProjectDetails/>} />
        <Route path="/S-Home" element={<Home/>} />
        <Route path="/S-ViewPanel" element={<PanelMembers/>} />
        <Route path="/S-ViewProjectTitle" element={<ViewProject/>} />
        <Route path="/S-ViewSupervisor" element={<ViewSupervisor/>} />
        <Route path="/S-ViewDeadline" element={<ViewDeadline/>} />
        <Route path="/S-ViewGroup" element={<ViewGroup/>} />
        <Route path="/C-AssignPanel" element={<AssignPanel/>} />
        <Route path="/C-AssignProject" element={<AssignProject/>} />
        <Route path="/P-ViewProjects" element={<PprojectDetails/>} />
        <Route path="/Sup-ViewProject" element={<SProjectDetails/>} />
        <Route path="/assign-supervisor" element={<AssignSupervisor/>} />
        <Route path="/C-AssignRole" element={<AssignRoles/>} />
        <Route path="/C-AssignDeadline" element={<AssignDeadline/>} />
        <Route path="/C-AssignPanel" element={<AssignPanel/>} />
        <Route path="/C-AssignSupervisor" element={<AssignSupervisor/>} />
        <Route path="/C-AssignGroup" element={<AssignGroups/>} />
        <Route path="/C-RegisterProject" element={<RegisterProject/>} />
        <Route path="/assign-grade" element={<AssignGrade/>} />
        {/* Define other routes for different pages if needed */}
        </Routes>
    </Router>
    );
}

export default App;
