import React, { useState } from 'react';

const SearchBar = ({ searchTerm, setSearchTerm }) => {

    const handleSearchChange = (event) => {
        const term = event.target.value;
        setSearchTerm(term);
      };

  return (
    <div className="search">
            <label htmlFor="searchBar">Search parts:</label>
            <input
                id="searchText"
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search for parts here..."
            />
        </div>
  );
};

export default SearchBar;