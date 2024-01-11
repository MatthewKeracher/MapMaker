// Import the necessary module
import Edit from "./edit.js";
import Array from "./array.js";
import Ref from "./ref.js";
import Items from "./items.js";
import Monsters from "./monsters.js";
import Spells from "./spells.js";
import Events from "./events.js";

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
npcNameDiv.textContent = ' [' + npc.occupation + ']  ' + npc.name ;            

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

if(Edit.editPage === 3){

Ref.npcForm.style.display = 'flex'; // Display the npcForm

console.log(npc)

Ref.npcName.value = npc.name;
Ref.npcTags.value = npc.occupation;

Ref.MorningLocation.value = npc.MorningLocation;

Ref.npcLevel.value = npc.level;
Ref.npcClass.value = npc.class;

Ref.STR.value = npc.str;  
Ref.DEX.value = npc.dex; 
Ref.INT.value = npc.int; 
Ref.WIS.value = npc.wis; 
Ref.CON.value = npc.con; 
Ref.CHA.value = npc.cha; 

Ref.Backstory.value = npc.Backstory;
}else{

Ref.eventNPC.value = npc.name


}

});

},

saveNPC: function() {

//if not empty

// Check if an NPC with the same name already exists
const existingNPCIndex = this.npcArray.findIndex(npc => npc.name === Ref.npcName.value);
console.log(Ref.npcName.value)
const npc = {
name: Ref.npcName.value,
occupation: Ref.npcTags.value,

MorningLocation: Ref.MorningLocation.value,


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

generateNPCStory(npc, locationName) {
let story = `<br>`;

story += `<span class="expandable npc" data-content-type="npc" divId="${npc.name.replace(/\s+/g, '-')}">
${npc.occupation} is here. </span> <br>  <span class="hotpink"> (${npc.name}) </span>`

//Search active events to see if any apply based on the location, or the individual. 

const presentNPCEvents = Events.eventsArray.filter(event => 
    (event.npc === npc.name || event.npc === 'All' || event.npc === npc.occupation) && (event.active === 1)
  );
  

//console.log(locationEvents)
//console.log(presentNPCEvents)

// for (const event of locationEvents) {
// story += `<span class = "misc"> ${event.description} </span> \n`;
// }

for (const event of presentNPCEvents) {
story += `${event.description} \n`;
}

//console.log(story)
return story;
},

getNPCSpells(cleric, level){

const filteredSpells = Spells.spellsArray.filter(spell => spell.Level <= level && spell.Class === cleric);

console.log(filteredSpells);

return filteredSpells

},

getRandomItem(itemsArray) {
    if (itemsArray.length > 0) {
      const randomIndex = Math.floor(Math.random() * itemsArray.length);
      return itemsArray[randomIndex];
    } else {
      console.log("No items found.");
      return null;
    }
  },



addNPCInfo(npcName) {
const extraContent = document.getElementById('extraContent');

// Search for the NPC in the npcArray
const findNPC = npcName.replace(/-/g, ' ');
const foundNPC = NPCs.npcArray.find(npc => npc.name === findNPC);

if (foundNPC) {
//console.log(foundNPC);
// Format the NPC information into npcContent
let npcContent = `<h3><span class="cyan">${foundNPC.name}</span></h3>`;

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
//want to put in Backstory as hover for extraextra
if (foundNPC.Backstory && foundNPC.Backstory !== "undefined") {
    npcContent += `<br><br><span class="withbreak">${Spells.getSpells(Monsters.getMonsters(Items.getItems(foundNPC.Backstory)))}</span>`;
    }

//RANDOM SPELLS FOR NPCS ------>

//Need to filter by CLASS and LEVEL

console.log(foundNPC.class + ' ' + foundNPC.level)

const knownSpells = this.getNPCSpells(foundNPC.class, foundNPC.level)

let magic = ``;
let level = 0

for (let i = 0; i < knownSpells.length; i++) {
  const spell = knownSpells[i]
  const newLevel = knownSpells[i].Level

if (newLevel > level) {

  magic += `<br> LEVEL ${newLevel} SPELLS <br> ~${spell.Name}~ <br>`;
  level = newLevel;

} else {

  magic += `~${spell.Name}~ <br>`;

}

}

npcContent += `<br><span class="withbreak">${Spells.getSpells(Monsters.getMonsters(Items.getItems(magic)))}</span>`;

//RANDOM ITEMS FOR NPCS ----->

const randomItemsLoop = 5; // Change this to the desired number of times

let loot = `<br> ${foundNPC.name} has nearby: <br><br>`;

for (let i = 0; i < randomItemsLoop; i++) {
  const randomItem = this.getRandomItem(Items.itemsArray);
  if (randomItem) {
    loot += `#${randomItem.Name}# <br>`;
  }
}

npcContent += `<br><span class="withbreak">${Spells.getSpells(Monsters.getMonsters(Items.getItems(loot)))}</span>`;

//RANDOM GARB OUTFITTER FOR NPCS ---->

let garb = `<br> ${foundNPC.name} is wearing: <br><br>`

const typesToSearch = [
    'Head Garb', 
    'Body Garb', 
    'Hand Garb', 
    'Garb' , 
    'Leg Garb',
    'Over Garb',
    'Under Garb',
    'Whole Garb',
    'Winter Foot Garb',
    'Winter Hand Garb' ];
    
    for (const type of typesToSearch) {
      const filteredItems = Items.itemsArray.filter(item => item.Type === type);
    
      if (filteredItems.length > 0) {
        const randomIndex = Math.floor(Math.random() * filteredItems.length);
        const selectedItem = filteredItems[randomIndex];
        //console.log(`${type}:`, selectedItem.Name);
        garb += `#${selectedItem.Name}# <br>`;
      } else {
        console.log(`No matching items found for ${type}.`);
      }
    }
      
      
npcContent += `<br><span class="withbreak">${Spells.getSpells(Monsters.getMonsters(Items.getItems(garb)))}</span>`;


// if (foundNPC.MorningLocation) {
// npcContent += `<br><br>
// They can always be found at 
// <span class="lime">[${foundNPC.MorningLocation}]</span>`;
// }


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

if (Edit.editPage === 2 | Edit.editPage === 3 | Edit.editPage === 4 | Edit.editPage === 5 | Edit.editPage === 6) {
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
