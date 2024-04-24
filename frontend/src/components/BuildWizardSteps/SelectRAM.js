import React from 'react';
import SelectPart from './SelectPart';
import caseImage from './assets/case.png';
import CpuImage from './assets/cpu.png';
import GpuImage from './assets/gpu.png';
import MotherboardImage from './assets/motherboard.png';
import PsuImage from './assets/psu.png';
import RamImage from './assets/ram.png';
import StorageImage from './assets/storage.png';
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
            imageUrl={RamImage}
        />
    );
}

export default SelectRAM;
