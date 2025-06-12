import { useState, useEffect, useMemo } from 'react';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import './Dashboard.css';


const fetchSalesData = async (startDate, endDate, category) => {
  console.log(`Mock API: Fetching with params - Start: ${startDate || 'N/A'}, End: ${endDate || 'N/A'}, Category: ${category || 'All'}`);
  await new Promise(resolve => setTimeout(resolve, 1000));

  const startTimestamp = startDate ? new Date(startDate).getTime() : new Date('2023-01-01').getTime();
  const endTimestamp = endDate ? new Date(endDate).getTime() : new Date().getTime();

  if (startTimestamp > endTimestamp) {
    console.warn("Start date cannot be after end date. Returning empty data.");
    return [];
  }

  const days = Math.max(0, Math.floor((endTimestamp - startTimestamp) / (1000 * 60 * 60 * 24)));
  const data = [];
  const allCategories = ['Electronics', 'Clothing', 'Food', 'Books'];
  const selectedCategories = category ? [category] : allCategories;

  for (let i = 0; i <= days; i++) {
    const currentDate = new Date(startTimestamp + i * 24 * 60 * 60 * 1000);
    const dateStr = currentDate.toISOString().split('T')[0];
    const dataPoint = { date: dateStr };
    let hasCategoryData = false;

    selectedCategories.forEach(cat => {
      if (allCategories.includes(cat)) {
        const baseValue = (currentDate.getDay() + 1) * 100;
        const categoryIndex = allCategories.indexOf(cat);
        const multiplier = categoryIndex + 1;
        const randomSeed = currentDate.getDate() + categoryIndex;
        const randomFactor = (randomSeed % 5) * 0.1 + 0.8;
        dataPoint[cat] = Math.max(0, Math.round(baseValue * multiplier * randomFactor));
        hasCategoryData = true;
      }
    });

    if (hasCategoryData) {
      data.push(dataPoint);
    }
  }
  console.log(`Mock API: Returning ${data.length} data points.`);
  return data;
};

// --- End Mock API Function ---

