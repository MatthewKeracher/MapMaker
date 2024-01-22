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

  //console.log('calling buildNPC()')

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
  this.addNPCInfo(npcDiv.id, Ref.extraInfo2);
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

//console.log(npc)

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

if (existingNPCIndex !== -1 && Ref.npcName.value !== '') {
// Update the existing NPC entry
this.npcArray[existingNPCIndex] = npc;
console.log('NPC updated:', npc);
} 

else if (Ref.npcName.value === '' && Ref.npcTags !== ''){
console.log('Add ' + Ref.npcTags.value + ' to all Selected NPC Tags')
this.bulkAddTag(Ref.npcTags.value)
} 

else {
// Add the created NPC to the npcArray
this.npcArray.push(npc);
//console.log('New NPC added:', npc);
}

},

bulkAddTag(npcTags){

  // Iterate over itemsSearchArray and update Tags
  this.npcSearchArray.forEach(npc => {
    if (npc.occupation) {
      // Split existing Tags into an array
      const existingTags = npc.occupation.split(',').map(tag => tag.trim());
  
      // Check if the new tag is not already present
      if (!existingTags.includes(npcTags)) {
        // If not present, append the new tag value
        npc.occupation += `, ${npcTags}`;
      }
    } else {
      // If Tags is empty, set it to the new tag value
      npc.occupation = npcTags;
    }
  });

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

getNPCs(subLocation, Location) {
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
event.location === subLocation) {
const npcStory = this.generateNPCStory(npc, subLocation);
presentNPCsSet.add(JSON.stringify({ name: npc.name, story: npcStory }));
}

}}

// Convert the set back to an array
const presentNPCs = [...presentNPCsSet].map(JSON.parse);

return presentNPCs;
},

