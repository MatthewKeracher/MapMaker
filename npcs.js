// Import the necessary module
import editor from "./editor.js";

import Ref from "./ref.js";
import Items from "./items.js";
import Monsters from "./monsters.js";
import Spells from "./spells.js";
import Events from "./events.js";
import Storyteller from "./storyteller.js";
import NPCbuild from "./classes.js";
import load from "./load.js";



// Define the NPCs module
const NPCs = {
npcArray: [],
npcSearchArray:[],
namedNPCs: [],
groupedNPCs : [],
absentNPCs: [],
uniqueNames: [],

loadAndBuild: async function(fileContent) {
try {
// Wait for the handleFileLoad to complete
await load.handleFileLoad(fileContent);

// Now you can call buildNPC safely
await this.buildNPC();
} catch (error) {
console.error('Error loading file and building NPC:', error);
}
},

buildNPC: function() {

//console.log('calling buildNPC()')

const npcInstances = load.Data.npcs.map(npcData => new NPCbuild(npcData));

// Now npcInstances is an array of NPC objects with the data from npcArray
// You can store or use these instances as needed.
load.Data.npcs = npcInstances;

// For example, you can log the properties of each NPC instance
//npcInstances.forEach(npc => console.log(npc));

},

loadNPC: function(NPCArray) {

Events.loadEventsList(load.Data.events, Ref.Centre, 'eventsManager');

},

sortNPCs: function(npc, npcNameDiv, sortEvents) {

//Takes NPCs one at a time and sorts them. 

// Is the NPC named directly in sortEvents?
sortEvents.forEach(event => {
if (npc.name === event.npc && !this.uniqueNames.includes(npc.name)) {
npcNameDiv.innerHTML = `<span class = "white"> ${npc.name} </span>` ;
this.groupedNPCs.push(npcNameDiv);
this.uniqueNames.push(npc.name);
} 
});

//Is the NPC named indirectly through tags in sortEvents?
sortEvents.forEach(event => {
const npcTags = npc.tags ? npc.tags.split(',').map(item => item.trim()) : [];
const eventTags = event.npc.split(',').map(item => item.trim());

const matchingTag = eventTags.find(eventTag => npcTags.includes(eventTag) && !this.uniqueNames.includes(eventTag));

if (matchingTag) {
npcNameDiv.innerHTML = `<span class="white">${npc.name}</span>`;
this.groupedNPCs.push(npcNameDiv);
this.uniqueNames.push(npc.name);
}
});

// Mark absent NPCs are somewhere else.
if (!this.uniqueNames.includes(npc.name)) {
npcNameDiv.innerHTML = `${npc.name}` ;
this.absentNPCs.push(npcNameDiv);
}

},

fillNPCForm: function(npc, npcNameDiv){
// Add click event listener to each NPC name
npcNameDiv.addEventListener('click', () => {

if(editor.editPage === 3){

Ref.npcForm.style.display = 'flex'; // Display the npcForm

//console.log(npc)
Ref.npcId.value = parseInt(npc.id);
Ref.npcName.value = npc.name;
Ref.npcTags.value = npc.tags;

//Ref.MorningLocation.value = npc.MorningLocation;

Ref.npcLevel.value = npc.level;
Ref.npcClass.value = npc.class;
Ref.monsterTemplate.value = npc.monsterTemplate;

Ref.STR.value = npc.str;  
Ref.DEX.value = npc.dex; 
Ref.INT.value = npc.int; 
Ref.WIS.value = npc.wis; 
Ref.CON.value = npc.con; 
Ref.CHA.value = npc.cha; 

Ref.Backstory.value = npc.Backstory;
}else{

//Ref.eventNPC.value = npc.name


}

});

},

saveNPC: function() {

//if not empty

// Check if an NPC with the same name already exists
const index = this.npcArray.findIndex(npc => npc.id === parseInt(Ref.npcId.value) && npc.name === Ref.npcName.value);

//const index = this.npcArray.findIndex(npc => npc.name === Ref.npcName.value);

const npc = {
id: parseInt(Ref.npcId.value),
name: Ref.npcName.value,
tags: Ref.npcTags.value,
level: Ref.npcLevel.value,
class: Ref.npcClass.value,
monsterTemplate: Ref.monsterTemplate.value,
str: Ref.STR.value,
dex: Ref.DEX.value,
int: Ref.INT.value,
wis: Ref.WIS.value,
con: Ref.CON.value,
cha: Ref.CHA.value,

Backstory: Ref.Backstory.value,
};

console.log(index)

if (index !== -1 && Ref.npcName.value !== '') {
// Update the existing NPC entry
this.npcArray[index] = npc;
console.log('NPC updated:', npc);
} 

else if (Ref.npcName.value === '' && Ref.npcTags.value !== '' && Ref.monsterTemplate.value === ''){
console.log('Add ' + Ref.npcTags.value + ' to all Selected NPCs')
this.bulkAdd(Ref.npcTags.value, 'tags')
} 

else if (Ref.npcName.value === '' && Ref.npcTags.value === '' && Ref.monsterTemplate.value !== ''){
console.log('Add ' + Ref.monsterTemplate.value + ' to all Selected NPCs')
this.bulkAdd(Ref.monsterTemplate.value, 'monsterTemplate')
} 

else {
// Add the created NPC to the npcArray
npc.id = Array.generateUniqueId(this.npcArray, 'entry');
Ref.npcId.value = npc.id
this.npcArray.push(npc);
console.log('New NPC added:', npc);

}

},

bulkAdd(data, target){

// Iterate over itemsSearchArray and update Tags
//console.log('bulkAdd')

if(target === 'tags'){

this.npcSearchArray.forEach(npc => {

if (npc.tags) {
// Split existing Tags into an array
const existingTags = npc.tags.split(',').map(tag => tag.trim());

// Check if the new tag is not already present
if (!existingTags.includes(data)) {
// If not present, append the new tag value
npc.tags += `, ${data}`;
}
} else {
// If Tags is empty, set it to the new tag value
npc.tags = data;
}

})};

if (target === 'monsterTemplate'){
//console.log('monster')
this.npcSearchArray.forEach(npc => {
npc.monsterTemplate = data

})}},

clearForm: function(form){

// const inputFields = form.querySelectorAll('input, textarea, select'); 
// inputFields.forEach(formElement => {
// if (formElement.tagName === 'SELECT') {
// // For select elements, set the selected index to -1 to clear the selection
// formElement.selectedIndex = -1;
// } else {
// formElement.value = ''; 
// }
// });

// Array.generateLocationOptions();

},

getNPCs(subLocation, npcEvents) {
const presentNPCsSet = new Set();

for (const npc of load.Data.npcs) {
for (const event of npcEvents) {

const eventNpcList = event.npc.split(',').map(item => item.trim());
const npctagsList = npc.tags.split(',').map(item => item.trim());

const npcNameMatches = npc.name === event.npc;
const npcInEventList = eventNpcList.includes(npc.name);
const eventIntagsList = npctagsList.includes(event.npc);
const commonElementExists = npc.tags && event.npc && eventNpcList.some(tag => npctagsList.includes(tag));
const isHere = event.location === subLocation;

if ((npcNameMatches || npcInEventList || eventIntagsList || commonElementExists) &&
parseInt(event.active) === 1 &&
event.target === 'NPC' &&
isHere) {
const npcStory = this.generateNPCStory(npc, subLocation, npcEvents);
presentNPCsSet.add(JSON.stringify({ name: npc.name, story: npcStory }));
}

}}

// Convert the set back to an array
const presentNPCs = [...presentNPCsSet].map(JSON.parse);
//console.log(subLocation, presentNPCs)
return presentNPCs;
},

generateNPCStory(npc, subLocation, npcEvents) {
let story = ``;

//Search active events to see if any apply based on the location, or the individual. 

const presentNPCEvents = npcEvents.filter(event => {
const eventNpcList = event.npc.split(',').map(item => item.trim());
const npctagsList = npc.tags.split(',').map(item => item.trim());

const npcNameMatches = npc.name === event.npc;
const npcInEventList = eventNpcList.includes(npc.name);
const eventIntagsList = npctagsList.includes(event.npc);
const commonElementExists = npc.tags && event.npc && eventNpcList.some(tag => npctagsList.includes(tag));

return (
(npcNameMatches || npcInEventList || eventIntagsList || commonElementExists) &&
event.target === 'NPC' &&
parseInt(event.active) === 1 &&
npc.tags !== '' &&
(event.location === subLocation || event.location === 'All')
);
});


let relevantTag = ''; // Variable to store the relevant part of npc.tags

if (presentNPCEvents.length > 0) {
// Find the first matching item.trim() in npc.tags
const matchingItem = npc.tags.split(',').map(item => item.trim()).find(item => presentNPCEvents.some(event => event.npc === item));

if (matchingItem) {
relevantTag = matchingItem;
} else {relevantTag = npc.class} 
}

story += `<span class="expandable npc" data-content-type="npc" divId="${npc.name.replace(/\s+/g, '-')}"> ${npc.name} is here. </span> <br>`;

for (const event of presentNPCEvents) {
// Define eventNpcList and npctagsList within the loop
const eventNpcList = event.npc.split(',').map(item => item.trim());
const npctagsList = npc.tags.split(',').map(item => item.trim());

const sharedTag = event.npc && eventNpcList.find(tag => npctagsList.includes(tag));

if (sharedTag) {
story += 
`<span class="expandable hotpink" 
divId="${event.name}"data-content-type="events">${sharedTag}. </span>`;
} else {
story += `<span class="expandable hotpink" 
divId="${event.name}"data-content-type="events">${event.group}. </span>`;
}

const options = event.description.split('??').filter(Boolean);

if (options.length > 0) {
const randomIndex = Math.floor(Math.random() * options.length);
const selectedOption = options[randomIndex].trim();

story += `${selectedOption}<br>`;
} else {
story += `${event.description}<br>`;
}
}

return story;
},

addNPCInfo(npcName) {

const findNPC = npcName.replace(/-/g, ' ');
const foundNPC = load.Data.npcs.find(npc => npc.name === findNPC);

if (foundNPC) {

let npcContent = ``;
Ref.Centre.innerHTML = '';
Ref.Left.innerHTML = '';


// Ref.centreToolbar.style.display = 'flex';
Ref.Centre.style.display = 'block';
Ref.Left.style.display = 'block';

//0. Make Hidden MetaData
if(foundNPC){

  const keyArea = document.createElement('div');
  keyArea.id = 'keyArea';
  
  let keyContent =  
  `<label class="entry-label" 
  style="display: none"
  divId="key">
  </label>
  <input
  class="entry-input" 
  style="display:none"
  divId="key"
  value="npcs">`;
  
  keyArea.innerHTML = keyContent;
  Ref.Left.appendChild(keyArea);
  
  const idArea = document.createElement('div');
  idArea.id = 'centreId';
  
  let idContent =  
  `<label class="entry-label" 
  style="display: none"
  divId="id">
  </label>
  <input
  class="entry-input centreId" 
  style="display:none"
  divId="id"
  id="currentId"
  value="${foundNPC.id || 'N/A'} ">`;
  
  idArea.innerHTML = idContent;
  Ref.Left.appendChild(idArea);
  };

// 1. NAME
if(foundNPC){
const nameContainer = document.createElement('div');

let nameContent =  
`<label class="entry-label" 
style="display: none"
divId="name">
</label>
<h2><input 
class="entry-input centreName orange" 
style="font-family:'SoutaneBlack'"
type="text" 
divId="npcName"
value="${foundNPC.name}"></h2><hr>`;

nameContainer.innerHTML = nameContent;
Ref.Centre.appendChild(nameContainer);

nameContainer.addEventListener('click', function() {
nameContainer.querySelector('.leftText').focus();
nameContainer.querySelector('.leftText').select();
});
}

// 2. TAGS
if(foundNPC){
const tagsContainer = document.createElement('div');

let tagsContent =  
`<label class="entry-label" 
style="display: none"
divId="tags">
</label>
<h3><input 
class="centreTag entry-input" 
type="text" 
divId= "npcTags"
value="${foundNPC.tags}"></h3><hr>`;

//${foundNPC.monsterTemplate? `${Monsters.getMonsters('*' + foundNPC.monsterTemplate + '*')} <br>` : ''}

tagsContainer.innerHTML = tagsContent;
Ref.Centre.appendChild(tagsContainer);

tagsContainer.addEventListener('click', function() {
tagsContainer.querySelector('.centreTag').focus();
//tagsContainer.querySelector('.centreTag').select();
});
}

//3. BIO
if(foundNPC){

const backStoryText = document.createElement('div');

let backStoryContent =  
`<label class="entry-label"
style="display: none"
divId="description">
</label>
<textarea
id="descriptionText"
class="entry-input centreText" 
>`;

backStoryText.innerHTML = backStoryContent;
Ref.Centre.appendChild(backStoryText);
Ref.Centre.style.display = 'block';

//Attach and display.
const extraSpace = 125
//console.log(extraSpace)

const descriptionText = document.getElementById('descriptionText');
descriptionText.textContent = foundNPC.description || 'Insert information about ' + foundNPC.name + ' here.';

// Set the initial height based on the scroll height of the content
descriptionText.style.height = 'auto';
descriptionText.style.height = descriptionText.scrollHeight + 'px';


// Add event listener for input event
descriptionText.addEventListener('input', function() {
    // Set the height based on the scroll height of the content
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
});
}


if (foundNPC.class && foundNPC.class !== "N/A") {

const classContainer = document.createElement('div');

let classContent =  
`<h3>
<label class="entry-label expandable orange" 
data-content-type="rule" 
divId="class">
Class
</label>
<input 
pair="class"
class="entry-input leftTextshort white" 
type="text" 
id= "typeEntry"
value="${foundNPC.class}">
</h3>`;

classContainer.innerHTML = classContent;
Ref.Left.appendChild(classContainer);

classContainer.addEventListener('click', function() {
classContainer.querySelector('.leftTextshort').focus();
classContainer.querySelector('.leftTextshort').select();
});

const levelContainer = document.createElement('div');

let levelContent =  
`<h3>
<label class="entry-label expandable orange" 
data-content-type="rule" 
divId="level">
Level
</label>
<input 
maxlength="2"
pair="level"
class="entry-input centreNumber white" 
type="text" 
id= "subTypeEntry"
value="${foundNPC.level}">
</h3><hr>`;

levelContainer.innerHTML = levelContent;
Ref.Left.appendChild(levelContainer);

levelContainer.addEventListener('click', function() {
levelContainer.querySelector('.centreNumber').focus();
levelContainer.querySelector('.centreNumber').select();
});

const hitPointsCont = document.createElement('div');

let hitPoints = 
`<h3>
<label class="expandable orange" 
data-content-type="rule" 
divId="hitPoints">
Hit Points
</label>
<input 
maxlength="3"
class="centreNumber white" 
type="text" 
divId= "npcHitPoints"
value="${foundNPC.hitPoints}">
</h3>`;

hitPointsCont.innerHTML = hitPoints;
Ref.Left.appendChild(hitPointsCont);

hitPointsCont.addEventListener('click', function() {
hitPointsCont.querySelector('.centreNumber').focus();
hitPointsCont.querySelector('.centreNumber').select();
});

const attackBonusCont = document.createElement('div');

let attackBonus = 
`<h3>
<label class="expandable orange" 
data-content-type="rule" 
divId="attackBonus">
Attack Bonus 
</label>
<input 
maxlength="3"
class="centreNumber white" 
type="text" 
divId= "npcAttackBonus"
value="${foundNPC.attackBonus}">
</h3>`;

attackBonus += `<hr>`;

attackBonusCont.innerHTML = attackBonus;
Ref.Left.appendChild(attackBonusCont);

attackBonusCont.addEventListener('click', function() {
attackBonusCont.querySelector('.centreNumber').focus();
attackBonusCont.querySelector('.centreNumber').select();
});

}

const container = document.createElement('div');
container.classList.add('form');
container.id = 'npcInfo'


if (foundNPC.monsterTemplate){

npcContent += `<h3>

<span 
class="expandable hotpink"  
data-content-type="rule" 
divId="Monster Damage">
ATTACKS:
</span>
${foundNPC.attacks}
<br>

<span
class="expandable hotpink"
data-content-type="rule"
divId="Monster Damage">
DAMAGE:
</span>
${foundNPC.damage}
<br>

<span class="expandable hotpink"
data-content-type="rule"
divId="Monster Armour Class">
ARMOUR CLASS:
</span>
${foundNPC.AC}
<br>

<span class="expandable hotpink"
data-content-type="rule"
divId="Monster Movement">
MOVEMENT:
</span>
${foundNPC.movement}
<br>

<span class="expandable hotpink"
data-content-type="rule" 
divId="Monster XP">
XP:
</span>
${foundNPC.XP}
<br>

</h3>`;

}

const statNames = {
"STR": "Strength",
"DEX": "Dexterity",
"INT": "Intelligence",
"WIS": "Wisdom",
"CON": "Constitution",
"CHA": "Charisma"
};

["STR", "DEX", "INT", "WIS", "CON", "CHA"].forEach(stat => {
if (foundNPC[stat.toLowerCase()]) {
const statContainer = document.createElement('div');

let statBlock = `<h2>`;

statBlock +=
`<label class="entry-label expandable teal" data-content-type="rule" divId="${stat.toLowerCase()}" style="letter-spacing: 0.18vw;">
${stat}: 
</label>
<input 
maxlength="2"
class="entry-input centreStat white" 
style="left: '15vw'; font-family:'SoutaneBlack'"
type="text" 
divId= "npc${stat}"
value="${foundNPC[stat.toLowerCase()]}">
(${foundNPC[`${stat.toLowerCase()}Mod`]})
<br>`;

statBlock += `</h2>`;

statContainer.innerHTML = statBlock;
Ref.Left.appendChild(statContainer);

statContainer.addEventListener('click', function() {
statContainer.querySelector('.centreStat').focus();
statContainer.querySelector('.centreStat').select();
});

}
});

if (foundNPC.tags){

//Add Relationships
if(foundNPC.tags){  
// Split the foundNPC tags into an array
const tags = foundNPC.tags.split(',').map(item => item.trim());

const taggedNPCs = {};

// Iterate over each NPC
load.Data.npcs.forEach(npc => {
// Split the npc tag string into an array of tags
const npcTags = npc.tags.split(',').map(item => item.trim());
const commonTags = tags.filter(tag => npcTags.includes(tag));

// Iterate over each common tag associated with the NPC
commonTags.forEach(tag => {
if (!taggedNPCs[tag]) {
taggedNPCs[tag] = [];
}

if(foundNPC.id !== npc.id){
taggedNPCs[tag].push(npc.id);
};
});
});

let totalLength = 0;

for (const key in taggedNPCs) {
  if (Object.prototype.hasOwnProperty.call(taggedNPCs, key)) {
    totalLength += taggedNPCs[key].length;
  }
}

if(totalLength !== 0){
// Add Header
const relationshipsHeader = document.createElement('div');
let relationshipsHeaderContent = 
`<hr><h3>
<span class='cyan'>
Relationships:
</span></h3>`;

relationshipsHeader.innerHTML = relationshipsHeaderContent;

Ref.Left.appendChild(relationshipsHeader);
}

for (const tag in taggedNPCs) {

if (taggedNPCs.hasOwnProperty(tag)) {
// Add Header

const evObj = load.Data.events.find(event => event.group === tag && event.target === 'NPC');
//console.log(tag, evObj)

const relationshipHeader = document.createElement('div');
let relationshipContent = 
`<h3>
<span class='orange'>
${tag}
</span></h3>`;

relationshipHeader.innerHTML = relationshipContent;

if(taggedNPCs[tag].length > 0){
Ref.Left.appendChild(relationshipHeader);

relationshipHeader.addEventListener('click', function(){
editor.createForm(evObj);
})
};

// Add Names
const npcIds = taggedNPCs[tag];
npcIds.forEach(npcId => {
const npcObj = load.Data.npcs.find(npc => parseInt(npc.id) === npcId);

const npcNameArea = document.createElement('div');
let npcNameContent = `<h3><span>${npcObj.name}</span></h3>`;

npcNameArea.innerHTML = npcNameContent;
Ref.Left.appendChild(npcNameArea);

npcNameArea.style.color = 'lightgray';

npcNameArea.addEventListener('mouseenter', function(){
this.style.color = 'white';
})

npcNameArea.addEventListener('mouseleave', function(){
npcNameArea.style.color = 'lightgray'
})

npcNameArea.addEventListener('click', function(){
NPCs.addNPCInfo(npcObj.name);
})


});
}
}
}

//Add Current Whereabouts
if(foundNPC.tags){

 // Split the foundNPC tags into an array
const tags = foundNPC.tags.split(',').map(item => item.trim());
tags.push(foundNPC.name);
const taggedLocations = {};

//subLocations to search
const subLocations = load.Data.events.filter(subLoc => subLoc.target === 'NPC');

// Iterate over each NPC
subLocations.forEach(event => {

// Split the npc tag string into an array of tags
const locEvTags = event.npc.split(',').map(item => item.trim());
const commonTags = tags.filter(tag => locEvTags.includes(tag));

// Iterate over each common tag associated with the subLocation.
commonTags.forEach(tag => {
if (!taggedLocations[tag]) {
taggedLocations[tag] = [];
}

taggedLocations[tag].push(event.id);

});
}); 

let totalLength = 0;

for (const key in taggedLocations) {
  if (Object.prototype.hasOwnProperty.call(taggedLocations, key)) {
    totalLength += taggedLocations[key].length;
  }
}

if(totalLength !== 0){
// Add Header
const relationshipsHeader = document.createElement('div');
let relationshipsHeaderContent = 
`<hr><h3>
<span class='cyan'>
Whereabouts:
</span></h3>`;

relationshipsHeader.innerHTML = relationshipsHeaderContent;
Ref.Left.appendChild(relationshipsHeader);
}

console.log(taggedLocations)
for (const tag in taggedLocations) {

  if (taggedLocations.hasOwnProperty(tag)) {
    const locIds = taggedLocations[tag];
    locIds.forEach(locId => {
    const taggedEvent = load.Data.events.find(obj => parseInt(obj.id) === locId);
    let header = taggedEvent.location;

    if(taggedEvent.location !== 'All'){
    
    let subLocObj = load.Data.events.find(obj => obj.name === taggedEvent.location && obj.target === 'Location');
    
    //console.log(taggedEvent, subLocObj)

    if(subLocObj){header = subLocObj.name}else{subLocObj= load.Data.locations.find(loc => loc.name = taggedEvent.location)};

  const whereaboutsHeader = document.createElement('div');
  let whereaboutsContent = 
  `<h3>
  <span class='orange'>
  ${header}
  </span></h3>`;
  
  whereaboutsHeader.innerHTML = whereaboutsContent;
  
  if(taggedLocations[tag].length > 0){
  Ref.Left.appendChild(whereaboutsHeader);
  
  whereaboutsHeader.addEventListener('click', function(){
  console.log(subLocObj)
  editor.createForm(subLocObj);
  })
  }};

  })
}
}}
};

if (foundNPC.Skills){

const skillTypeContainer = document.createElement('div');
skillTypeContainer.classList.add('no-hover');

let skillsType = 
`<hr><h3><span class="expandable cyan" data-content-type="rule"
divId="${foundNPC.class === 'Cleric'? `Turn Undead` : `${foundNPC.class} Skills`}">
${foundNPC.class === 'Cleric'? `Turn Undead` : `${foundNPC.class} Skills`}:</span> <br></h3>`

skillTypeContainer.innerHTML = skillsType;
Ref.Left.appendChild(skillTypeContainer);

const skillNames = {
  "removeTraps": "Remove Traps",
  "pickPockets": "Pick Pockets",
  "moveSilently": "Move Silently",
  "climbWalls": "Climb Walls",
  "hide": "Hide",
  "listen": "Listen",
  "poison": "Poison",
  "tracking": "Tracking"
  };
  
["removeTraps", "pickPockets", "moveSilently", "climbWalls", "hide", "listen", "poison", "tracking"].forEach(skill => {
if (foundNPC.Skills[skill]) {
const skillContainer = document.createElement('div');


let skillBlock = `<h3>`;

skillBlock +=
`<label class="expandable orange" data-content-type="rule" divId="${skill}">
${skillNames[skill]}
</label>
<input 
maxlength="2"
class="centreNumber white" 
type="text" 
divId= "npc${skill}"
value="${foundNPC.Skills[skill]}">
<br>`;

skillBlock += `</h3>`;

skillContainer.innerHTML = skillBlock;
Ref.Left.appendChild(skillContainer);

skillContainer.addEventListener('click', function() {
skillContainer.querySelector('.centreNumber').focus();
skillContainer.querySelector('.centreNumber').select();
});
}
});

// Cleric-specific skills
if(foundNPC.class === 'Cleric'){

  ["Skeleton", "Zombie", "Ghoul", "Wight", "Wraith", "Mummy", "Spectre", "Vampire", "Ghost"].forEach(creature => {
    
    if (foundNPC.Skills[creature] !== 'No') {
    
    const turnContainer = document.createElement('div');
   
    
    const turnValue = 
    foundNPC.Skills[creature] && foundNPC.Skills[creature] === 'Damaged'? 
    `Takes ${foundNPC.level}d8 Damage`: 
    foundNPC.Skills[creature] && foundNPC.Skills[creature] !== 'Damaged' && foundNPC.Skills[creature] !== 'No' ? 
    `${foundNPC.Skills[creature]}` :'';
    
    let turnBlock =
    `<h3>
    <label class="expandable orange" data-content-type="rule" divId="${creature}">
    ${creature}:
    </label>
    <input 
    class="centreNumber white" 
    type="text" 
    divId= "npc${creature}"
    value="${turnValue}">
    <br>
    </h3>`;
    
    turnContainer.innerHTML = turnBlock;
    Ref.Left.appendChild(turnContainer);
    
    turnContainer.addEventListener('click', function() {
    turnContainer.querySelector('.leftText').focus();
    turnContainer.querySelector('.leftText').select();
  });
}
});
      
}}

if (foundNPC.magic){

const magicHeaderContainer = document.createElement('div');
magicHeaderContainer.classList.add('no-hover');

let magicHeader = `<hr><h3>`;

magicHeader += `${foundNPC.class === 'Cleric' ? `<span class="expandable cyan" data-content-type="rule" divId="Orsons">Orsons:</span>`:
`<span class="expandable cyan" data-content-type="rule" divId="Spellcasting">Spells:</span>`}<br>`;

magicHeader += `</h3>`;

magicHeaderContainer.innerHTML = magicHeader;
Ref.Left.appendChild(magicHeaderContainer);

foundNPC.magic.forEach(spell => {
  const spellContainer = document.createElement('div');
  //console.log(spell)
  
  let spellBlock =
  `<h3><label class="expandable orange" data-content-type="rule" divId="${spell}">
  ${spell} 
  </label>
  <br></h3>`;
  
  spellContainer.innerHTML = spellBlock;
  Ref.Left.appendChild(spellContainer);
  
  spellContainer.addEventListener('click', function() {
  let spellObj = load.Data.spells.find(spellObj => spellObj.name === spell)
  editor.createForm(spellObj);
  });
  });

}

if(foundNPC.savingThrows){
const saveNamesHeaderContainer = document.createElement('div');
saveNamesHeaderContainer.classList.add('no-hover');

let saveNamesHeader = 
`<hr><h3><span class="expandable cyan" data-content-type="rule"
divId="savingThrowsHeader">
Saving Throws:</span><br></h3>`

saveNamesHeaderContainer.innerHTML = saveNamesHeader;
Ref.Left.appendChild(saveNamesHeaderContainer);


const saveNames = {
  "deathRay": "Death Ray or Poison",
  "magicWands": "Magic Wands",
  "paralysisPetrify": "Paralysis or Petrify",
  "dragonBreath": "Dragon Breath",
  "spells": "Spells",
  };
  
  ["deathRay", "magicWands", "paralysisPetrify", "dragonBreath", "spells"].forEach(save => {
  if (foundNPC.savingThrows[save]) {
  const saveContainer = document.createElement('div');
  
  let saveBlock =
  `<h3><label class="expandable orange" data-content-type="rule" divId="${save}">
  ${saveNames[save]}: 
  </label>
  <input 
  maxlength="2"
  class="centreNumber white" 
  type="text" 
  divId= "npc${save}"
  value="${foundNPC.savingThrows[save]}">
  <br></h3>`;
  
  saveContainer.innerHTML = saveBlock;
  Ref.Left.appendChild(saveContainer);
  
  saveContainer.addEventListener('click', function() {
  saveContainer.querySelector('.centreNumber').focus();
  saveContainer.querySelector('.centreNumber').select();
  });
  }});
};

if(foundNPC.inventory){

//Add INVENTORY Header
const inventoryHeader = document.createElement('div');
inventoryHeader.classList.add('no-hover');

let headerContent = 
`<hr><h3><span class="expandable cyan" data-content-type="rule"
divId="inventoryHeader">
Inventory:</span><br></h3>`

inventoryHeader.innerHTML = headerContent;
Ref.Left.appendChild(inventoryHeader);

//Add New Inventory Item.
if(foundNPC.inventory){

  const addInvArea = document.createElement('div');
  let addInvContent = `<h3><span class = 'leftText'>[Add New Inventory Item]</span></h3>`;
  
  addInvArea.innerHTML = addInvContent;
  Ref.Left.appendChild(addInvArea);
  
  addInvArea.style.color = 'lightgray'
  
  addInvArea.addEventListener('mouseenter', function(){
  this.style.color = 'lime';
  })
  
  addInvArea.addEventListener('mouseleave', function(){
  this.style.color = 'lightgray';
  })
  
  addInvArea.addEventListener('click', function(){
  
    editor.addItem = true;
    editor.loadList({ items: load.Data.items });
    

  })
  }

//Map through Inventory.

foundNPC.inventory.map(item => {

const itemContainer = document.createElement('div'); 

let itemContent =
`<h3>
<span class="centreText">
${Items.getItems(item.name)}
</span>
</h3>`

itemContainer.innerHTML = itemContent;
Ref.Left.appendChild(itemContainer);

itemContainer.addEventListener('click', function() {
editor.createForm(item);
});

});

}

if (foundNPC.treasure) {

const treasureContainer = document.createElement('div');

let treasure = foundNPC.treasure[0]

console.log(foundNPC.name, treasure)
const allEmptyOrZero = Object.values(treasure).every(value => value.length === 0 || value === 0);

let treasureContent = 

`${!allEmptyOrZero ? `<br><hr><span class= "hotpink"> Treasure:</span> <br>` : '' }`  +

`${treasure.Copper ? `<span class="expandable" data-content-type="rule" divId="Money"> ${treasure.Copper} Copper Pieces </span> <br>` : '' }`  +
`${treasure.Silver ? `<span class="expandable" data-content-type="rule" divId="Money"> ${treasure.Silver} Silver Pieces </span> <br>` : '' }`  +
`${treasure.Electrum ? `<span class="expandable" data-content-type="rule" divId="Money"> ${treasure.Electrum} Electrum Pieces </span> <br>` : '' }`  +
`${treasure.Gold ? `<span class="expandable" data-content-type="rule" divId="Money"> ${treasure.Gold} Gold Pieces </span> <br>` : '' }`  +
`${treasure.Platinum ? `<span class="expandable" data-content-type="rule" divId="Money"> ${treasure.Platinum} Platinum Pieces </span> <br>` : '' }`  +

//Loop through Gems
`${treasure.Gems.length > 0 ? `<span class="orange">
${treasure.Gems.map(gem => `
${gem.numberFound} ${gem.gemType} (${gem.type}; ${gem.baseValue} gp each)
`).join('<br>')}
</span><br>` : ''} ` +

//Loop through Jewelry
`${treasure.Jewelry.length > 0 ? `<span class="teal">
${treasure.Jewelry.map(Jewelry => `
${Jewelry.type} ${Jewelry.jewelryType} (${Jewelry.baseValue} gp)
`).join('<br>')}
</span><br>` : ''} ` +

//Loop through magicItems
`${treasure.magicItems.length > 0 ? `<span class="expandable lime">
${treasure.magicItems.map(item => `
${item.name} ${item.bonus}
`).join('<br>')}
</span><br>` : ''} ` ;


treasureContent += `</h3>`;

treasureContainer.innerHTML = treasureContent;
Ref.Left.appendChild(treasureContainer);

treasureContainer.addEventListener('click', function() {
treasureContainer.querySelector('.centreNumber').focus();
treasureContainer.querySelector('.centreNumber').select();
});

};


Storyteller.showFloatingExpandable();
}},

};

// Export the NPCs module
export default NPCs;
