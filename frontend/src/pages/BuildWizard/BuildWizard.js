import React, { useState } from 'react';
import SelectCPU from '../../components/BuildWizardSteps/SelectCPU';
import SelectMotherboard from '../../components/BuildWizardSteps/SelectMotherboard';
import SelectRAM from '../../components/BuildWizardSteps/SelectRAM';
import SelectStorage from '../../components/BuildWizardSteps/SelectStorage';
import SelectGPU from '../../components/BuildWizardSteps/SelectGPU';
import SelectPSU from '../../components/BuildWizardSteps/SelectPSU';
import SelectCase from '../../components/BuildWizardSteps/SelectCase';
import SelectAccessories from '../../components/BuildWizardSteps/SelectAccessories';
import './BuildWizard.css';

function BuildWizard() {
    const [currentStep, setCurrentStep] = useState(1);

    const nextStep = () => {
        if (currentStep < 8) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <SelectCPU />;
            case 2:
                return <SelectMotherboard />;
            case 3:
                return <SelectRAM />;
            case 4:
                return <SelectStorage />;
            case 5:
                return <SelectGPU />;
            case 6:
                return <SelectPSU />;
            case 7:
                return <SelectCase />;
            case 8:
                return <SelectAccessories />;
            default:
                return <div>Step not found</div>;
        }
    };

    return (
        <div className="buildWizard">
            <h1>PC Build Wizard</h1>
            {renderStep()}
            <div className="navigationButtons">
                {currentStep > 1 && <button onClick={prevStep}>Previous</button>}
                {currentStep < 8 && <button onClick={nextStep}>Next</button>}
                {/* Optionally, add a submit or finish button on the last step */}
                {currentStep === 8 && <button>Finish</button>}
            </div>
        </div>
    );
}

export default BuildWizard;
