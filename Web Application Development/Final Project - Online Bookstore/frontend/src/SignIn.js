import React, { useState } from 'react';
import './SignIn.css'; // Make sure this CSS file exists and is styled as needed
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

function SignIn({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const isFormValid = () => email && password;

  const handleSignIn = () => {
    if (isFormValid()) {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in successfully
          const user = userCredential.user;
          // Handle navigation to another page or dashboard
          console.log('User signed in:', user);
          // onNavigate('dashboard'); // Example navigation function
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setErrorMessage(errorMessage); // Display error message to the user
          console.error('Error during sign in:', errorCode, errorMessage);
        });
    }
  };

  return (
    <div className="sign-in">
      <h2>Sign in</h2>
      <input
        type="email"
        name="username"
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        name="userpassword"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <p className="forgot-password" onClick={() => onNavigate('forgotPassword')}>
        Forgot password?
      </p>
      <button disabled={!isFormValid()} onClick={handleSignIn}>Sign in</button>
      <p className="sign-up-link">
        Do not have an account? <span onClick={() => onNavigate('signup')}>Join us!</span>
      </p>
    </div>
  );
}

export default SignIn;
