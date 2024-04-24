import React from 'react';
import SelectPart from './SelectPart'; // Adjust the import path as necessary
import caseImage from './assets/case.png';
import CpuImage from './assets/cpu.png';
import GpuImage from './assets/gpu.png';
import MotherboardImage from './assets/motherboard.png';
import PsuImage from './assets/psu.png';
import RamImage from './assets/ram.png';
import StorageImage from './assets/storage.png';
function SelectCPU({ onSelect, currentSelection }) {
    // Define the attributes you want to display for CPUs
    const displayAttributes = ['price', 'cores', 'baseClock'];

    return (
        <SelectPart
            onSelect={onSelect}
            currentSelection={currentSelection}
            fetchUrl="http://localhost:3001/cpus" // Your backend endpoint for CPUs
            displayAttributes={displayAttributes}
            partType="CPU" // This is used for dynamic labeling and potentially for specific styling or logic
            imageUrl={CpuImage}
        />
    );
}

export default SelectCPU;
