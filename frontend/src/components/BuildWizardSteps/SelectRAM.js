import React from 'react';
import SelectPart from './SelectPart';

function SelectRAM({ onSelect, currentSelection }) {
    const displayAttributes = [
        'price', 'speed', 'modules', 'price_per_gb', 'color', 'first_word_latency', 'cas_latency'
    ];

    return (
        <SelectPart
            onSelect={onSelect}
            currentSelection={currentSelection}
            fetchUrl="http://localhost:3001/memory"
            displayAttributes={displayAttributes}
            partType="Memory"
        />
    );
}

export default SelectRAM;
