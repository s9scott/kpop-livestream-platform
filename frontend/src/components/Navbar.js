import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/artists">Artists</Link></li>
        <li><Link to="/load-live">Load Live</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        
      </ul>
    </nav>
  );
};

export default Navbar;
