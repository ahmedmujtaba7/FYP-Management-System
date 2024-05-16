import React from 'react'
import { Link } from 'react-router-dom'
import './StudentHome.css'

const header = () => {
  return (
    <header>
        <h1>FYP MANAGER</h1>
        <button>
            <Link className='text-link' to={'/'}>Logout</Link>
        </button>
    </header>
  )
}

export default header;