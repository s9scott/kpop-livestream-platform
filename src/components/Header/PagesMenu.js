/**
 * @file PagesMenu.js
 * @author Paola Bustos, Simon Tenedero, Jonas Matulis, Yevheniia Bazhmaieva
 * @created 2024-XX-XX
 * @lastModified 2025-07-15
 * @description file containing PagesMenu component
 */

import React from "react";
import { NavLink } from "react-router-dom";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

/**
 * Hamburger Menu on left side of navbar, containing links to other pages (Home, Livestreaming, Settings)
 *
 * @returns {JSX.Element} The rendered m enu component.
 */
export default function PagesMenu() {
  // We define the classes as constants so as not to repeat so much
  const linkBaseClass =
    "block px-4 py-3 text-white transition-colors duration-200 text-sm first:rounded-t-xl last:rounded-b-xl only:rounded-xl";
  const hoverClass = "hover:bg-primary";

  return (
    <Menu as="div" className="relative inline-block text-left">
      {/*this comes from headlessui, notice how this is a function with its own return value - the menuButton and the MenuItems, the latter renders based on the 'open' argument*/}
      {({ open }) => (
        <>
          <MenuButton className="btn btn-ghost btn-circle p-1 hover:bg-gray-700">
            <Bars3Icon className="h-6 w-6" />
          </MenuButton>
          {open && (
            <MenuItems className="absolute top-full left-2 mt-2 w-52 bg-base-300 text-white shadow-xl z-50 rounded-xl">
              <MenuItem>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `${linkBaseClass} ${hoverClass} ${isActive && "bg-primary"}`
                  }
                >
                  Home
                </NavLink>
              </MenuItem>
              <MenuItem>
                  <NavLink
                    to="/load-live"
                    className={({ isActive }) =>
                      `${linkBaseClass} ${hoverClass} ${isActive && "bg-primary"}`
                    }
                  >
                    Livestreaming
                  </NavLink>
              </MenuItem>
            </MenuItems>
          )}
        </>
      )}
    </Menu>
  );
}
