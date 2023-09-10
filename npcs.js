// Import the necessary module
import Edit from "./edit.js";
import Array from "./array.js";
import Ref from "./ref.js";
import Items from "./items.js";
import Monsters from "./monsters.js";

// Define the NPCs module
const NPCs = {
npcArray: [],
npcSearchArray:[],
AlwaysNPCs : [],
MorningNPCs : [],
AfternoonNPCs : [],
NightNPCs : [],
otherNPCs : [],

loadNPC: function(NPCArray) {

const itemList = document.getElementById('itemList'); // Do not delete!!

// Clear the existing content
itemList.innerHTML = '';

this.AlwaysNPCs = [];
this.MorningNPCs = [];
this.AfternoonNPCs = [];
this.NightNPCs = [];
this.otherNPCs = [];

for (const npc of NPCArray) {
const npcNameDiv = document.createElement('div');
npcNameDiv.textContent = npc.name + ' [' + npc.occupation + ']';            

this.sortNPCs(npc, npcNameDiv);
this.fillNPCForm(npc, npcNameDiv);

}

// Concatenate arrays in desired order
const sortedNPCs = [...this.AlwaysNPCs, ...this.MorningNPCs, ...this.AfternoonNPCs, ...this.NightNPCs, ...this.otherNPCs];

// Append sorted divs to the itemList
sortedNPCs.forEach(npcDiv => {
itemList.appendChild(npcDiv);
});

itemList.style.display = 'block'; // Display the NPC names container

this.fixDisplay();

},

sortNPCs: function(npc, npcNameDiv){

// Colour code based on whether this is their Morning, Afternoon, or Night Location

if (npc.MorningLocation   === Ref.locationLabel.textContent &&
npc.AfternoonLocation === Ref.locationLabel.textContent &&
npc.NightLocation     === Ref.locationLabel.textContent) {

npcNameDiv.classList.add('Always');

this.AlwaysNPCs.push(npcNameDiv);

} else if (npc.MorningLocation === Ref.locationLabel.textContent) {

npcNameDiv.classList.add('Morning');
this.MorningNPCs.push(npcNameDiv);

} else if (npc.AfternoonLocation === Ref.locationLabel.textContent) {

npcNameDiv.classList.add('Afternoon');
this.AfternoonNPCs.push(npcNameDiv);

} else if (npc.NightLocation === Ref.locationLabel.textContent) {

npcNameDiv.classList.add('Night');
this.NightNPCs.push(npcNameDiv);

} else {

npcNameDiv.classList.add('npc-name'); // Add a class for styling
this.otherNPCs.push(npcNameDiv);

}

},

fillNPCForm: function(npc, npcNameDiv){

// Add click event listener to each NPC name
npcNameDiv.addEventListener('click', () => {

console.log(npc)

Ref.npcName.value = npc.name;
Ref.npcOccupation.value = npc.occupation;

Ref.MorningLocation.value = npc.MorningLocation;
Ref.MorningActivity.value = npc.MorningActivity;

Ref.AfternoonLocation.value = npc.AfternoonLocation;
Ref.AfternoonActivity.value = npc.AfternoonActivity;

Ref.NightLocation.value = npc.NightLocation;
Ref.NightActivity.value = npc.NightActivity;

Ref.npcLevel.value = npc.level;
Ref.npcClass.value = npc.class;

Ref.STR.value = npc.str;  
Ref.DEX.value = npc.dex; 
Ref.INT.value = npc.int; 
Ref.WIS.value = npc.wis; 
Ref.CON.value = npc.con; 
Ref.CHA.value = npc.cha; 

Ref.Backstory.value = npc.Backstory;

Ref.npcForm.style.display = 'flex'; // Display the npcForm
});

},

saveNPC: function() {

//if not empty

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

Backstory: Ref.Backstory.value,
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

clearForm: function(form){

const inputFields = form.querySelectorAll('input, textarea, select'); 
inputFields.forEach(formElement => {
if (formElement.tagName === 'SELECT') {
// For select elements, set the selected index to -1 to clear the selection
formElement.selectedIndex = -1;
} else {
formElement.value = ''; 
}
});

Array.generateLocationOptions();

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
${npc.occupation} is here. </span> <br>  <span class="hotpink"> (${npc.name}) </span>`

if (phaseName === 'Morning' && npc.MorningLocation === locationName && npc.MorningActivity && npc.MorningActivity !== "undefined") {
story += `   is currently ${npc.MorningActivity} \n`;
}

if (phaseName === 'Afternoon'  && npc.AfternoonLocation === locationName && npc.AfternoonActivity && npc.AfternoonActivity !== "undefined") {
story += `   is currently ${npc.AfternoonActivity} \n`;
}

if (phaseName === 'Night'  && npc.NightLocation === locationName && npc.NightActivity && npc.NightActivity !== "undefined") {
story += `   is currently ${npc.NightActivity} \n`;
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
let npcContent = `<hr><h3><span class="cyan">${foundNPC.name}</span></h3>`;

if (foundNPC.occupation && foundNPC.occupation !== "undefined") {
npcContent += `${foundNPC.occupation}.<br><br>`;
}

if (foundNPC.class && foundNPC.class !== "N/A") {
npcContent += `<span class="cyan">Level ${foundNPC.level} ${foundNPC.class.toUpperCase()}</span><br>`;
}

if (foundNPC.str) {
npcContent += `<br>
<span class="hotpink"> STR: </span> ${foundNPC.str} <br>
<span class="hotpink"> DEX: </span> ${foundNPC.dex} <br>
<span class="hotpink"> INT: </span> ${foundNPC.int} <br>
<span class="hotpink"> WIS: </span> ${foundNPC.wis} <br>
<span class="hotpink"> CON: </span> ${foundNPC.con} <br>
<span class="hotpink"> CHA: </span> ${foundNPC.cha} <br>
`
}

//need to run through getMonsters and getItems
if (foundNPC.Backstory && foundNPC.Backstory !== "undefined") {
npcContent += `<br><br><span class="withbreak">${Monsters.getMonsters(Items.getItems(foundNPC.Backstory))}</span>`;
}


if (foundNPC.MorningLocation) {
npcContent += `<br><br>
In the morning they can be found at
<span class="lime">[${foundNPC.MorningLocation}]</span>,
${foundNPC.MorningActivity}`;
}

if (foundNPC.AfternoonLocation) {
npcContent += `<br><br>
In the afternoon they can be found at <span class="orange">
[${foundNPC.AfternoonLocation}]</span>,
${foundNPC.AfternoonActivity}`;
}

if (foundNPC.NightLocation) {
npcContent += `<br><br>
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

addNPCSearch: function(){

Ref.npcName.addEventListener('input', (event) => {
let searchText = event.target.value.toLowerCase();

// Check if the searchText contains '{'
if (searchText.includes('{')) {
// Remove '{' from the searchText
searchText = searchText.replace('{', '');

// Call the searchNPC function
this.searchNPC(searchText);
}
});

},

searchNPC: function(searchText){

this.npcSearchArray = [];

this.npcSearchArray = this.npcArray.filter((npc) => {
const npcName = npc.name.toLowerCase();
const npcOccupation = npc.occupation.toLowerCase();

// Check if either the name or occupation contains the search text
return npcName.includes(searchText.toLowerCase()) || npcOccupation.includes(searchText.toLowerCase());
});

this.loadNPC(this.npcSearchArray);

},

fixDisplay: function(){

const imageContainer = document.querySelector('.image-container');
const radiantDisplay = document.getElementById('radiantDisplay');

try{

if (Edit.editPage === 2 | Edit.editPage === 3 | Edit.editPage === 4 | Edit.editPage === 5) {
imageContainer.style.width = "45vw";
radiantDisplay.style.width = "45vw";
Ref.itemList.style.display = "block";
} else {
imageContainer.style.width = "70vw";
radiantDisplay.style.width = "70vw";
Ref.itemList.style.display = "none";
}

}catch{}

}

};

// Export the NPCs module
export default NPCs;