generateNPCStory(npc, locationName) {
let story = ``;

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

const findNPC = npcName.replace(/-/g, ' ');
const foundNPC = NPCs.npcArray.find(npc => npc.name === findNPC);

if (foundNPC) {

let npcContent = `<h2><span class="cyan">${foundNPC.name}</span><br></h2>`;

if (foundNPC.occupation && foundNPC.occupation !== "undefined") {
npcContent += `<h3><span class="hotpink">${foundNPC.occupation}.</span></h3>`;
}

if (foundNPC.Backstory && foundNPC.Backstory !== "undefined") {
  npcContent += `<h3><hr><span class="lime">Backstory:</span></h3>
  <span class="withbreak">${Spells.getSpells(Monsters.getMonsters(Items.getItems(Storyteller.getQuotes(foundNPC.Backstory))))}</span>`;
}

if (foundNPC.class && foundNPC.class !== "N/A") {

npcContent += `<hr><h3>
<span class="expandable cyan" data-content-type="rule" divId="${foundNPC.class}">

Level ${foundNPC.level} ${foundNPC.class.toUpperCase()}

</span></h3>

<h3><span class="expandable hotpink" data-content-type="rule" divId="Hit Points">HIT POINTS: </span> ${foundNPC.hitPoints} <br>
<span class="expandable lime" data-content-type="rule" divId="Attack Bonus">ATTACK BONUS: </span> +${foundNPC.attackBonus}</h3>`;

}

if (foundNPC.str) {
npcContent += `<h2>
<span class="expandable misc" data-content-type="rule" divId="Strength"> STR: </span> ${foundNPC.str}  (${foundNPC.strMod}) <br>
<span class="expandable misc" data-content-type="rule" divId="Dexterity"> DEX: </span> ${foundNPC.dex}  (${foundNPC.dexMod})<br>
<span class="expandable misc" data-content-type="rule" divId="Intelligence"> INT: </span> ${foundNPC.int}  (${foundNPC.intMod})<br>
<span class="expandable misc" data-content-type="rule" divId="Wisdom"> WIS: </span> ${foundNPC.wis}  (${foundNPC.wisMod})<br>
<span class="expandable misc" data-content-type="rule" divId="Constitution"> CON: </span> ${foundNPC.con}  (${foundNPC.conMod})<br>
<span class="expandable misc" data-content-type="rule" divId="Charisma"> CHA: </span> ${foundNPC.cha}  (${foundNPC.chaMod})</h2>
`
}

if (foundNPC.Skills){

  npcContent +=
  `<hr><h3>
  <span class="expandable cyan" 
   data-content-type="rule"

   divId="${foundNPC.class === 'Cleric'? `Turn Undead` : `${foundNPC.class} Skills`}">
          ${foundNPC.class === 'Cleric'? `Turn Undead` : `${foundNPC.class} Skills`}:</span> <br><br>` +

  // Skills common to multiple classes
  `${foundNPC.Skills.removeTraps ? `<span class="orange">Remove Traps</span> ${foundNPC.Skills.removeTraps}<br>` : ''}` +
  `${foundNPC.Skills.pickPockets ? `<span class="orange">Pick Pockets</span> ${foundNPC.Skills.pickPockets}<br>` : ''}` +
  `${foundNPC.Skills.moveSilently ? `<span class="orange">Move Silently</span> ${foundNPC.Skills.moveSilently}<br>` : ''}` +
  `${foundNPC.Skills.climbWalls ? `<span class="orange">Climb Walls</span> ${foundNPC.Skills.climbWalls}<br>` : ''}` +
  `${foundNPC.Skills.hide ? `<span class="orange">Hide</span> ${foundNPC.Skills.hide}<br>` : ''}` +
  `${foundNPC.Skills.listen ? `<span class="orange">Listen</span> ${foundNPC.Skills.listen}<br>` : ''}` +
  `${foundNPC.Skills.poison ? `<span class="orange">Poison</span> ${foundNPC.Skills.poison}<br>` : ''}` +
  `${foundNPC.Skills.tracking ? `<span class="orange">Tracking</span> ${foundNPC.Skills.tracking}<br>` : ''}`

// Cleric-specific skills
if(foundNPC.class === 'Cleric'){

npcContent+= 

`${foundNPC.Skills.Skeleton && foundNPC.Skills.Skeleton === 'Damaged'? `<span class="orange">Skeleton</span> Takes ${foundNPC.level}d8 Damage </span><br>` : 
foundNPC.Skills.Skeleton && foundNPC.Skills.Skeleton !== 'Damaged' && foundNPC.Skills.Skeleton !== 'No' ? `<span class="orange">Skeleton</span> ${foundNPC.Skills.Skeleton}<br>` :
''}` +

`${foundNPC.Skills.Zombie && foundNPC.Skills.Zombie === 'Damaged'? `<span class="orange">Zombie</span> Takes ${foundNPC.level}d8 Damage </span><br>` : 
foundNPC.Skills.Zombie && foundNPC.Skills.Zombie !== 'Damaged' && foundNPC.Skills.Zombie !== 'No' ? `<span class="orange">Zombie</span> ${foundNPC.Skills.Zombie}<br>` :
''}` +

`${foundNPC.Skills.Ghoul && foundNPC.Skills.Ghoul === 'Damaged'? `<span class="orange">Ghoul</span> Takes ${foundNPC.level}d8 Damage </span><br>` : 
foundNPC.Skills.Ghoul && foundNPC.Skills.Ghoul !== 'Damaged' && foundNPC.Skills.Ghoul !== 'No' ? `<span class="orange">Ghoul</span> ${foundNPC.Skills.Ghoul}<br>` :
''}` +

`${foundNPC.Skills.Wight && foundNPC.Skills.Wight === 'Damaged'? `<span class="orange">Wight</span> Takes ${foundNPC.level}d8 Damage </span><br>` : 
foundNPC.Skills.Wight && foundNPC.Skills.Wight !== 'Damaged' && foundNPC.Skills.Wight !== 'No' ? `<span class="orange">Wight</span> ${foundNPC.Skills.Wight}<br>` :
''}` +

`${foundNPC.Skills.Wraith && foundNPC.Skills.Wraith === 'Damaged'? `<span class="orange">Wraith</span> Takes ${foundNPC.level}d8 Damage </span><br>` : 
foundNPC.Skills.Wraith && foundNPC.Skills.Wraith !== 'Damaged' && foundNPC.Skills.Wraith !== 'No' ? `<span class="orange">Wraith</span> ${foundNPC.Skills.Wraith}<br>` :
''}` +

`${foundNPC.Skills.Mummy && foundNPC.Skills.Mummy === 'Damaged'? `<span class="orange">Mummy</span> Takes ${foundNPC.level}d8 Damage </span><br>` : 
foundNPC.Skills.Mummy && foundNPC.Skills.Mummy !== 'Damaged' && foundNPC.Skills.Mummy !== 'No' ? `<span class="orange">Mummy</span> ${foundNPC.Skills.Mummy}<br>` :
''}` +

`${foundNPC.Skills.Spectre && foundNPC.Skills.Spectre === 'Damaged'? `<span class="orange">Spectre</span> Takes ${foundNPC.level}d8 Damage </span><br>` : 
foundNPC.Skills.Spectre && foundNPC.Skills.Spectre !== 'Damaged' && foundNPC.Skills.Spectre !== 'No' ? `<span class="orange">Spectre</span> ${foundNPC.Skills.Spectre}<br>` :
''}` +

`${foundNPC.Skills.Vampire && foundNPC.Skills.Vampire === 'Damaged'? `<span class="orange">Vampire</span> Takes ${foundNPC.level}d8 Damage </span><br>` : 
foundNPC.Skills.Vampire && foundNPC.Skills.Vampire !== 'Damaged' && foundNPC.Skills.Vampire !== 'No' ? `<span class="orange">Vampire</span> ${foundNPC.Skills.Vampire}<br>` :
''}` +

`${foundNPC.Skills.Ghost && foundNPC.Skills.Ghost === 'Damaged'? `<span class="orange">Ghost</span> Takes ${foundNPC.level}d8 Damage </span><br>` : 
foundNPC.Skills.Ghost && foundNPC.Skills.Ghost !== 'Damaged' && foundNPC.Skills.Ghost !== 'No' ? `<span class="orange">Ghost</span> ${foundNPC.Skills.Ghost}<br>` :
''}` 

} 

npcContent+= `</h3>`;

}

if (foundNPC.magic){
npcContent += `<hr><h3><span class="withbreak">${Spells.getSpells(Monsters.getMonsters(Items.getItems(foundNPC.magic)))}</span></h3>`;
}


if (foundNPC.inventory) {
  let previousTag = '';

  const inventoryItems = foundNPC.inventory.map(item => {
    const tagToDisplay = item.Tag !== previousTag ? `<br><span class = "hotpink">${item.Tag}:</span> <br>` : '';
    previousTag = item.Tag;
    return `${tagToDisplay}#${item.Name}# <br>`;
  });

  const formattedInventory = inventoryItems.join('');

  npcContent += `<hr><h3><span class ="cyan">Inventory:</span><br>
  <span class="withbreak">${Spells.getSpells(Monsters.getMonsters(Items.getItems(formattedInventory)))}</span></h3>`;
}

if (foundNPC.savingThrows){

  npcContent +=
  `<hr><h3>
  <span class="expandable cyan" 
   data-content-type="rule"

   divId="Saving Throws">
          Saving Throws:</span> <br><br>` +

  // savingThrows common to multiple classes
  `${foundNPC.savingThrows.deathRay ? `<span class="orange">Death Ray</span> ${foundNPC.savingThrows.deathRay}<br>` : ''}` +
  `${foundNPC.savingThrows.magicWands ? `<span class="orange">Magic Wands</span> ${foundNPC.savingThrows.magicWands}<br>` : ''}` +
  `${foundNPC.savingThrows.paralysisPetrify ? `<span class="orange">Paralysis & Petrify</span> ${foundNPC.savingThrows.paralysisPetrify}<br>` : ''}` +
  `${foundNPC.savingThrows.dragonBreath ? `<span class="orange">Dragon Breath</span> ${foundNPC.savingThrows.dragonBreath}<br>` : ''}` +
  `${foundNPC.savingThrows.spells ? `<span class="orange">Spells</span> ${foundNPC.savingThrows.spells}<br>` : ''}` 

}

target.innerHTML = npcContent;
} else {
target.innerHTML = `NPC not found`;
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


