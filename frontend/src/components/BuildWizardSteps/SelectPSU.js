import React from 'react';
import SelectPart from './SelectPart';

function SelectPSU({ onSelect, currentSelection }) {
    const displayAttributes = [
        'price', 'type', 'efficiency', 'wattage', 'modular', 'color'
    ];

    return (
        <SelectPart
            onSelect={onSelect}
            currentSelection={currentSelection}
            fetchUrl="http://localhost:3001/psus"
            displayAttributes={displayAttributes}
            partType="PSU"
        />
    );
}

export default SelectPSU;
