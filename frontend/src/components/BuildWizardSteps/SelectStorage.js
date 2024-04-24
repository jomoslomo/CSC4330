import React from 'react';
import SelectPart from './SelectPart';
import caseImage from './assets/case.png';
import CpuImage from './assets/cpu.png';
import GpuImage from './assets/gpu.png';
import MotherboardImage from './assets/motherboard.png';
import PsuImage from './assets/psu.png';
import RamImage from './assets/ram.png';
import StorageImage from './assets/storage.png';
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
            imageUrl={StorageImage}
        />
    );
}

export default SelectStorage;
