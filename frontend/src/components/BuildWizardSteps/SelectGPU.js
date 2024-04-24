import React from 'react';
import SelectPart from './SelectPart';
import caseImage from './assets/case.png';
import CpuImage from './assets/cpu.png';
import GpuImage from './assets/gpu.png';
import MotherboardImage from './assets/motherboard.png';
import PsuImage from './assets/psu.png';
import RamImage from './assets/ram.png';
import StorageImage from './assets/storage.png';
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
            imageUrl={GpuImage}
        />
    );
}

export default SelectGPU;
