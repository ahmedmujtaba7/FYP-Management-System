import React, { useState } from 'react';
import axios from 'axios';
import './StudentHome.css'
import C_navbar from './C-navbar';
import S_Header from './header';

const RegisterStudent = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate name length
    if (name.length > 15) {
      setError('Name should not be longer than 15 characters');
      return;
    }

    if (name.length < 5) {
      setError('Name should not be shorter than 5 characters');
      return;
    }

    // Validate password contains capital and special characters
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])/
    if (!regex.test(password)) {
      setError('Password should contain at least one capital letter and one special character');
      return;
    }
    if (password.length<8 || password.length>15) {
      setError('Password should contain at least 8 characters and  at most 15 characters');
      return;
    }

    try {
      // Send registration data to the backend API
      const response = await axios.post('http://localhost:3001/register', {
        name,
        email,
        password
      });

      // Display success message
      if (response.data.success) {
        alert('Registration successful!');
        // Clear form fields
        setName('');
        setEmail('');
        setPassword('');
        setError('');
      }
    } catch (error) {
      // Display error message if registration fails
      setError('Failed to register. Please try again.');
    }
  };

  return (
    <div>
      <S_Header />
      <section className='mainSection'>
        <C_navbar active={'3'} />
        <div className='welcome-container'>
          <h2>Registration Form</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name">Name:</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <p>{error}</p>}
            <button type="submit">Register</button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default RegisterStudent;
