// Import the necessary module
import Edit from "./edit.js";
import Array from "./array.js";
import Ref from "./ref.js";

// Define the NPCs module
const NPCs = {
npcArray: [],

saveNPC: function() {

// Check if an NPC with the same name already exists
const existingNPCIndex = this.npcArray.findIndex(npc => npc.name === Ref.npcName.value);
console.log(Ref.npcName.value)
const npc = {
name: Ref.npcName.value,
occupation: Ref.npcOccupation.value,

MorningLocation: Ref.MorningLocation.value,
MorningActivity: Ref.MorningActivity.value,

AfternoonLocation: Ref.AfternoonLocation.value,
AfternoonActivity: Ref.AfternoonActivity.value,

NightLocation: Ref.NightLocation.value,
NightActivity: Ref.NightActivity.value,

level: Ref.npcLevel.value,
class: Ref.npcClass.value,
str: Ref.STR.value,
dex: Ref.DEX.value,
int: Ref.INT.value,
wis: Ref.WIS.value,
con: Ref.CON.value,
cha: Ref.CHA.value,

physicalAppearance: Ref.npcPhysicalAppearance.value,
emotionalAppearance: Ref.npcEmotionalAppearance.value,
socialAppearance: Ref.npcSocialAppearance.value
};

if (existingNPCIndex !== -1) {
// Update the existing NPC entry
this.npcArray[existingNPCIndex] = npc;
console.log('NPC updated:', npc);
} else {
// Add the created NPC to the npcArray
this.npcArray.push(npc);
//console.log('New NPC added:', npc);
}

},

fixDisplay: function(){

const imageContainer = document.querySelector('.image-container');
const radiantDisplay = document.getElementById('radiantDisplay');

try{
if (Edit.editPage === 2) {
imageContainer.style.width = "55vw"; 
radiantDisplay.style.width = "55vw"; 
}else{imageContainer.style.width = "70vw"; 
radiantDisplay.style.width = "70vw"; 
}}catch{}
},

clearNPCForm: function(){
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


},

getNPCs(locationName, currentPhase) {
const presentNPCs = [];

// Apply different colors based on location type
const phaseName = 
currentPhase === 0 ? 'Morning' :
currentPhase === 1 ? 'Afternoon' :
currentPhase === 2 ? 'Night' : 'wild';

for (const npc of NPCs.npcArray) {
if (npc[`${phaseName}Location`] === locationName) {
const npcStory = this.generateNPCStory(npc, locationName, phaseName);
presentNPCs.push({ name: npc.name, story: npcStory });
}}

return presentNPCs;
},

generateNPCStory(npc, locationName,phaseName) {
let story = `<br>`;

story += `<span class="expandable npc" data-content-type="npc" divId="${npc.name.replace(/\s+/g, '-')}">
${npc.occupation} is here. </span>
\n <span class="hotpink"> (${npc.name})</span>
`

if (phaseName === 'Morning' && npc.MorningLocation === locationName && npc.MorningActivity && npc.MorningActivity !== "undefined") {
story += `   They are currently ${npc.MorningActivity} \n`;
}

if (phaseName === 'Afternoon'  && npc.AfternoonLocation === locationName && npc.AfternoonActivity && npc.AfternoonActivity !== "undefined") {
story += `   They are currently ${npc.AfternoonActivity} \n`;
}

if (phaseName === 'Night'  && npc.NightLocation === locationName && npc.NightActivity && npc.NightActivity !== "undefined") {
story += `   They are currently ${npc.NightActivity} \n`;
}

//console.log(story)
return story;
},

addNPCInfo(npcName) {
const extraContent = document.getElementById('extraContent');

// Search for the NPC in the npcArray
const findNPC = npcName.replace(/-/g, ' ');
const foundNPC = NPCs.npcArray.find(npc => npc.name === findNPC);

if (foundNPC) {
//console.log(foundNPC);
// Format the NPC information into npcContent
let npcContent = `<h2><span class="cyan">${foundNPC.name}</span></h2>`;

if (foundNPC.occupation && foundNPC.occupation !== "undefined") {
npcContent += `${foundNPC.occupation}.`;
}

if (foundNPC.class && foundNPC.class !== "N/A") {
npcContent += `<br><span class="cyan">Level ${foundNPC.level} ${foundNPC.class.toUpperCase()}</span>`;
}

if (foundNPC.str) {
npcContent += `<br>
<span class="hotpink"> STR: </span> ${foundNPC.str}
<span class="hotpink"> DEX: </span> ${foundNPC.dex}
<span class="hotpink"> INT: </span> ${foundNPC.int}
<span class="hotpink"> WIS: </span> ${foundNPC.wis}
<span class="hotpink"> CON: </span> ${foundNPC.con}
<span class="hotpink"> CHA: </span> ${foundNPC.cha}
`
}

if (foundNPC.physicalAppearance && foundNPC.physicalAppearance !== "undefined") {
npcContent += `<br><br>${foundNPC.physicalAppearance}`;
}

if (foundNPC.emotionalAppearance && foundNPC.emotionalAppearance !== "undefined") {
npcContent += `<br><br>${foundNPC.emotionalAppearance}`;
}

if (foundNPC.socialAppearance && foundNPC.socialAppearance !== "undefined") {
npcContent += `<br><br>${foundNPC.socialAppearance}`;
}

if (foundNPC.MorningLocation) {
npcContent += `<br>
In the morning they can be found at
<span class="lime">[${foundNPC.MorningLocation}]</span>,
${foundNPC.MorningActivity}`;
}

if (foundNPC.AfternoonLocation) {
npcContent += `<br>
In the afternoon they can be found at <span class="orange">
[${foundNPC.AfternoonLocation}]</span>,
${foundNPC.AfternoonActivity}`;
}

if (foundNPC.NightLocation) {
npcContent += `<br>
In the evening they can be found at <span class="hotpink">
[${foundNPC.NightLocation}]</span>,
 ${foundNPC.NightActivity}`;
}

// Set the formatted content in the extraContent element
extraContent.innerHTML = npcContent;
} else {
// NPC not found
extraContent.innerHTML = `NPC not found`;
}
},

};

// Export the NPCs module
export default NPCs;
