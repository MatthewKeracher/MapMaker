import ref from "./ref.js";
import load from "./load.js";
import form from "./form.js";
import helper from "./helper.js";
import NPCs from "./npcs.js";
import Storyteller from "./storyteller.js";

const party = {

loadParty(){

ref.leftParty.innerHTML = '';
let membersList = load.Data.miscInfo.party;
let members = [];

membersList.forEach(element => {
    
let member = helper.getObjfromTag(element);
members.push(member);

});

ref.Left.style.display = "none";
ref.Centre.style.display = "none";
ref.leftParty.style.display = "block";

//Add party members.
members.forEach(member => {

// Inside the loop that creates memberDiv elements
const memberDiv = document.createElement('div');

let memberHTML = `
    <div class="member-table">
        <div id="${member.name}Row" class="member-row">
            <div id="${member.name}" class="member-cell name-column" style="color:${member.color}">${member.name}</div>
            <div class="member-cell class-column">${member.class}</div>
            <div class="member-cell init-column">${member.initiative}</div>
        </div>
    </div>
`;

memberDiv.innerHTML = memberHTML;
ref.leftParty.appendChild(memberDiv);
const nameDiv = document.getElementById(member.name);

nameDiv.addEventListener('click', (event) => {

if(event.shiftKey){ //shift-click
//Remove tag from item.
event.preventDefault();
membersList = membersList.filter(members => parseInt(members.id) !== parseInt(member.id));
load.Data.miscInfo.party = membersList;

//Repackage.
party.loadParty();
Storyteller.refreshLocation();

}

else if(event.button === 0){ //left-click
ref.leftParty.style.display = "none";
partyButton.classList.remove('click-button')
let memberObj = load.Data.npcs.find(npc => npc.name === member.name);
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
    <option value="modStrength">Strength</option>
    <option value="modDexterity">Dexterity</option>
    <option value="modWisdom">Wisdom</option>
    <option value="modIntelligence">Intelligence</option>
    <option value="modConstitution">Constitution</option>
    <option value="modCharisma">Charisma</option>
    <option value="none" selected>Raw</option>
</select>

<button id="rollButton" class="partyButton">Roll</button>`;

buttonDiv.innerHTML = buttonHTML;
ref.leftParty.appendChild(buttonDiv);
const rollButton = document.getElementById("rollButton");


rollButton.addEventListener('click', () => {
let sides  = document.getElementById("partyDice").value;
let modifier = document.getElementById("partyMod").value;

const rows = document.querySelectorAll(".member-row");
const initResults = [];

rows.forEach(row => {

//Fetch npcObj
const nameCol = row.getElementsByClassName('name-column');
const name = nameCol[0].id;
const npcObj = load.Data.npcs.find(npc => npc.name === name)

//Roll Initiative with Dex Modifier.
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

// Sort the memberResults array based on the rollResult
initResults.sort((a, b) => parseInt(b.modifiedRoll) - parseInt(a.modifiedRoll));

initResults.forEach((result, index) => {
const name = result.name;
const newRow = document.getElementById(`${name}Row`).parentNode.parentNode;
ref.leftParty.insertBefore(newRow, ref.leftParty.childNodes[index]);
});


});

},

};

export default party;



