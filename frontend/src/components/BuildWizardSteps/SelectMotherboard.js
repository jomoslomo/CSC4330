import React from 'react';
import SelectPart from './SelectPart';

function SelectMotherboard({ onSelect, currentSelection }) {
    const displayAttributes = [
        'price', 'socket', 'form_factor', 'max_memory', 'memory_slots', 'color'
    ];

    return (
        <SelectPart
            onSelect={onSelect}
            currentSelection={currentSelection}
            fetchUrl="http://localhost:3001/motherboards"
            displayAttributes={displayAttributes}
            partType="Motherboard"
        />
    );
}

export default SelectMotherboard;
