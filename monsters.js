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
  
  const noKeys = Array.extractValues(data);
  this.monstersArray = noKeys;
  
  return data //.monsters;
  } catch (error) {
  console.error('Error loading monsters array:', error);
  return [];
  }
  
  },   


getMonsters(locationText) {
const asteriskBrackets = /\*([^*]+)\*/g;

return locationText.replace(asteriskBrackets, (match, targetText) => {
const monster = Object.values(this.monstersArray).find(monster => monster.Name.toLowerCase() === targetText.toLowerCase());
if (monster) {
return `<span class="expandable monster" data-content-type="monster" divId="${targetText}">${targetText}</span>`;
} else {
console.log(`Monster not found: ${targetText}`);
return match;
}
});
},


addMonsterFormEvents: function(){

Ref.monsterName.addEventListener('input', (event) => {
let searchText = event.target.value.toLowerCase();

// Check if the searchText contains '{'
if (searchText.includes('{')) {
// Remove '{' from the searchText
searchText = searchText.replace('{', '');

// Call the searchMonster function
this.searchMonster(searchText);
}
});

//Add MonsterList show on Click
Ref.monsterName.addEventListener('click', () => {
//Ref.Centre.style.display = 'block';
this.loadMonsterList(this.monstersArray)
});

},

extraMonsters(contentId) {
const asteriskBrackets = /\*([^*]+)\*/g;

return contentId.replace(asteriskBrackets, (match, targetText) => {
const monster = Object.values(this.monstersArray).find(monster => monster.Name.toLowerCase() === targetText.toLowerCase());
if (monster) {
return this.addMonsterInfo(targetText);
} else {
console.log(`Monster not found: ${targetText}`);
return match;
}
});
},

addMonsterInfo(monster, target) {

const monsterStats = [

`<h1><span class="monster">${monster.Name}</span></h1>`,
`<h3><span class = "cyan">${monster.Type}.</span><hr>`,

`${monster.NoApp ?        `<span class="expandable hotpink" data-content-type="rule" divId="Monster Number Appearing"># App:</span>        ${monster.NoApp}          <br>` : ''}`,
`${monster.SaveAs?        `<span class="expandable hotpink" data-content-type="rule" divId="Monster Save As">Save As:</span>     ${monster.SaveAs}         <br>` : ''}`,
`${monster.Morale ?       `<span class="expandable hotpink" data-content-type="rule" divId="Monster Morale">Morale:</span>      ${monster.Morale}         <br>` : ''}`,
`${monster.Movement ?     `<span class="expandable hotpink" data-content-type="rule" divId="Monster Movement">Movement:</span>  ${monster.Movement}       <br>` : ''} <hr>`,

`${monster.AC ?           `<span class="expandable orange"  data-content-type="rule" divId="Monster Armour Class">Armour Class:</span>    ${monster.AC}              <br>` : ''}`,
`${monster.HD ?           `<span class="expandable orange"  data-content-type="rule" divId="Monster Hit Dice">Hit Dice:</span>        ${monster.HD}              <br>` : ''}`,
`${monster.HDSort ?       `<span class="expandable orange"  data-content-type="rule" divId=""> HD Sort:</span>                  ${monster.HDSort}              ` : ''} <hr>`,

`${monster.Attacks ?      `<span class="expandable lime"    data-content-type="rule" divId="Monster Attacks">Attacks:</span>    ${monster.Attacks}        <br>` : ''}`,
`${monster.Damage ?       `<span class="expandable lime"    data-content-type="rule" divId="Monster Damage">Damage:</span>      ${monster.Damage}             ` : ''} <hr>`,

`${monster.Treasure ?     `<span class="expandable spell"    data-content-type="rule" divId="Monster Treasure">Treasure:</span>    ${monster.Treasure}       <br>` : ''}`,
`${monster.XP ?           `<span class="expandable spell"    data-content-type="rule" divId="Monster XP">Experience Points:</span> ${monster.XP}                 ` : ''} <hr>`,

`${monster.Special ?      `<span class="expandable monster" data-content-type="rule" divId="Monster Special">Special:</span>        ${monster.Special}        <hr>` : ''} `,

`${monster.Description ?  `</h3><span class = "withbreak">${Spells.getSpells(this.getMonsters(Items.getItems(monster.Description)))}<span>`: ''}`,

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
monsterDiv.id = monster.Name;
monsterDiv.innerHTML = `[${monster.Type}]<span class="hotpink">${monster.Name}</span>`;
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
this.addMonsterInfo(monster, Ref.Left);
});

}

}, 

fillMonsterForm: function(monster, monsterNameDiv){

// Add click event listener to each NPC name
monsterNameDiv.addEventListener('click', () => {

Ref.monsterName.value = monster.Name;
Ref.monsterType.value = monster.Type;

Ref.monsterAppearing.value = monster.NoApp;
Ref.monsterMorale.value = monster.Morale;

Ref.monsterMovement.value = monster.Movement;
Ref.monsterAC.value = monster.AC;

Ref.monsterHD.value = monster.HD;
Ref.monsterHDRange.value = monster.HDSort;

Ref.monsterAttacks.value = monster.Attacks;
Ref.monsterDamage.value = monster.Damage;
Ref.monsterSpecial.value = monster.Special;  
Ref.monsterSaveAs.value = monster.SaveAs; 
Ref.monsterTreasure.value = monster.Treasure; 
Ref.monsterXP.value = monster.XP; 

Ref.monsterDescription.value = monster.Description; 

Ref.monsterForm.style.display = 'flex'; // Display the monsterForm
});

},

saveMonster: function() {

const existingMonsterIndex = this.monstersArray.findIndex(monster => monster.Name === Ref.monsterName.value);
// Get the monster name from the form
const monsterName = Ref.monsterName.value;

const monster = {
Name: monsterName,
Type: Ref.monsterType.value,
NoApp: Ref.monsterAppearing.value,
Morale: Ref.monsterMorale.value,
Movement: Ref.monsterMovement.value,
AC: Ref.monsterAC.value,
HD: Ref.monsterHD.value,
HDSort: Ref.monsterHDRange.value,
Attacks: Ref.monsterAttacks.value,
Damage: Ref.monsterDamage.value,
Special: Ref.monsterSpecial.value,
SaveAs: Ref.monsterSaveAs.value,
Treasure: Ref.monsterTreasure.value,
XP: Ref.monsterXP.value,
Description: Ref.monsterDescription.value
};

if (existingMonsterIndex !== -1) {
  // Update the existing Monster entry
  this.monstersArray[existingMonsterIndex] = monster;
  
  } else {
  this.monstersArray.push(monster);
  //this.itemsSearchArray.push(item);
  }

},


searchMonster: function(searchText) {
this.searchArray = [];
//console.log('Searching for Events including: ' + searchText)

this.searchArray = this.monstersArray.filter((e) => {
const type = e.Type.toLowerCase();
const name = e.Name.toLowerCase();

// Check if any of the properties contain the search text
return type.includes(searchText) || name.includes(searchText);

}); 

this.loadMonsterList(this.searchArray);
},


};

export default Monsters;

