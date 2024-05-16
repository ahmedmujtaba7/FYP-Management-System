import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StudentHome.css'
import C_navbar from './C-navbar';
import S_Header from './header';


const AssignGroups = () => {
  // State variables
  const [students, setStudents] = useState([]); // To store unassigned students
  const [selectedStudents, setSelectedStudents] = useState([]); // To store selected student IDs
  const [loading, setLoading] = useState(false); // To track loading state
  const [error, setError] = useState(''); // To store error message

  useEffect(() => {
    // Function to fetch unassigned students from the backend API
    const fetchUnassignedStudents = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3001/unassigned-students');
        setStudents(response.data.unassignedStudents);
        setLoading(false);
      } catch (error) {
        setError('Error fetching unassigned students');
        setLoading(false);
      }
    };

    // Call the fetchUnassignedStudents function when the component mounts
    fetchUnassignedStudents();
  }, []);

  // Event handler for checkbox selection change
  const handleCheckboxChange = (e) => {
    const studentId = e.target.value;
    if (e.target.checked) {
      // Add the selected student ID to the list
      setSelectedStudents(prevState => [...prevState, studentId]);
    } else {
      // Remove the deselected student ID from the list
      setSelectedStudents(prevState => prevState.filter(id => id !== studentId));
    }
  };
  // Event handler for registering the group
  const handleRegisterGroup = async () => {
    try {
      // Send a request to the backend API to assign group members
      const sender= selectedStudents.slice(0,3)
      const response = await axios.post('http://localhost:3001/assign-group-members', {
        student1Id: sender[0],
        student2Id: sender[1],
        student3Id: sender[2] // Limit to three selected student IDs
      });

      // Display success message in an alert
      alert(response.data.message);

      // Clear selected students
      setSelectedStudents([]);

    } catch (error) {
      // Display error message in an alert
      alert('Error registering group');
    }
  };

  return (
    <div>
      <S_Header />
      
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <section className='mainSection'>
          <C_navbar active={'8'} />
        <div className='welcome-container'>
        <h2>Select Group Members</h2>
        <form>
        <div>
          {/* Checkboxes for selecting group members */}
          {students.map(student => (
            <div key={student._id}>
              <label>
                <input
                  type="checkbox"
                  value={student._id}
                  checked={selectedStudents.includes(student._id)}
                  onChange={handleCheckboxChange}
                />
                {student.name}
              </label>
            </div>
          ))}
          {/* Button to register the group */}
          <button onClick={handleRegisterGroup}>Assign Group</button>
        </div>
        </form>
        </div>
        </section>
      )}
    </div>
  );
};

export default AssignGroups;
