import Ref from "./ref.js";
import NPCs from "./npcs.js";
import Array from "./array.js";
import Items from "./items.js";
import editor from "./editor.js";

const Spells = {

spellsArray: [],
searchArray: [],

async loadSpellsArray() {
    try {
        const response = await fetch('spells.json'); // Adjust the path if needed
        const rawData = await response.json();

        // Store the raw data if needed
        this.rawSpellsArray = rawData;

        // Extract values and assign to this.spellsArray
        const noKeys = Array.extractValues(rawData);
        this.spellsArray = noKeys;

        // Uncomment the following line if you want to log the extracted spellsArray
        // console.log(this.spellsArray);

        return this.spellsArray;
    } catch (error) {
        console.error('Error loading spells array:', error);
        return [];
    }
}, 

//Add to Storyteller

//addPredictive Items is now with addPredictive Monsters

getSpells(locationText) {
const tildeBrackets = /~([^~]+)~/g;

return locationText.replace(tildeBrackets, (match, targetText) => {
const spell = Object.values(this.spellsArray).find(spell => spell.name.toLowerCase() === targetText.toLowerCase());
if (spell) {
return `<span class="expandable spell" data-content-type="spell" divId="${spell.name}">${spell.name}</span>`;
} else {
console.log(`Spell not found: ${targetText}`);
return match;
}
});
},

extraSpell(contentId) {
const tildeBrackets = /~([^~]+)~/g;

return contentId.replace(tildeBrackets, (match, targetText) => {
const spell = Object.values(this.spellsArray).find(spell => spell.name.toLowerCase() === targetText.toLowerCase());
if (spell) {
console.log(spell.name);
return editor.addInfo(spell.name);
} else {
console.log(`Spell not found: ${targetText}`);
return match;
}
});
},




saveSpell: function() {

const existingItemIndex = this.spellsArray.findIndex(spell => spell.name === Ref.spellName.value);
console.log(Ref.spellName.value)

const item = {

id: Ref.spellId.value,
name: Ref.spellName.value,
type: Ref.spellClass.value,
subType: Ref.spellLevel.value,
description: Ref.spellDescription.value,
reverse: Ref.spellReverse.value,
note: Ref.spellNote.value,
range: Ref.spellRange.value,
duration: Ref.spellDuration.value       

};

if (existingItemIndex !== -1) {
// Update the existing Spell entry
this.spellsArray[existingItemIndex] = item;
console.log('Item updated:', item);
} else {
this.spellsArray.push(item);
}

},

addSearch: function(){

// Ref.search.addEventListener('input', (event) => {
// let searchText = event.target.value.toLowerCase();

// // Call the searchMonster function
// this.searchSpell(searchText);

// })
},

searchSpell: function(searchText){

this.searchArray = [];

this.searchArray = this.spellsArray.filter((entry) => {
const entryName = entry.name.toLowerCase();
const entryType = entry.type.toLowerCase();
const entrySubType = entry.subType.toLowerCase();

// Check if either the name or tags contains the search text
return entryName.includes(searchText.toLowerCase()) || entryType.includes(searchText.toLowerCase()) || entrySubType.includes(searchText.toLowerCase());
});

this.loadList(this.searchArray, "Spell Search Results");

},


};

export default Spells;

