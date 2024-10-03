import ref from "./ref.js";
import load from "./load.js";
import form from "./form.js";
import helper from "./helper.js";
import events from "./events.js";
import classes from "./classes.js";
import battleMap from "./battleMap.js";
import NPCbuild from "./classes.js";
import NPCs from "./npcs.js";

const party = {

currentParty: [],
attacks: [],

makeMonsterNPC(member, i) {

let skillNames = ["Strength", "Dexterity", "Wisdom", "Intelligence", "Constitution", "Charisma"];
let skills = {};

skillNames.forEach(skillName => {
let skill = helper.rollMultipleDice('3d6');
skills[skillName] = skill; 
skills['mod'+skillName] = NPCbuild.getModifier(parseInt(skill));
});

//Monster Level can be in several formats.
//Default is an integer.
let monsterLevel = member.level;
//Check for Dice Noation
if(monsterLevel.includes('d')){
monsterLevel = helper.rollMultipleDice(monsterLevel)
//Check for Range
}else if(monsterLevel.includes('-')){
const [min, max] = monsterLevel.split('-').map(Number); // Split by '-' and convert to numbers
monsterLevel = Math.floor(Math.random() * (max - min + 1)) + min; // Generate random number in range
}

const newMonster = {
...member,
...skills,
level:  monsterLevel,
attackBonus: classes.getAttackBonus({class: member.class, level:monsterLevel}),
x: 40,
y: 40 + (i * 40),
name: member.name + ' ' + i,
initiative: 0,
hitPoints: helper.rollMultipleDice(monsterLevel + 'd8'),
};

return newMonster
},


getLocationMonsters(monsters){
let monstPartyTags = [];

monsters.forEach(tag => {

let tagObj = helper.getObjfromTag(tag);
let monstTags = tagObj.tags.filter(entry => entry.key === 'monsters');

monstTags.forEach(tag => {
//Check Monster Chance
//Factor in Chance of Item appearing in the Container
const chance = parseInt(tag.chance)
const roll = helper.rollDice(100)
//console.log(chance, roll)
if(roll > chance && !tag.special ){return}

monstPartyTags.push(tag)
})
})

//Erase monsters from Party
load.Data.miscInfo.party = load.Data.miscInfo.party.filter(member => member.key !== "monsters")

//Add monsters to Party
monstPartyTags.forEach(monster => {

load.Data.miscInfo.party.push({key: 'monsters', id: monster.id, type:'monster', appearing: 'Wild'})

})

const partyDisplay = ref.leftParty.style.display;

party.buildParty();
party.loadParty();

ref.leftParty.style.display = partyDisplay;



},

addToParty(){

//Erase npcs from Party
load.Data.miscInfo.party = load.Data.miscInfo.party.filter(member => member.type !== "npc")

//Add npcs to Party
events.partyNPCs.forEach(npc => {
load.Data.miscInfo.party.push({key: 'npcs', type: 'npc', id: npc.id});
})

const partyDisplay = ref.leftParty.style.display;

party.buildParty();
party.loadParty();


ref.leftParty.style.display = partyDisplay;

},


buildParty(){

ref.leftParty.innerHTML = '';
let membersList = load.Data.miscInfo.party;
let members = [];


//console.log(membersList)

membersList.forEach(memberTag => {

let memberObj = helper.getObjfromTag(memberTag);

if(memberTag.type === 'monster'){

let noAppearing = 1;

if (memberObj.encounter.includes('d')) {
const appearing = memberTag.appearing.toLowerCase();
//console.log(appearing, memberObj[appearing])
noAppearing = helper.rollMultipleDice(memberObj[appearing]); 
}else{
noAppearing = memberObj.encounter;
}

for (let i = 0; i < noAppearing; i++) {
let monster = this.makeMonsterNPC(memberObj, i + 1); 
members.push(monster); 
}

}else{
//console.log('Adding ' + memberObj.name + ' to party.')
members.push(memberObj)
}

});

this.currentParty = members

},

makeDamageEntry(member){

const itemTags = member.tags.filter(entry => entry.key === "items");
let weapons = [];

itemTags.forEach(tag => { 
let tagObj = helper.getObjfromTag(tag);
    if(tagObj.damage !== ''){   
        let attackEntry = {       
            member: member.id,
            entry: tagObj.name + ': ' + tagObj.damage
        }  

        //Check for Duplicates!
        let duplicateEntry = this.attacks.find(entry => entry.entry === attackEntry.entry);

        if(!duplicateEntry){        
        this.attacks.push(attackEntry)
        }
    }
});

let attackEntries = this.attacks.filter(entry => entry.member === member.id);   
let returnEntry = 'No Weapon'
    
if(attackEntries.length > 0){ 
returnEntry = attackEntries[0].entry
}

return returnEntry;

},

loadParty(){

this.attacks = [];
let members = this.currentParty;
let membersList = load.Data.miscInfo.party;
ref.leftParty.innerHTML = ``;

const leftPartyContainer = document.createElement('div');
leftPartyContainer.id = "leftPartyContainer"
leftParty.appendChild(leftPartyContainer)

//ref.Left.style.display = "none";
//ref.Centre.style.display = "none";
ref.leftParty.style.display = "block";

//Table Headers
const tableContainer = document.createElement('div');
const headerDiv = document.createElement('div');
const memberRows = document.createElement('div');

let headerHTML = `
<div class="member-table">
<div id="headerRow" class="header-row">
<div id="nameColumn" class="member-cell name-column" style="color:rgba(255, 255, 255, 0.376)">Name</div>
<div class="member-cell class-column" style="color:rgba(255, 255, 255, 0.376)">Class</div>
<div class="member-cell init-column"  style="color:rgba(255, 255, 255, 0.376)">Lvl</div>
<div class="member-cell init-column"  style="color:rgba(255, 255, 255, 0.376)">AB</div>
<div class="member-cell init-column"  style="color:rgba(255, 255, 255, 0.376)">M</div>
<div class="member-cell init-column"  style="color:rgba(255, 255, 255, 0.376)">#</div>
<div class="member-cell init-column"  style="color:rgba(255, 255, 255, 0.376)">AC</div>
<div class="member-cell init-column"  style="color:rgba(255, 255, 255, 0.376)">HP</div>
</div>
</div>
`;

headerDiv.innerHTML = headerHTML;
tableContainer.appendChild(headerDiv);
tableContainer.appendChild(memberRows);
leftPartyContainer.appendChild(tableContainer)

//Add party members.
members.forEach(member => {

this.makeDamageEntry(member)

// Inside the loop that creates memberDiv elements
const memberDiv = document.createElement('div');
const memberAC = helper.getCurrentAC(member);

let memberHTML = `
<div class="member-table">
<div id="${member.name}Row" class="member-row">
<div id="${member.name}" class="member-cell name-column" style="color:${member.color}">${member.name}</div>
<div class="member-cell class-column">${member.class}</div>
<div class="member-cell init-columnn">${member.level}</div>
<div class="member-cell init-columnn">+${member.attackBonus}</div>
<div class="member-cell init-columnn">${member.morale}</div>
<div class="member-cell init-column">${member.initiative}</div>
<div class="member-cell init-column">${memberAC}</div>
<div class="member-cell init-column">
<input type="text" value="${member.hitPoints}" style="color: ${member.color}" class="hitPointBox" member="${member.name}">
</div>
</div>
</div>
`;

memberDiv.innerHTML = memberHTML;
memberRows.appendChild(memberDiv);
const nameDiv = document.getElementById(member.name);
nameDiv.dataset.iconId = `icon-${member.name}`;

const hitPointBoxes = document.querySelectorAll('.hitPointBox');

hitPointBoxes.forEach(box => {
box.addEventListener('change', (event) => {

const newValue = event.target.value; 
const findName = box.getAttribute('member')
const member = members.find(member => member.name === findName)
member.hitPoints = newValue

});
});

nameDiv.addEventListener('mouseover', () => {
const iconId = nameDiv.getAttribute('data-icon-id');  
const icon = document.querySelector(`.icon[data-icon-id="${iconId}"]`);

if (icon) {
icon.classList.add('icon-highlight');  // Add the highlight class
}

partyBox.innerHTML = `
<h3 class='member-cell'> # Attacks: </h3> ${member.attacks}
<h3 class='member-cell'> Damage: </h3> ${member.damage}
`

if(member.treasure){
let treasure = party.getTreasure(member)
partyBox.innerHTML += `<h3 class='member-cell'> Treasure: </h3> ${treasure}`
}
    
let attackEntries = this.attacks.filter(entry => entry.member === member.id);

if(attackEntries.length > 0){partyBox.innerHTML += `<h3 class='member-cell'> Weapons: </h3>`}

attackEntries.forEach(attack => {

partyBox.innerHTML += `${attack.entry}<br>`
   
})



});

nameDiv.addEventListener('mouseout', () => {
const iconId = nameDiv.getAttribute('data-icon-id');  // Get the associated icon ID
const icon = document.querySelector(`.icon[data-icon-id="${iconId}"]`);  // Find the corresponding icon

if (icon) {
icon.classList.remove('icon-highlight');  // Remove the highlight class
}

partyBox.innerHTML = '';
});

nameDiv.addEventListener('click', (event) => {

if(event.shiftKey){ //shift-click
//Remove tag from item.
event.preventDefault();
membersList = membersList.filter(members => parseInt(members.id) !== parseInt(member.id));
load.Data.miscInfo.party = membersList;

//Repackage.
refreshButton.click();

}

else if(event.button === 0){ //left-click
// ref.leftParty.style.display = "none";
// partyButton.classList.remove('click-button')
partyButton.click()
let memberObj = load.Data[member.key].find(entry => entry.id === member.id);
console.log(memberObj)
form.createForm(memberObj);
}

});

})

// Create and append the partyBox to the right
const boxDiv = document.createElement('div');
let boxHTML = `<div id="partyBox"></div>`;
boxDiv.innerHTML = boxHTML;
leftPartyContainer.appendChild(boxDiv)


// Create button row
const buttonDiv = document.createElement('div');

let buttonHTML = 
`<br>
<select id="partyDice" class="partyNumber">
<option value=4>4</option>
<option value=6>6</option>
<option value=8>8</option>
<option value=10>10</option>
<option value=12>12</option>
<option value=20 selected>20</option>
<option value=100>100</option>
</select>

<select id="partyMod" class="partyText">
<option value="rollInit" selected>Initiative</option>
<option value="modStrength">Strength</option>
<option value="modDexterity">Dexterity</option>
<option value="modWisdom">Wisdom</option>
<option value="modIntelligence">Intelligence</option>
<option value="modConstitution">Constitution</option>
<option value="modCharisma">Charisma</option>
<option value="none" selected>Raw</option>
</select>

<button id="rollButton" class="partyButton">Roll</button>
<button id="clearButton" class="partyButton">Clear</button>
<button id="refreshButton" class="partyButton">Refresh</button>`;

buttonDiv.innerHTML = buttonHTML;
ref.leftParty.appendChild(buttonDiv);
const rollButton = document.getElementById("rollButton");
const clearButton = document.getElementById("clearButton");
const refreshButton = document.getElementById("refreshButton");

refreshButton.addEventListener('click', () => {

battleMap.drawGrid(ref.battleMap);
this.buildParty();
party.loadParty();
battleMap.loadIcons();
//Storyteller.refreshLocation();

});

clearButton.addEventListener('click', () => {

membersList = membersList.filter(members => members.key === 'npcs');
load.Data.miscInfo.party = membersList;

refreshButton.click();

});

rollButton.addEventListener('click', () => {
let sides  = document.getElementById("partyDice").value;
let modifier = document.getElementById("partyMod").value;
let rollInit = false

if(modifier === 'rollInit'){
modifier = "modDexterity" 
rollInit = true
}

const rows = document.querySelectorAll(".member-row");
const initResults = [];

rows.forEach(row => {

//Fetch npcObj
const nameCol = row.getElementsByClassName('name-column');
const name = nameCol[0].id;
const npcObj = members.find(npc => npc.name === name)

//Roll Dice with  Modifier.
const initCol = row.getElementsByClassName('init-column');

let rawRoll = helper.rollDice(parseInt(sides)) 
let modifiedRoll = rawRoll + (modifier === 'none'? '': npcObj[modifier]);

//Natural 20!
if(parseInt(sides) === 20 && parseInt(rawRoll) === 20){
modifiedRoll = modifiedRoll + '*'
}

initCol[0].innerHTML = modifiedRoll;
initResults.push({name,modifiedRoll})
npcObj.initiative = modifiedRoll;

});

if(rollInit === true){

// Sort the memberResults array based on the rollResult
initResults.sort((a, b) => parseInt(b.modifiedRoll) - parseInt(a.modifiedRoll));

initResults.forEach((result, index) => {
const name = result.name;
const newRow = document.getElementById(`${name}Row`).parentNode.parentNode;
memberRows.insertBefore(newRow, memberRows.childNodes[index]);
});

document.getElementById("partyMod").value = 'none'

}


});

},

getTreasure(monster){
//console.log('getting treasure...')
const lootEntry = monster.treasure;
const lootObj = load.Data.tags.find(entry => entry.name === lootEntry);
const lootTags = lootObj.tags.filter(tag => tag.key === 'items' && !tag.special);
const instructions = lootObj.tags.filter(tag => tag.key === 'items' && tag.special);
let lootItems = ''

instructions.forEach(instruction => {
helper.followInstructions(instruction, monster)   
})

lootTags.forEach(tag => {   
const quantity = tag.quantity;
const tagItem = helper.getObjfromTag(tag);
let lootItem = helper.makeIteminfo(tagItem, tag)
lootItems += lootItem.short
});

return lootItems

},

dragPartyScreen(){

let isDragging = false;
let offsetX, offsetY;

ref.leftParty.addEventListener('mousedown', (event) => {
isDragging = true;
// Calculate the offset between the mouse position and the element's top-left corner
offsetX = event.clientX - ref.leftParty.getBoundingClientRect().left;
offsetY = event.clientY - ref.leftParty.getBoundingClientRect().top;
});

document.addEventListener('mousemove', (event) => {
if (isDragging) {
// Update the position of the element
ref.leftParty.style.left = `${event.clientX - offsetX}px`;
ref.leftParty.style.top = `${event.clientY - offsetY}px`;
}
});

document.addEventListener('mouseup', () => {
isDragging = false; // Stop dragging when the mouse is released
});
}

};

export default party;



