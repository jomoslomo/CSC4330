import React, { useState } from 'react';
import SelectPart from '../../components/BuildWizardSteps/SelectPart';
import './BuildWizard.css';

function BuildWizard() {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedParts, setSelectedParts] = useState({
        cpu: null,
        motherboard: null,
        ram: null,
        storage: null,
        gpu: null,
        psu: null,
        case: null,
        // accessories: []
    });

    const SelectedPartsSidebar = ({ selectedParts }) => (
        <div className="selectedPartsSidebar">
          <h2>Selected Parts</h2>
          {Object.entries(selectedParts).map(([part, value]) => (
            value && <div key={part}>{`${part.toUpperCase()}: ${value.name || value.map(v => v.name).join(', ')}`}</div>
          ))}
        </div>
      );
      

    // Define part selection steps in an array or object for easier management
    const steps = [
        { type: 'cpu', fetchUrl: 'http://localhost:3001/cpus', component: SelectPart },
        { type: 'motherboard', fetchUrl: 'http://localhost:3001/motherboards', component: SelectPart },
        { type: 'ram', fetchUrl: 'http://localhost:3001/memory', component: SelectPart },
        { type: 'storage', fetchUrl: 'http://localhost:3001/storage', component: SelectPart },
        { type: 'gpu', fetchUrl: 'http://localhost:3001/gpus', component: SelectPart },
        { type: 'psu', fetchUrl: 'http://localhost:3001/psus', component: SelectPart },
        { type: 'case', fetchUrl: 'http://localhost:3001/cases', component: SelectPart },
        // { type: 'accessories', fetchUrl: 'http://localhost:3001/accessories', component: SelectPart }
    ];
    
    const handleSelectPart = (part) => {
        setSelectedParts(prevState => ({
            ...prevState,
            [steps[currentStep - 1].type]: part
        }));
    };

    const renderStep = () => {
        const stepConfig = steps[currentStep - 1];
        if (!stepConfig) return <div>Step not found</div>;

        return (
            <>
                <h2>Selecting: {stepConfig.type.toUpperCase()}</h2>
                <SelectPart
                    onSelect={handleSelectPart}
                    currentSelection={selectedParts[stepConfig.type]}
                    fetchUrl={stepConfig.fetchUrl}
                    partType={stepConfig.type.toUpperCase()}
                />
            </>
        );
    };

    return (
        <div className="buildWizardContainer">
            <div className="buildWizard">
                <h1>PC Build Wizard</h1>
                {renderStep()}
                <div className="navigationButtons">
                    {currentStep > 1 && <button onClick={() => setCurrentStep(currentStep - 1)}>Previous</button>}
                    {currentStep < steps.length && <button onClick={() => setCurrentStep(currentStep + 1)}>Next</button>}
                    {currentStep === steps.length && <button>Finish</button>}
                </div>
            </div>
            <SelectedPartsSidebar selectedParts={selectedParts} />
        </div>
    );
}

export default BuildWizard;