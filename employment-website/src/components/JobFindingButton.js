import React from 'react';

const JobFindingButton = ({ user, setUser }) => {

  const typeFilter = (jobs) => {
    if (user.jobType === 'Both') {
      return jobs;
    } else {
      const result = jobs.filter((job) => {
        return (user.jobType === job.jobType);
      });
      return result;
    }
  }

  const salaryFilter = (jobs) => {
    const result = jobs.filter((job) => {
      return (user.salary <= job.maximumSalary);
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

  const educationFilter = (jobs) => {
    const result = jobs.filter((job) => {
      return (educationQuality(user.education) >= educationQuality(job.education));
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

  const workExperienceFilter = (jobs) => {
    const result = jobs.filter((job) => {
      return (experience(user.workExperience) >= experience(job.workExperience));
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

  const checkMatching = (job, attribute) => {
    const required = job[attribute].split(' ');
    if (attribute === 'complementarySkills') {
      attribute = 'skills';
    }
    const candidate = user[attribute].split(' ');
    return (stringCompare(required, candidate));
  }

  const skillsFilter = (jobs) => {
    const result = jobs.filter((job) => {
      let matching = 0;
      matching += checkMatching(job, 'skills') * 3;
      matching += checkMatching(job, 'complementarySkills');
      return matching > 1;
    });
    return result;
  }

const findJob = async () => {

  const result = await fetch('/api/vacancies/get-all-vacancies',
  {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  let jobs = await result.json();
  jobs = typeFilter(jobs);
  jobs = salaryFilter(jobs);
  jobs = educationFilter(jobs);
  jobs = workExperienceFilter(jobs);
  jobs = skillsFilter(jobs);

  const search = await fetch('/api/seekers/search',
  {
    method: 'post',
    body: JSON.stringify({ email: user.email, jobs: jobs }),
    headers: {
      'Content-Type': 'application/json',
    }
  });

  const userCopy = JSON.parse(JSON.stringify(user));
  userCopy.search = 1;
  setUser(userCopy);
};


  return (
    <>
      <div className="apply-button">
        <button onClick={findJob}>Find Job</button>
      </div>
    </>
  )

}

export default JobFindingButton;
