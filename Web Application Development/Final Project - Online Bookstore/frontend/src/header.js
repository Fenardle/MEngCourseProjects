import React, { useState, useEffect } from 'react';
import './header.css';
import { auth } from './firebase'; // import from your firebase.js
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

function Header({ onNavigate, fetchFavorites, fetchCartItems, setCartItems, setFavorites }) {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const unregisterAuthObserver = auth.onAuthStateChanged(user => {
      setIsSignedIn(!!user);
    });
    return () => unregisterAuthObserver(); // Unsubscribe on unmount
  }, []); // Removed fetchFavorites from dependency array

  const handleSignOut = () => {
    auth.signOut();
    onNavigate('home');
    setCartItems([]); // Clear cart items
    setFavorites([]); // Clear favorites
  };
  

  const handleGoogleSignIn = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      // The signed-in user info.
      const user = result.user;

      // Fetch favorites and cart items after successful login
      await fetchFavorites();
      await fetchCartItems();

      // Additional actions after sign in can be added here.
    } catch (error) {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode, errorMessage);
    }
  };

  return (
    <header>
      <h1>Simple Online Bookstore</h1>
      <nav>
        <ul>
          <li onClick={() => onNavigate('home')}>Home</li>
          <li onClick={() => onNavigate('cart')}>Shopping Cart</li>
          <li onClick={() => onNavigate('about')}>About</li>
          <li onClick={() => onNavigate('booklist')}>Booklist</li>
          {isSignedIn ? (
            <li onClick={handleSignOut}>Sign Out</li>
          ) : (
            <li className="sign-in" onClick={handleGoogleSignIn}>Sign In with Google</li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
