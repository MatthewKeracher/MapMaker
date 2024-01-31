import Ref from "./ref.js";
import Array from "./array.js";
import Storyteller from "./storyteller.js";
import NPCs from "./npcs.js";
import Monsters from "./monsters.js";
import Items from "./items.js";
import Events from "./events.js";
import Spells from "./spells.js";

const Edit = {

editMode : false,
moveMode: false,
editPage: 1,
divIds : ['textLocation', 'npcBackStory','ambienceDescription'],

init: function () {
this.divIds.forEach((divId) => {
const divElement = document.getElementById(divId);
if (divElement) {
divElement.addEventListener('input', (event) => {
const text = event.target.value;
const cursorPosition = event.target.selectionStart;
const openBraceIndex = text.lastIndexOf('#', cursorPosition);
const openAsteriskIndex = text.lastIndexOf('*', cursorPosition);
const openTildeIndex = text.lastIndexOf('~', cursorPosition); // Add this line for ~

if (openBraceIndex !== -1 || openAsteriskIndex !== -1 || openTildeIndex !== -1) { // Add openTildeIndex here
let searchText;
let filteredItems;

if (openBraceIndex > openAsteriskIndex && openBraceIndex > openTildeIndex) { // Modify this condition
searchText = text.substring(openBraceIndex + 1, cursorPosition);
filteredItems = Items.itemsArray.filter(item =>
item.Name.toLowerCase().includes(searchText.toLowerCase())
);
} else if (openAsteriskIndex > openBraceIndex && openAsteriskIndex > openTildeIndex) { // Modify this condition
searchText = text.substring(openAsteriskIndex + 1, cursorPosition);
filteredItems = Monsters.monstersArray.filter(monster =>
monster.name.toLowerCase().includes(searchText.toLowerCase())
);
} else {
searchText = text.substring(openTildeIndex + 1, cursorPosition); // Handle ~ case
filteredItems = Spells.spellsArray.filter(spell =>
spell.Name.toLowerCase().includes(searchText.toLowerCase())
);
}

console.log(searchText);

// Show Centre
Ref.Centre.style.display = 'block';
Ref.Centre.innerHTML = ''; // Clear existing content

filteredItems.forEach(item => {
const option = document.createElement('div');
option.textContent = item.Name || item; // Use "Name" property if available
option.addEventListener('click', () => {
const replacement = openBraceIndex !== -1
  ? `#${item.Name}#`
  : openAsteriskIndex !== -1
  ? `*${item.Name}*`
  : openTildeIndex !== -1 // Add this line
  ? `~${item.Name}~` // Add this line
  : ''; // Add this line for ~
  
  const newText = text.substring(
    0,
    openBraceIndex !== -1
      ? openBraceIndex
      : openAsteriskIndex !== -1
      ? openAsteriskIndex
      : openTildeIndex // Add this line for ~
  ) + replacement + text.substring(cursorPosition);
  event.target.value = newText;
  
//Ref.Centre.style.display = 'none'; // Hide Ref.optionsList
});
Ref.Centre.appendChild(option);
});
} else {

}
});
}
});
},

deleteLocation() {
let array;
let id;
let index;

switch (this.editPage) {

    case 2:

      array = Events.eventsArray;
      id = Ref.eventId.value;
      index = array.findIndex(entry => parseInt(entry.id) === parseInt(id));

      if (index !== -1) {
      const confirmation = window.confirm("Are you sure you want to delete " + array[index].name + "?");

      if (confirmation) {
      array.splice(index, 1); 
      Events.loadEventsList(array, Ref.Centre);
      Ref.eventForm.reset();
      }
      }

    break;

    case 3:

      array = NPCs.npcArray;
      id = Ref.npcId.value;
      index = array.findIndex(entry => parseInt(entry.id) === parseInt(id));

      if (index !== -1) {
      const confirmation = window.confirm("Are you sure you want to delete " + array[index].name + "?");

      if (confirmation) {
      array.splice(index, 1); 
      NPCs.loadNPC(array, Ref.Centre);
      Ref.npcForm.reset();
      }
      }

    break;

    case 4:

      array = Monsters.monstersArray;
      id = Ref.monsterId.value;
      index = array.findIndex(entry => parseInt(entry.id) === parseInt(id));

      if (index !== -1) {
      const confirmation = window.confirm("Are you sure you want to delete " + array[index].name + "?");

      if (confirmation) {
      array.splice(index, 1); 
      Monsters.loadMonsterList(array, Ref.Centre);
      Ref.monsterForm.reset();
      }
      }

    break;

    case 5:

    array = Items.itemsArray;
    id = Ref.itemId.value;
    index = array.findIndex(entry => parseInt(entry.id) === parseInt(id));

    if (index !== -1) {
    const confirmation = window.confirm("Are you sure you want to delete " + array[index].name + "?");

    if (confirmation) {
    array.splice(index, 1); 
    Items.loadItemsList(array, Ref.Centre);
    Ref.itemForm.reset();
    }
    }

    break;

    case 6:
    
    array = Spells.spellsArray;
    id = Ref.spellId.value;
    index = array.findIndex(entry => parseInt(entry.id) === parseInt(id));

    if (index !== -1) {
    const confirmation = window.confirm("Are you sure you want to delete " + array[index].name + "?");

    if (confirmation) {
    array.splice(index, 1); 
    Spells.loadSpellsList(array, Ref.Centre);
    Ref.spellsForm.reset();
    }
    }

    break;

    default:
    // For locations.
    const divId = Ref.locationLabel.textContent;
    array = Array.locationArray;
    index = array.findIndex(entry => entry.divId === divId);

    if (index !== -1) {
    const confirmation = window.confirm("Are you sure you want to delete " + array[index].divId + "?");

    if (confirmation) {
    // Remove the entry from locationArray
    array.splice(index, 1);

    // Remove the corresponding <div> element from the DOM
    const divToRemove = document.getElementById(divId);
    if (divToRemove) {
    divToRemove.remove();
    }
    }
    }
    break;
    }
},

// Move a Location -- Unfinished
moveLocation(source,target) {

  if (!Edit.moveMode) {
  
  
  } else {
  
  if (Edit.editMode) { 
  
  const sourceDivId = Ref.locationLabel.textContent;
  
  console.log('Moving ' + targetDivId + ' to ' + sourceDivId)
  
  const sourceEntry = Array.locationArray.find(entry => entry.divId === sourceDivId);
  const targetEntryIndex = Array.locationArray.find(entry => entry.divId === targetDivId);
  
  if (sourceEntry !== -1 && targetEntryIndex !== -1) {
  const sourceEntry = Array.locationArray[sourceEntry];
  const targetEntry = Array.locationArray[targetEntryIndex];
  
  // Copy information from sourceEntry to targetEntry
  targetEntry.description = sourceEntry.description;
  
  
  // Optionally, you can clear the source entry information
  sourceEntry.description = '';
  
  }
  
  editMoveButton.click();
  
  }}},

// Save a Location
saveLocation() {
const divId = Ref.locationLabel.textContent; // Get the divId for the location you're saving

//Find correct place to save...
const matchingEntry = Array.locationArray.find(entry => entry.divId === divId);

if (matchingEntry) {
// Update the corresponding entry in locationArray
console.log(matchingEntry)
matchingEntry.description = Ref.textLocation.value;
matchingEntry.divId = Ref.editLocationName.value;
matchingEntry.tags = Ref.editLocationTags.value;

//Update the Existing Divs
const locationDiv = document.getElementById(divId);
locationDiv.setAttribute('id',Ref.editLocationName.value);
locationDiv.querySelector('.div-id-label').textContent = Ref.editLocationName.value;

//console.log("Updated Entry: " + JSON.stringify(matchingEntry, null, 2));

//Refresh
const savedLocation = document.getElementById(Ref.editLocationName.value);
Storyteller.changeContent(savedLocation);

}

// Update the new location name in npcArray!

for (const npc of NPCs.npcArray) {
if (npc.MorningLocation === divId) {
npc.MorningLocation = Ref.editLocationName.value;
}
if (npc.AfternoonLocation === divId) {
npc.AfternoonLocation = Ref.editLocationName.value;
}
if (npc.NightLocation === divId) {
npc.NightLocation = Ref.editLocationName.value;
}
}



}, 

//Remove or Add editContainer contents depending on editPage no.
pageChange(newPage){


Ref.Centre.innerHTML = ``;
Ref.Centre.classList.remove('showCentre');


switch (newPage) {
case 1:

//Show
Ref.stateLabel.textContent = "editing Location (" + newPage + ")";
Ref.locationGroup.style.display  = "flex";
Ref.textLocation.style.display = "flex";

//Hide

Ref.Centre.style.display = "none";
Ref.Left.classList.remove('showLeft');
Ref.npcForm.style.display = "none";
Ref.monsterForm.style.display = "none";
Ref.itemForm.style.display = "none";
Ref.eventForm.style.display = "none";
Ref.SettingsContainer.style.display = "none";
Ref.spellsForm.style.display = "none";

break;

case 2:
//Show
Ref.stateLabel.textContent = "editing Events (" + newPage + ")";
Ref.eventForm.style.display = "flex";



//Hide

Ref.monsterForm.style.display = "none";
Ref.npcForm.style.display = "none";
Ref.itemForm.style.display = "none";
Ref.locationGroup.style.display  = "none";
Ref.textLocation.style.display = "none";
Ref.SettingsContainer.style.display = "none";
Ref.spellsForm.style.display = "none";

Events.loadEventsList(Events.eventsArray, Ref.Centre);

break;

case 3:
//Show
Ref.stateLabel.textContent = "editing NPCs (" + newPage + ")";
Ref.npcForm.style.display = "flex"


//Hide

Ref.monsterForm.style.display = "none";
Ref.itemForm.style.display = "none";
Ref.locationGroup.style.display  = "none";
Ref.textLocation.style.display = "none";
Ref.eventForm.style.display = "none";
Ref.SettingsContainer.style.display = "none";
Ref.spellsForm.style.display = "none";

NPCs.loadNPC(NPCs.npcArray);

break;

case 4:

//Show
Ref.stateLabel.textContent = "editing Monsters (" + newPage + ")";
Ref.monsterForm.style.display = "flex";


//Hide

Ref.npcForm.style.display = "none"
Ref.itemForm.style.display = "none";
Ref.locationGroup.style.display  = "none";
Ref.textLocation.style.display = "none";
Ref.eventForm.style.display = "none";
Ref.SettingsContainer.style.display = "none";
Ref.spellsForm.style.display = "none";

Monsters.loadMonsterList(Monsters.monstersArray);

break;

case 5:
//Show
Ref.stateLabel.textContent = "editing Items (" + newPage + ")";
Ref.itemForm.style.display = "flex";

//Hide

Ref.monsterForm.style.display = "none";
Ref.npcForm.style.display = "none"
Ref.locationGroup.style.display  = "none";
Ref.textLocation.style.display = "none";
Ref.eventForm.style.display = "none";
Ref.SettingsContainer.style.display = "none";
Ref.spellsForm.style.display = "none";

Items.loadItemsList(Items.itemsArray);

break;

case 6:

//Show
Ref.stateLabel.textContent = "editing Spells (" + newPage + ")";
Ref.spellsForm.style.display = "flex";

//Hide

Ref.monsterForm.style.display = "none";
Ref.npcForm.style.display = "none";
Ref.itemForm.style.display = "none";
Ref.locationGroup.style.display  = "none";
Ref.textLocation.style.display = "none";
Ref.eventForm.style.display = "none";
Ref.SettingsContainer.style.display = "none";

Spells.loadSpellsList(Spells.spellsArray);

break;

case 7:
//Show
Ref.stateLabel.textContent = "Settings (" + newPage + ")";
Ref.SettingsContainer.style.display = "flex";

//Hide

Ref.monsterForm.style.display = "none";
Ref.npcForm.style.display = "none";
Ref.itemForm.style.display = "none";
Ref.locationGroup.style.display  = "none";
Ref.textLocation.style.display = "none";
Ref.spellsForm.style.display = "none";
Ref.eventForm.style.display = "none";

break;

default:
// Handle any other cases
break;
}

},

};

export default Edit;