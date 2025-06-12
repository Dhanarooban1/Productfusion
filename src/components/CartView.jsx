import React from 'react';
import CartItem from './CartItem';



function CartView({ cartItems, total, onRemoveFromCart }) {
  return (
    <div className="cart" style={{ marginTop: '30px', padding: '15px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f8f9fa' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Shopping Cart</h2>
      {/* Check if the cart is empty */}
      {cartItems.length === 0 ? (
        <p>Your cart is empty. Go add some products!</p>
      ) : (
        // If not empty, show the list and the total
        <>
          {/* Map over the cart items and render a CartItem component for each */}
          {cartItems.map(item => (
            <CartItem
              key={item.id}
              itemData={item}
              onRemoveClick={onRemoveFromCart} 
            />
          ))}          {/* Display the total price */}
          <div className="cart-total" style={{ marginTop: '15px', fontWeight: 'bold', fontSize: '1.2em', textAlign: 'right' }}>
            Total: ${total}
          </div>
        </>
      )}
    </div>
  );
}

export default React.memo(CartView);

