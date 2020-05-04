import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

const NewVacancyPage = () => {
  const [vacancy, setVacancy] = useState({ jobTitle: '', companyName: '', email: '', jobType: 'Permanent', minimumSalary: '',
  maximumSalary: '', location: '', description: '', education: 'None', workExperience: 'None', skills: '', complementarySkills: '' });
  const [salaryDesciption, setSalaryDescription] = useState('£ per year');
  const [error, setError] = useState('');
  const [navigate, setNavigate] = useState(false);


    const typeFilter = (seekers) => {
      const result = seekers.filter((seeker) => {
        if (seeker.jobType === 'Both') {
          return true;
        } else {
          return (seeker.jobType === vacancy.jobType);
        }
      });
      return result;
    }

    const salaryFilter = (seekers) => {
      const result = seekers.filter((seeker) => {
        return (seeker.salary <= vacancy.maximumSalary);
      });
      return result;
    }

    const educationQuality = (education) => {
      if (education === 'None') {
        return 0;
      } else if (education === 'High School Diploma') {
        return 1;
      } else if (education === "Bachelor's Degree") {
        return 2;
      } else if (education === "Master's Degree") {
        return 3;
      } else if (education === 'Doctoral Degree') {
        return 4;
      } else {
        return 0;
      }
    }

    const educationFilter = (seekers) => {
      const result = seekers.filter((seeker) => {
        return (educationQuality(seeker.education) >= educationQuality(vacancy.education));
      });
      return result;
    }

    const experience = (time) => {
      if (time === 'None') {
        return 0;
      } else if (time === 'Less than 1 year') {
        return 1;
      } else if (time === '1 to 2 years') {
        return 2;
      } else if (time === '2 to 3 years') {
        return 3;
      } else if (time === '3 to 4 years') {
        return 4;
      } else if (time === '4 to 5 years') {
        return 5;
      } else if (time === 'Over 5 years') {
        return 6;
      } else {
        return 0;
      }
    }

    const workExperienceFilter = (seekers) => {
      const result = seekers.filter((seeker) => {
        return (experience(seekers.workExperience) >= experience(vacancy.workExperience));
      })
      return result;
    }

    const stringCompare = (string1, string2) => {
      let matches = 0;
      for (let i = 0; i < string1.length; i++) {
        for (let j = 0; j < string2.length; j++) {
          if (string1[i].replace(',', '').replace('.', '').toLowerCase() === string2[j].replace(',', '').replace('.', '').toLowerCase()) {
            matches++;
          }
        }
      }
      if (string1.length > 0) {
        return matches/string1.length;
      } else {
        return 1;
      }
    }

    const checkMatching = (seeker, attribute) => {
      const required = vacancy[attribute].split(' ');
      if (attribute === 'complementarySkills') {
        attribute = 'skills';
      }
      const candidate = seeker[attribute].split(' ');
      return (stringCompare(required, candidate));
    }

    const skillsFilter = (seekers) => {
      const result = seekers.filter((seeker) => {
        let matching = 0;
        matching += checkMatching(seeker, 'skills') * 3;
        matching += checkMatching(seeker, 'complementarySkills');
        return matching > 1;
      });
      return result;
    }

  const addVacancy = async () => {
    if (vacancy.jobTitle.length > 2) {
      if (vacancy.email.includes('@', 1) && vacancy.email.includes('.', 3)) {
        let body = vacancy;
        const dateAdded = new Date().toLocaleString();
        body.dateAdded = dateAdded;

        const result = await fetch('/api/vacancies/add-new', {
          method: 'post',
          body: JSON.stringify(body),
          headers: {
            'Content-Type': 'application/json',
          }
        });
        const response = await result.json();

        if (response.message === 'This job name is already taken') {
          setError('nameTaken');
        } else {

          const result = await fetch('/api/seekers/get-all-searching', {
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
            }
          });
          let seekers = await result.json();
          seekers = typeFilter(seekers);
          seekers = salaryFilter(seekers);
          seekers = educationFilter(seekers);
          seekers = workExperienceFilter(seekers);
          seekers = skillsFilter(seekers);

          if (seekers.length) {
            const search = await fetch('/api/vacancies/search',
            {
              method: 'post',
              body: JSON.stringify({ jobTitle: vacancy.jobTitle, seekers: seekers }),
              headers: {
                'Content-Type': 'application/json',
              }
            });
          }
          setNavigate(true);
        }
      } else {
        setError('invalidEmail');
      }
    } else {
      setError('invalidTitle');
    }
  }

  useEffect(() => {
    if (vacancy.jobType === 'Contract') {
      setSalaryDescription('£ per day');
    } else {
      setSalaryDescription('£ per year');
    }
  }, [vacancy.jobType]);


  const handleChange = (event) => {
    const vacancyCopy = JSON.parse(JSON.stringify(vacancy));
    vacancyCopy[event.target.name] = event.target.value;
    setVacancy(vacancyCopy);
  }

  if (navigate) {
    return <Redirect to="/" />;
  }



  return (
    <>
    <div className="loginbox">
      <h1>Add new Vacancy</h1>
        <div>
          <label>Job Title:</label>
          <input type="text" name="jobTitle" value={vacancy.jobTitle} onChange={handleChange} />
          {(error === 'nameTaken') && <p>This job title is already taken. Please choose another one</p>}
          {(error === 'invalidTitle') && <p>Please select a valid Job Title</p>}
        </div>
        <div>
          <label>Company Name:</label>
          <input type="text" name="companyName" value={vacancy.companyName} onChange={handleChange} />
        </div>
        <div>
          <label>Email:</label>
          <input type="text" name="email" value={vacancy.email} onChange={handleChange} />
          {(error === 'invalidEmail') && <p>Please enter a valid e-mail</p>}
        </div>
        <div>
          <label>Employment Type:</label>
          <select name="jobType" value={vacancy.jobType} onChange={handleChange}>
            <option value="Permanent">Permanent</option>
            <option value="Contract">Contract</option>
          </select>
        </div>
        <div>
          <label>Minimum Salary ({salaryDesciption}):</label>
          <input type="number" name="minimumSalary" value={vacancy.minimumSalary} onChange={handleChange} />
        </div>
        <div>
          <label>Maximum Salary ({salaryDesciption}):</label>
          <input type="number" name="maximumSalary" value={vacancy.maximumSalary} onChange={handleChange} />
        </div>
        <div>
          <label>Location:</label>
          <input type="text" name="location" value={vacancy.location} onChange={handleChange} />
        </div>
        <div>
          <label>Description:</label>
          <textarea rows="6" cols="50" name="description" value={vacancy.description} onChange={handleChange} />
        </div>
        <div>
          <label>Education Required:</label>
          <select name="education" value={vacancy.education} onChange={handleChange}>
            <option value="None">None</option>
            <option value="High School Diploma">High School Diploma</option>
            <option value="Bachelor's Degree">Bachelor's Degree</option>
            <option value="Master's Degree">Master's Degree</option>
            <option value="Doctoral Degree">Doctoral Degree</option>
          </select>
        </div>
        <div>
          <label>Work Experience Required:</label>
          <select name="workExperience" value={vacancy.workExperience} onChange={handleChange}>
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
          <label>Skills Required:</label>
          <textarea rows="4" cols="50" name="skills" value={vacancy.skills} placeholder="Use keywords separated by commas" onChange={handleChange} />
        </div>
        <div>
          <label>Complementary Skills:</label>
          <textarea rows="4" cols="50" name="complementarySkills" placeholder="Use keywords separated by commas" value={vacancy.complementarySkills} onChange={handleChange} />
        </div>
        <button onClick={addVacancy}>Add new vacancy</button>
      </div>
    </>
  );
}

export default NewVacancyPage;
