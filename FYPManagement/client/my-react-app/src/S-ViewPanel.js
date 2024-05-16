import React, { useState, useEffect } from 'react';
import axios from 'axios';
import S_header from './header';
import S_navbar from './S-navbar';

const PanelMembers = () => {
  const [panelMembers, setPanelMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPanelMembers = async () => {
      try {
        // Retrieve student ID from local storage
        const studentId = localStorage.getItem('userId');

        // Send request to backend API to get panel members
        const response = await axios.get('http://localhost:3001/panel-members', {
          params: { id: studentId }
        });

        // Set the panel members state with the response data
        setPanelMembers(response.data.panelMembers);
        setLoading(false);
      } catch (error) {
        // Handle any errors
        setError('Error fetching panel members');
        setLoading(false);
      }
    };

    // Call the fetchPanelMembers function when the component mounts
    fetchPanelMembers();
  }, []);

  return (
    <div>
      <S_header />
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <section className='mainSection'>
          <S_navbar active={'6'}/>
          <div className='welcome-container'>
            <h2>Panel Members</h2>
            <ol>
              {panelMembers.map((member, index) => (
                <li className='box' key={index}>{member.name}</li>
              ))}
            </ol>
          </div>
        </section>
      )}
    </div>
  );
};

export default PanelMembers;