function Dashboard() {
  const [salesData, setSalesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('2023-01-01');
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);  const [selectedCategory, setSelectedCategory] = useState(''); 
  const [searchTerm, setSearchTerm] = useState('');
  const [cacheCleared, setCacheCleared] = useState(false);

  const availableCategories = ['Electronics', 'Clothing', 'Food', 'Books'];
  
  // Function to reset all filters to their default values
  const clearFilters = () => {
    setStartDate('2023-01-01');
    setEndDate(new Date().toISOString().split('T')[0]);
    setSelectedCategory('');
    setSearchTerm('');
  };
  
  // Function to clear all dashboard cache data
  const clearCache = () => {
    // Get all localStorage keys
    const keys = Object.keys(localStorage);
    
    // Filter only dashboard cache keys
    const dashboardCacheKeys = keys.filter(key => key.startsWith('dashboard_'));
    
    // Remove each cache item
    dashboardCacheKeys.forEach(key => localStorage.removeItem(key));
    
    // Set state to trigger a re-fetch
    setCacheCleared(true);
    
    // Show success message
    alert('Cache cleared successfully! Data will be refreshed.');
  };
  
  // Function to export data as CSV
  const exportDataAsCSV = () => {
    if (salesData.length === 0) return;
    
    // Get all headers (date + all categories)
    const headers = ['date', ...categoriesInData];
    
    // Create CSV content
    let csvContent = headers.join(',') + '\n';
    
    // Add data rows
    salesData.forEach(day => {
      const row = headers.map(header => day[header] || 0);
      csvContent += row.join(',') + '\n';
    });
    
    // Create a download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `sales_data_${startDate}_to_${endDate}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  // --- Data Fetching and Caching ---
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      // Create a simple key for caching based on filters
      const cacheKey = `dashboard_${startDate}_${endDate}_${selectedCategory || 'all'}`;

      // 1. Try to get data from cache (localStorage) unless cache was cleared
      const cachedDataString = cacheCleared ? null : localStorage.getItem(cacheKey);
      if (cachedDataString) {
        console.log("Using cached data for key:", cacheKey);
        setSalesData(JSON.parse(cachedDataString));
        setIsLoading(false); 
        return; 
      }

      // 2. If no cache, fetch from API
      console.log("No cache found, fetching from API...");
      try {
        const freshData = await fetchSalesData(startDate, endDate, selectedCategory);
        setSalesData(freshData);

        // 3. Save the fresh data to cache (only if cache wasn't cleared)
        if (!cacheCleared) {
          localStorage.setItem(cacheKey, JSON.stringify(freshData));
          console.log("Saved fresh data to cache for key:", cacheKey);
        }
        
        // Reset cacheCleared flag after successful fetch
        if (cacheCleared) {
          setCacheCleared(false);
        }

      } catch (fetchError) {
        console.error("API fetch error:", fetchError);
        setError("Could not load data. Please try again.");
        setSalesData([]); 
      } finally {
        setIsLoading(false);
      }
    };

    loadData();

  }, [startDate, endDate, selectedCategory, cacheCleared]);

  // --- Calculated Values (Memoized) ---

  // Get the list of category names present in the current data (e.g., ['Electronics', 'Clothing'])
  // useMemo avoids recalculating this on every single render
  const categoriesInData = useMemo(() => {
    if (salesData.length === 0) return [];
    // Get all keys from the first data item, remove 'date'
    return Object.keys(salesData[0]).filter(key => key !== 'date');
  }, [salesData]); // Recalculate only when salesData changes
  // Calculate total sales for each category and overall
  // useMemo prevents recalculating this unless the data changes
  const summaryStats = useMemo(() => {
    const totals = { overallTotal: 0 };
    categoriesInData.forEach(cat => { totals[cat] = 0; });

    salesData.forEach(dayData => {
      categoriesInData.forEach(cat => {
        totals[cat] += dayData[cat] || 0;
        totals.overallTotal += dayData[cat] || 0;
      });
    });
    return totals;
  }, [salesData, categoriesInData]);

  // Filter the table data based on search term
  const filteredTableData = useMemo(() => {
    if (!searchTerm.trim()) return salesData;
    
    return salesData.filter(day => 
      day.date.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [salesData, searchTerm]);

  const lineColors = {
    Electronics: '#8884d8',
    Clothing: '#82ca9d',
    Food: '#ffc658',
    Books: '#ff7300',
  };

  return (
    <div className="dashboard-container">
      <h1>Sales Dashboard</h1>
      
      <div className="dashboard-actions">
        <button className="button refresh-button" onClick={clearCache} title="Clear cached data and refresh">
          Refresh Data
        </button>
      </div>
      
      {/* Filter Section */}
      <div className="filters-container">
        <div>
          <label htmlFor="start-date">Start Date: </label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)} // Update state directly
          />
        </div>
        <div>
          <label htmlFor="end-date">End Date: </label>
          <input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)} // Update state directly
          />
        </div>
        <div>
          <label htmlFor="category">Category: </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)} // Update state directly
          >
            <option value="">All Categories</option>
            {availableCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="search">Search: </label>
          <input
            id="search"
            type="text"
            placeholder="Search by date..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-buttons">
          <button className="button clear-button" onClick={clearFilters}>Clear Filters</button>
          <button className="button export-button" onClick={exportDataAsCSV}>Export CSV</button>
        </div>
      </div>{/* Loading State Display */}
      {isLoading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading data...</p>
        </div>
      )}

      {/* Error State Display */}
      {error && <p className="error">Error: {error}</p>}

      {/* Main Content (Show only if not loading and no error) */}
      {!isLoading && !error && (
        <>
          {/* Check if there's data to display */}
          {salesData.length > 0 ? (
            <>
              {/* Chart Section */}
              <div className="chart-container">
                <h2>Sales Trend</h2>
                <ResponsiveContainer width="100%" height={300}> {/* Slightly smaller height */}
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" fontSize={10} /> {/* Smaller font for axis */}
                    <YAxis fontSize={10} />
                    <Tooltip />
                    <Legend />
                    {/* Create a line for each category in the data */}
                    {categoriesInData.map(cat => (
                      <Line key={cat} type="monotone" dataKey={cat} stroke={lineColors[cat] || '#333'} dot={false} />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>              {/* Summary Section */}
              <h2>Summary</h2>
              <div className="summary-container">
                {/* Show total for each category */}
                {categoriesInData.map(cat => (
                  <div key={cat} className="summary-card" style={{backgroundColor: `${lineColors[cat]}22`}}>
                    <h3>Total {cat}</h3>
                    {/* Format number with commas */}
                    <p>${(summaryStats[cat] || 0).toLocaleString()}</p>
                  </div>
                ))}
                {/* Show overall total */}
                <div className="summary-card overall-card">
                  <h3>Overall Total</h3>
                  <p>${(summaryStats.overallTotal || 0).toLocaleString()}</p>
                </div>
              </div>{/* Data Table Section */}
              <h2>Detailed Data</h2>
              <div className="table-container">
                <div className="table-header">
                  <span>Showing {filteredTableData.length} of {salesData.length} records</span>
                </div>                <table className="data-table">
                  <thead><tr>
                      <th>Date</th>
                      {/* Table headers for each category */}
                      {categoriesInData.map(cat => <th key={cat}>{cat}</th>)}
                    </tr></thead>
                  <tbody>
                    {/* Table row for each day */}
                    {filteredTableData.map(day => (
                      <tr key={day.date}>
                        <td>{day.date}</td>
                        {/* Table cell for each category's value */}
                        {categoriesInData.map(cat => (
                          <td key={cat}>{(day[cat] ?? 0).toLocaleString()}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            // Message shown if no data matches filters (but no error occurred)
            <p>No data available for the selected filters.</p>
          )}
        </>
      )}
    </div>
  );
}

export default Dashboard;