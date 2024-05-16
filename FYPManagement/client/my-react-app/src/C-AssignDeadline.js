import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StudentHome.css'
import C_navbar from './C-navbar';
import S_Header from './header';

const AssignDeadline = () => {
  const [projectsWithoutDeadline, setProjectsWithoutDeadline] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch projects without deadline
    const fetchProjectsWithoutDeadline = async () => {
      try {
        const response = await axios.get('http://localhost:3001/projects-without-deadline');
        setProjectsWithoutDeadline(response.data.projectsWithoutDeadline);
      } catch (error) {
        console.error('Error fetching projects without deadline:', error);
      }
    };

    fetchProjectsWithoutDeadline();
  }, []);

  const handleAssignDeadline = async () => {
    try {
      const projectIds = projectsWithoutDeadline.map(project => project._id);
      const response = await axios.post('http://localhost:3001/assign-deadline-to-projects', {
        deadlineDate: selectedDate,
        projectIds: projectIds
      });
      setMessage(response.data.message);
      // Display success message in an alert
      alert(response.data.message);
    } catch (error) {
      // Display error message in an alert
      alert('Error assigning deadline to projects');
    }
  };

  return (
    <div>
      <S_Header/>
      <section className='mainSection'>
        <C_navbar active={'4'}/>
        <div className='welcome-container'>
          <h2>Assign Deadline to Projects</h2>
          <form>
            <div>
              <h3>Projects Without Deadline:</h3>
              <ul>
                {projectsWithoutDeadline.map(project => (
                  <li key={project._id}>{project.title}</li>
                ))}
              </ul>
            </div>
            <div>
              <label>Select Deadline Date:</label>
              <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
            </div>
            
            <button onClick={handleAssignDeadline}>Assign Deadline</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default AssignDeadline;
