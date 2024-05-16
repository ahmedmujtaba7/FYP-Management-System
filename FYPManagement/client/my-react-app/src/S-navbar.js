import React from 'react'
import { Link } from 'react-router-dom';
import './StudentHome.css'



const navbar = ({active}) => {
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
              <Link className='text-link' to="/S-Home">Home</Link>
            </li>
            <li className={active == 2 ? "active" : undefined}>
              <Link className='text-link' to="/S-ViewProjectTitle">Project Title</Link>
            </li>
            <li className={active == 3 ? "active" : undefined}>
              <Link className='text-link' to="/S-ViewSupervisor">Supervisor</Link>
            </li>
            <li className={active == 4 ? "active" : undefined}>
              <Link className='text-link' to="/S-ViewDeadline">Deadlines</Link>
            </li>
            <li className={active == 5 ? "active" : undefined}>
              {/* Update the link to navigate to "/S-GradesReport" */}
              <Link className='text-link' to="/S-ViewGroup">Group</Link>
            </li>
            <li className={active == 6 ? "active" : undefined}>
              <Link className='text-link' to="/S-ViewPanel">Panel</Link>
            </li>
          </ul>
    </nav>
  )
}

export default navbar;