import React, { useEffect, useState } from 'react';
import './SelectPart.css'; // Ensure this is the correct path

function SelectPart({ onSelect, currentSelection, fetchUrl, partType, displayAttributes, searchTerm }) {
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

    const handleSearch = () => {
        let searched;
        if (parts) {
            searched = parts.filter(part => {
                const partName = part.name.toLowerCase();
                return partName.includes(searchTerm.toLowerCase());
            });
        } else {
            searched = [];
        }
        setDisplayedParts(searched.slice(0, 10));
      };

      useEffect(() => {
        handleSearch(searchTerm);
    }, [searchTerm, parts]);

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

    const getAttributes = (part) => {
        if(part) {
            const attributes = [];
            Object.keys(part).forEach(key => {
                if (key !== '_id' && key !== 'name') {
                    attributes.push(`${key}: ${part[key]}`);
                }
            });

            return attributes;
        }
        else return null;
    }

    return (
        <div className="partContainer">
            {displayedParts.map(part => ( 
                <div key={part._id} className="partCard" onClick={() => handleSelect(part)}>
                    <h3>{part.name}</h3>
                    {getAttributes(part) && getAttributes(part).map(attribute => (
                    <p key={attribute}>{attribute}</p>
                    ))}
                </div>
            ))}
            {loadMore && <button onClick={handleLoadMore}>Load More</button>}
        </div>
    );
}

export default SelectPart;