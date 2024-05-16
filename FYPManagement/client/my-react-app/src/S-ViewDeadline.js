import React, { useState, useEffect } from 'react';
import axios from 'axios';
import S_header from './header';
import S_navbar from './S-navbar';

const ViewDeadline = () => {
    const [projectDetail, setProjectDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

  useEffect(() => {
    const fetchGroupMembers = async () => {
      try {
        // Retrieve student ID from local storage
        const id = localStorage.getItem('userId');
        
        // Send request to backend API to get group members
        const response = await axios.get('http://localhost:3001/projectDeadline', {
          params: { id: id }
        });
        
        // Set the group members state with the response data
        setProjectDetail(response.data.projectDetail);
        setLoading(false);
      } catch (error) {
        // Handle any errors
        setError('Error fetching group members');
        setLoading(false);
      }
    };

    // Call the fetchGroupMembers function when the component mounts
    fetchGroupMembers();
  }, []);

  return (
    <div>
      <S_header />
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div >
          <section className='mainSection'>
            <S_navbar active={'4'} />
            <div className="welcome-container">
              <h2>Project Title: {projectDetail.title}</h2>
              <h2 className='box'>Deadline: {projectDetail.deadlines}</h2>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default ViewDeadline;
