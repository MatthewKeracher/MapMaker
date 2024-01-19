// Import the necessary module
import Edit from "./edit.js";
import Array from "./array.js";
import Ref from "./ref.js";
import Items from "./items.js";
import Monsters from "./monsters.js";
import Spells from "./spells.js";
import Events from "./events.js";
import Storyteller from "./storyteller.js";
import NPCbuild from "./classes.js";


// Define the NPCs module
const NPCs = {
npcArray: [],
npcSearchArray:[],
namedNPCs: [],
groupedNPCs : [],
absentNPCs: [],



loadAndBuild: async function(fileContent) {
  try {
      // Wait for the handleFileLoad to complete
      await Array.handleFileLoad(fileContent);

      // Now you can call buildNPC safely
      await this.buildNPC();
  } catch (error) {
      console.error('Error loading file and building NPC:', error);
  }
},

buildNPC: function() {

  console.log('calling buildNPC()')

  const npcInstances = NPCs.npcArray.map(npcData => new NPCbuild(npcData));
          
  // Now npcInstances is an array of NPC objects with the data from npcArray
  // You can store or use these instances as needed.
  NPCs.npcArray = npcInstances;
  
  // For example, you can log the properties of each NPC instance
  //npcInstances.forEach(npc => console.log(npc));

},

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

//Ref.MorningLocation.value = npc.MorningLocation;

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
// MorningLocation: Ref.MorningLocation.value,
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
  const presentNPCsSet = new Set();

  for (const npc of NPCs.npcArray) {
    for (const event of Events.eventsArray) {

      const eventNpcList = event.npc.split(',').map(item => item.trim());
      const npcOccupationList = npc.occupation.split(',').map(item => item.trim());

const npcNameMatches = npc.name === event.npc;
const npcInEventList = eventNpcList.includes(npc.name);
const eventInOccupationList = npcOccupationList.includes(event.npc);
const commonElementExists = npc.occupation && event.npc && eventNpcList.some(tag => npcOccupationList.includes(tag));

if ((npcNameMatches || npcInEventList || eventInOccupationList || commonElementExists) &&
    event.active === 1 &&
    event.target === 'NPC' &&
    event.location === locationName) {
    const npcStory = this.generateNPCStory(npc, locationName);
    presentNPCsSet.add(JSON.stringify({ name: npc.name, story: npcStory }));
}

}}

  // Convert the set back to an array
  const presentNPCs = [...presentNPCsSet].map(JSON.parse);

  return presentNPCs;
},

