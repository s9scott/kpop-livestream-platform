/**
 * @file PagesMenu.js
 * @author Paola Bustos, Simon Tenedero, Jonas Matulis
 * @created 2024-XX-XX
 * @lastModified 2025-06-01
 * @desc file containing PagesMenu.js
 */

import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';

/**
 * Hamburger Menu on left side of navbar, containing links to other pages (Home, Livestreaming, Settings)
 * @returns {JSX.Element} The rendered menu component.
 */
export default function PagesMenu() {

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

    <Menu as="div" className="relative inline-block text-left">

      {/*this comes from headlessui, notice how this is a function with its own return value - the menuButton and the MenuItems, the latter renders based on the 'open' argument*/}
      {({open}) => (<>
          <MenuButton 
          onClick={toggleMenu}
          className="btn btn-ghost btn-circle p-1 hover:bg-gray-700"
          >
            <Bars3Icon className="h-6 w-6 text-white" />
          </MenuButton>

          {open && (
            <MenuItems className="absolute top-full left-2 mt-2 w-52 bg-base-300 text-white shadow-xl z-50 rounded-xl">
              <MenuItem>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `rounded-t-xl ${linkBaseClass} ${hoverClass} ${isActive ? 'bg-primary' : ''}`
                  }
                  onClick={closeMenu}
                >
                  Home
                </NavLink>
              </MenuItem>
              <MenuItem>
                <NavLink
                  to="/load-live"
                  className={({ isActive }) =>
                    `${linkBaseClass} ${hoverClass} ${isActive ? 'bg-primary' : ''}`
                  }
                  onClick={closeMenu}
                >
                  Livestreaming
                </NavLink>
              </MenuItem>
              <MenuItem>
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    `rounded-b-xl ${linkBaseClass} ${hoverClass} ${isActive ? 'bg-primary' : ''}`
                  }
                  onClick={closeMenu}
                >
                  Settings
                </NavLink>
              </MenuItem>
            </MenuItems>
          )}
        </>)

      }
    </Menu>)}