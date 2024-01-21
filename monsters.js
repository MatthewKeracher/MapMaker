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
console.error('Error loading monster array:', error);
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

addMonsterInfo(contentId, target) {
  
//Search for Monster in the Array   
const monster = Object.values(this.monstersArray).find(monster => monster.Name.toLowerCase() === contentId.toLowerCase());

if (monster) {

const monsterStats = [

  `<h1><span class="monster">${contentId}</span></h1>`,
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

// Set the formatted content in the extraContent element
target.innerHTML = formattedMonster;

return formattedMonster;

} else {
console.log(`Monster not found: ${contentId}`);

}

},

// Edit Monsters
loadMonsterList: function(data) {
const itemList = document.getElementById('itemList'); // Do not delete!!

// Clear the existing content
itemList.innerHTML = '';

// Get an array of monster names and sort them alphabetically
const monsterNames = Object.keys(data).sort();

// Iterate through the sorted monster names
for (const monsterName of monsterNames) {
const monster = data[monsterName];
const monsterNameDiv = document.createElement('div');
monsterNameDiv.id = monster.Name;
monsterNameDiv.innerHTML = `[${monster.Type}]<span class="hotpink">${monster.Name}</span>`;
itemList.appendChild(monsterNameDiv);
this.fillMonsterForm(monster, monsterNameDiv);

 //show Monster info in ExtraInfo2 when hover over Div
 monsterNameDiv.addEventListener('mouseover', () => {
  Ref.extraInfo2.classList.add('showExtraInfo');
  this.addMonsterInfo(monsterNameDiv.id, Ref.extraInfo2);
  //Storyteller.showFloatingExpandable(Ref.extraInfo2);
  });

}

itemList.style.display = 'block'; // Display the NPC names container

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

// Check if the monster already exists by name
if (this.monstersArray.hasOwnProperty(monsterName)) {
// Update the existing monster entry
this.monstersArray[monsterName] = monster;
console.log('Monster updated:', monster);
} else {
// Add the created monster to the monstersArray
this.monstersArray[monsterName] = monster;
console.log('New Monster added:', monster);
}
},

addMonsterSearch: function(){

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

},

searchMonster: function(searchText) {
this.monsterSearchObject = {};

for (const monsterName in this.monstersArray) {
if (Object.hasOwnProperty.call(this.monstersArray, monsterName)) {
const monster = this.monstersArray[monsterName];
const monsterNameLower = monster.Name.toLowerCase();
const monsterTypeLower = monster.Type.toLowerCase();

if (monsterNameLower.includes(searchText.toLowerCase()) || monsterTypeLower.includes(searchText.toLowerCase())) {
this.monsterSearchObject[monsterName] = monster;
}
}
}

this.loadMonsterList(this.monsterSearchObject);
},


};

export default Monsters;

