import React, { useState, useEffect } from 'react';
import axios from 'axios';
import S_header from './header';
import S_navbar from './S-navbar';
import './StudentHome.css'

const ViewGroup = () => {
  const [groupMembers, setGroupMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGroupMembers = async () => {
      try {
        // Retrieve student ID from local storage
        const id = localStorage.getItem('userId');
        
        // Send request to backend API to get group members
        const response = await axios.get('http://localhost:3001/group-members', {
          params: { id: id }
        });
        
        // Set the group members state with the response data
        setGroupMembers(response.data.groupMembers);
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
        <section className='mainSection'>
          <S_navbar active={'5'} />
          <div className="welcome-container">
            <h1 className="welcome-text">Group Members</h1>
            <ul className='groupMembers'>
              {groupMembers.map((member, index) => (
                <li key={index}>
                  <strong>Name:</strong> {member.name} - <strong>Email:</strong> {member.email}
                </li>
              ))}
            </ul>
          </div>
        </section>
    </div>
  );
};

export default ViewGroup;
