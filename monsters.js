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





};

export default Monsters;

