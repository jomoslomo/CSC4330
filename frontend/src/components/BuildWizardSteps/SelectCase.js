import React from 'react';
import SelectPart from './SelectPart'; // Adjust the import path as necessary

function SelectCase({ onSelect, currentSelection }) {
    const displayAttributes = [
        'price', 'type', 'color', 'psu', 'side_panel', 'external_volume', 'internal_35_bays'
    ];

    return (
        <SelectPart
            onSelect={onSelect}
            currentSelection={currentSelection}
            fetchUrl="http://localhost:3001/cases"
            displayAttributes={displayAttributes}
            partType="Case"
        />
    );
}

export default SelectCase;
