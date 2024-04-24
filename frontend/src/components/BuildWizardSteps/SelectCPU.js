import React from 'react';
import SelectPart from './SelectPart'; // Adjust the import path as necessary

function SelectCPU({ onSelect, currentSelection }) {
    // Define the attributes you want to display for CPUs
    const displayAttributes = ['price', 'core_count', 'core_clock', 'boost_clock', 'tdp', 'graphics', 'smt'];

    return (
        <SelectPart
            onSelect={onSelect}
            currentSelection={currentSelection}
            fetchUrl="http://localhost:3001/cpus" // Your backend endpoint for CPUs
            displayAttributes={displayAttributes}
            partType="CPU" // This is used for dynamic labeling and potentially for specific styling or logic
        />
    );
}

export default SelectCPU;
