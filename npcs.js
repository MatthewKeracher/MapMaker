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
namedNPCs: [],
groupedNPCs : [],
absentNPCs: [],

loadNPC: function(NPCArray) {

const itemList = document.getElementById('itemList'); // Do not delete!!

// Clear the existing content
itemList.innerHTML = '';
this.namedNPCs = [];
this.groupedNPCs = [];
this.absentNPCs = [];

for (const npc of NPCArray) {
const npcNameDiv = document.createElement('div'); 
npcNameDiv.id = npc.name;          
this.sortNPCs(npc, npcNameDiv);
this.fillNPCForm(npc, npcNameDiv);
}

// Add <hr> between namedNPCs and groupedNPCs if arrays are not empty
if (this.namedNPCs.length > 0) {
  this.namedNPCs.push(document.createElement('hr'));
}
if (this.groupedNPCs.length > 0) {
  this.groupedNPCs.push(document.createElement('hr'));
}

// Concatenate arrays in desired order
const sortedNPCs = [...this.namedNPCs, ...this.groupedNPCs, ...this.absentNPCs];

// Append sorted divs to the itemList
sortedNPCs.forEach(npcDiv => {
itemList.appendChild(npcDiv);

//show NPC info in ExtraInfo2 when hover over Div
npcDiv.addEventListener('mouseover', () => {
  //Ref.eventManagerInput.value = event.event;
  // console.log(npcDiv.id)
  Ref.extraInfo2.classList.add('showExtraInfo');
  this.addNPCInfo(npcDiv.id);
  });

});

itemList.style.display = 'block'; // Display the NPC names container
Ref.extraInfo.classList.remove('showExtraInfo');

},

sortNPCs: function(npc, npcNameDiv) {
  const currentLocation = Ref.locationLabel.textContent;
  
  // Array to track unique NPC names
  const uniqueNames = [];

  // Filter eventsArray based on currentLocation
const sortEvents = Events.eventsArray.filter(event => {
  if (event.target === 'NPC' && event.active === 1) {
    const locations = event.location ? event.location.split(',').map(item => item.trim()) : [];
    return locations.includes(currentLocation);
  }
  return false; // If event.target is not 'NPC', filter it out
});

  // Check if npc.name matches event.npc for each event
  sortEvents.forEach(event => {
    if (npc.name === event.npc && !uniqueNames.includes(npc.name)) {
      npcNameDiv.innerHTML = `<span class = "lime"> [${event.event}] </span>  <span class = "white"> ${npc.name} </span>` ;
      this.namedNPCs.push(npcNameDiv);

      // Add the name to the array to mark it as processed
      uniqueNames.push(npc.name);
    } else {
      // Handle the case when npc.name doesn't match or it's already processed
    }
  });

// Check if npc.occupation matches event.npc for each event
sortEvents.forEach(event => {
  const occupations = npc.occupation ? npc.occupation.split(',').map(item => item.trim()) : [];

  if (occupations.includes(event.npc) && !uniqueNames.includes(npc.name)) {
    npcNameDiv.innerHTML = `<span class = "misc"> [${event.event}] </span> <span class = "white"> ${npc.name} </span>` ;
    this.groupedNPCs.push(npcNameDiv);

    // Add the name to the array to mark it as processed
    uniqueNames.push(npc.name);
  } else {
    // Handle the case when npc.occupation doesn't match or it's already processed
  }
});

// Check if npc is not included in namedNPCs, add with class npc-name to absentNPCs
if (!uniqueNames.includes(npc.name)) {
  npcNameDiv.innerHTML = ` ${npc.name}` ;
  this.absentNPCs.push(npcNameDiv);
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


getNPCs(locationName) {
  const presentNPCs = [];

  //Figure out who is 'free', who is 'doing something,' and who has a scheduling conflict.


  for (const npc of NPCs.npcArray) {
    for (const event of Events.eventsArray) {
  
      if (
        (npc.name === event.npc || 
          (npc.occupation && npc.occupation.split(',').map(item => item.trim()).includes(event.npc))) &&
        event.active === 1 &&
        event.target === 'NPC' &&
        event.location === locationName
      ) {
        const npcStory = this.generateNPCStory(npc, locationName);
        presentNPCs.push({ name: npc.name, story: npcStory });
      }
    }
  }
  
  return presentNPCs;

 
},


generateNPCStory(npc, locationName) {
let story = `<br>`;

//Search active events to see if any apply based on the location, or the individual. 

const presentNPCEvents = Events.eventsArray.filter(event => 
  (event.npc === npc.name || 
    event.npc === 'All' || 
    (npc.occupation && npc.occupation.split(',').map(item => item.trim()).includes(event.npc))
  ) &&
  (event.target === 'NPC' && event.active === 1 && npc.occupation !== '') &&
  (event.location === locationName || 
    (event.location === 'All')
  )
);

let relevantTag = ''; // Variable to store the relevant part of npc.occupation

if (presentNPCEvents.length > 0) {
  // Find the first matching item.trim() in npc.occupation
  const matchingItem = npc.occupation.split(',').map(item => item.trim()).find(item => presentNPCEvents.some(event => event.npc === item));

  if (matchingItem) {
    relevantTag = matchingItem;
  }
}

story += `<span class="expandable npc" data-content-type="npc" divId="${npc.name.replace(/\s+/g, '-')}">
${npc.name} is here. </span> <br>  <span class="hotpink"> (${relevantTag}) </span>`;

  

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

addNPCInfo(npcName, target) {
const extraContent = document.getElementById('extraContent');

let targetLocation = '';

if(target === 'ExtraContent'){
targetLocation = Ref.extraContent
} else {
targetLocation = Ref.extraContent2
}

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
targetLocation.innerHTML = npcContent;

} else {
// NPC not found
targetLocation.innerHTML = `NPC not found`;
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

Ref.npcName.addEventListener('click', (event) => {
Ref.extraInfo.classList.remove('showExtraInfo');
this.loadNPC(NPCs.npcArray);
});

},

searchNPC: function(searchText) {
  this.npcSearchArray = [];

  this.npcSearchArray = this.npcArray.filter((npc) => {
    const npcName = npc.name.toLowerCase();
    const npcOccupation = npc.occupation.toLowerCase();

    // Split the occupation string into an array of words
    const occupationWords = npcOccupation.split(',').map(word => word.trim());

    // Check if either the name or any occupation word contains the search text
    return npcName.includes(searchText.toLowerCase()) || occupationWords.some(word => word.includes(searchText.toLowerCase()));
  });

  this.loadNPC(this.npcSearchArray);
},


fixDisplay: function(){

const imageContainer = document.querySelector('.image-container');
const radiantDisplay = document.getElementById('radiantDisplay');

try{

// if (Edit.editPage === 2 | Edit.editPage === 3 | Edit.editPage === 4 | Edit.editPage === 5 | Edit.editPage === 6) {
// imageContainer.style.width = "45vw";
// radiantDisplay.style.width = "45vw";
// Ref.itemList.style.display = "block";
// } else {
// imageContainer.style.width = "70vw";
// radiantDisplay.style.width = "70vw";
// Ref.itemList.style.display = "none";
// }

}catch{}

}

};

// Export the NPCs module
export default NPCs;
