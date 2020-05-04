import React from 'react';
import image from '../components/home.jpg';

const HomePage = () => (
  <>
    <h1>Employment Website</h1>
    <img src={image} alt="Homepage" />
    <div className="homepage">
      <p>
         Job search made easy!<br />
         Register, entering all your details once.<br />
         Then, browse jobs and apply directly.<br />
         Or go to your profile and press "Find Job"<br />
      </p>
    </div>
  </>
);


export default HomePage;
