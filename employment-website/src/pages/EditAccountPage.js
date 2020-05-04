import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

const EditAccountPage = ({ user, setUser }) => {
  const [account, setAccount] = useState(user);
  const [navigate, setNavigate] = useState(false);
  const [salaryDesciption, setSalaryDescription] = useState((account.jobType === 'Contract') ? '£/day' : '£/year');


  const edit = async () => {
    const result = await fetch('/api/seekers/edit', {
      method: 'post',
      body: JSON.stringify(account),
      headers: {
        'Content-Type': 'application/json',
      }
    });
    setNavigate(true);
    setUser(account);
  }

  const handleChange = (event) => {
   const accountCopy = JSON.parse(JSON.stringify(account));
   accountCopy[event.target.name] = event.target.value;
   setAccount(accountCopy);
  }

  useEffect(() => {
    if (account.jobType === 'Contract') {
      setSalaryDescription('£ per day');
    } else {
      setSalaryDescription('£ per year');
    }
  }, [account.jobType]);


  if (navigate) {
    return <Redirect to="/my-account" />;
  }



 return (
   <>
     <div className="loginbox">
       <h1>Edit Account</h1>
       <div>
         <label>First Name:</label>
          <input type="text" name="firstName" value={account.firstName} onChange={handleChange} />
       </div>
       <div>
         <label>Surname:</label>
          <input type="text" name="surname" value={account.surname} onChange={handleChange} />
       </div>
       <div>
         <label>Location:</label>
         <input type="text" name="location" value={account.location} onChange={handleChange} />
       </div>
       <div>
         <label>Highest level of education:</label>
         <select name="education" value={account.education} onChange={handleChange}>
           <option value="None">None</option>
           <option value="High School Diploma">High School Diploma</option>
           <option value="Bachelor's Degree">Bachelor's Degree</option>
           <option value="Master's Degree">Master's Degree</option>
           <option value="Doctoral Degree">Doctoral Degree</option>
         </select>
       </div>
       <div>
         <label>Work Experience:</label>
         <select name="workExperience" value={account.workExperience} onChange={handleChange}>
           <option value="None">None</option>
           <option value="Less than 1 year">Less than 1 year</option>
           <option value="1 to 2 years">1 to 2 years</option>
           <option value="2 to 3 years">2 to 3 years</option>
           <option value="3 to 4 years">3 to 4 years</option>
           <option value="4 to 5 years">4 to 5 years</option>
           <option value="Over 5 years">Over 5 years</option>
         </select>
       </div>
       <div>
         <label>Skills:</label>
         <textarea rows="4" cols="50" name="skills" value={account.skills} onChange={handleChange}/>
       </div>
       <div>
         <label>Minimum Expected Salary ({salaryDesciption}):</label>
          <input type="number" name="salary" value={account.salary} onChange={handleChange} />
       </div>
       <div>
         <label>Employment Type:</label>
         <select name="jobType" value={account.jobType} onChange={handleChange}>
           <option value="Permanent">Permanent</option>
           <option value="Contract">Contract</option>
           <option value="Any">Any</option>
         </select>
       </div>
       <button onClick={edit}>Save changes</button>
     </div>
   </>
 );

};

export default EditAccountPage;
