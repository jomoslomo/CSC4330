import React from 'react';
import SelectPart from './SelectPart';
import caseImage from './assets/case.png';
import CpuImage from './assets/cpu.png';
import GpuImage from './assets/gpu.png';
import MotherboardImage from './assets/motherboard.png';
import PsuImage from './assets/psu.png';
import RamImage from './assets/ram.png';
import StorageImage from './assets/storage.png';
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
            imageUrl={MotherboardImage}
        />
    );
}

export default SelectMotherboard;
