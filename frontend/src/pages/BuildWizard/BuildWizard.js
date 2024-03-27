import React, { useState } from 'react';
import SelectPart from '../../components/BuildWizardSteps/SelectPart';
import './BuildWizard.css';
import axios from 'axios'; // Make sure to install axios via npm or yarn
import { useNavigate } from 'react-router-dom';

function BuildWizard() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedParts, setSelectedParts] = useState({
        cpu: null,
        motherboard: null,
        ram: null,
        storage: null,
        gpu: null,
        psu: null,
        case: null,
    });
    const [buildName, setBuildName] = useState(''); // State to store the build name

    const renderBuildNameInput = () => (
        <div className="buildNameInput">
            <label htmlFor="buildName">Build Name:</label>
            <input
                id="buildName"
                type="text"
                value={buildName}
                onChange={(e) => setBuildName(e.target.value)}
                placeholder="Enter your build name"
            />
        </div>
    );

    const SelectedPartsSidebar = ({ selectedParts }) => (
        <div className="selectedPartsSidebar">
          <h2>Selected Parts</h2>
          {Object.entries(selectedParts).map(([part, value]) => (
            value && <div key={part}>{`${part.toUpperCase()}: ${value.name || value.map(v => v.name).join(', ')}`}</div>
          ))}
        </div>
      );

    const steps = [
        { type: 'cpu', fetchUrl: 'http://localhost:3001/cpus', component: SelectPart },
        { type: 'motherboard', fetchUrl: 'http://localhost:3001/motherboards', component: SelectPart },
        { type: 'ram', fetchUrl: 'http://localhost:3001/memory', component: SelectPart },
        { type: 'storage', fetchUrl: 'http://localhost:3001/storage', component: SelectPart },
        { type: 'gpu', fetchUrl: 'http://localhost:3001/gpus', component: SelectPart },
        { type: 'psu', fetchUrl: 'http://localhost:3001/psus', component: SelectPart },
        { type: 'case', fetchUrl: 'http://localhost:3001/cases', component: SelectPart },
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
    const saveBuild = async () => {
        // The endpoint where builds are saved
        const saveEndpoint = 'http://localhost:3001/user/builds';
        
        // Retrieve the token saved during login from localStorage
        const token = localStorage.getItem('token');
        
        try {
            // Prepare components with both ID and name
            const components = Object.entries(selectedParts).reduce((acc, [key, part]) => {
                // Assuming each part object has an 'id' and 'name' property
                if (part) {
                    acc.push({ type: key, id: part._id, name: part.name });
                }
                return acc;
            }, []);
            
            // Use the token in the Authorization header for your POST request
            const response = await axios.post(saveEndpoint, {
                build_name: buildName, // Use the state that holds the user's input for the build name
                components: components
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`, // Use Bearer scheme for JWT
                    'Content-Type': 'application/json' // Ensure the content type is set to application/json
                }
            });
    
            // Alert or handle the response from the server upon successful save
            alert('Build saved successfully!');
            // Optionally, redirect the user or clear the form as needed
        } catch (error) {
            // Log or handle errors, such as displaying a message to the user
            console.error('Failed to save build', error);
            alert('Failed to save build');
        }
    };

    return (
        <div className="buildWizardContainer">
            <div className="buildWizard">
                <h1>PC Build Wizard</h1>
                {currentStep === 1 && renderBuildNameInput()} {/* Render the build name input at the first step */}
                {renderStep()}
                <div className="navigationButtons">
                    {currentStep > 1 && <button onClick={() => setCurrentStep(currentStep - 1)}>Previous</button>}
                    {currentStep < steps.length && <button onClick={() => setCurrentStep(currentStep + 1)}>Next</button>}
                    {currentStep === steps.length && (
                        <>
                            <button onClick={saveBuild}>Save Build</button>
                            <button onClick={() => navigate('/CartPage', { state: { selectedParts } })}>Finish</button>
                        </>
                    )}
                </div>
            </div>
            <SelectedPartsSidebar selectedParts={selectedParts} />
        </div>
    );
}

export default BuildWizard;
