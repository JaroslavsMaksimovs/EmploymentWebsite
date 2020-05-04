import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import NavBar from './NavBar';
import HomePage from './pages/HomePage';
import JobSearchList from './pages/JobSearchList';
import JobPage from './pages/JobPage';
import NewVacancyPage from './pages/NewVacancyPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProfileInfoPage from './pages/ProfileInfoPage';
import EditAccountPage from './pages/EditAccountPage';
import './App.css';

const App = () => {
  const [user, setUser] = useState({});
  return(
      <Router>
      <div className="App">
        <NavBar user={user} setUser={setUser} />
        <div>
          <Switch>
            <Route path="/" component={HomePage} exact />
            <Route path="/vacancies/" component={JobSearchList} exact />
            <Route path="/vacancies/:name" render={(props) => <JobPage {...props} user={user} />} exact />
            <Route path="/add-new-vacancy/" component={NewVacancyPage} exact />
            <Route path="/register/" component={RegisterPage} exact />
            <Route path="/login/" render={() => <LoginPage setUser={setUser} />} exact />
            {(user.email) &&
              <>
              <Route path="/my-account/" render={() => <ProfileInfoPage user={user} setUser={setUser} />} exact />
              <Route path="/edit-account/" render={() => <EditAccountPage user={user} setUser={setUser} />} exact />
              </>
            }
            <Redirect to="/" />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
