import React, { useState, useEffect } from 'react';
import './ForgetPass.css'; // Link to the CSS file

function ForgetPass({ onNavigate }) {
  const [newPassword, setNewPassword] = useState('');
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [countdown, setCountdown] = useState(3); // Countdown starting from 3 seconds

  useEffect(() => {
    let timer;
    if (passwordChanged) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);

      setTimeout(() => {
        clearInterval(timer);
        onNavigate('signin');
      }, 3000);
    }
    return () => clearInterval(timer);
  }, [passwordChanged, onNavigate]);

  const isFormValid = () => newPassword;

  const handleSubmit = () => {
    setPasswordChanged(true);
  };

  return (
    <div className="forget-pass">
      {!passwordChanged ? (
        <>
          <h2>New Password</h2>
          <input
            type="password"
            name="userpassword"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button onClick={handleSubmit} disabled={!isFormValid()}>
            Confirm
          </button>
        </>
      ) : (
        <div className="password-change-successful">
          <p>Password Change Successful</p>
          <p>Redirecting in {countdown} seconds...</p>
        </div>
      )}
    </div>
  );
}

export default ForgetPass;
