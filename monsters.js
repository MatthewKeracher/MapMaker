// Import the necessary module
import editor from "./editor.js";
import load from "./load.js";

import Ref from "./ref.js";
import Items from "./items.js";
import Spells from "./spells.js";
import Events from "./events.js";
import Storyteller from "./storyteller.js";
import NPCs from "./npcs.js";

const Monsters = {

 
searchMonster: function(searchText) {
  this.searchArray = [];
  //console.log('Searching for Events including: ' + searchText)
  
  this.searchArray = load.Data.monsters.filter((e) => {
  const type = e.type.toLowerCase();
  const name = e.name.toLowerCase();
  
  // Check if any of the properties contain the search text
  return type.includes(searchText) || name.includes(searchText);
  
  }); 
  
  editor.loadList(this.searchArray, "Monster Search Results");
},

getMonsters(locationText) {
const asteriskBrackets = /\*([^*]+)\*/g;
return locationText.replace(asteriskBrackets, (match, targetText) => {
const monster = load.Data.monsters.find(monster => monster.name.toLowerCase() === targetText.toLowerCase());
if (monster) {
return `<span class="expandable monster" data-content-type="monsters" divId="${targetText}">${targetText}</span>`;
} else {
console.log(`Monster not found: ${targetText}`);
return match;
}
});
},

addMonsterFormEvents: function(){

// Ref.monsterSearch.addEventListener('input', (event) => {
// let searchText = event.target.value.toLowerCase();

// // Call the searchMonster function
// this.searchMonster(searchText);

// });

// //Add MonsterList show on Click
// Ref.monsterSearch.addEventListener('click', () => {
// //Ref.Centre.style.display = 'block';
// editor.loadList(load.Data.monsters, "All Monsters")
// });

},

extraMonsters(contentId) {
const asteriskBrackets = /\*([^*]+)\*/g;

return contentId.replace(asteriskBrackets, (match, targetText) => {
const monster = load.Data.monsters.find(monster => monster.name.toLowerCase() === targetText.toLowerCase());
if (monster) {
return this.addMonsterInfo(targetText);
} else {
console.log(`Monster not found: ${targetText}`);
return match;
}
});
},


saveMonster: function() {

// Check if an NPC with the same name already exists
const index = load.Data.monsters.findIndex(monster => monster.id === parseInt(Ref.monsterId.value) && monster.name === Ref.monsterName.value);

// Get the monster name from the form
const monsterName = Ref.monsterName.value;

const monster = {
id: parseInt(Ref.monsterId.value),
name: monsterName,
type: Ref.monsterType.value,
subType: Ref.monsterSaveAs.value,
noApp: Ref.monsterAppearing.value,
morale: Ref.monsterMorale.value,
movement: Ref.monsterMovement.value,
ac: Ref.monsterAC.value,
hd: Ref.monsterHD.value,
attacks: Ref.monsterAttacks.value,
damage: Ref.monsterDamage.value,
special: Ref.monsterSpecial.value,
treasure: Ref.monsterTreasure.value,
xp: Ref.monsterXP.value,
description: Ref.monsterDescription.value
};

if (index !== -1) {
// Update the existing Monster entry
load.Data.monsters[index] = monster;

} else {
// Add the created NPC to the npcArray
monster.id = Array.generateUniqueId(load.Data.monsters, 'entry');
Ref.monsterId.value = monster.id
load.Data.monsters.push(monster);
console.log('New Monster added:', monster);
}

},




};

export default Monsters;

