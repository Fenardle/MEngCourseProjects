import React from 'react';
import './BookInfo.css';

function BookInfo({ book, onBack, onAddToCart, onAddToFav }) {
  if (!book) {
    return <p>Loading...</p>;
  }

  return (
    <div className="book-info">
      {book.thumbnail && (
        <img src={book.thumbnail} alt={book.title} className="book-info-image" />
      )}
      <div className="book-info-details">
        <h3>{book.title}</h3>
        <p>Author: {book.authors ? book.authors.join(', ') : 'No Authors'}</p>
        {book.description && (
          <>
            <h2>Description:</h2>
            <p>{book.description}</p>
          </>
        )}
        <p>Price: {book.price} {book.currencyCode}</p>
        <button onClick={onBack}>Back</button>
        <button onClick={() => onAddToCart(book)}>Add to Cart</button>
        <button onClick={() => onAddToFav(book)}>Add to Fav</button>
      </div>
    </div>
  );
}

export default BookInfo;
