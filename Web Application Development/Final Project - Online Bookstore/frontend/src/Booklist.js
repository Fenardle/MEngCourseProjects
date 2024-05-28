import React, { useState, useEffect } from 'react';
import './Booklist.css';
import { auth } from './firebase';

function BookList({ books, onRemoveFromList, onAddToCart }) {
  const initialLists = JSON.parse(localStorage.getItem('bookLists')) || Array(20).fill().map(() => ({ books: [], isPublic: false }));
  const [bookLists, setBookLists] = useState(initialLists);

  useEffect(() => {
    localStorage.setItem('bookLists', JSON.stringify(bookLists));
  }, [bookLists]);

  const handleRemoveFromSublist = (bookId, sublistIndex) => {
    const updatedSublist = bookLists[sublistIndex].books.filter(book => book.id !== bookId);
    // Immutable update pattern
    setBookLists(bookLists.map((list, index) => index === sublistIndex ? { ...list, books: updatedSublist } : list));
  };

  const handleAddToList = (book, listIndex, fromIndex = null) => {
    if (!book || listIndex < 0 || listIndex >= bookLists.length) return; // Validation to avoid undefined values

    if (fromIndex !== null) {
      handleRemoveFromSublist(book.id, fromIndex);
    } else {
      onRemoveFromList(book.id);
    }

    // Immutable update pattern
    const newList = [...bookLists];
    newList[listIndex].books.push(book);
    setBookLists(newList);
  };

  const toggleListVisibility = (index) => {
    if (index < 0 || index >= bookLists.length) return; // Validation to avoid undefined values

    // Immutable update pattern
    const newList = [...bookLists];
    newList[index].isPublic = !newList[index].isPublic;
    setBookLists(newList);
  };

  const handleSave = async () => {
    console.log(JSON.stringify(bookLists))
    const url = 'http://localhost:3000/api/bookList';
    try {
      console.log(bookLists);
      const token = await auth.currentUser.getIdToken(true);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bookLists),
      });
  
      if (response.ok) {
        console.log('Book lists saved successfully');
      } else {
        console.error('Failed to save book lists');
      }
    } catch (error) {
      console.error('Error saving book lists:', error);
    }
  };
  
  useEffect(() => {
    const fetchBookLists = async () => {
      const url = 'http://localhost:3000/api/bookList';
      try {
        const token = await auth.currentUser.getIdToken(true);
        if (token) {
          console.log(token);
          const response = await fetch(url, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            const loadedBookLists = data.bookLists.map(list => ({
              ...list,
              books: Array.isArray(list.books) ? list.books : []
            }));
            setBookLists(loadedBookLists.length ? loadedBookLists : initialLists);
          }
        } else {
          // Token is not available, set the bookLists to the default value
          setBookLists(Array(20).fill().map(() => ({ books: [], isPublic: false })));
        }
      } catch (error) {
        console.error('Error fetching book lists:', error);
        // In case of any error, also set the bookLists to the default value
        setBookLists(Array(20).fill().map(() => ({ books: [], isPublic: false })));
      }
    };
  
    fetchBookLists();
  }, []);
  
  

  return (
    <div className="book-list">
      <h2>Waiting Area</h2>
      <button onClick={handleSave} className="save-button">Save</button>
      {books.map((book) => (
        <div className="book-item" key={book.id}>
          <img src={book.thumbnail} alt={book.title} className="book-item-image" />
          <div className="book-item-info">
            <h3>{book.title}</h3>
            <p>Author: {book.authors ? book.authors.join(', ') : 'No Authors'}</p>
            <button onClick={() => onRemoveFromList(book.id)}>Remove</button>
            <button onClick={() => onAddToCart(book)}>Add to Cart</button>
            <select onChange={(e) => handleAddToList(book, parseInt(e.target.value))}>
              <option value="">Add to list</option>
              {bookLists.map((_, index) => (
                <option key={index} value={index}>List {index + 1}</option>
              ))}
            </select>
          </div>
        </div>
      ))}

      {bookLists.map((list, index) => (
        <div key={index} className="list-section">
          <div className="list-header">
            <h3>List {index + 1}</h3>
            <input 
              type="checkbox" 
              checked={list.isPublic} 
              onChange={() => toggleListVisibility(index)} 
              className="list-visibility-checkbox"
            />
            <span>{list.isPublic ? '(Public)' : '(Private)'}</span>
          </div>
          {list.books.map(book => (
            <div className="book-item" key={book.id}>
              <img src={book.thumbnail} alt={book.title} className="book-item-image" />
              <div className="book-item-info">
                <h3>{book.title}</h3>
                <p>Author: {book.authors ? book.authors.join(', ') : 'No Authors'}</p>
                <button onClick={() => handleRemoveFromSublist(book.id, index)}>Remove from List</button>
                <button onClick={() => onAddToCart(book)}>Add to Cart</button>
                <select onChange={(e) => handleAddToList(book, parseInt(e.target.value), index)}>
                  <option value="">Move to another list</option>
                  {bookLists.map((_, i) => (
                    <option key={i} value={i} disabled={i === index}>List {i + 1}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default BookList;
