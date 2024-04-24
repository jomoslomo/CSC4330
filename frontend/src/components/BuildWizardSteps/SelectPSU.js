import React from 'react';
import SelectPart from './SelectPart';
import caseImage from './assets/case.png';
import CpuImage from './assets/cpu.png';
import GpuImage from './assets/gpu.png';
import MotherboardImage from './assets/motherboard.png';
import PsuImage from './assets/psu.png';
import RamImage from './assets/ram.png';
import StorageImage from './assets/storage.png';
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
            imageUrl={PsuImage}
        />
    );
}

export default SelectPSU;
