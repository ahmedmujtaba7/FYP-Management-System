import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StudentHome.css'
import C_navbar from './C-navbar';
import S_Header from './header';

const AssignProject = () => {
  const [studentsWithoutProject, setStudentsWithoutProject] = useState([]);
  const [unassignedProjects, setUnassignedProjects] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch students without project
    const fetchStudentsWithoutProject = async () => {
      try {
        const response = await axios.get('http://localhost:3001/students-without-project');
        setStudentsWithoutProject(response.data.studentsWithoutProject);
      } catch (error) {
        console.error('Error fetching students without project:', error);
      }
    };

    // Fetch unassigned projects
    const fetchUnassignedProjects = async () => {
      try {
        const response = await axios.get('http://localhost:3001/unassigned-projects-projects');
        setUnassignedProjects(response.data.unassignedProjects);
      } catch (error) {
        console.error('Error fetching unassigned projects:', error);
      }
    };

    fetchStudentsWithoutProject();
    fetchUnassignedProjects();
  }, []);

  const handleAssignProject = async () => {
    try {
      const response = await axios.post('http://localhost:3001/assign-project-to-students', {
        studentId: selectedStudentId,
        projectId: selectedProjectId
      });
      setMessage(response.data.message);
      // Display success message in an alert
      alert(response.data.message);
    } catch (error) {
      // Display error message in an alert
      alert('Error assigning project to students');
    }
  };

  return (
    <div>
      <S_Header />
      <section className='mainSection'>
        <C_navbar active={'9'} />
    <div className="welcome-container">
  <h2>Assign Project to Student</h2>
  <form>
  <div className="select-student">
    <label>Select Student:</label>
    <select
      value={selectedStudentId}
      onChange={(e) => setSelectedStudentId(e.target.value)}
    >
      <option value="">Select Student</option>
      {studentsWithoutProject.map((student) => (
        <option key={student._id} value={student._id}>
          {student.name}
        </option>
      ))}
    </select>
  </div>
  <div className="select-project">
    <label>Select Project:</label>
    <select
      value={selectedProjectId}
      onChange={(e) => setSelectedProjectId(e.target.value)}
    >
      <option value="">Select Project</option>
      {unassignedProjects.map((project) => (
        <option key={project._id} value={project._id}>
          {project.title}
        </option>
      ))}
    </select>
  </div>
  <button onClick={handleAssignProject}>Assign Project</button>
  </form>
</div>
</section>
</div>
  );
};

export default AssignProject;
