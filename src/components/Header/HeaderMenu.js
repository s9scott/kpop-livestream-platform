import { NavLink } from 'react-router-dom';

export default function HeaderMenu() {
  return (
    <div className="dropdown dropdown-hover menu-lg z-[1001]">
      <div
        tabIndex={1}
        role="button"
        className="btn btn-secondary text-sm hover:btn-accent transform hover:-translate-y-1 hover:scale-110 delay-100 duration-200"
      >
        Menu
      </div>
      <ul className="dropdown-content menu bg-primary text-primary-content rounded-lg z-[1] w-52 p-2 mt-2 shadow">
        <li>
          <NavLink
            to="/"
            className="block px-4 py-2 text-base text-sm font-semibold hover:bg-accent hover:text-m transition-colors duration-200 Active:bg-accent"
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/artists"
            className="block px-4 py-2 text-base text-sm font-semibold hover:bg-accent hover:text-m transition-colors duration-200"
          >
            Artists
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/load-live"
            className="block px-4 py-2 text-base text-sm font-semibold hover:bg-accent hover:text-m transition-colors duration-200"
          >
            Load Live
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/about"
            className="block px-4 py-2 text-base text-sm font-semibold hover:bg-accent hover:text-m transition-colors duration-200"
          >
            About
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/contact"
            className="block px-4 py-2 text-base text-sm font-semibold hover:bg-accent hover:text-m transition-colors duration-200"
          >
            Contact
          </NavLink>
        </li>
      </ul>
    </div>
  );
}
