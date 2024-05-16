import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StudentHome.css'
import C_navbar from './C-navbar';
import S_Header from './header';

const AssignSupervisor = () => {
  // State variables
  const [projectsWithoutSupervisor, setProjectsWithoutSupervisor] = useState([]);
  const [supervisorsWithLimitedFYPs, setSupervisorsWithLimitedFYPs] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedSupervisor, setSelectedSupervisor] = useState('');

  // Fetch projects without supervisors and supervisors with limited FYPs
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch projects without supervisors
        const projectsRes = await axios.get('http://localhost:3001/projects-without-supervisor');
        setProjectsWithoutSupervisor(projectsRes.data.projectsWithoutSupervisor);

        // Fetch supervisors with limited FYPs
        const supervisorsRes = await axios.get('http://localhost:3001/supervisors-with-limited-fyps');
        setSupervisorsWithLimitedFYPs(supervisorsRes.data.facultyMembers);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Event handler for assigning supervisor to project
  const handleAssignSupervisor = async () => {
    try {
      // Send request to assign supervisor to project
      const response = await axios.post('http://localhost:3001/assign-supervisor-to-project', {
        supervisorId: selectedSupervisor,
        projectId: selectedProject
      });

      // Display response message in an alert
      alert(response.data.message);
      if(response.success){
        const projectsRes2 = await axios.get('http://localhost:3001/incrementincrement-maxFYPs',{
          supervisorId: selectedSupervisor,
        });
        console.log(projectsRes2.data.message);
      }
    } catch (error) {
      console.error('Error assigning supervisor to project:', error);
    }
  };

  return (
    <div>
      <S_Header />
      <section className='mainSection'>
        <C_navbar active={'7'} />
    <div className='welcome-container'>
      <h2>Assign Supervisor to Project</h2>
      <form>
      <div>
        <h3>Select Project:</h3>
        <select
        value={selectedProject}
        onChange={(e) => setSelectedProject(e.target.value)}
        // Inline CSS to set width and height
        >
          <option value="">Select Project</option>
          {projectsWithoutSupervisor.map(project => (
            <option key={project._id} value={project._id}>{project.title}</option>
          ))}
        </select>
        </div>

            <div>
              <h3>Select Supervisor:</h3>
              <select value={selectedSupervisor} onChange={(e) => setSelectedSupervisor(e.target.value)}>
                <option value="">Select Supervisor</option>
                {supervisorsWithLimitedFYPs.map(supervisor => (
                  <option key={supervisor.supervisorId} value={supervisor.supervisorId}>{supervisor.name}</option>
                ))}
              </select>
            </div>
            <button onClick={handleAssignSupervisor}>Assign Supervisor</button>
            </form>
          </div>
    </section>
    </div>
  );
};

export default AssignSupervisor;
