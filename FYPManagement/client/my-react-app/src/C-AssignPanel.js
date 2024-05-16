import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StudentHome.css'
import C_navbar from './C-navbar';
import S_Header from './header';

const AssignPanel = () => {
  const [panels, setPanels] = useState([]);
  const [selectedPanel, setSelectedPanel] = useState('');
  const [projectsWithoutPanels, setProjectsWithoutPanels] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');

  useEffect(() => {
    // Fetch all panels
    axios.get('http://localhost:3001/panels')
      .then(response => {
        setPanels(response.data.panels);
      })
      .catch(error => {
        console.error('Error fetching panels:', error);
      });

    // Fetch projects without panels
    axios.get('http://localhost:3001/unassigned-projects-panels')
      .then(response => {
        setProjectsWithoutPanels(response.data.unassignedProjects);
      })
      .catch(error => {
        console.error('Error fetching unassigned projects:', error);
      });
  }, []);

  const handleAssignPanel = () => {
    if (!selectedPanel || !selectedProject) {
      alert('Please select a panel and a project.');
      return;
    }

    // Assign panel to project
    axios.post('http://localhost:3001/assign-panel-to-project', {
      panelId: selectedPanel,
      projectId: selectedProject
    })
    .then(response => {
      alert(response.data.message);
    })
    .catch(error => {
      console.error('Error assigning panel to project:', error);
      alert('Error assigning panel to project. Please try again.');
    });
  };

  return (
    <div>
      <S_Header />
      <section className='mainSection'>
        <C_navbar active={'5'} />
        <div className="assign-project-container welcome-container">
          <h2>Assign Panel to Project</h2>
          <div className="select-panel">
            <label>Select Panel:</label>
            <select className="select-student" onChange={(e) => setSelectedPanel(e.target.value)}>
              <option value="">Select Panel</option>
              {panels.map((panel, index) => (
                <option key={panel._id} value={panel._id}>{`Panel ${index + 1}`}</option>
              ))}
            </select>
          </div>
          <div className="select-project">
            <label>Select Project without Panel:</label>
            <select className="select-project" onChange={(e) => setSelectedProject(e.target.value)}>
              <option value="">Select Project</option>
              {projectsWithoutPanels.map(project => (
                <option key={project._id} value={project._id}>{project.title}</option>
              ))}
            </select>
          </div>
          <button className="assign-panel-btn" onClick={handleAssignPanel}>Assign Panel</button>
        </div>
      </section>
</div>
  );
};

export default AssignPanel;
