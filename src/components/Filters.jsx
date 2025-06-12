import React, { useState, useEffect } from 'react';

function Filters(props) {
  // Using props directly here, could also destructure: const { searchTerm, ... } = props;
  const {
    searchTerm,
    onSearchChange,
    selectedCategory,
    onCategoryChange,
    categories
  } = props;

  // Add local state for debouncing search
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  // Use useEffect to implement debouncing
  useEffect(() => {
    // Set a timeout to update the actual search after user stops typing
    const timeoutId = setTimeout(() => {
      if (localSearchTerm !== searchTerm) {
        onSearchChange(localSearchTerm);
      }
    }, 300); // 300ms debounce delay

    // Cleanup function to clear timeout if user types again quickly
    return () => clearTimeout(timeoutId);
  }, [localSearchTerm, onSearchChange, searchTerm]);

  // Handler for the search input changes - now updates local state
  const handleSearchInputChange = (event) => {
    setLocalSearchTerm(event.target.value);
  };

  // Handler for the category dropdown changes
  const handleCategorySelectChange = (event) => {
    // Call the function passed down from ProductPage
    onCategoryChange(event.target.value);
  };

  return (
    <div className="filters" style={{ marginBottom: '20px', padding: '10px', border: '1px solid #eee' }}>
      <h3>Filter Products</h3>
      <input
        type="text"
        placeholder="Search by name..."
        value={localSearchTerm}
        onChange={handleSearchInputChange}
        style={{ marginRight: '10px', padding: '5px' }}
      />

      <select
        value={selectedCategory}
        onChange={handleCategorySelectChange}
        style={{ padding: '5px' }}
      >
        <option value="">All Categories</option>
        {/* Create an <option> for each category passed in */}
        {categories.map(category => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
}

export default React.memo(Filters);