import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AssignGradePage = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch ungraded projects for the supervisor
    const supervisorId = localStorage.getItem('userId');
    const fetchUngradedProjects = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/ungraded-projects?id=${supervisorId}`);
        setProjects(response.data.projects);
      } catch (error) {
        console.error('Error fetching ungraded projects:', error);
      }
    };

    fetchUngradedProjects();
  }, []);

  const handleAssignGrade = async () => {
    try {
      const response = await axios.post('http://localhost:3001/assign-grade-to-project', {
        projectId: selectedProjectId,
        grade: selectedGrade
      });
      setMessage(response.data.message);
      // Display success message in an alert
      alert(response.data.message);
    } catch (error) {
      // Display error message in an alert
      alert('Error assigning grade to project');
    }
  };

  return (
    <div>
      <h2>Assign Grade to Project</h2>
      <div>
        <label>Select Project:</label>
        <select value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)}>
          <option value="">Select Project</option>
          {projects.map(project => (
            <option key={project._id} value={project._id}>{project.title}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Select Grade:</label>
        <select value={selectedGrade} onChange={(e) => setSelectedGrade(e.target.value)}>
          <option value="">Select Grade</option>
          <option value="A+">A+</option>
          <option value="A">A</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B">B</option>
          <option value="B-">B-</option>
          <option value="C+">C+</option>
          <option value="C">C</option>
          <option value="C-">C-</option>
          <option value="D+">D+</option>
          <option value="D">D</option>
          <option value="D-">D-</option>
        </select>
      </div>
      <button onClick={handleAssignGrade}>Assign Grade</button>
    </div>
  );
};

export default AssignGradePage;
