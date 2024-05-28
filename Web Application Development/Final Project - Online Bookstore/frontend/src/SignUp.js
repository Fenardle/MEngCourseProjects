import React, { useState, useEffect } from 'react';
import './SignUp.css'; // Make sure to create a corresponding CSS file

function SignUp({ onNavigate }) {
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [signupSuccessful, setSignupSuccessful] = useState(false);
  const [countdown, setCountdown] = useState(3); // Countdown starting from 3 seconds

  useEffect(() => {
    let timer;
    if (signupSuccessful) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      setTimeout(() => {
        clearInterval(timer);
        onNavigate('signin');
      }, 3000);
    }
    return () => clearInterval(timer);
  }, [signupSuccessful, onNavigate]);

  const isFormValid = () => newEmail && newPassword;

  const handleSignUp = () => {
    // You can add your sign up logic here
    setSignupSuccessful(true);
  };

  return (
    <div className="sign-up">
      {!signupSuccessful ? (
        <>
          <h2>Sign up</h2>
          <input
            type="email"
            name="newusername"
            placeholder="New Email address"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <input
            type="password"
            name="newuserpassword"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button onClick={handleSignUp} disabled={!isFormValid()}>
            Sign up
          </button>
        </>
      ) : (
        <div className="signup-successful">
          <p>Sign up Successful</p>
          <p>Redirecting in {countdown} seconds...</p>
        </div>
      )}
    </div>
  );
}

export default SignUp;
