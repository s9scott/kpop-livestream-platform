import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-content">
          <ul>
            <li><NavLink to="/" exact>Home</NavLink></li>
            <li><NavLink to="/artists">Artists</NavLink></li>
            <li><NavLink to="/load-live">Load Live</NavLink></li>
            <li><NavLink to="/about">About</NavLink></li>
            <li><NavLink to="/contact">Contact</NavLink></li>
          </ul>
        </div>
      </div>
      <div className={`sidebar-toggle ${isOpen ? 'open' : ''}`} onClick={toggleSidebar}>
        <span className={`arrow ${isOpen ? 'open' : ''}`}></span>
      </div>
    </div>
  );
};

export default Sidebar;
