import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import ApplyButton from '../components/ApplyButton';
import EditVacancy from '../components/EditVacancy';

const JobPage = ({ match, user }) => {
  const name = match.params.name;

  const [jobInfo, setJobInfo] = useState({ jobTitle: '' });
  const [navigate, setNavigate] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetch(`/api/vacancies/${name}`);
      const body = await result.json()
      if (body) {
        setJobInfo(body);
      } else {
        setNavigate(true);
      }
    }
    fetchData();
  }, [name]);

  if (navigate) {
    return <Redirect to="/vacancies" />
  }




  return(
    <>
    <h1>{jobInfo.jobTitle}</h1>
    <div>
      <table>
        <tr>
          <th>Company Name</th>
          <td>{jobInfo.companyName}</td>
        </tr>
        <tr>
          <th>Salary</th>
          <td>{jobInfo.minimumSalary}£ - {jobInfo.maximumSalary}£</td>
        </tr>
        <tr>
          <th>Location</th>
          <td>{jobInfo.location}</td>
        </tr>
        <tr>
          <th>Job Description</th>
          <td>{jobInfo.description}</td>
        </tr>
        <tr>
          <th>Required Education</th>
          <td>{jobInfo.education}</td>
        </tr>
        <tr>
          <th>Required Work Experience</th>
          <td>{jobInfo.workExperience}</td>
        </tr>
        <tr>
          <th>Required Skills</th>
          <td>{jobInfo.skills}</td>
        </tr>
        <tr>
          <th>Complementary Skills</th>
          <td>{jobInfo.complementarySkills}</td>
        </tr>
        <tr>
          <th>Date Added</th>
          <td>{jobInfo.dateAdded}</td>
        </tr>
      </table>
    </div>
    {(user.status === 'confirmed') ?
      (<ApplyButton jobTitle={name} user={user} />) :
      (<p>Login and confirm your e-mail before applying!</p>)
    }
      {/*<EditVacancy name={name} />  */}
    </>
  );
};

export default JobPage;
