import React from 'react';
import { Link } from 'react-router-dom';
import JobFindingButton from '../components/JobFindingButton'


const ProfileInfoComponent = ({ user, setUser }) => (
  <>
    <h1> My account </h1>
    <table>
      <tr>
        <th>First Name</th>
        <td>{user.firstName}</td>
      </tr>
      <tr>
        <th>Surname</th>
        <td>{user.surname}</td>
      </tr>
      <tr>
        <th>E-mail</th>
        <td>{user.email}</td>
      </tr>
      <tr>
        <th>Location</th>
        <td>{user.location}</td>
      </tr>
      <tr>
        <th>Education</th>
        <td>{user.education}</td>
      </tr>
      <tr>
        <th>Work Experience</th>
        <td>{user.workExperience}</td>
      </tr>
      <tr>
        <th>Skills</th>
        <td>{user.skills}</td>
      </tr>
      <tr>
        <th>Minimum Expected Salary</th>
        <td>{user.salary}</td>
      </tr>
      <tr>
        <th>Employment Type</th>
        <td>{user.jobType}</td>
      </tr>
    </table>
    <div>
    <Link className="button-link" to={'/edit-account/'}>Edit Account</Link>
    </div>
      {(parseInt(user.search) === 0) ?
        ((user.status === 'confirmed') ?
      (<JobFindingButton user={user} setUser={setUser} />) :
      (<p>Don't forget to confirm your email</p>)) :
      (<p>Job search launched, check your email regularly!</p>)
      }
  </>
);

export default ProfileInfoComponent;
