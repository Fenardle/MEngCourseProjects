import React from 'react';
import './CategoryIcon.css'; // Import the CSS file

function CategoryIcon({ category, onClick }) {
  // Object to map category names to image file names
  const categoryImages = {
    FICTION: 'fiction.png',
    DESIGN: 'design.png',
    COMPUTERS: 'computers.png',
    EDUCATION: 'education.png',
    ART: 'art.png',
    COOKING: 'cooking.png',
    TRAVEL: 'travel.png',
    HUMOR: 'humor.png'
  };

  // Function to get image path
  const getImagePath = (category) => {
    // Direct path from the public directory
    return `/img/${categoryImages[category.toUpperCase()]}`;
    
  };

  return (
    <div className="category-icon" onClick={() => onClick(category)}>
      <div className="category-image">
        <img src={getImagePath(category)} alt={category} />
      </div>
      <p>{category}</p>
    </div>
  );
}

export default CategoryIcon;
