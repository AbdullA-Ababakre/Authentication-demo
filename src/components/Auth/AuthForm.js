import { useState, useRef, useContext } from 'react';
import React from 'react';
import authContext from '../../store/auth-context'
import classes from './AuthForm.module.css';
import { useHistory } from 'react-router-dom';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const authCtx = useContext(authContext)
  const history = useHistory();

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    setIsLoading(true);
    event.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    let url;

    if (isLogin) {
      url = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDjPtFM3FTY2uKLZNM4MziQasf1cyIl1-E";
    } else {
      url = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDjPtFM3FTY2uKLZNM4MziQasf1cyIl1-E";
    }

    fetch(url,
      {
        method: 'POST',
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true
        }),
        headers: {
          contentType: 'application/json',
        }
      }).then(res => {
        setIsLoading(false);
        if (res.ok) {
          return res.json();
        }
        else {
          return res.json().then((data) => {
            let errorMsg = 'authentication failed';
            throw new Error(errorMsg);
          })
        }
      }).then(data => {
        const expirationTime = new Date((new Date().getTime() + (+data.expiresIn * 1000)))
        authCtx.loggedIn(data.idToken, expirationTime.toISOString());
        history.replace('/');
      }).catch((err) => {
        alert(err);
      })

  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' required ref={passwordInputRef} />
        </div>
        <div className={classes.actions}>
          {isLoading && <p>Sennding request...</p>}
          {!isLoading && <button>{isLogin ? 'Login' : 'Create Account'}</button>}
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
