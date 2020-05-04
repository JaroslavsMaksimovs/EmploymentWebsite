import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { generate } from 'password-hash';

const RegisterPage = () => {
  const [account, setAccount] = useState({ firstName: '', surname: '', email: '', password: '', confirmPassword: '',
                                         location: '', education: 'None', workExperience: 'None', skills: '', salary: '', jobType: 'Permanent' });
  const [salaryDesciption, setSalaryDescription] = useState('£/year');
  const [error, setError] = useState('');
  const [navigate, setNavigate] = useState(false);


  const register = async () => {
    if (account.email.includes('@', 1) && account.email.includes('.', 3)) {
      if (account.password && account.password.length >= 8 && account.password === account.confirmPassword)
      {
        let body = account;

        const dateAdded = new Date().toLocaleString();
        body.dateAdded = dateAdded;

        body.hashPassword = generate(account.password);
        delete body.password;
        delete body.confirmPassword;

        const result = await fetch('/api/seekers/add-new', {
          method: 'post',
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json',
          }
        });
        const response = await result.json();
        if (response.message === 'This email is already taken') {
          setError('emailTaken');
        } else {
          setNavigate(true);
        }
      } else {
        setError('invalidPassword');
      }
    } else {
      setError('invalidEmail');
    }
  };

  useEffect(() => {
    if (account.jobType === 'Contract') {
      setSalaryDescription('£ per day');
    } else {
      setSalaryDescription('£ per year');
    }
  }, [account.jobType]);

  if (navigate) {
    return <Redirect to="/" />;
  }

  const handleChange = (event) => {
    const accountCopy = JSON.parse(JSON.stringify(account));
    accountCopy[event.target.name] = event.target.value;
    setAccount(accountCopy);
  }




    return (
      <>
          <div className = "loginbox">
          <h1>Register</h1>
          <div>
            <div>
              <label>First Name:</label>
              <input type="text" name="firstName" value={account.firstName} onChange={handleChange} />
            </div>
            <div>
              <label>Surname:</label>
              <input type="text" name="surname" value={account.surname} onChange={handleChange} />
            </div>
            <div>
              <label>E-mail:</label>
              <input type="text" name="email" value={account.email} onChange={handleChange} />
              {(error === 'emailTaken') && <p>This e-mail is already taken</p>}
              {(error === 'invalidEmail') && <p>Please enter a valid e-mail</p>}
            </div>
            <div>
              <label>Password:</label>
              <input type="password" name="password" value={account.password} onChange={handleChange} />
              {(error === 'invalidPassword') && <p>Make sure your password matches and is at least 8 characters long</p>}
            </div>
            <div>
              <label>Confirm Password:</label>
              <input type="password" name="confirmPassword" value={account.confirmPassword} onChange={handleChange} />
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
              <textarea rows="4" cols="50" name="skills" value={account.skills} placeholder="Use keywords separated by commas" onChange={handleChange}/>
            </div>
            <div>
              <label>Employment Type:</label>
              <select name="jobType" value={account.jobType} onChange={handleChange}>
                <option value="Permanent">Permanent</option>
                <option value="Contract">Contract</option>
                <option value="Any">Any</option>
              </select>
            </div>
            <div>
              <label>Minimum Expected Salary ({salaryDesciption}):</label>
              <input type="number" name="salary" value={account.salary} onChange={handleChange} />
            </div>
          </div>
          <button onClick={register}>Register</button>
        </div>
      </>
    );

};

export default RegisterPage;
