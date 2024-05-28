import React from 'react';
import './Footer.css'; // Assuming you have a CSS file for styling the footer

function Footer() {
  return (
    <footer>
      <p>Contact: 123-456-789</p>
      <p>Email: onlinebk@fake.ca</p>
      <p>&copy; {new Date().getFullYear()} Simple Online Bookstore</p>
    </footer>
  );
}

export default Footer;
