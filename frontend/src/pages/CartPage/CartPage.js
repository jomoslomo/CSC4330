import React from 'react';
import { useLocation } from 'react-router-dom';

function CartPage() {
    const location = useLocation();
    const selectedParts = location.state.selectedParts;

    const handleFindOnAmazon = (partName) => {
        // Construct Amazon search URL
        const amazonSearchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(partName)}`;

        // Open Amazon search URL in a new tab
        window.open(amazonSearchUrl, '_blank');
    };

    return (
        <div>
            <h1>Cart</h1>
            <h2>Selected Parts</h2>
            <ul>
                {Object.entries(selectedParts).map(([partType, part]) => (
                    <li key={partType} style={{ display: 'flex', alignItems: 'center' }}>
                        <strong>{partType.toUpperCase()}:</strong> {part && (Array.isArray(part) ? part.map(p => p.name).join(', ') : part.name)}
                        {/* Button to find the selected part on Amazon */}
                        {part && (
                            <button
                                style={{ marginLeft: '10px', fontSize: '12px', padding: '5px 10px', width: '100px' }}
                                onClick={() => handleFindOnAmazon(Array.isArray(part) ? part[0].name : part.name)}
                            >
                                Find
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CartPage;
