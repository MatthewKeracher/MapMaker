// Import the necessary module
import Array from "./array.js";

// Define the NPCs module
const NPCs = {
    npcArray: [],

    saveNPC: function() {
        // Get the values from the form fields
        const npcName = document.getElementById('npcName').value;
        const npcOccupation = document.getElementById('npcOccupation').value;
        const npcLevel = document.getElementById('npcLevel').value;
        const npcClass = document.getElementById('npcClass').value;
        const primaryLocation = document.getElementById('primaryLocation').value;
        const primaryActivity = document.getElementById('primaryActivity').value;
        const secondaryLocation = document.getElementById('secondaryLocation').value;
        const secondaryActivity = document.getElementById('secondaryActivity').value;
        const tertiaryLocation = document.getElementById('tertiaryLocation').value;
        const tertiaryActivity = document.getElementById('tertiaryActivity').value;
        const npcPhysicalAppearance = document.getElementById('npcPhysicalAppearance').value;
        const npcEmotionalAppearance = document.getElementById('npcEmotionalAppearance').value;
        const npcSocialAppearance = document.getElementById('npcSocialAppearance').value;
    
        // Check if an NPC with the same name already exists
        const existingNPCIndex = this.npcArray.findIndex(npc => npc.name === npcName);
    
        // Create an NPC object with the retrieved values
        const npc = {
            name: npcName,
            occupation: npcOccupation,
            level: npcLevel,
            class: npcClass,
            primaryLocation: primaryLocation,
            primaryActivity: primaryActivity,
            secondaryLocation: secondaryLocation,
            secondaryActivity: secondaryActivity,
            tertiaryLocation: tertiaryLocation,
            tertiaryActivity: tertiaryActivity,
            physicalAppearance: npcPhysicalAppearance,
            emotionalAppearance: npcEmotionalAppearance,
            socialAppearance: npcSocialAppearance
        };
    
        if (existingNPCIndex !== -1) {
            // Update the existing NPC entry
            this.npcArray[existingNPCIndex] = npc;
            console.log('NPC updated:', npc);
        } else {
            // Add the created NPC to the npcArray
            this.npcArray.push(npc);
            console.log('New NPC added:', npc);
        }
    
        // Do something with the created/updated NPC object (e.g., add to an array)
        console.log(this.npcArray);
    
        // Clear the form
        document.getElementById('npcForm').reset();
    },
    

    

loadNPC: function() {
const npcForm = document.getElementById('npcForm');

// Hide the npcForm
npcForm.style.display = "none";

const editorContainer = document.querySelector('.EditorContainer');      

// Create a new npcNamesTable div
const npcNamesTable = document.createElement('div');
npcNamesTable.id = 'npcNamesTable'; // Set an ID for the div element

// Create a table element inside the npcNamesTable div
const table = document.createElement('table');

// Create table rows and cells for each NPC name and location
for (const npc of NPCs.npcArray) {
const row = document.createElement('tr');

// Create and populate the cell for the NPC name
const nameCell = document.createElement('td');
nameCell.textContent = npc.name;

// Create and populate the cell for the location information
const locationName = document.querySelector('.locationLabel').textContent;
const currentLocation = document.createElement('td');
if (npc.primaryLocation === locationName) {
    currentLocation.textContent = 'Primary';
} else if (npc.secondaryLocation === locationName) {
    currentLocation.textContent = 'Secondary';
} else if (npc.tertiaryLocation === locationName) {
    currentLocation.textContent = 'Tertiary';
} else {
    currentLocation.textContent = 'Not here';
}


// Add both cells to the row
row.appendChild(nameCell);
row.appendChild(currentLocation);

// Determine where to insert the row based on the location type
if (npc.primaryLocation) {
    table.insertBefore(row, table.querySelector('tr[data-location="Secondary"]'));
} else if (npc.secondaryLocation) {
    table.insertBefore(row, table.querySelector('tr[data-location="Tertiary"]'));
} else if (npc.tertiaryLocation) {
    table.appendChild(row); // Append to the end for tertiary
} else {
    table.appendChild(row); // Append to the end for unknown
}
}

// Add the table element to the npcNamesTable div
npcNamesTable.appendChild(table);

// Add the npcNamesTable div to the editorContainer
editorContainer.appendChild(npcNamesTable);

table.addEventListener('click', function(event) {
    const clickedRow = event.target.closest('tr');
    console.log('table click');

    // Check if the clicked element is a row
    if (clickedRow) {
        // Get the row index of the clicked row
        const rowIndex = clickedRow.rowIndex;
        console.log('Row index:', rowIndex);

        // Make sure the rowIndex is within the valid range
        if (rowIndex >= 0 && rowIndex < NPCs.npcArray.length) {
            const selectedNPC = NPCs.npcArray[rowIndex];   

        document.getElementById('npcName').value = selectedNPC.name;
        document.getElementById('npcOccupation').value = selectedNPC.occupation;
        document.getElementById('npcLevel').value = selectedNPC.level;
        document.getElementById('npcClass').value = selectedNPC.class;
        document.getElementById('primaryLocation').value = selectedNPC.primaryLocation;
        document.getElementById('primaryActivity').value = selectedNPC.primaryActivity;
        document.getElementById('secondaryLocation').value = selectedNPC.secondaryLocation;
        document.getElementById('secondaryActivity').value = selectedNPC.secondaryActivity;
        document.getElementById('tertiaryLocation').value = selectedNPC.tertiaryLocation;
        document.getElementById('tertiaryActivity').value = selectedNPC.tertiaryActivity;
        document.getElementById('npcPhysicalAppearance').value = selectedNPC.npcPhysicalAppearance;
        document.getElementById('npcEmotionalAppearance').value = selectedNPC.npcEmotionalAppearance;
        document.getElementById('npcSocialAppearance').value = selectedNPC.npcSocialAppearance;


// Display the npcForm
document.getElementById('npcForm').style.display = 'flex';


npcNamesTable.parentNode.removeChild(npcNamesTable);


} else {
console.log('Invalid row index:', rowIndex);
}
}
});

},

updateNPCTable: function() {
    const npcNamesTable = document.getElementById('npcNamesTable');
    const npcForm = document.getElementById('npcForm');
    console.log('attempting')
    if (npcNamesTable) {
        npcNamesTable.parentNode.removeChild(npcNamesTable);
        //npcForm.style.display = "flex";
        this.loadNPC();
    }
},



};

// Export the NPCs module
export default NPCs;
