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
return `<span class="expandable spell" data-content-type="spells" divId="${spell.name}">${spell.name}</span>`;
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

