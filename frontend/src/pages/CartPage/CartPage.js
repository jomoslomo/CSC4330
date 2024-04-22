import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

function CartPage() {
    const location = useLocation();
    const [selectedParts, setSelectedParts] = useState(location.state.selectedParts);
    const [imageSrc, setImageSrc] = useState(null);

    const handleFindOnAmazon = (partName) => {
        const amazonSearchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(partName)}`;
        window.open(amazonSearchUrl, '_blank');
    };

    const handleSeeImage = (partName) => {
        const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(partName)}`;
        window.open(googleSearchUrl, '_blank');
    };

    const handleUnseeImage = () => {
        setImageSrc(null);
    };

    const handleDeleteItem = (partType) => {
        const updatedParts = { ...selectedParts };
        delete updatedParts[partType];
        setSelectedParts(updatedParts);
    };

    // Function to calculate total price
    const calculateTotalPrice = () => {
        let totalPrice = 0;
        Object.values(selectedParts).forEach(part => {
            if (Array.isArray(part)) {
                part.forEach(p => totalPrice += p.price);
            } else {
                totalPrice += part.price;
            }
        });
        return totalPrice.toFixed(2); // Fix to two decimal places
    };

    return (
        <div>
            <h1 style={{ marginLeft: '20px' }}>Cart</h1>
            <h2 style={{ marginLeft: '40px' }}>Selected Parts</h2>
            <ul>
                {Object.entries(selectedParts).map(([partType, part]) => (
                    <li key={partType} style={{ display: 'flex', alignItems: 'center' }}>
                        <strong>{partType.toUpperCase()}:</strong>
                        {Array.isArray(part) ? (
                            <ul>
                                {part.map(p => (
                                    <li key={p.name} style={{ marginLeft: '10px' }}>
                                        {p.name}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Price: {p.price}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div style={{ marginLeft: '10px' }}>
                                {part.name}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Price: {part.price}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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
            <div style={{ width: '50%', textAlign: 'left' }}>
                <hr />
            </div>
            <p style={{ marginLeft: '40px', marginTop: '20px', fontWeight: 'bold' }}>Total Price: <span style={{ marginLeft: '250px' }}>${calculateTotalPrice()}</span></p>
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
