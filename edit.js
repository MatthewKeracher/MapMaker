import Ref from "./ref.js";
import Array from "./array.js";
import Storyteller from "./storyteller.js";
import NPCs from "./npcs.js";
import Monsters from "./monsters.js";
import Items from "./items.js";
import Ambience from "./ambience.js";

const Edit = {

editMode : false,
moveMode: false,
editPage: 1,

filterEmptyEntries(npcArray) {
return npcArray.filter(npc => {
// Check if any of the key values is not an empty string
for (const key in npc) {
if (npc.hasOwnProperty(key) && npc[key] !== "") {
return true;
}
}
return false;
});
},

addPredictiveContent() {
  Ref.textLocation.addEventListener('input', (event) => {
    const text = event.target.value;
    const cursorPosition = event.target.selectionStart;

    const openBraceIndex = text.lastIndexOf('#', cursorPosition);
    const openAsteriskIndex = text.lastIndexOf('*', cursorPosition);

    if (openBraceIndex !== -1 || openAsteriskIndex !== -1) {
      let searchText;
      let filteredItems;

      if (openBraceIndex > openAsteriskIndex) {
        searchText = text.substring(openBraceIndex + 1, cursorPosition);
        filteredItems = Items.itemsArray.filter(item =>
          item.Name.toLowerCase().includes(searchText.toLowerCase())
        );
      } else {
        searchText = text.substring(openAsteriskIndex + 1, cursorPosition);
        filteredItems = Object.keys(Monsters.monstersArray).filter(monsterName =>
          monsterName.toLowerCase().includes(searchText.toLowerCase())
        );
      }

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
            : `*${item}*`;
          const newText = text.substring(0, openBraceIndex !== -1 ? openBraceIndex : openAsteriskIndex) + replacement + text.substring(cursorPosition);
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
  const ambienceTitle = document.getElementById('ambienceTitle').value;
  const ambienceIndex = Ambience.ambienceArray.findIndex(ambience => ambience.title === ambienceTitle);
  const ambienceForm = document.getElementById('ambienceForm');

  if (ambienceIndex !== -1) {
    const confirmation = window.confirm("Are you sure you want to delete this ambience?");
    if (confirmation) {
      Ambience.ambienceArray.splice(ambienceIndex, 1); // Remove ambience from ambienceArray

      // Update the ambience list with the updated ambienceArray
      Ambience.loadAmbienceList(Ambience.ambienceArray);

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
Ref.AmbienceContainer.style.display = "none";
Ref.SettingsContainer.style.display = "none";

break;

case 2:
//Show
Ref.npcForm.style.display = "flex"


//Hide
Ref.monsterForm.style.display = "none";
Ref.itemForm.style.display = "none";
Ref.editLocationName.style.display  = "none";
Ref.textLocation.style.display = "none";
Ref.AmbienceContainer.style.display = "none";
Ref.SettingsContainer.style.display = "none";

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
Ref.AmbienceContainer.style.display = "none";
Ref.SettingsContainer.style.display = "none";

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
Ref.AmbienceContainer.style.display = "none";
Ref.SettingsContainer.style.display = "none";

Items.loadItemsList(Items.itemsArray);

break;

case 5:
//Show
Ref.AmbienceContainer.style.display = "flex";

//Hide
Ref.monsterForm.style.display = "none";
Ref.npcForm.style.display = "none";
Ref.itemForm.style.display = "none";
Ref.editLocationName.style.display  = "none";
Ref.textLocation.style.display = "none";
Ref.SettingsContainer.style.display = "none";

Ambience.loadAmbienceList(Ambience.ambienceArray);

break;

case 6:
//Show
Ref.SettingsContainer.style.display = "flex";

//Hide
Ref.monsterForm.style.display = "none";
Ref.npcForm.style.display = "none";
Ref.itemForm.style.display = "none";
Ref.editLocationName.style.display  = "none";
Ref.textLocation.style.display = "none";

break;

default:
// Handle any other cases
break;
}

},





};

export default Edit;