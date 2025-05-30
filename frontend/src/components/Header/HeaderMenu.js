import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Bars3Icon } from '@heroicons/react/24/outline';

/**
 * HeaderMenu component for rendering a dropdown menu with navigation links.
 * @returns {JSX.Element} The rendered menu component.
 */
export default function HeaderMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Definimos las clases como constantes para no repetir tanto
  const linkBaseClass = "block px-4 py-3 text-white transition-colors duration-200 text-sm";
  const hoverClass = "hover:bg-primary";

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className="relative flex items-center ">
      {/* Botón Hamburguesa */}
      <button 
        onClick={toggleMenu}
        className="btn btn-ghost btn-circle p-1 hover:bg-gray-700"
      >
        <Bars3Icon className="h-6 w-6 text-white" />
      </button>

      {/* Título */}
      <span className="text-md font-bold text-white ml-4 whitespace-nowrap">livestreaming prototype</span>

      {/* Menú Dropdown */}
      {isMenuOpen && (
        <>
          {/* Overlay para cerrar al hacer clic fuera */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={closeMenu}
          ></div>
          
          {/* Menú */}
          <ul className="absolute top-full left-0 mt-2 w-52 bg-base-300 text-white shadow-xl z-50 py-2 rounded-xl">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `${linkBaseClass} ${hoverClass} ${isActive ? 'bg-primary' : ''}`
                }
                onClick={closeMenu}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/load-live"
                className={({ isActive }) =>
                  `${linkBaseClass} ${hoverClass} ${isActive ? 'bg-primary' : ''}`
                }
                onClick={closeMenu}
              >
                Livestreamings
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `${linkBaseClass} ${hoverClass} ${isActive ? 'bg-primary' : ''}`
                }
                onClick={closeMenu}
              >
                Settings
              </NavLink>
            </li>
          </ul>
        </>
      )}
    </div>
  );
}