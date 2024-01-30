// Import the necessary module
import Edit from "./edit.js";
import Array from "./array.js";
import Ref from "./ref.js";
import Items from "./items.js";
import Spells from "./spells.js";
import Events from "./events.js";
import Storyteller from "./storyteller.js";
import NPCs from "./npcs.js";

const Monsters = {

monstersArray: [],

//Load the Array
async loadMonstersArray() {

try {
const response = await fetch('monsters.json'); // Adjust the path if needed
const data = await response.json();
this.monstersArray = data;

// const noKeys = Array.extractValues(data);
// this.monstersArray = noKeys;

return data //.monsters;
} catch (error) {
console.error('Error loading monsters array:', error);
return [];
}

},   

searchMonster: function(searchText) {
  this.searchArray = [];
  //console.log('Searching for Events including: ' + searchText)
  
  this.searchArray = Monsters.monstersArray.filter((e) => {
  const type = e.type.toLowerCase();
  const name = e.name.toLowerCase();
  
  // Check if any of the properties contain the search text
  return type.includes(searchText) || name.includes(searchText);
  
  }); 
  
  this.loadMonsterList(this.searchArray);
},

getMonsters(locationText) {
const asteriskBrackets = /\*([^*]+)\*/g;
return locationText.replace(asteriskBrackets, (match, targetText) => {
const monster = this.monstersArray.find(monster => monster.name.toLowerCase() === targetText.toLowerCase());
if (monster) {
return `<span class="expandable monster" data-content-type="monster" divId="${targetText}">${targetText}</span>`;
} else {
console.log(`Monster not found: ${targetText}`);
return match;
}
});
},

addMonsterFormEvents: function(){

Ref.monsterSearch.addEventListener('input', (event) => {
let searchText = event.target.value.toLowerCase();

// Call the searchMonster function
this.searchMonster(searchText);

});

//Add MonsterList show on Click
Ref.monsterSearch.addEventListener('click', () => {
//Ref.Centre.style.display = 'block';
this.loadMonsterList(this.monstersArray)
});

},

extraMonsters(contentId) {
const asteriskBrackets = /\*([^*]+)\*/g;

return contentId.replace(asteriskBrackets, (match, targetText) => {
const monster = this.monstersArray.find(monster => monster.name.toLowerCase() === targetText.toLowerCase());
if (monster) {
return this.addMonsterInfo(targetText);
} else {
console.log(`Monster not found: ${targetText}`);
return match;
}
});
},

addMonsterInfo(monsterName, target) {

const monster = this.monstersArray.find(monster => monster.name === monsterName)

const monsterStats = [

`<h1><span class="monster">${monster.name}</span></h1>`,
`<h3><span class = "cyan">${monster.type}.</span><hr>`,

`${monster.noApp ?        `<span class="expandable hotpink" data-content-type="rule" divId="Monster Number Appearing"># App:</span>        ${monster.noApp}          <br>` : ''}`,
`${monster.saveAs?        `<span class="expandable hotpink" data-content-type="rule" divId="Monster Save As">Save As:</span>     ${monster.saveAs}         <br>` : ''}`,
`${monster.morale ?       `<span class="expandable hotpink" data-content-type="rule" divId="Monster Morale">Morale:</span>      ${monster.morale}         <br>` : ''}`,
`${monster.movement ?     `<span class="expandable hotpink" data-content-type="rule" divId="Monster Movement">Movement:</span>  ${monster.movement}       <br>` : ''} <hr>`,

`${monster.ac ?           `<span class="expandable orange"  data-content-type="rule" divId="Monster Armour Class">Armour Class:</span>    ${monster.ac}              <br>` : ''}`,
`${monster.hd ?           `<span class="expandable orange"  data-content-type="rule" divId="Monster Hit Dice">Hit Dice:</span>        ${monster.hd}              <br>` : ''}<hr>`,

`${monster.attacks ?      `<span class="expandable lime"    data-content-type="rule" divId="Monster Attacks">Attacks:</span>    ${monster.attacks}        <br>` : ''}`,
`${monster.damage ?       `<span class="expandable lime"    data-content-type="rule" divId="Monster Damage">Damage:</span>      ${monster.damage}             ` : ''} <hr>`,

`${monster.treasure ?     `<span class="expandable spell"    data-content-type="rule" divId="Monster Treasure">Treasure:</span>    ${monster.treasure}       <br>` : ''}`,
`${monster.xp ?           `<span class="expandable spell"    data-content-type="rule" divId="Monster XP">Experience Points:</span> ${monster.xp}                 ` : ''} <hr>`,

`${monster.special ?      `<span class="expandable monster" data-content-type="rule" divId="Monster Special">Special:</span>        ${monster.special}        <hr>` : ''} `,

`${monster.description ?  `</h3><span class = "withbreak">${Spells.getSpells(this.getMonsters(Items.getItems(monster.description)))}<span>`: ''}`,

];

const formattedMonster = monsterStats
.filter(attribute => attribute.split(": ")[1] !== '""' && attribute.split(": ")[1] !== '0' && attribute.split(": ")[1] !== 'Nil')
.join(" ");

// Set the formatted content in the target element
target.innerHTML = formattedMonster;

//return formattedMonster;

},

loadMonsterList: function(data) {

// Clear the existing content
Ref.Centre.innerHTML = '';
Ref.Centre.style.display = 'block'; 

// Iterate through the sorted monster names
for (const monster of data) {
const monsterDiv = document.createElement('div');
monsterDiv.id = monster.name;
monsterDiv.innerHTML = `[${monster.type}]<span class="hotpink">${monster.name}</span>`;
Ref.Centre.appendChild(monsterDiv);

monsterDiv.addEventListener('click', () => {

if(Edit.editPage === 3){
Ref.monsterTemplate.value = monsterDiv.id;
}else{
this.fillMonsterForm(monster, monsterDiv);
}

});

//show Monster info in Left when hover over Div
monsterDiv.addEventListener('mouseover', () => {
Ref.Left.style.display = 'block';
this.addMonsterInfo(monster.name, Ref.Left);
});

}

}, 

fillMonsterForm: function(monster, monsterNameDiv){

Ref.monsterId.value = monster.id;
Ref.monsterName.value = monster.name;
Ref.monsterType.value = monster.type;
Ref.monsterAppearing.value = monster.noApp;
Ref.monsterMorale.value = monster.morale;
Ref.monsterMovement.value = monster.movemnt;
Ref.monsterAC.value = monster.ac;
Ref.monsterHD.value = monster.hd;
Ref.monsterAttacks.value = monster.attacks;
Ref.monsterDamage.value = monster.damage;
Ref.monsterSpecial.value = monster.special;  
Ref.monsterSaveAs.value = monster.saveAs; 
Ref.monsterTreasure.value = monster.treasure; 
Ref.monsterXP.value = monster.xp; 
Ref.monsterDescription.value = monster.description; 

Ref.monsterForm.style.display = 'flex'; // Display the monsterForm

},

saveMonster: function() {

// Check if an NPC with the same name already exists
const index = this.monstersArray.findIndex(monster => monster.id === parseInt(Ref.monsterId.value) && monster.name === Ref.monsterName.value);

// Get the monster name from the form
const monsterName = Ref.monsterName.value;

const monster = {
id: parseInt(Ref.monsterId.value),
name: monsterName,
type: Ref.monsterType.value,
noApp: Ref.monsterAppearing.value,
morale: Ref.monsterMorale.value,
movement: Ref.monsterMovement.value,
ac: Ref.monsterAC.value,
hd: Ref.monsterHD.value,
attacks: Ref.monsterAttacks.value,
damage: Ref.monsterDamage.value,
special: Ref.monsterSpecial.value,
saveAs: Ref.monsterSaveAs.value,
treasure: Ref.monsterTreasure.value,
xp: Ref.monsterXP.value,
description: Ref.monsterDescription.value
};

if (index !== -1) {
// Update the existing Monster entry
this.monstersArray[index] = monster;

} else {
// Add the created NPC to the npcArray
monster.id = Array.generateUniqueId(this.monstersArray, 'entry');
Ref.monsterId.value = monster.id
this.monstersArray.push(monster);
console.log('New Monster added:', monster);
}

},




};

export default Monsters;

