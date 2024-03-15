import Ref from "./ref.js";
import NPCs from "./npcs.js";

import Items from "./items.js";
import editor from "./editor.js";
import load from "./load.js";

const Spells = {

searchArray: [],

//Add to Storyteller

//addPredictive Items is now with addPredictive Monsters

getSpells(locationText) {
const tildeBrackets = /~([^~]+)~/g;

return locationText.replace(tildeBrackets, (match, targetText) => {
const spell = Object.values(load.Data.spells).find(spell => spell.name.toLowerCase() === targetText.toLowerCase());
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
const spell = Object.values(load.Data.spells).find(spell => spell.name.toLowerCase() === targetText.toLowerCase());
if (spell) {
console.log(spell.name);
return editor.createForm(spell);
} else {
console.log(`Spell not found: ${targetText}`);
return match;
}
});
},




saveSpell: function() {

const existingItemIndex = load.Data.spells.findIndex(spell => spell.name === Ref.spellName.value);
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
load.Data.spells[existingItemIndex] = item;
console.log('Item updated:', item);
} else {
load.Data.spells.push(item);
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

this.searchArray = load.Data.spells.filter((entry) => {
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

