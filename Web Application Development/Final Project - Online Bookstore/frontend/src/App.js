import React, { useState } from 'react';
import { auth } from './firebase'; // import from your firebase.js
import Header from './header.js';
import axios from 'axios'; // make sure to install axios if not already installed
import BookCatalog from './bookcatalog.js';
import BookList from './Booklist.js';
import About from './About.js';
import ShopCart from './ShopCart.js';
import Footer from './Footer.js';
import ForgetPass from './ForgetPass.js';
import SignIn from './SignIn.js';
import SignUp from './SignUp.js';
import './App.css';
function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const navigate = (page) => {
    setCurrentPage(page);
  };

  const addToCart = (book) => {
    const existingItem = cartItems.find(item => item.id === book.id);
    let updatedCartItems;
    if (existingItem) {
      updatedCartItems = cartItems.map(item => 
        item.id === book.id ? { ...existingItem, quantity: existingItem.quantity + 1 } : item
      );
    } else {
      updatedCartItems = [...cartItems, { ...book, quantity: 1 }];
    }
    setCartItems(updatedCartItems);
    updateCartAPI(updatedCartItems); // Synchronize with backend
  };

  const updateCart = (book, quantity) => {
    const updatedCartItems = cartItems.map(item =>
      item.id === book.id ? { ...item, quantity } : item
    );
    setCartItems(updatedCartItems);
    updateCartAPI(updatedCartItems); // Synchronize with backend
  };

  const updateCartAPI = async (updatedCartItems) => {
    try {
      console.log("Cart APi is Called!!!!!")
      const token = await auth.currentUser.getIdToken(true);
      await axios.post('http://localhost:3000/api/cart', {
        cartItems: updatedCartItems
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  // Function to fetch cart items from the backend
  const fetchCartItems = async () => {
    try {
      const token = await auth.currentUser.getIdToken(true);
      const response = await axios.get('http://localhost:3000/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.data && response.data.cartItems) {
        setCartItems(response.data.cartItems);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const updateFavoritesAPI = async (favoritesList) => {
    try {
      console.log(favoritesList)
      const token = await auth.currentUser.getIdToken(true); // Get Firebase auth token
  
      const response = await axios.post('http://localhost:3000/api/fav', {
        favorites: favoritesList
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      console.log('Server response:', response.data); // Log the server response
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  const addToFavorites = (book) => {
    const isBookInFavorites = favorites.some(favorite => favorite.id === book.id);
    if (!isBookInFavorites) {
      const updatedFavorites = [...favorites, book];
      updateFavoritesAPI(updatedFavorites);
      setFavorites(updatedFavorites);
    }
  };

  const removeFromFavorites = (bookId) => {
    const updatedFavorites = favorites.filter(book => book.id !== bookId);
    updateFavoritesAPI(updatedFavorites);
    setFavorites(updatedFavorites);
  };

  const fetchFavorites = async () => {
    try {
      const token = await auth.currentUser.getIdToken(true);
      const response = await axios.get('http://localhost:3000/api/fav', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data && response.data.favorites) {
        setFavorites(response.data.favorites);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };
  
  return (
    <div className="App">
     <Header 
        onNavigate={navigate} 
        fetchFavorites={fetchFavorites} 
        fetchCartItems={fetchCartItems}
        setCartItems={setCartItems} 
        setFavorites={setFavorites}
      />

      <main>
        {currentPage === 'home' && <BookCatalog onAddToCart={addToCart} onAddToFavorites={addToFavorites} />}
        {currentPage === 'about' && <About />}
        {currentPage === 'cart' && <ShopCart items={cartItems} onUpdateCart={updateCart} />}
        {currentPage === 'signin' && <SignIn onNavigate={navigate} />}
        {currentPage === 'signup' && <SignUp onNavigate={navigate} />}
        {currentPage === 'forgotPassword' && <ForgetPass onNavigate={navigate} />}
        {currentPage === 'booklist' &&<BookList books={favorites} onRemoveFromList={removeFromFavorites} onAddToCart={addToCart} />}


      </main>
      {currentPage === 'home' && <Footer />}
      {currentPage === 'about' && <Footer />}
    </div>
  );
}

export default App;
