import Ref from "./ref.js";
import Array from "./array.js";
import Storyteller from "./storyteller.js";
import NPCs from "./npcs.js";
import Monsters from "./monsters.js";
import Items from "./items.js";
import Ambience from "./ambience.js";
import Spells from "./spells.js";

const Edit = {

editMode : false,
moveMode: false,
editPage: 1,
divIds : ['textLocation', 'npcBackStory'],

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
            filteredItems = Object.keys(Monsters.monstersArray).filter(monsterName =>
              monsterName.toLowerCase().includes(searchText.toLowerCase())
            );
          } else {
            searchText = text.substring(openTildeIndex + 1, cursorPosition); // Handle ~ case
            filteredItems = Spells.spellsArray.filter(spell =>
              spell.Name.toLowerCase().includes(searchText.toLowerCase())
              );
          }

          console.log(searchText);

          // Show ExtraContent
          Ref.itemList.style.display = 'block';
          Ref.itemList.innerHTML = ''; // Clear existing content

          // fixDisplay()
          const imageContainer = document.querySelector('.image-container');
          const radiantDisplay = document.getElementById('radiantDisplay');
          imageContainer.style.width = "45vw";
          radiantDisplay.style.width = "45vw";

          filteredItems.forEach(item => {
            const option = document.createElement('div');
            option.textContent = item.Name || item; // Use "Name" property if available
            option.addEventListener('click', () => {
              const replacement = openBraceIndex !== -1
                ? `#${item.Name}#`
                : openAsteriskIndex !== -1
                ? `*${item}*`
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
                
              Ref.itemList.style.display = 'none'; // Hide Ref.optionsList
            });
            Ref.itemList.appendChild(option);
          });
        } else {
          Ref.itemList.style.display = 'none';
          Ref.itemList.innerHTML = '';

          // fixDisplay()
          const imageContainer = document.querySelector('.image-container');
          const radiantDisplay = document.getElementById('radiantDisplay');
          imageContainer.style.width = "70vw";
          radiantDisplay.style.width = "70vw";
        }
      });
    }
  });
},



