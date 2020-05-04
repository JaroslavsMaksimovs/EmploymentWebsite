import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import salaries from '../components/salary-filter';

const JobSearchList = () => {
  const [jobs, setJobs] = useState([]);
  const [jobsFiltered, setJobsFiltered] = useState([]);
  const [jobsDisplay, setJobsDisplay] = useState([]);
  const [typeFilter, setTypeFilter] = useState([]);
  const [salaryFilter, setSalaryFilter] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);

  const jobsPerPage = 5;


  const typeFilterize = (unfilteredJobs) => {
    const filteredJobs = unfilteredJobs.filter((element) => {
      if (typeFilter.length === 0) {
        return true;
      } else if (typeFilter.length === 2) {
        return true;
      } else if (typeFilter.includes("P")) {
        return (element.jobType === 'Permanent');
      } else if (typeFilter.includes("C")) {
        return (element.jobType === 'Contract');
      }
    });
    return filteredJobs;
  };

  const checkSalaryFilter = (job) => {
    let result = false;
    salaries.forEach((filter) => {
      if (salaryFilter.includes(filter.index)) {
        if (filter.jobType === job.jobType) {
          if (!(job.maximumSalary < filter.lowerLimit || job.minimumSalary > filter.upperLimit)) {
            result = true;
          }
        }
      }
    });
    return result;
  };

  const salaryFilterize = (unfilteredJobs) => {
    const filteredJobs = unfilteredJobs.filter((element) => {
      if (salaryFilter.length === 0) {
        return true;
      } else if (salaryFilter.length === salaries.length) {
        return true;
      } else {
        return checkSalaryFilter(element);
      }
    });
    return filteredJobs;
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch('/api/vacancies/get-all-vacancies',
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const body = await result.json();
      setJobs(body);
    }
    fetchData();
  }, []);

  useEffect(() => {
    let vacancies = jobs;
    vacancies = typeFilterize(vacancies);
    vacancies = salaryFilterize(vacancies);
    setJobsFiltered(vacancies);
    setJobsDisplay(vacancies.slice(0, 5));
    setPageNumber(1);
  }, [jobs, typeFilter, salaryFilter]);

  const updateTypeFilter = () => {
    let array = [];
    const typeBoxes = document.querySelectorAll('[name="typeFilter"]:checked');
    typeBoxes.forEach((box) => {
      array.push(box.value);
    });
    setTypeFilter(array);
  };

  const updateSalaryFilter = () => {
    let array = [];
    const salaryBoxes = document.querySelectorAll('[name="salaryFilter"]:checked');
    Array.prototype.forEach.call(salaryBoxes, (box) => {
      array.push(box.value);
    })
    setSalaryFilter(array);
  };

  const shorten = (description) => {
    if (description.length > 80) {
      return description.slice(0, 80) + '...';
    } else {
      return description;
    }
  }

  const totalPages = (Math.ceil(jobsFiltered.length / jobsPerPage));

  useEffect(() => {
    setJobsDisplay(jobsFiltered.slice((pageNumber - 1) * jobsPerPage, (pageNumber * jobsPerPage)));
  }, [pageNumber]);



  return(
  <>
    <h1 className="job-search-list"> Various IT jobs </h1>

    <div className="filter">
      <h3> Job Types: </h3>
      <label>
        <input type="checkbox" name="typeFilter" value="P" onClick={updateTypeFilter} />Permanent <br />
      </label>
      <label>
        <input type="checkbox" name="typeFilter" value="C" onClick={updateTypeFilter} />Contract <br />
      </label>
      <h3> Salary: </h3>
      <ul>
        {
          salaries.map((salary, key) => (
            <li key={key}>
              <label>
                <input type="checkbox" name="salaryFilter" value={salary.index} onClick={updateSalaryFilter} />{salary.message}<br />
              </label>
            </li>
          ))
        }
      </ul>
    </div>

    <div className="job-search-list">
      <ul>
        {jobsDisplay.map((job, key) => (
          <li key={key}>
            <Link className="job-link" to={`/vacancies/${job.jobTitle}`}> {job.jobTitle} </Link>
            <table>
              <tr>
                <th>Company name</th>
                <td>{job.companyName}</td>
              </tr>
              <tr>
                <th>Employment Type</th>
                <td>{job.jobType}</td>
              </tr>
              <tr>
                <th>Salary</th>
                <td>{job.minimumSalary}£ - {job.maximumSalary}£</td>
              </tr>
              <tr>
                <th>Location</th>
                <td>{job.location}</td>
              </tr>
              <tr>
                <th>Job Description</th>
                <td>{shorten(job.description)}</td>
              </tr>
              <tr>
                <th>Required Education</th>
                <td>{job.education}</td>
              </tr>
              <tr>
                <th>Required Work Experience</th>
                <td>{job.workExperience}</td>
              </tr>
              <tr>
                <th>Required skills</th>
                <td>{job.skills}</td>
              </tr>
              <tr>
                <th>Complementary skills</th>
                <td>{job.complementarySkills}</td>
              </tr>
              <tr>
                <th>Date Added</th>
                <td>{job.dateAdded}</td>
              </tr>
            </table>
          </li>
        ))}
      </ul>
      <div className="page-buttons">
        {(pageNumber > 1) && <button onClick={() => setPageNumber(pageNumber - 1)}>{pageNumber - 1}</button>}
        <button className="current-page" >{pageNumber}</button>
        {(pageNumber < totalPages) && <button onClick={() => setPageNumber(pageNumber + 1)}>{pageNumber + 1}</button>}
      </div>
    </div>
  </>
)};


export default JobSearchList;
