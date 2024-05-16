import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PprojectDetails = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjectsBySupervisor = async () => {
      try {
        // Retrieve supervisor ID from local storage
        const facultyId = localStorage.getItem('userId');
        console.log(facultyId)
        // Call the API to fetch projects by supervisor ID
        const response = await axios.get('http://localhost:3001/projects-by-panel', {
          params: { id: facultyId }
        });

        // Extract projects data from the response
        const projectsData = response.data.projects;

        // Set projects state with the fetched data
        setProjects(projectsData);
        setLoading(false);
      } catch (error) {
        setError('Error fetching projects');
        setLoading(false);
      }
    };

    fetchProjectsBySupervisor();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div>
          <h2>Projects Assigned to Panel</h2>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, index) => (
                <tr key={index}>
                  <td>{project.title}</td>
                  <td>{project.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PprojectDetails;
