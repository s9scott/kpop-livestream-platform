/**
 * @file ProfileMenu.js
 * @author Paola Bustos, Simon Tenedero, Jonas Matulis
 * @created 2024-XX-XX
 * @lastModified 2025-06-30
 * @desc file containing ProfileMenu.js
 */

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { useUser } from '../../context/UserContext';
import { useAuth } from "../../hooks/useAuth";

/**
 * Menu that appears when profile is clicked on right side of navbar. displays user login/logout functionality and user profile menu.
 * 
 * @returns {JSX.Element} rendered component of ProfileMenu
 */
const ProfileMenu = () => {

  //retrieve user context
  const {user} = useUser();
  const { handleSignIn, handleSignOut } = useAuth();

  // We define the classes as constants so as not to repeat so much
  const linkBaseClass = "block px-4 py-3 text-white transition-colors duration-200 text-sm";
  const hoverClass = "hover:bg-primary";

  return (

    <div className="relative text-xsm">
      {user ? (
        <Menu as="div" className="relative inline-block text-left">
          {({ open }) => (
            <>
              <MenuButton className="mr-5">
                <div className='flex items-center'>
                  <img
                    alt="User Avatar"
                    src={user.photoURL || user.profilePicture}
                    className="rounded-full w-10 h-10"
                  />
                </div>
              </MenuButton>

              {open && (

              <MenuItems
                transition
                className="absolute top-full right-3 w-52 bg-base-300 text-white shadow-xl rounded-xl"
              >
                <MenuItem>
                  {({ active }) => (
                    <button
                      onClick={handleSignOut}
                      className={`rounded-t-xl rounded-b-xl text-left w-full ${linkBaseClass} ${hoverClass}`
                      }
                    >
                      Logout
                    </button>
                  )}
                </MenuItem>
              </MenuItems>)}
            </>
          )}
        </Menu>) 
      : (
        <button onClick={handleSignIn} id="login" className="whitespace-nopwrap truncate mr-2 btn btn-secondary text-xsm hover:btn-accent px-4">
          Login
        </button>
      )}
    </div>
  );
};

export default ProfileMenu;
