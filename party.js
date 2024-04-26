import ref from "./ref.js";
import load from "./load.js";
import form from "./form.js";
import helper from "./helper.js";
import NPCs from "./npcs.js";

const party = {

loadParty(){

ref.leftParty.innerHTML = '';
let membersList = load.Data.townText.party;
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
load.Data.townText.party = membersList;

//Repackage.
party.loadParty();

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

let buttonHTML = `<br><button id="initButton" class="partyButton">Initiative</button>`;

buttonDiv.innerHTML = buttonHTML;
ref.leftParty.appendChild(buttonDiv);

const initButton = document.getElementById("initButton");

initButton.addEventListener('click', () => {

const rows = document.querySelectorAll(".member-row");
const initResults = [];

rows.forEach(row => {

//Fetch npcObj
const nameCol = row.getElementsByClassName('name-column');
const name = nameCol[0].id;
const npcObj = load.Data.npcs.find(npc => npc.name === name)

//Roll Initiative with Dex Modifier.
const initCol = row.getElementsByClassName('init-column');
const roll = helper.rollDice(6) + npcObj.dexMod;
initCol[0].innerHTML = roll;
initResults.push({name,roll})
npcObj.initiative = roll;

});

// Sort the memberResults array based on the rollResult
initResults.sort((a, b) => b.roll - a.roll);

initResults.forEach((result, index) => {
const name = result.name;
const newRow = document.getElementById(`${name}Row`).parentNode.parentNode;
ref.leftParty.insertBefore(newRow, ref.leftParty.childNodes[index]);
});


});

},

};

export default party;



