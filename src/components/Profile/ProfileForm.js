import classes from './ProfileForm.module.css';
import { useRef, useContext } from 'react'
import authContext from '../../store/auth-context'
import { useHistory } from 'react-router-dom';

const ProfileForm = () => {
  const newPasswordRef = useRef();
  const authCtx = useContext(authContext);
  const history = useHistory();

  const submitHandler = (event) => {
    event.preventDefault();

    const newPasswordVal = newPasswordRef.current.value;

    fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDjPtFM3FTY2uKLZNM4MziQasf1cyIl1-E', {
      method: 'POST',
      body: JSON.stringify({
        idToken: authCtx.token,
        password: newPasswordVal,
        returnSecureToken: false
      }),
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(res => {
      // assumption success
      history.replace('/');
    })
  }

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' ref={newPasswordRef} minLength='7' />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
