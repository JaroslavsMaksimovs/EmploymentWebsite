import React from 'react';
import { Link } from 'react-router-dom';
import VariableNavButtons from './components/VariableNavButtons';
import SearchComponent from './components/SearchComponent';



const NavBar = ({ user, setUser }) => (
  <nav className="topnav">
    <ul>
      <li className="left-aligned">
        <Link to="/">Home</Link>
      </li>
      <li className="left-aligned">
        <Link to={'/vacancies/'}>View vacancies</Link>
      </li>
      <SearchComponent />
      <VariableNavButtons user={user} setUser={setUser} />
    </ul>
  </nav>
);

export default NavBar;