deleteLocation() {
switch (this.editPage) {
case 2:
const npcName = document.getElementById('npcName').value;
const npcIndex = NPCs.npcArray.findIndex(npc => npc.name === npcName);
const npcForm = document.getElementById('npcForm');

if (npcIndex !== -1) {
const confirmation = window.confirm("Are you sure you want to delete this NPC?");
if (confirmation) {
NPCs.npcArray.splice(npcIndex, 1); // Remove NPC from npcArray

// Filter and update npcArray to remove empty entries
//NPCs.npcArray = this.filterEmptyEntries(NPCs.npcArray);

NPCs.loadNPC(NPCs.npcArray); // Refresh the NPC form with updated npcArray
npcForm.reset(); // Call the reset() method to clear the form fields
}
}
break;

case 3:
const monsterName = document.getElementById('monsterName').value;
const monsterToDelete = Monsters.monstersArray[monsterName];
const monsterForm = document.getElementById('monsterForm');

if (monsterToDelete) {
const confirmation = window.confirm("Are you sure you want to delete this Monster?");
if (confirmation) {
delete Monsters.monstersArray[monsterName];

Monsters.loadMonsterList(Monsters.monstersArray); // No need to pass the updated array
monsterForm.reset(); // Call the reset() method to clear the form fields
}
}
break;

case 4:
const itemName = document.getElementById('itemName').value;
const itemIndex = Items.itemsArray.findIndex(item => item.Name === itemName);
const itemForm = document.getElementById('itemForm');

if (itemIndex !== -1) {
const confirmation = window.confirm("Are you sure you want to delete this item?");
if (confirmation) {
Items.itemsArray.splice(itemIndex, 1); // Remove NPC from npcArray

// Filter and update npcArray to remove empty entries
//NPCs.npcArray = this.filterEmptyEntries(NPCs.npcArray);

Items.loadItemsList(Items.itemsArray); // Refresh the NPC form with updated npcArray
itemForm.reset(); // Call the reset() method to clear the form fields
}
}
break;

case 5:
const spellName = document.getElementById('spellName').value;
const spellIndex = Spells.spellsArray.findIndex(spell => spell.Name === spellName);
const spellsForm = document.getElementById('spellsForm');

if (spellIndex !== -1) {
const confirmation = window.confirm("Are you sure you want to delete this spell?");
if (confirmation) {
Spells.spellsArray.splice(spellIndex, 1); // Remove ambience from ambienceArray

// Update the ambience list with the updated ambienceArray
Spells.loadSpellsList(Spells.spellsArray);

// Reset the ambience form fields
spellsForm.reset();
}
}
break;

case 6:
const ambienceTitle = document.getElementById('ambienceTitle').value;
const ambienceIndex = Ambience.ambienceArray.findIndex(ambience => ambience.title === ambienceTitle);
const ambienceForm = document.getElementById('ambienceForm');

if (ambienceIndex !== -1) {
const confirmation = window.confirm("Are you sure you want to delete this ambience?");
if (confirmation) {
Ambience.ambienceArray.splice(ambienceIndex, 1); // Remove ambience from ambienceArray

// Update the ambience list with the updated ambienceArray
Ambience.loadEventsList(Ambience.ambienceArray);

// Reset the ambience form fields
ambienceForm.reset();
}
}
break;


default:
// For any other case
const divId = Ref.locationLabel.textContent;

const matchingEntryIndex = Array.locationArray.findIndex(entry => entry.divId === divId);

if (matchingEntryIndex !== -1) {
const confirmation = window.confirm("Are you sure you want to delete this entry?");
if (confirmation) {
// Remove the entry from locationArray
Array.locationArray.splice(matchingEntryIndex, 1);

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
matchingEntry.description = Ref.textLocation.value;
matchingEntry.divId = Ref.editLocationName.value;

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

NPCs.fixDisplay();
Ref.itemList.innerHTML = ``;
Ref.extraInfo.classList.remove('showExtraInfo');


switch (newPage) {
case 1:

//Show
Ref.editLocationName.style.display  = "flex";
Ref.textLocation.style.display = "flex";

//Hide

Ref.npcForm.style.display = "none";
Ref.monsterForm.style.display = "none";
Ref.itemForm.style.display = "none";
Ref.ambienceForm.style.display = "none";
Ref.SettingsContainer.style.display = "none";
Ref.spellsForm.style.display = "none";

break;

case 2:
//Show
Ref.npcForm.style.display = "flex"


//Hide

Ref.monsterForm.style.display = "none";
Ref.itemForm.style.display = "none";
Ref.editLocationName.style.display  = "none";
Ref.textLocation.style.display = "none";
Ref.ambienceForm.style.display = "none";
Ref.SettingsContainer.style.display = "none";
Ref.spellsForm.style.display = "none";

NPCs.loadNPC(NPCs.npcArray);

break;

case 3:

//Show
Ref.monsterForm.style.display = "flex";


//Hide

Ref.npcForm.style.display = "none"
Ref.itemForm.style.display = "none";
Ref.editLocationName.style.display  = "none";
Ref.textLocation.style.display = "none";
Ref.ambienceForm.style.display = "none";
Ref.SettingsContainer.style.display = "none";
Ref.spellsForm.style.display = "none";

Monsters.loadMonsterList(Monsters.monstersArray);

break;

case 4:
//Show
Ref.itemForm.style.display = "flex";

//Hide

Ref.monsterForm.style.display = "none";
Ref.npcForm.style.display = "none"
Ref.editLocationName.style.display  = "none";
Ref.textLocation.style.display = "none";
Ref.ambienceForm.style.display = "none";
Ref.SettingsContainer.style.display = "none";
Ref.spellsForm.style.display = "none";

Items.loadItemsList(Items.itemsArray);

break;

case 5:

//Show
Ref.spellsForm.style.display = "flex";

//Hide

Ref.monsterForm.style.display = "none";
Ref.npcForm.style.display = "none";
Ref.itemForm.style.display = "none";
Ref.editLocationName.style.display  = "none";
Ref.textLocation.style.display = "none";
Ref.ambienceForm.style.display = "none";
Ref.SettingsContainer.style.display = "none";

Spells.loadSpellsList(Spells.spellsArray);

break;

case 6:
//Show
Ref.ambienceForm.style.display = "flex";


//Hide

Ref.monsterForm.style.display = "none";
Ref.npcForm.style.display = "none";
Ref.itemForm.style.display = "none";
Ref.editLocationName.style.display  = "none";
Ref.textLocation.style.display = "none";
Ref.SettingsContainer.style.display = "none";
Ref.spellsForm.style.display = "none";

Ambience.loadEventsList(Ambience.ambienceArray);

break;

case 7:
//Show
Ref.SettingsContainer.style.display = "flex";

//Hide

Ref.monsterForm.style.display = "none";
Ref.npcForm.style.display = "none";
Ref.itemForm.style.display = "none";
Ref.editLocationName.style.display  = "none";
Ref.textLocation.style.display = "none";
Ref.spellsForm.style.display = "none";
Ref.ambienceForm.style.display = "none";

break;

default:
// Handle any other cases
break;
}

},

};

export default Edit;