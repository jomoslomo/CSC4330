import React from 'react';
import SelectPart from './SelectPart';

function SelectGPU({ onSelect, currentSelection }) {
    const displayAttributes = [
        'price', 'chipset', 'memory', 'core_clock', 'boost_clock', 'color', 'length'
    ];

    return (
        <SelectPart
            onSelect={onSelect}
            currentSelection={currentSelection}
            fetchUrl="http://localhost:3001/gpus"
            displayAttributes={displayAttributes}
            partType="GPU"
        />
    );
}

export default SelectGPU;
