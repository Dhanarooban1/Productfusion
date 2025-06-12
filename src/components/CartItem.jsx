
function CartItem({ itemData, onRemoveClick }) {

  if (!itemData) return null;

 
  const handleRemoveButtonClick = () => {
    onRemoveClick(itemData.id);
  };

  
  const itemLineTotal = (itemData.price * itemData.quantity).toFixed(2);
  return (
    <div className="cart-item" style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px dashed #eee' }}>
      <span>{itemData.title} x {itemData.quantity}</span>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: '20px' }}>${itemLineTotal}</span>        <button onClick={handleRemoveButtonClick} style={{ 
          padding: '2px 8px', 
          backgroundColor: '#f8f9fa', 
          border: '1px solid #ddd',
          borderRadius: '3px',
          cursor: 'pointer'
        }}>
          Remove
        </button>
      </div>
    </div>
  );
}

export default CartItem;