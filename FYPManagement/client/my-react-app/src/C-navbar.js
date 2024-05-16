import React from 'react'
import { Link } from 'react-router-dom'
import './StudentHome.css'

const C_navbar = ({active}) => {
    const handleChange = () => { 
    
        var nav = document.querySelector('nav');
        if(nav.style.left == '-105%') {
            nav.style.left = '0px'
        }
        else {
            nav.style.left = '-105%'
        }
        
      }; 
  return (
    <nav>
        <label htmlFor="check"><img src={require('./imgs/menu-icon.png')}/></label>
        <input type="checkbox" id="check" onChange={handleChange}/>
          <ul>
          <li className={active == 1 ? "active" : undefined}>
              <Link className='text-link' to="/C-ProjectDetails">Project Details</Link>
            </li>
            <li className={active == 2 ? "active" : undefined}>
              <Link className='text-link' to="/C-RegisterProject">Register Project</Link>
            </li>
            <li className={active == 3 ? "active" : undefined}>
              <Link className='text-link' to="/C-RegisterStudent">Register Student</Link>
            </li>
            <li className={active == 4 ? "active" : undefined}>
              <Link className='text-link' to="/C-AssignDeadline">Deadlines</Link>
            </li>
            <li className={active == 5 ? "active" : undefined}>
              <Link className='text-link' to="/C-AssignPanel">Assign Panel</Link>
            </li>
            <li className={active == 6 ? "active" : undefined}>
              <Link className='text-link' to="/C-AssignRole">Assign Role</Link>
            </li>
            <li className={active == 7 ? "active" : undefined}>
              <Link className='text-link' to="/C-AssignSupervisor">Assign Supervisor</Link>
            </li>
            <li className={active == 8 ? "active" : undefined}>
              <Link className='text-link' to="/C-AssignGroup">Assign Group</Link>
            </li>
            <li className={active == 9 ? "active" : undefined}>
              <Link className='text-link' to="/C-AssignProject">Assign Project</Link>
            </li>
          </ul>
      </nav>
  )
}

export default C_navbar