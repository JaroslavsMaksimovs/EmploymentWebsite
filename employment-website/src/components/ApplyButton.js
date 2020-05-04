import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';


const ApplyButton = ({ jobTitle, user }) => {
  const [navigate, setNavigate] = useState(false);

  const apply = async () => {
    setNavigate(true);
    const result = await fetch(`/api/submit/${user.email}/${jobTitle}`);
  }

  if (navigate) {
    return <Redirect to="/" />
  }



  return(
    <>
      <div className="apply-button">
        <button onClick={apply}>Apply</button>
      </div>
    </>
  );
};

export default ApplyButton;
