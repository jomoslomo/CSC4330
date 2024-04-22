import React, { useState } from 'react';
import SelectPart from '../../components/BuildWizardSteps/SelectPart';
import './BuildWizard.css';
import SearchBar from './SearchBar';
import checkCompatibility from '../../components/BuildWizardSteps/Compatibility';
import axios from 'axios'; // Make sure to install axios via npm or yarn

function BuildWizard() {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedParts, setSelectedParts] = useState({
        cpu: [],
        motherboard: [],
        ram: [],
        storage: [],
        gpu: [],
        psu: [],
        case: [],
        accessories: []
    });
    const [buildName, setBuildName] = useState(''); // State to store the build name
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
        { type: 'cpu', fetchUrl: 'http://localhost:3001/cpus', component: SelectPart },
        { type: 'motherboard', fetchUrl: 'http://localhost:3001/motherboards', component: SelectPart },
        { type: 'ram', fetchUrl: 'http://localhost:3001/memory', component: SelectPart },
        { type: 'storage', fetchUrl: 'http://localhost:3001/internal-hdds', component: SelectPart },
        { type: 'gpu', fetchUrl: 'http://localhost:3001/gpus', component: SelectPart },
        { type: 'psu', fetchUrl: 'http://localhost:3001/psus', component: SelectPart },
        { type: 'case', fetchUrl: 'http://localhost:3001/cases', component: SelectPart },
        // { type: 'accessories', fetchUrl: 'http://localhost:3001/accessories', component: SelectPart }
    ];
    
    const handleSelectPart = (part) => {
        const compatibilityCheck = checkCompatibility(part, selectedParts, currentStep);

        //check if part is compatible with current build. If not, alert the user of the reason
        if (compatibilityCheck.passes) {
                setSelectedParts(prevState => ({
                    ...prevState,
                    [steps[currentStep - 1].type]: [...prevState[steps[currentStep - 1].type], part]
                }));
        }
        else {
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
        setSelectedParts(prevSelectedParts => ({
            ...prevSelectedParts,
            [partType]: prevSelectedParts[partType].filter(part => part === partToRemove)
        }));
        console.log(selectedParts);
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
    

    const saveBduild = async () => {
        // The endpoint where builds are saved
        const saveEndpoint = 'http://localhost:3001/user/builds';
        
        // Retrieve the token saved during login from localStorage
        const token = localStorage.getItem('token');
        
        try {
            // Use the token in the Authorization header for your POST request
            const response = await axios.post(saveEndpoint, {
                build_name: buildName, // Use the state that holds the user's input for the build name
                components: Object.values(selectedParts).map(part => part.id) // Assuming each part object has an 'id' property
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
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                {renderStep()}
                <div className="navigationButtons">
                    {currentStep > 1 && <button onClick={() => setCurrentStep(currentStep - 1)}>Previous</button>}
                    {currentStep < steps.length && <button onClick={() => setCurrentStep(currentStep + 1)}>Next</button>}
                    {currentStep === steps.length && (
                        <>
                            <button onClick={saveBuild}>Save Build</button>
                            <button>Finish</button>
                        </>
                    )}
                </div>
            </div>
            <SelectedPartsSidebar selectedParts={selectedParts} onRemovePart={handleRemovePart}/>
        </div>
    );
}

export default BuildWizard;