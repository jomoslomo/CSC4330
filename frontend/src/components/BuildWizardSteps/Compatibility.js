
function checkCompatibility(part, selectedParts, step) {
   //part allows me to access the part attributes
   //selectedParts allows me to compare selection with other selected Parts
   //step determines which part is picked (cpu: 1, motherboard: 2, ram: 3, storage: 4, gpu: 5, psu: 6, case: 7)

    if(part && selectedParts)
    {

    // ================== CPU constraints ==========================================
    if(step === 1){
        if(selectedParts.cpu.length > 0 && step === 1) {
            return {passes: false, reason: '1'};
        }

        //constraints if a motherboard is selected first
        if(selectedParts.motherboard.length !== 0) {
            const core = part.name[0];
            const socket = selectedParts.motherboard.socket;

            if(core === 'I' && socket !== 'LGA1700') {
             return {passes: false, reason: '10'};
            }
            else if(core === 'A' && (socket === 'LGA1700')) {
                return {passes: false, reason: '11'};
            }
        }
    }
    // ===============================================================================

    // ================== Motherboard constraints ===================================
    if(step === 2) {

        if(selectedParts.motherboard.length > 0 && step === 2) {
            return {passes: false, reason: '2'};
        }

        //constraints if a cpu is selected
        if(selectedParts.cpu.length !== 0) {
            const core = selectedParts.cpu[0].name[0];
            const socket = part.socket;
            console.log("core: " + core + ", socket: " + socket);

            if(core === 'I' && socket !== 'LGA1700') {
             return {passes: false, reason: '10'};
            }
            else if(core === 'A' && socket === 'LGA1700') {
                return {passes: false, reason: '11'};
            }
        }

        //constraints if ram is already selected
        if(selectedParts.ram.length !== 0) {
            let mem = getTotalMemory(selectedParts);

            if(selectedParts.ram.length > part.memory_slots) {
                return {passes: false, reason: '12'};
            }
            else if(mem > part.max_memory) {
                return {passes: false, reason: '13'};
            }
        }
    }
    // ==============================================================================
        
    // ================== RAM constraints =============================================
    if(step === 3) {
        let mem = getTotalMemoryStep3(part, selectedParts);

        if(selectedParts.ram.length > 7) {
            return {passes: false, reason: '3'};
        }

        //constraints if motherboard is selected
        if(selectedParts.motherboard.length !== 0) {
            if(selectedParts.ram.length > selectedParts.motherboard[0].memory_slots - 1) {
                return {passes: false, reason: '4'};
            }
            else if(mem > selectedParts.motherboard[0].max_memory) {
                return {passes: false, reason: '5'};
            }
        }
    }
    // ================================================================================

    // ================== Storage constraints ==========================================
    if(step === 4) {

        if(selectedParts.storage.length > 3) {
            return {passes: false, reason: '6'};
        }
    }

    // ================================================================================
        
    // ================== GPU constraints ==============================================
    if(step === 5) {

        if(selectedParts.gpu.length > 3) {
            return {passes: false, reason: '7'};
        }
    }

    // =================================================================================

    // ================== PSU constraints ==============================================
    if(step === 6) {

        if(selectedParts.psu.length > 0 && step === 6) {
            return {passes: false, reason: '8'};
        }
    }

    // =================================================================================

    // ================== Case constraints =============================================
    if(step === 7) {

        if(selectedParts.case.length > 0 && step === 7) {
            return {passes: false, reason: '9'};
        }
    }

    // =================================================================================

        return {passes: true};
    }
    else 
    {
        return {passes: false, reason: '0'};
    }
}

export default checkCompatibility;


//function returns the sum of the memory of the ram sticks in selectedParts and the selected ram
//stick in step 3 (if a motherboard is selected first)
function getTotalMemoryStep3(part, selectedParts)
{
    let totalMemory = 0;
        console.log(selectedParts.ram.length);

        for(let i = 0; i < selectedParts.ram.length; i++) {
            console.log(selectedParts.ram[i]);
            let gbString = selectedParts.ram[i].name.substring(selectedParts.ram[i].name.length - 5, selectedParts.ram[i].name.length - 3);                gbString = gbString.trim();
            let gb = parseInt(gbString);

            totalMemory += gb;
        }

        let gbStringLastSelected = part.name.substring(part.name.length - 5, part.name.length - 3);
        gbStringLastSelected = gbStringLastSelected.trim();
        let gbLastSelected = parseInt(gbStringLastSelected);
        totalMemory += gbLastSelected;
        
        return totalMemory;
}

//returns the total memory of the ram sticks in selected parts (if ram is selected before motherboard)
function getTotalMemory(selectedParts)
{
    let totalMemory = 0;
        console.log(selectedParts.ram.length);

        for(let i = 0; i < selectedParts.ram.length; i++) {
            console.log(selectedParts.ram[i]);
            let gbString = selectedParts.ram[i].name.substring(selectedParts.ram[i].name.length - 5, selectedParts.ram[i].name.length - 3);                gbString = gbString.trim();
            let gb = parseInt(gbString);

            totalMemory += gb;
        }

        return totalMemory;
    }