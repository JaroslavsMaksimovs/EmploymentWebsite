import React, { useState, useEffect } from 'react';

const EditVacancy = ({ name }) => {
  const [vacancy, setVacancy] = useState({});
  const [salaryDesciption, setSalaryDescription] = useState('');

  const deleteVacancy = async () => {
    const result = await fetch(`/api/vacancies/delete/${vacancy.jobTitle}`);
  }


  const edit = async () => {
    const result = await fetch('/api/vacancies/edit', {
      method: 'post',
      body: JSON.stringify(vacancy),
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(`/api/vacancies/${name}`);
      const body = await result.json()
      if (body !== null) {
        setVacancy(body);
      }
    }
    fetchData();
  }, [name]);

  const handleChange = (event) => {
   const vacancyCopy = JSON.parse(JSON.stringify(vacancy));
   vacancyCopy[event.target.name] = event.target.value;
   setVacancy(vacancyCopy);
  }


  useEffect(() => {
    if (vacancy.jobType === 'Permanent') {
      setSalaryDescription('£ per year');
    } else if (vacancy.jobType === 'Contract') {
      setSalaryDescription('£ per day');
    }
  }, [vacancy.jobType]);



 return (
   <>
     <h1>Edit vacancy</h1>
     <div className="form">
       <div>
         <label>
           Company Name:
           <input type="text" name="companyName" value={vacancy.companyName} onChange={handleChange} />
         </label>
       </div>
       <div>
         <label>
           Email:
           <input type="text" name="email" value={vacancy.email} onChange={handleChange} />
         </label>
       </div>
       <div>
         <label>
           Employment Type:
           <select name="jobType" value={vacancy.jobType} onChange={handleChange}>
             <option value="Permanent">Permanent</option>
             <option value="Contract">Contract</option>
           </select>
         </label>
       </div>
       <div>
         <label>
           Minimum Salary ({salaryDesciption}):
           <input type="number" name="minimumSalary" value={vacancy.minimumSalary} onChange={handleChange} />
         </label>
       </div>
       <div>
         <label>
           Maximum Salary ({salaryDesciption}):
           <input type="number" name="maximumSalary" value={vacancy.maximumSalary} onChange={handleChange} />
         </label>
       </div>
       <div>
         <label>
           Location:
           <input type="text" name="location" value={vacancy.location} onChange={handleChange} />
         </label>
       </div>
       <div>
         <label>
           Description:
           <textarea rows="6" cols="50" name="description" value={vacancy.description} onChange={handleChange} />
         </label>
       </div>
       <div>
         <label>
           Education Required:
           <textarea rows="4" cols="50" name="education" value={vacancy.education} onChange={handleChange} />
         </label>
       </div>
       <div>
         <label>
           Work Experience Required:
           <textarea rows="4" cols="50" name="workExperience" value={vacancy.workExperience} onChange={handleChange} />
         </label>
       </div>
       <div>
         <label>
           Skills Required:
           <textarea rows="4" cols="50" name="skills" value={vacancy.skills} onChange={handleChange} />
         </label>
       </div>
     </div>
     <button onClick={edit}>Edit vacancy</button>
     <button onClick={deleteVacancy}>Delete Vacancy</button>
   </>
 );

};

export default EditVacancy;
