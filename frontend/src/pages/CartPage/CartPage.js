import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './CartPage.css'; // Import CSS file for component-specific styles

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

    const handleDeleteSubPart = (partType, index) => {
        const updatedParts = { ...selectedParts };
        updatedParts[partType] = selectedParts[partType].filter((_, i) => i !== index);
        setSelectedParts(updatedParts);
    };

    // Function to calculate total price
    const calculateTotalPrice = () => {
        let totalPrice = 0;
        Object.values(selectedParts).forEach(partGroup => {
            if (Array.isArray(partGroup)) {
                partGroup.forEach(part => totalPrice += part.price);
            } else {
                totalPrice += partGroup.price;
            }
        });
        return totalPrice.toFixed(2); // Fix to two decimal places
    };

    return (
        <div className="cart-container">
            <h1 className="cart-heading">Cart</h1>
            <h2 className="selected-parts-heading">Selected Parts</h2>
            <ul className="part-list">
                {Object.entries(selectedParts).map(([partType, partGroup]) => (
                    <li key={partType} className="part-list-item">
                        <strong>{partType.toUpperCase()}:</strong>
                        {Array.isArray(partGroup) ? (
                            <ul>
                                {partGroup.map((part, index) => (
                                    <li key={index} className="sub-part-list-item">
                                        {part.name}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Price: {part.price}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <button className="action-button" onClick={() => handleFindOnAmazon(part.name)}>Find on Amazon</button>
                                        <button className="action-button" onClick={() => handleSeeImage(part.name)}>See Image</button>
                                        <button className="delete-button" onClick={() => handleDeleteSubPart(partType, index)}>X</button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="sub-part-item">
                                {partGroup.name}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Price: {partGroup.price}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <button className="action-button" onClick={() => handleFindOnAmazon(partGroup.name)}>Find on Amazon</button>
                                <button className="action-button" onClick={() => handleSeeImage(partGroup.name)}>See Image</button>
                                <button className="delete-button" onClick={() => handleDeleteItem(partType)}>X</button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
            <hr className="divider" /> {/* Divider line */}
            <p className="total-price-text">Total Price: <span className="total-price">${calculateTotalPrice()}</span></p>
            {imageSrc && (
                <div>
                    <img src={imageSrc} alt="Part" className="part-image" />
                    <button className="action-button" onClick={handleUnseeImage}>Unsee Image</button>
                </div>
            )}
        </div>
    );
}

export default CartPage;
