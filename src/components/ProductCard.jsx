import React from 'react';

function ProductCard({ productData, onAddToCartClick }) {
  if (!productData) {
    return null;
  }

  
  const handleButtonClick = () => {
    onAddToCartClick(productData);
  };
  return (
    <div className="product-card" style={{ 
      border: '1px solid #ccc', 
      padding: '15px', 
      width: '200px',
      height: '350px',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: '8px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s',
      position: 'relative'
    }}>      <div style={{ height: '150px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
        <img
          src={productData.image}
          alt={productData.title ?? 'Product image'}
          style={{ maxWidth: '100%', maxHeight: '150px', objectFit: 'contain' }}
        />
      </div><h3 className="product-title" style={{ 
        fontSize: '1.1rem', 
        fontWeight: '600', 
        minHeight: '2.5em',
        maxHeight: '3.3em',
        lineHeight: '1.2',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        marginBottom: '8px'
      }}>
        {productData.title ?? 'Product Name'}
      </h3>      <p className="product-description" style={{ 
        fontSize: '0.85rem', 
        color: '#666', 
        marginBottom: '0.5rem',
        padding: '3px 6px',
        backgroundColor: '#f5f5f5',
        borderRadius: '4px',
        display: 'inline-block'
      }}>
        {productData.category}
      </p>
      <p className="product-price" style={{ 
        fontWeight: 'bold', 
        fontSize: '1.2rem', 
        color: '#e63946',
        marginBottom: '10px',
        marginTop: '5px'
      }}>
        ${productData.price?.toFixed(2) ?? 'N/A'}
      </p><button 
        onClick={handleButtonClick} 
        style={{ 
          backgroundColor: '#1e88e5', 
          color: 'white', 
          border: 'none', 
          padding: '8px 12px', 
          borderRadius: '4px', 
          fontWeight: '600',
          transition: 'background-color 0.2s',
          cursor: 'pointer',
          marginTop: 'auto',
          width: '100%',
          textAlign: 'center'
        }}>
        Add to Cart
      </button>
    </div>
  );
}

export default React.memo(ProductCard);