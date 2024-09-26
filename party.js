import ref from "./ref.js";
import load from "./load.js";
import form from "./form.js";
import helper from "./helper.js";
import events from "./events.js";
import Storyteller from "./storyteller.js";
import battleMap from "./battleMap.js";
import NPCbuild from "./classes.js";

const party = {

currentParty: [],

makeMonsterNPC(member, i) {

let skillNames = ["Strength", "Dexterity", "Wisdom", "Intelligence", "Constitution", "Charisma"];
let skills = {};

skillNames.forEach(skillName => {
let skill = helper.rollMultipleDice('3d6');
skills[skillName] = skill; 
skills['mod'+skillName] = NPCbuild.getModifier(parseInt(skill));
});

const newMonster = {
...member,
...skills,
class: "Monster",
x: 200 + (i * 40),
y: 100,
name: member.name + ' ' + i,
initiative: 0,
hitPoints: helper.rollMultipleDice(member.level + 'd8'),
};

return newMonster
},
    

buildParty(){

ref.leftParty.innerHTML = '';
let membersList = load.Data.miscInfo.party;
let members = [];

membersList.forEach(element => {
    
let member = helper.getObjfromTag(element);

if(member.key === 'monsters'){

let noAppearing = 1;
if (member.encounter.includes('d')) {
noAppearing = helper.rollMultipleDice(member.encounter); 
}else{
noAppearing = member.encounter;
}

for (let i = 0; i < noAppearing; i++) {
let monster = this.makeMonsterNPC(member, i + 1); 
members.push(monster); 
}

}else{
members.push(member);
}

});

this.currentParty = members

},

loadParty(){

let members = this.currentParty;
let membersList = load.Data.miscInfo.party;
ref.leftParty.innerHTML = ``;

ref.Left.style.display = "none";
ref.Centre.style.display = "none";
ref.leftParty.style.display = "block";

//Table Headers
const headerDiv = document.createElement('div');
const memberRows = document.createElement('div');

let headerHTML = `
    <div class="member-table">
        <div id="headerRow" class="header-row">
            <div id="nameColumn" class="member-cell name-column" style="color:rgba(255, 255, 255, 0.376)">Name</div>
            <div class="member-cell class-column" style="color:rgba(255, 255, 255, 0.376)">Class</div>
            <div class="member-cell init-column"  style="color:rgba(255, 255, 255, 0.376)">#</div>
            <div class="member-cell init-column"  style="color:rgba(255, 255, 255, 0.376)">AC</div>
            <div class="member-cell init-column"  style="color:rgba(255, 255, 255, 0.376)">HP</div>
        </div>
    </div>
`;

headerDiv.innerHTML = headerHTML;
ref.leftParty.appendChild(headerDiv);
ref.leftParty.appendChild(memberRows);

//Add party members.
members.forEach(member => {

// Inside the loop that creates memberDiv elements
const memberDiv = document.createElement('div');
const memberAC = events.getCurrentAC(member);

let memberHTML = `
    <div class="member-table">
        <div id="${member.name}Row" class="member-row">
            <div id="${member.name}" class="member-cell name-column" style="color:${member.color}">${member.name}</div>
            <div class="member-cell class-column">${member.class}</div>
            <div class="member-cell init-column">${member.initiative}</div>
            <div class="member-cell init-column">${memberAC}</div>
            <div class="member-cell init-column">
            <input type="text" value="${member.hitPoints}" style="color: ${member.color}" class="hitPointBox" id="${member.name}-hitpoints">
            </div>
        </div>
    </div>
`;

// `<input 
// id="${npc.id}CurrentHP" 
// type="number" 
// class="hitPointBox"
// style="color: ${npc.color}"
// value="${npc.hitPoints}">`

memberDiv.innerHTML = memberHTML;
memberRows.appendChild(memberDiv);
const nameDiv = document.getElementById(member.name);

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

    this.buildParty();
    party.loadParty();
    Storyteller.refreshLocation();

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

};

export default party;



