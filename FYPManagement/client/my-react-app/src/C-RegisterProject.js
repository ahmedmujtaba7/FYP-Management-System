import React, { useState } from 'react';
import axios from 'axios';
import './StudentHome.css'
import C_navbar from './C-navbar';
import S_Header from './header';

const RegisterProject = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      // Validate project title and description lengths
      if (title.length > 15 || description.length > 150) {
        setError('Project title must be less than 15 characters and description must be less than 150 characters.');
        setLoading(false);
        return;
      }
      if (title.length < 5 || description.length < 15) {
        setError('Project title must be greater than 5 characters and description must be greater than 15 characters.');
        setLoading(false);
        return;
      }

      // Send project data to the backend API
      const response = await axios.post('http://localhost:3001/add-project', { title, description });

      if (response.data.success) {
        alert('Project Added successfully!');
        setSuccess(true);
        setTitle('');
        setDescription('');
      } else {
        setError('Failed to add project. Please try again.');
      }
    } catch (error) {
      setError('Error adding project. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <S_Header />
      <section className='mainSection'>
        <C_navbar active={'2'} />
        <div className='welcome-container'>
          <h2>Add Project</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="title">Project Title:</label>
                <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div>
                <label htmlFor="description">Project Description:</label>
                <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <button type="submit" disabled={loading}>Register</button>
            </form>
          {loading && <p>Loading...</p>}
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">Project added successfully!</p>}
        </div>
      </section>

    </div>
  );
};

export default RegisterProject;
