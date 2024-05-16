// import React, { useState } from 'react';
import React, { useState } from 'react';
import axios from 'axios';
//import { useHistory } from 'react-router-dom';
import './App.css'
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const [name, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('students'); // Adjusted default role
  const [error, setError] = useState('');
  const navigate = useNavigate();
  //const history = useHistory();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:3001/login", {
        name,
        password,
        role: role.toLowerCase() // Ensure role is lowercase
      });

      if (response.data.success) {
        localStorage.setItem('userId', response.data.id);
        switch (role.toLowerCase()) {
          case 'students':
            //setUserRole('student');
            navigate('./S-Home');
            break;
          case 'committee member':
            //setUserRole('committeeMember');
            navigate('/C-RegisterStudent');
            break;
          case 'supervisor':
            //setUserRole('supervisor');
            navigate('/Sup-ViewProject');
            break;
          case 'panel member': // Adjusted role name
            //setUserRole('panel');
            navigate('/P-ViewProjects');
            break;
          default:
            setError('Invalid role');
            break;
        }
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('An error occurred during login. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <h1>FYP Management System</h1>
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="login-container">
        <label htmlFor="username">Username:</label>
        <input type="text" id="username" className="input-field" value={name} onChange={(e) => setUsername(e.target.value)} />
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} />
        <label htmlFor="role">Role:</label>
        <select id="role" className="input-field" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="students">Students</option>
          <option value="committee member">Committee Member</option>
          <option value="supervisor">Supervisor</option>
          <option value="panel member">Panel Member</option>
        </select>
        <button className="login-button" onClick={handleLogin}>Login</button>
      </div>
    </div>

  );
};

export default Login;
