import React, { useState, useEffect, useRef } from 'react';
import CategoryIcon from './CategoryIcon.js';
import BookInfo from './BookInfo.js';
import './BookCatalog.css';

function BookCatalog({ onAddToCart, onAddToFavorites }) {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const bookCatalogRef = useRef();

  const categories = ["FICTION", "DESIGN", "COMPUTERS", "EDUCATION", "ART", "COOKING", "TRAVEL", "HUMOR"];

  const searchBooks = async (category) => {
    setLoading(true);
    try {
      const queryCategory = category || selectedCategory;
      // Update the URL to the Next.js API endpoint
      const url = `http://localhost:3000/api/searchBooks?searchTerm=${encodeURIComponent(searchTerm)}&category=${encodeURIComponent(queryCategory)}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setBooks(result);
      setNoResults(result.length === 0);
    } catch (error) {
      console.error('Error:', error.message);
      setBooks([]);
      setNoResults(true);
    } finally {
      setLoading(false);
    }
  };
  

  const handleCategoryIconClick = (category) => {
    setSelectedCategory(category);
    setSearchTerm('');
    searchBooks(category);
  };

  const showBookDetails = (book) => {
    setSelectedBook(book);
  };

  const handleBack = () => {
    setSelectedBook(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bookCatalogRef.current && !bookCatalogRef.current.contains(event.target)) {
        setBooks([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (selectedBook) {
    return <BookInfo book={selectedBook} onBack={handleBack} onAddToCart={onAddToCart} onAddToFav={onAddToFavorites} />;
  }

  return (
    <section id="book-catalog" ref={bookCatalogRef}>
      <h2>Book Catalog</h2>
      <input 
        type="text" 
        id="book-search" 
        placeholder="Search books..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={() => searchBooks()}>Search</button>
      <div className="categories">
        {categories.map(category => (
          <CategoryIcon key={category} category={category} onClick={() => handleCategoryIconClick(category)} />
        ))}
      </div>
      <div id="books-list">
        {loading && <p>Loading...</p>}
        {noResults && <p>No results found.</p>}
        {books.map((book, index) => (
          <div key={book.id + '-' + index} className="book-item" onClick={() => showBookDetails(book)}>
            {book.thumbnail && (
              <img src={book.thumbnail} alt={book.title} />
            )}
            <div>
              <h3>{book.title}</h3>
              <p>Author: {book.authors ? book.authors.join(', ') : 'No Authors'}</p>
              <p>Price: {book.price} {book.currencyCode}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default BookCatalog;
