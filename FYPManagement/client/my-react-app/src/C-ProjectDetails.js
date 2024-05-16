import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StudentHome.css'
import C_navbar from './C-navbar';
import S_Header from './header';

const CProjectDetails = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Fetch projects from the API
        const response = await axios.get('http://localhost:3001/projects');
        setProjects(response.data.projects);
        setLoading(false);
      } catch (error) {
        setError('Error fetching projects');
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div>
      <S_Header />
      <section className='mainSection'>
        <C_navbar active={'1'}/>
        <div>
          <h2>Project List</h2>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Students</th>
                  <th>Supervisor</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project, index) => (
                  <tr key={index}>
                    <td>{project.title}</td>
                    <td>{project.description}</td>
                    <td>
                      <ul>
                        {project.students.map((student, index) => (
                          <li key={index}>{student.name} ({student.email})</li>
                        ))}
                      </ul>
                    </td>
                    <td>{project.supervisor.name} ({project.supervisor.email})</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
    </section>
    </div>
  );
};

export default CProjectDetails;
