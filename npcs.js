// Import the necessary module
import Edit from "./edit.js";
import Array from "./array.js";
import Ref from "./ref.js";

// Define the NPCs module
const NPCs = {
npcArray: [],

saveNPC: function() {

// Check if an NPC with the same name already exists
const existingNPCIndex = this.npcArray.findIndex(npc => npc.name === npcName);

const npc = {
        name: Ref.npcName,
        occupation: Ref.npcOccupation,

        MorningLocation: Ref.MorningLocation,
        MorningActivity: Ref.MorningActivity,

        AfternoonLocation: Ref.AfternoonLocation,
        AfternoonActivity: Ref.AfternoonActivity,

        NightLocation: Ref.NightLocation,
        NightActivity: Ref.NightActivity,


        level: Ref.npcLevel,
        class: Ref.npcClass,
        str: Ref.STR,
        dex: Ref.DEX,
        int: Ref.INT,
        wis: Ref.WIS,
        con: Ref.CON,
        cha: Ref.CHA,

        physicalAppearance: Ref.npcPhysicalAppearance,
        emotionalAppearance: Ref.npcEmotionalAppearance,
        socialAppearance: Ref.npcSocialAppearance
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

},

fixDisplay: function(){

    const imageContainer = document.querySelector('.image-container');
    const radiantDisplay = document.getElementById('radiantDisplay');

try{
if (Edit.editPage === 3) {
imageContainer.style.width = "55vw"; 
radiantDisplay.style.width = "55vw"; 
}else{imageContainer.style.width = "70vw"; 
radiantDisplay.style.width = "70vw"; 
}}catch{}
},

clearForm: function(){
const npcForm = document.getElementById('npcForm');
const inputFields = npcForm.querySelectorAll('input, textarea, select'); // Select input, textarea, and select fields within npcForm

//console.log("clearing npcForm")

// Loop through the form elements and clear their values
inputFields.forEach(formElement => {
if (formElement.tagName === 'SELECT') {
// For select elements, set the selected index to -1 to clear the selection
formElement.selectedIndex = -1;
} else {
formElement.value = ''; // Clear the value of input and textarea elements
}
});

Array.generateLocationOptions();

},


loadNPC: function() {
const npcForm = document.getElementById('npcForm');    
const NPCoptionsList = document.getElementById('NPCoptionsList'); // Reuse the optionsList div


// Clear the existing content
NPCoptionsList.innerHTML = '';

const MorningNPCs = [];
const AfternoonNPCs = [];
const NightNPCs = [];
const otherNPCs = [];

for (const npc of NPCs.npcArray) {
const npcNameDiv = document.createElement('div');
npcNameDiv.textContent = npc.name;            

// Colour code based on whether this is their Morning, Afternoon, or Night Location

if (npc.MorningLocation === Ref.locationLabel.textContent &&
npc.AfternoonLocation === Ref.locationLabel.textContent &&
npc.NightLocation === Ref.locationLabel.textContent) {
npcNameDiv.classList.add('Always');
NightNPCs.push(npcNameDiv);
} else if (npc.MorningLocation === Ref.locationLabel.textContent) {
npcNameDiv.classList.add('Morning');
MorningNPCs.push(npcNameDiv);
} else if (npc.AfternoonLocation === Ref.locationLabel.textContent) {
npcNameDiv.classList.add('Afternoon');
AfternoonNPCs.push(npcNameDiv);
} else if (npc.NightLocation === Ref.locationLabel.textContent) {
npcNameDiv.classList.add('Night');
NightNPCs.push(npcNameDiv);
} else {
npcNameDiv.classList.add('npc-name'); // Add a class for styling
otherNPCs.push(npcNameDiv);
}

// Add click event listener to each NPC name
npcNameDiv.addEventListener('click', () => {

document.getElementById('npcName').value = npc.name;
document.getElementById('npcOccupation').value = npc.occupation;

document.getElementById('MorningLocation').value = npc.MorningLocation;
document.getElementById('MorningActivity').value = npc.MorningActivity;

document.getElementById('AfternoonLocation').value = npc.AfternoonLocation;
document.getElementById('AfternoonActivity').value = npc.AfternoonActivity;

document.getElementById('NightLocation').value = npc.NightLocation;
document.getElementById('NightActivity').value = npc.NightActivity;

document.getElementById('npcLevel').value = npc.level;
document.getElementById('npcClass').value = npc.class;

document.getElementById('STR').value = npc.str;  
document.getElementById('DEX').value = npc.dex; 
document.getElementById('INT').value = npc.int; 
document.getElementById('WIS').value = npc.wis; 
document.getElementById('CON').value = npc.con; 
document.getElementById('CHA').value = npc.cha; 

document.getElementById('npcPhysicalAppearance').value = npc.physicalAppearance;
document.getElementById('npcEmotionalAppearance').value = npc.emotionalAppearance;
document.getElementById('npcSocialAppearance').value = npc.socialAppearance;


npcForm.style.display = 'flex'; // Display the npcForm
});
}

// Concatenate arrays in desired order
const sortedNPCs = [...MorningNPCs, ...AfternoonNPCs, ...NightNPCs, ...otherNPCs];

// Append sorted divs to the NPCoptionsList
sortedNPCs.forEach(npcDiv => {
NPCoptionsList.appendChild(npcDiv);
});

NPCoptionsList.style.display = 'block'; // Display the NPC names container

this.fixDisplay();


}
      
 

};

// Export the NPCs module
export default NPCs;
