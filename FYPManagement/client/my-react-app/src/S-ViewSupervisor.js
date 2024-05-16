import React, { useState, useEffect } from 'react';
import axios from 'axios';
import S_header from './header';
import S_navbar from './S-navbar';
import './StudentHome.css'

const ViewSupervisor = () => {
  const [supervisorName, setSupervisorName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch student ID from local storage
    const studentId = localStorage.getItem('userId');

    // Make API call to get supervisor name
    axios.get('http://localhost:3001/get-supervisor-name',{
        params: { id: studentId }
    })
      .then(response => {
        setSupervisorName(response.data.supervisorName);
        setLoading(false);
      })
      .catch(error => {
        setError('Error retrieving supervisor name');
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <S_header />
      <section className='mainSection'>
        <S_navbar active={'3'} />
        <div className="welcome-container">
          <h1 className="welcome-text">Supervisor Name</h1>
          <h2 className='box'>{supervisorName}</h2>
        </div>
      </section>
    </div>
  );
};
export default ViewSupervisor;