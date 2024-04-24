import React, { useEffect, useState } from 'react';
import './SelectPart.css'; // Ensure this is the correct path
import caseImage from './assets/case.png';
import CpuImage from './assets/cpu.png';
import GpuImage from './assets/gpu.png';
import MotherboardImage from './assets/motherboard.png';
import PsuImage from './assets/psu.png';
import RamImage from './assets/ram.png';
import StorageImage from './assets/storage.png';

function SelectPart({ onSelect, currentSelection, fetchUrl, partType, displayAttributes }) {
    const [parts, setParts] = useState([]);
    const [displayedParts, setDisplayedParts] = useState([]);
    const [loadMore, setLoadMore] = useState(true);
    // Removed lastSelectedPart if it's not used or ensure it's utilized if needed
    // const [lastSelectedPart, setLastSelectedPart] = useState(null);

    useEffect(() => {
        fetch(fetchUrl)
            .then(response => response.json())
            .then(data => {
                setParts(data);
                setDisplayedParts(data.slice(0, 10));
                // If lastSelectedPart is used, ensure it's set here
            })
            .catch(error => console.error(`Failed to load ${partType}`, error));
    }, [fetchUrl, currentSelection, partType]);

    const handleLoadMore = () => {
        const nextParts = parts.slice(displayedParts.length, displayedParts.length + 10);
        setDisplayedParts(prev => [...prev, ...nextParts]);
        if (displayedParts.length + 10 >= parts.length) {
            setLoadMore(false);
        }
    };

    const handleSelect = (part) => {
        onSelect(part); // Call the onSelect prop function with the selected part
    };

    return (
        <div className="partContainer">
            {displayedParts.map(part => (
                <div key={part._id} className="partCard" onClick={() => handleSelect(part)}>
                    <h3>{part.name}</h3>
                    {displayAttributes && displayAttributes.map(attr => (
                        <p key={attr}>{`${attr.charAt(0).toUpperCase() + attr.slice(1)}: ${part[attr]}`}</p>
                    ))}
                    <img src={part.imageUrl} alt={part.name} className="partImage" />
                </div>
            ))}
            {loadMore && <button onClick={handleLoadMore}>Load More</button>}
        </div>
    );
}

export default SelectPart;
