import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import S_header from './header';
import S_navbar from './S-navbar';

const ViewProject = () => {
  const [id, setId] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Retrieve ID from internal storage (assuming it's stored as 'userId')
    const storedId = localStorage.getItem('userId');
    setId(storedId);
  }, []);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (id) {
        setLoading(true);
        try {
          // Send ID to API endpoint to retrieve project details using query parameter
          const response = await axios.get('http://localhost:3001/get-project-details', {
            params: { id: id } // Send ID as a query parameter
          });
          setProjectTitle(response.data.projectTitle);
          setProjectDescription(response.data.projectDescription);
          setLoading(false);
        } catch (error) {
          setError('Error fetching project details');
          setLoading(false);
        }
      }
    };
    fetchProjectDetails();
  }, [id]);

  return (
    <div>
      <S_header />
      <section className='mainSection'>
        <S_navbar active={'2'} />
        <div className="welcome-container">
          <h1 className="welcome-text">Project Details</h1>
          <h2 className='box'>Title: {projectTitle}</h2>
          <p className='box'>Description: {projectDescription}</p>
        </div>
      </section>
    </div>
  );
};

export default ViewProject;