generateNPCStory(npc, locationName) {
let story = `<br>`;

//Search active events to see if any apply based on the location, or the individual. 

const presentNPCEvents = Events.eventsArray.filter(event => {
  const eventNpcList = event.npc.split(',').map(item => item.trim());
  const npcOccupationList = npc.occupation.split(',').map(item => item.trim());

  const npcNameMatches = npc.name === event.npc;
  const npcInEventList = eventNpcList.includes(npc.name);
  const eventInOccupationList = npcOccupationList.includes(event.npc);
  const commonElementExists = npc.occupation && event.npc && eventNpcList.some(tag => npcOccupationList.includes(tag));

  return (
    (npcNameMatches || npcInEventList || eventInOccupationList || commonElementExists) &&
    event.target === 'NPC' &&
    event.active === 1 &&
    npc.occupation !== '' &&
    (event.location === locationName || event.location === 'All')
  );
});


let relevantTag = ''; // Variable to store the relevant part of npc.occupation

if (presentNPCEvents.length > 0) {
  // Find the first matching item.trim() in npc.occupation
  const matchingItem = npc.occupation.split(',').map(item => item.trim()).find(item => presentNPCEvents.some(event => event.npc === item));

  if (matchingItem) {
    relevantTag = matchingItem;
  } else {relevantTag = npc.class} 
}

story += `<span class="expandable npc" data-content-type="npc" divId="${npc.name.replace(/\s+/g, '-')}">
${npc.name} is here. </span> <br>`;

  

//console.log(locationEvents)
//console.log(presentNPCEvents)

// for (const event of locationEvents) {
// story += `<span class = "misc"> ${event.description} </span> \n`;
// }



for (const event of presentNPCEvents) {
  // Define eventNpcList and npcOccupationList within the loop
  const eventNpcList = event.npc.split(',').map(item => item.trim());
  const npcOccupationList = npc.occupation.split(',').map(item => item.trim());

  const sharedTag = event.npc && eventNpcList.find(tag => npcOccupationList.includes(tag));

  if (sharedTag) {
    story += `<span class="hotpink">${sharedTag}. </span>`;
  }

  story += `${event.description} \n`;
}



//console.log(story)
return story;
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
let npcContent = `<h2><span class="cyan">${foundNPC.name}</span><br></h2>`;

if (foundNPC.occupation && foundNPC.occupation !== "undefined") {
npcContent += `<h3><span class="hotpink">${foundNPC.occupation}.</span><hr>`;
}

if (foundNPC.Backstory && foundNPC.Backstory !== "undefined") {
  npcContent += `<span class="lime">Backstory:</span><br><br>
  <span class="withbreak">${Spells.getSpells(Monsters.getMonsters(Items.getItems(Storyteller.getQuotes(foundNPC.Backstory))))}</span>`;
}

if (foundNPC.class && foundNPC.class !== "N/A") {
npcContent += `<hr><span class="cyan">Level ${foundNPC.level} ${foundNPC.class.toUpperCase()}</span></h3>
<h3><span class="hotpink"> HIT POINTS: </span> ${foundNPC.hitPoints}</h3>`;
}


if (foundNPC.str) {
npcContent += `<h2>
<span class="misc"> STR: </span> ${foundNPC.str} <br>
<span class="misc"> DEX: </span> ${foundNPC.dex} <br>
<span class="misc"> INT: </span> ${foundNPC.int} <br>
<span class="misc"> WIS: </span> ${foundNPC.wis} <br>
<span class="misc"> CON: </span> ${foundNPC.con} <br>
<span class="misc"> CHA: </span> ${foundNPC.cha} </h2>
`
}

if (foundNPC.magic){
npcContent += `<hr><h3><span class="withbreak">${Spells.getSpells(Monsters.getMonsters(Items.getItems(foundNPC.magic)))}</span></h3>`;
}

if (foundNPC.thiefSkills){
  npcContent += `<hr><h3><span class="withbreak">
  <span class = "orange"> Remove Traps </span> ${foundNPC.thiefSkills.removeTraps} <br>
  <span class = "orange"> Pick Pockets </span> ${foundNPC.thiefSkills.pickPockets} <br>
  <span class = "orange"> Move Silently </span> ${foundNPC.thiefSkills.moveSilently} <br>
  <span class = "orange"> Climb Walls </span> ${foundNPC.thiefSkills.climbWalls} <br>
  <span class = "orange"> Hide </span> ${foundNPC.thiefSkills.hide} <br>
  <span class = "orange"> Listen </span> ${foundNPC.thiefSkills.listen} <br>
  </span></h3>`;
}

if (foundNPC.inventory) {
  const inventoryItems = foundNPC.inventory.map(item => `#${item}# <br>`);
  const formattedInventory = inventoryItems.join('');

  npcContent += `<hr><h3><span class ="cyan">Inventory:</span><br><br>
  <span class="withbreak">${Spells.getSpells(Monsters.getMonsters(Items.getItems(formattedInventory)))}</span></h3>`;
}









//RANDOM ITEMS FOR NPCS ----->

// const randomItemsLoop = 5; // Change this to the desired number of times

// let loot = `<br> ${foundNPC.name} has nearby: <br><br>`;

// for (let i = 0; i < randomItemsLoop; i++) {
//   const randomItem = this.getRandomItem(Items.itemsArray);
//   if (randomItem) {
//     loot += `#${randomItem.Name}# <br>`;
//   }
// }

//npcContent += `<br><span class="withbreak">${Spells.getSpells(Monsters.getMonsters(Items.getItems(loot)))}</span>`;





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

Ref.npcSearch.addEventListener('input', (event) => {
this.searchNPC();
})


Ref.npcSearch.addEventListener('click', (event) => {
this.searchNPC();
});

},

searchNPC: function() {
  this.npcSearchArray = [];
  let searchText = Ref.npcSearch.value.toLowerCase();

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

};

// Export the NPCs module
export default NPCs;


