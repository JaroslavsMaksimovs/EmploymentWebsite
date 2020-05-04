import React from 'react';
import { Link } from 'react-router-dom';

const VariableNavButtons = ({ user, setUser }) => {
  if (user.email) {
    return(
      <>
      <div className="dropdown">
        <button className="dropbtn">{user.email}</button>
        <div className="dropdown-content">
          <Link to="/my-account/">Account Details</Link>
          <Link to="/" onClick={() => setUser({})}>Exit</Link>
        </div>
      </div>
      </>
    );
  } else {
    return(
      <>
        <li className="left-aligned">
          <Link to="/add-new-vacancy/">Add new Job</Link>
        </li>
        <li className="left-aligned">
          <Link to="/login/">Log In</Link>
        </li>
        <li className="left-aligned">
          <Link to="/register/">Register</Link>
        </li>
      </>
    );
  }

};

export default VariableNavButtons;
