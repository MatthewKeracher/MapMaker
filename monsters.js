import Ref from "./ref.js";

const Monsters = {

monstersArray: [],

async loadMonstersArray() {

try {
const response = await fetch('monsters.json'); // Adjust the path if needed
const data = await response.json();
this.monstersArray = data;
return data //.monsters;
} catch (error) {
console.error('Error loading monster array:', error);
return [];
}

},   

addPredictiveMonsters() {

Ref.textLocation.addEventListener('input', (event) => {
const text = event.target.value;
const cursorPosition = event.target.selectionStart;

const openBraceIndex = text.lastIndexOf('*', cursorPosition);
if (openBraceIndex !== -1) {
const searchText = text.substring(openBraceIndex + 1, cursorPosition);

const filteredMonsters = Object.keys(this.monstersArray).filter(monsterName =>
monsterName.toLowerCase().includes(searchText.toLowerCase())
);

//Show ExtraContent      
Ref.itemList.style.display = 'block';
Ref.itemList.innerHTML = ''; // Clear existing content

//fixDisplay()
const imageContainer = document.querySelector('.image-container');
const radiantDisplay = document.getElementById('radiantDisplay');
imageContainer.style.width = "45vw";
radiantDisplay.style.width = "45vw";

filteredMonsters.forEach(monsterName => {
const option = document.createElement('div');
option.textContent = monsterName;
option.addEventListener('click', () => {
const replacement = `*${monsterName}*`;
const newText = text.substring(0, openBraceIndex) + replacement + text.substring(cursorPosition);
event.target.value = newText;
Ref.itemList.style.display = 'none'; // Hide Ref.optionsList
});
Ref.itemList.appendChild(option);
});
} else {

Ref.itemList.style.display = 'none';
Ref.itemList.innerHTML = '';

//fixDisplay()
imageContainer.style.width = "70vw";
radiantDisplay.style.width = "70vw";

}
});

},

getMonsters(locationText) {
const asteriskBrackets = /\*([^*]+)\*/g;

return locationText.replace(asteriskBrackets, (match, monsterName) => {
console.log(monsterName)
if (this.monstersArray[monsterName]) {
return `<span class="expandable monster" data-content-type="monster" divId="${monsterName}">${monsterName.toUpperCase()}</span>`;
} else {
console.log(`Monster not found: ${monsterName}`);
return match;
}
});
},

extraMonsters(contentId) {
const asteriskBrackets = /\*([^*]+)\*/g;

return contentId.replace(asteriskBrackets, (match, monsterName) => {
if (this.monstersArray[monsterName]) {
return this.addMonsterInfo(monsterName);
} else {
console.log(`Monster not found: ${monsterName}`);
return match;
}
});
},

addMonsterInfo(contentId) {

const extraContent = document.getElementById('extraContent');

//Search for Monster in the Array   
const monster = this.monstersArray[contentId]; 

if (monster) {

const monsterStats = [

`<h2><span class="hotpink">${contentId.toUpperCase()}</span></h2><br>`,
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
extraContent.innerHTML = formattedMonster;

return formattedMonster;

} else {
console.log(`Monster not found: ${contentId}`);

}

},

// Edit Monsters

loadMonsterList: function() {

const itemList = document.getElementById('itemList'); // Do not delete!!

// Clear the existing content
itemList.innerHTML = '';

for (const monster of this.monstersArray) {
const monsterNameDiv = document.createElement('div');
monsterNameDiv.textContent = monster.name + ' [' + monster.Type + ']';            

this.fillMonsterForm(monster, monsterNameDiv);

}

itemList.style.display = 'block'; // Display the NPC names container

this.fixDisplay();

},

fillMonsterForm: function(monster, monsterNameDiv){

// Add click event listener to each NPC name
monsterNameDiv.addEventListener('click', () => {

console.log(monster)

Ref.monsterName.value = monster.monsterName;
Ref.monsterType.value = monster.monsterType;

Ref.monsterAppearing.value = monster.monsterAppearing;
Ref.monsterMorale.value = monster.monsterMorale;

Ref.monsterMovement.value = monster.monsterMovement;
Ref.monsterAC.value = monster.monsterAC;

Ref.monsterHD.value = monster.monsterHD;
Ref.monsterHDRange.value = monster.monsterHDRange;

Ref.monsterAttacks.value = monster.monsterAttacks;
Ref.monsterDamage.value = monster.monsterDamage;
Ref.monsterSpecial.value = monster.monsterSpecial;  
Ref.monsterSaveAs.value = monster.monsterSaveAs; 
Ref.monsterTreasure.value = monster.monsterTreasure; 
Ref.monsterXP.value = monster.monsterXP; 

Ref.monsterDescription.value = monster.monsterDescription; 

Ref.npcForm.style.display = 'flex'; // Display the npcForm
});

},

};

export default Monsters;

