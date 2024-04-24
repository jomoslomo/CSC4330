import React, { useState } from 'react';
import SelectPart from '../../components/BuildWizardSteps/SelectPart';
import './BuildWizard.css';
import SearchBar from './SearchBar';
import checkCompatibility from '../../components/BuildWizardSteps/Compatibility';
import axios from 'axios'; // Make sure to install axios via npm or yarn
import { useNavigate } from 'react-router-dom';

function BuildWizard() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedParts, setSelectedParts] = useState({
        motherboard: [],
        cpu: [],
        ram: [],
        storage: [],
        gpu: [],
        psu: [],
        case: [],
    });
    const [buildName, setBuildName] = useState(''); // State to store the build name
    const [showBuildNameWarning, setShowBuildNameWarning] = useState(false); // State to manage build name warning visibility
    let [searchTerm, setSearchTerm] = useState('');

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
            <div key={part._id} className="selectedPart">
            <span>{`${part.toUpperCase()}: ${value.name || value.map(v => v.name).join(', ')}`}</span> 
            {value.length > 0 && <button onClick={() => handleRemovePart(part, value)}>Remove</button>}
        </div>
          ))}
        </div>
      );
      
    // Define part selection steps in an array or object for easier management
    const steps = [
        { type: 'motherboard', fetchUrl: 'http://localhost:3001/motherboards', component: SelectPart },
        { type: 'cpu', fetchUrl: 'http://localhost:3001/cpus', component: SelectPart },
        { type: 'ram', fetchUrl: 'http://localhost:3001/memory', component: SelectPart },
        { type: 'storage', fetchUrl: 'http://localhost:3001/internal-hdds', component: SelectPart },
        { type: 'storage', fetchUrl: 'http://localhost:3001/internal-hdds', component: SelectPart },
        { type: 'gpu', fetchUrl: 'http://localhost:3001/gpus', component: SelectPart },
        { type: 'psu', fetchUrl: 'http://localhost:3001/psus', component: SelectPart },
        { type: 'case', fetchUrl: 'http://localhost:3001/cases', component: SelectPart },
        // { type: 'accessories', fetchUrl: 'http://localhost:3001/accessories', component: SelectPart }
    ];
    
    const handleSelectPart = (part) => {
        const compatibilityCheck = checkCompatibility(part, selectedParts, currentStep);
    
        if (compatibilityCheck.passes) {
            setSelectedParts(prevState => {
                const updatedParts = {
                    ...prevState,
                    [steps[currentStep - 1].type]: [...prevState[steps[currentStep - 1].type], part]
                };
                console.log(`Updated selected parts after adding:`, updatedParts);
                return updatedParts;
            });
        } else {
            switch(compatibilityCheck.reason)
            {
                case '0':
                    alert("The selected part is not compatible with your build!");
                    break;
                case '1':
                    alert("You can only select one CPU for your build!");
                    break;
                case '2':
                    alert("You can only select one motherboard for your build!");
                    break;
                case '3': 
                    alert("You have exceeded the maximum amount of RAM allowed!");
                    break;
                case '4':
                    alert("Amount of RAM sticks exceeds motherboard's memory slots!");
                    break;
                case '5':
                    alert("Selected RAM stick exceeds your motherboard's total memory capacity!");
                    break;
                case '6':
                    alert("You have exceeded the maximum amount of storage allowed!");
                    break;
                case '7':
                    alert("You have exceeded the maximum amount of gpus allowed!");
                    break;
                case '8':
                    alert("You can only select one PSU for your build!");
                    break;
                case '9':
                    alert("You can only select one case for your build!");
                    break;
                case '10':
                    alert("An Intel core needs a motherboard with a LGA1700 socket!");
                    break;
                case '11':
                    alert("An AMD core needs a motherboard with an AM5 or AM4 socket!");
                    break;
                case '12':
                    alert("You have too many ram sticks for the selected motherboard!");
                    break;
                case '13':
                    alert("Selected motherboard does not have enough memory for selected RAM sticks!");
            }
            
        }
    };

    const handleRemovePart = (partType, partToRemove) => {
        setSelectedParts(prevSelectedParts => {
            const updatedParts = {
                ...prevSelectedParts,
                [partType]: prevSelectedParts[partType].filter(part => part === partToRemove)
            };
            console.log(`Updated selected parts after removal:`, updatedParts);
            return updatedParts;
        });
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
                    searchTerm={searchTerm}
                    searchTerm={searchTerm}
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
            const components = Object.entries(selectedParts).reduce((acc, [key, parts]) => {
                parts.forEach(part => {
                    if (part && part._id && part.name) { // Ensure each part has an 'id' and 'name'
                        acc.push({ type: key, id: part._id, name: part.name });
                    }
                });
                return acc;
            }, []);
            
            
            // Log the build data before sending the request
            console.log('Build data:', {
                build_name: buildName,
                components: components
            });
            
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
            
            // Log the response from the server
            console.log('Server response:', response.data);
            
            // Alert or handle the response from the server upon successful save
            alert('Build saved successfully!');
            // Optionally, redirect the user or clear the form as needed
        } catch (error) {
            // Log the error details
            console.error('Failed to save build:', error.response ? error.response.data : error.message);
            alert('Failed to save build');
        }
    };

    const handleNextStep = () => {
        if (currentStep === 1 && !buildName) {
            // Show warning if build name is not provided
            setShowBuildNameWarning(true);
        } else {
            // Proceed to the next step
            setCurrentStep(currentStep + 1);
            // Hide the warning if previously shown
            setShowBuildNameWarning(false);
        }
    };

    return (
        <div className="buildWizardContainer">
            <div className="buildWizard">
                <h1>PC Build Wizard</h1>
                {currentStep === 1 && renderBuildNameInput()} {/* Render the build name input at the first step */}
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                {showBuildNameWarning && <div className="warningMessage">Please input a build name to continue</div>}
                {renderStep()}
                <div className="navigationButtons">
                    {currentStep > 1 && <button onClick={() => setCurrentStep(currentStep - 1)}>Previous</button>}
                    {currentStep < steps.length && <button onClick={handleNextStep} disabled={currentStep === 1 && !buildName}>Next</button>}
                    {currentStep === steps.length && (
                        <>
                            <button onClick={saveBuild}>Save Build</button>
                            <button onClick={() => navigate('/CartPage', { state: { selectedParts } })}>Finish</button>
                        </>
                    )}
                </div>
            </div>
            <SelectedPartsSidebar selectedParts={selectedParts} onRemovePart={handleRemovePart}/>
        </div>
    );
}

export default BuildWizard;
