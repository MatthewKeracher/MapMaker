import Ref from "./ref.js";
import NPCs from "./npcs.js";
import Items from "./items.js";
import Array from "./array.js";

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
  return `<span class="expandable monster" data-content-type="monster" divId="${targetText}">${targetText.toUpperCase()}</span>`;
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

  let targetLocation = '';

  if(target === 'ExtraContent'){
  targetLocation = Ref.extraContent
  } else {
  targetLocation = Ref.extraContent2
  }

//Search for Monster in the Array   
const monster = Object.values(this.monstersArray).find(monster => monster.Name.toLowerCase() === contentId.toLowerCase());

if (monster) {

const monsterStats = [

`<hr><h3><span class="hotpink">${contentId.toUpperCase()}</span></h3>`,
`${monster.Type}<br><br>`,

`<span class="hotpink"># App:</span> ${monster.Appearing};<br>`,
`<span class="hotpink">Morale:</span> ${monster.Morale};<br>`,
`<span class="hotpink">Movement:</span> ${monster.Mvmt};<br>`,
`<span class="hotpink">Armour Class:</span> ${monster.AC};<br>`,
`<span class="hotpink">Hit Dice:</span> ${monster.HD};<br>`,
`<span class="hotpink">Hit Dice Range:</span> ${monster.HDSort};<br>`,
`<span class="hotpink">No. Attacks:</span> ${monster.Attacks};<br>`,
`<span class="hotpink">Damage:</span> ${monster.Damage};<br>`,          
`<span class="hotpink">Special:</span> ${monster.Special || "None"};<br>`,
`<span class="hotpink">Save As:</span> ${monster["Save As "]};<br>`,
`<span class="hotpink">Treasure:</span> ${monster.Treasure || "None"};<br>`,
`<span class="hotpink">Experience Points:</span> ${monster.XP};<br><br> `,
`<span class="hotpink">Description:</span> <br><br> ${monster.Description.replace(/\./g, '.<br><br>')}`,

];

const formattedMonster = monsterStats
.filter(attribute => attribute.split(": ")[1] !== '""' && attribute.split(": ")[1] !== '0' && attribute.split(": ")[1] !== 'Nil')
.join(" ");

// Set the formatted content in the extraContent element
targetLocation.innerHTML = formattedMonster;

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
  Ref.extraContent2.classList.add('showExtraInfo');
  this.addMonsterInfo(monsterNameDiv.id);
  });

}

itemList.style.display = 'block'; // Display the NPC names container

NPCs.fixDisplay();
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

