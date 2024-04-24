import React from 'react';
import SelectPart from './SelectPart'; // Adjust the import path as necessary
import CaseImage from '../../images/case.jpg';
function SelectCase({ onSelect, currentSelection }) {
    const displayAttributes = [
        'price', 'type', 'color', 'psu', 'side_panel', 'external_volume', 'internal_35_bays'
    ];

    return (
        <div>
        <SelectPart
            onSelect={onSelect}
            currentSelection={currentSelection}
            fetchUrl="http://localhost:3001/cases"
            displayAttributes={displayAttributes}
            partType="Case"
            imageUrl={CaseImage}
        />
        </div>
    );

}

export default SelectCase;
