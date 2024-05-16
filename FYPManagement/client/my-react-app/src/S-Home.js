import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './StudentHome.css';
import axios from 'axios';
import S_header from './header';
import S_navbar from './S-navbar';

const Home = () => {
  const [id, setId] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  

  useEffect(() => {
    // Retrieve ID from internal storage (assuming it's stored as 'userId')
    const storedId = localStorage.getItem('userId');
    setId(storedId);
  }, []);

  useEffect(() => {
    const fetchUsername = async () => {
        if (id) {
          setLoading(true);
          try {
            // Send ID to API endpoint to retrieve username using query parameter
            const response = await axios.get('http://localhost:3001/get-username', {
              params: { id: id } // Send ID as a query parameter
            });
            console.log(response.data.username)
            setUsername(response.data.username);
            setLoading(false);
          } catch (error) {
            setError('Error fetching username');
            setLoading(false);
          }
        }
      };
    fetchUsername();
  }, [id]);

  return (
    <div>
      <S_header />
      <section className='mainSection'>
      <S_navbar active={'1'} />
        <div className="welcome-container">
          <h1 className="welcome-text">Welcome, {username}</h1>
        </div>
      </section>
    </div>
  );
};

export default Home;
