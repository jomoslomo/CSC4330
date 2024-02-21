import React from 'react';
import SelectPart from './SelectPart';

function SelectStorage({ onSelect, currentSelection }) {
    const displayAttributes = [
        'price', 'capacity', 'price_per_gb', 'type', 'cache', 'form_factor', 'interface'
    ];

    return (
        <SelectPart
            onSelect={onSelect}
            currentSelection={currentSelection}
            fetchUrl="http://localhost:3001/internal-hdd"
            displayAttributes={displayAttributes}
            partType="Internal HDD"
        />
    );
}

export default SelectStorage;
