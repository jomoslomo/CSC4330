import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

function CartPage() {
    const location = useLocation();
    const [selectedParts, setSelectedParts] = useState(location.state.selectedParts);
    const [imageSrc, setImageSrc] = useState(null);

    const handleFindOnAmazon = (partName) => {
        // Construct Amazon search URL
        const amazonSearchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(partName)}`;

        // Open Amazon search URL in a new tab
        window.open(amazonSearchUrl, '_blank');
    };

    const handleSeeImage = (partName) => {
        // Construct Google search URL for the part
        const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(partName)}`;
        
        // Open Google search URL in a new tab
        window.open(googleSearchUrl, '_blank');
    };

    const handleUnseeImage = () => {
        // Remove the displayed image
        setImageSrc(null);
    };

    const handleDeleteItem = (partType) => {
        // Remove the entire item (category) from the selectedParts list
        const updatedParts = { ...selectedParts };
        delete updatedParts[partType];
        setSelectedParts(updatedParts);
    };

    return (
        <div>
            <h1>Cart</h1>
            <h2>Selected Parts</h2>
            <ul>
                {Object.entries(selectedParts).map(([partType, part]) => (
                    <li key={partType} style={{ display: 'flex', alignItems: 'center' }}>
                        <strong>{partType.toUpperCase()}:</strong>
                        {Array.isArray(part) ? (
                            <ul>
                                {part.map(p => (
                                    <li key={p.name} style={{ marginLeft: '10px' }}>
                                        {p.name}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div style={{ marginLeft: '10px' }}>
                                {part.name}
                            </div>
                        )}
                        <button
                            style={{ marginLeft: '10px', fontSize: '12px', padding: '5px 10px', width: '40px', backgroundColor: 'red', color: 'white', borderRadius: '50%' }}
                            onClick={() => handleDeleteItem(partType)}
                        >
                            X
                        </button>
                        <button
                            style={{ marginLeft: '10px', fontSize: '12px', padding: '5px 10px', width: '100px' }}
                            onClick={() => handleFindOnAmazon(Array.isArray(part) ? part[0].name : part.name)}
                        >
                            Find on Amazon
                        </button>
                        <button
                            style={{ marginLeft: '10px', fontSize: '12px', padding: '5px 10px', width: '100px' }}
                            onClick={() => handleSeeImage(Array.isArray(part) ? part[0].name : part.name)}
                        >
                            See Image
                        </button>
                    </li>
                ))}
            </ul>
            {/* Display the image if it exists */}
            {imageSrc && (
                <div>
                    <img src={imageSrc} alt="Part" style={{ marginTop: '20px', maxWidth: '100%', maxHeight: '300px' }} />
                    <button
                        style={{ marginLeft: '10px', fontSize: '12px', padding: '5px 10px', width: '100px' }}
                        onClick={handleUnseeImage}
                    >
                        Unsee Image
                    </button>
                </div>
            )}
        </div>
    );
}

export default CartPage;
