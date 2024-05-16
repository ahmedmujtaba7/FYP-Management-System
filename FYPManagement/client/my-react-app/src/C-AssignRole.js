import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StudentHome.css'
import C_navbar from './C-navbar';
import S_Header from './header';

const AssignRoles = () => {
  const [unassignedFaculty, setUnassignedFaculty] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState({});

  useEffect(() => {
    const fetchUnassignedFaculty = async () => {
      try {
        const response = await axios.get('http://localhost:3001/unassigned-faculty');
        setUnassignedFaculty(response.data.unassignedFaculty);
      } catch (error) {
        console.error('Error fetching unassigned faculty:', error);
      }
    };
    fetchUnassignedFaculty();
  }, []);

  const handleCheckboxChange = (id, role) => {
    setSelectedRoles({ ...selectedRoles, [id]: role });
  };

  const handleAssignRole = async () => {
    try {
      const assignments = [];
      for (const id in selectedRoles) {
        assignments.push({ id, role: selectedRoles[id] });
      }
      const response = await axios.post('http://localhost:3001/assign-role', assignments);
      alert(response.data.message);
    } catch (error) {
      console.error('Error assigning roles:', error);
      alert('Error assigning roles. Please try again.');
    }
  };

  return (
    <div>
      <S_Header />
      <section className='mainSection'>
        <C_navbar active={'6'} />
        <div className='welcome-container'>
          <h2>Assign Roles to Faculty Members</h2>
          {unassignedFaculty.map((faculty) => (
            <form>
            <div  key={faculty._id}>
              <h3>{faculty.name}</h3>
              <label>
                Panel
                <input
                  type="checkbox"
                  checked={selectedRoles[faculty._id] === 'Panel'}
                  onChange={() => handleCheckboxChange(faculty._id, 'Panel')}
                />
              </label>
              <label>
                Supervisor
                <input
                  type="checkbox"
                  checked={selectedRoles[faculty._id] === 'Supervisor'}
                  onChange={() => handleCheckboxChange(faculty._id, 'Supervisor')}
                />
              </label>
            </div>
            </form>
          ))}
          <button onClick={handleAssignRole}>Assign Roles</button>
        </div>
    </section>
    </div>
  );
};

export default AssignRoles;
