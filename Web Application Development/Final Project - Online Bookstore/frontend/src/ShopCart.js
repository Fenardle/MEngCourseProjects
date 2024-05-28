import React from 'react';
import './ShopCart.css';

function ShopCart({ items, onUpdateCart, onNavigate }) {
  const handleQuantityChange = (book, newQuantity) => {
    onUpdateCart(book, newQuantity);
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const total = calculateTotal();
  const tax = total * 0.13;
  const shipping = total > 100 ? 0 : 15;

  return (
    <div className="shop-cart">
      {items.map((item) => (
        <div className="cart-item" key={item.id}>
          <img src={item.thumbnail} alt={item.title} className="cart-item-image" />
          <div className="cart-item-info">
            <h3>{item.title}</h3>
            <p>Price: {item.price} {item.currencyCode}</p>
            <div className="cart-item-quantity">
              <button onClick={() => handleQuantityChange(item, item.quantity - 1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => handleQuantityChange(item, item.quantity + 1)}>+</button>
            </div>
          </div>
        </div>
      ))}
      <div className="cart-summary">
        <p>Total: {total.toFixed(2)}</p>
        <p>Tax (13%): {tax.toFixed(2)}</p>
        <p>Shipping: {shipping > 0 ? ${shipping.toFixed(2)} : 'Free'}</p>
        <p>Grand Total: {(total + tax + shipping).toFixed(2)}</p>
        <button onClick={() => onNavigate('checkout')}>Checkout</button>
      </div>
    </div>
  );
}

export default ShopCart;