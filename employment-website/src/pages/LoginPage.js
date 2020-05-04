import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { verify } from 'password-hash';

const LoginPage = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [navigate, setNavigate] = useState(false);


  useEffect(() => {
    const listener = (event) => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        document.getElementById("button").click();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, []);


  const login = async () => {
    if (email.includes('@', 1) && email.includes('.', 3)) {
      const result = await fetch(`/api/seekers/${email}`);
      const accountInfo = await result.json();
      if (accountInfo.message === 'Success') {
        if (verify(password, accountInfo.hashPassword)) {
          setUser(accountInfo);
          setNavigate(true);
        } else {
          setError('incorrectPassword');
        }
      } else {
        setError('incorrectEmail');
      }
    } else {
      setError('incorrectEmail');
    }
  };

  if (navigate) {
    return <Redirect to="/"/>
  }


  return(
    <>
      <div className="loginbox">
        <h1>Login</h1>
          <div>
            <label>E-mail</label>
            <input type="text" value={email} onChange={(event) => setEmail(event.target.value)} />
          </div>
          <div>
            <label >Password</label>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </div>
        {(error === 'incorrectEmail') && <p> This account does not exist </p>}
        {(error === 'incorrectPassword') && <p> Incorrect password </p>}
        <button id="button" onClick={login}>Log in</button>
      </div>
    </>
  );
}

export default LoginPage;
