// Import the necessary module
import editor from "./editor.js";

import ref from "./ref.js";
import Events from "./events.js";
import Storyteller from "./storyteller.js";
import NPCbuild from "./classes.js";
import load from "./load.js";
import expandable from "./expandable.js";

// Define the NPCs module
const NPCs = {

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

addNPCInfo(npcName) {
  
const findNPC = npcName.replace(/-/g, ' ');
let foundNPC = load.Data.npcs.find(npc => npc.name === findNPC);

if (foundNPC) {

let npcContent = ``;
ref.Centre.innerHTML = '';
ref.Left.innerHTML = '';


// Ref.centreToolbar.style.display = 'flex';
ref.Centre.style.display = 'block';
ref.Left.style.display = 'block';

//If needed, make copy Obj for basis of new data entry.
if (editor.makeNew === true) {

  const reservedTerms = ['id', 'key', 'type', 'subtype', 'active', 'order','color'];
  
  // Create a deep copy of the original object
  const newObj = JSON.parse(JSON.stringify(foundNPC));
  
  // Generate a unique ID for the new object
  newObj.id = load.generateUniqueId(load.Data[foundNPC.key], 'entry');
  newObj.name = 'NPC ' + newObj.id;
  newObj.description = 'A vague humanoid lacking description; giving NPC energy.'
  
  foundNPC = newObj
  // Print the first spell in load.Data to see if it's modified
  //console.log(load.Data.spells[0]);
  
  }

//0. Make Hidden MetaData -- KEY, ID
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
  pair="npcs"
  id="key"
  value="npcs">`;
  
  keyArea.innerHTML = keyContent;
  ref.Left.appendChild(keyArea);
  
  const idArea = document.createElement('div');
  idArea.id = 'currentIdArea';
  
  let idContent =  
  `<label class="entry-label" 
  style="display: none"
  divId="id">
  </label>
  <input
  class="entry-input currentId" 
  style="display:none"
  divId="id"
  id="currentId"
  value="${foundNPC.id || 'N/A'} ">`;
  
  idArea.innerHTML = idContent;
  ref.Left.appendChild(idArea);
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
ref.Centre.appendChild(nameContainer);

nameContainer.addEventListener('click', function() {
nameContainer.querySelector('.leftText').focus();
nameContainer.querySelector('.leftText').select();
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
ref.Centre.appendChild(backStoryText);
ref.Centre.style.display = 'block';

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

//4. CLASS & LEVEL
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
ref.Left.appendChild(classContainer);

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
ref.Left.appendChild(levelContainer);

levelContainer.addEventListener('click', function() {
levelContainer.querySelector('.centreNumber').focus();
levelContainer.querySelector('.centreNumber').select();
});


const colorContainer = document.createElement('div');

let colorContent =  
`<h3>
<label class="entry-label expandable orange" 
divId="color">
Color
</label>
<input 
class="entry-input leftTextshort white"
pair="color" 
type="text" 
id= "color"
value="${foundNPC.color}">
</h3><hr>`;

colorContainer.innerHTML = colorContent;
ref.Left.appendChild(colorContainer);

colorContainer.addEventListener('click', function() {
colorContainer.querySelector('.leftTextshort').focus();
colorContainer.querySelector('.leftTextshort').select();
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
ref.Left.appendChild(hitPointsCont);

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
ref.Left.appendChild(attackBonusCont);

attackBonusCont.addEventListener('click', function() {
attackBonusCont.querySelector('.centreNumber').focus();
attackBonusCont.querySelector('.centreNumber').select();
});

}

const container = document.createElement('div');
container.classList.add('form');
container.id = 'npcInfo'

//MONSTER STUFF
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
ref.Left.appendChild(statContainer);

statContainer.addEventListener('click', function() {
statContainer.querySelector('.centreStat').focus();
statContainer.querySelector('.centreStat').select();
});

}
});

//Tags
if(foundNPC){

  const container = document.getElementById(editor.buildSection('Tags', foundNPC));
  
  if(foundNPC.tags){
  //console.log(obj.tags)
  let tagsToAdd = foundNPC.tags
  tagsToAdd.sort((a, b) => a.key.localeCompare(b.key));
  //console.log(tagsToAdd)   
  tagsToAdd.forEach(tag => {
  
  let index = load.Data[tag.key].findIndex(obj => parseInt(obj.id) === parseInt(tag.id));
  let tagName = load.Data[tag.key][index].name
  
  const taggedArea = document.createElement('div');
  let tagHTML = 
  `<h3>
  <span 
  class = "tag"
  tagid = ${tag.id} 
  tagkey = ${tag.key}
  >
  ${tagName}
  </span>
  </h3>`;
  
  taggedArea.innerHTML = tagHTML;
  container.appendChild(taggedArea);
  
  taggedArea.style.color = load.Data[tag.key][index].color;

  taggedArea.addEventListener('click', (event) => {

  if(event.shiftKey){ //shift-click
  //Remove tag from item.
  event.preventDefault();
  //Remove tag from item.
  foundNPC.tags = foundNPC.tags.filter(item => item.id !== tag.id);

  //Remove item from other item's tags.
  let delTags = load.Data[tag.key][index].tags
  //console.log(delTags, foundNPC.id)
  delTags = delTags.filter(item => parseInt(item.id) !== foundNPC.id);
  //console.log(delTags)
  load.Data[tag.key][index].tags = delTags;

  //Repackage.
  NPCs.buildNPC();
  NPCs.addNPCInfo(foundNPC.name);   
  }else if(event.button === 0){ 
  //find tagObj based on Name!
  if(tag.key === 'npcs'){
  NPCs.addNPCInfo(load.Data[tag.key][index].name);
  }else{
  editor.createForm(load.Data[tag.key][index]);   
  }
  }})
  });
  }
  
  }

if (foundNPC.Skills){

  let textContent = foundNPC.class === 'Cleric'? 'Turn Undead' : foundNPC.class + ' Skills';
  
  const container = document.getElementById(editor.buildSection(textContent, foundNPC));  

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
container.appendChild(skillContainer);

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
    container.appendChild(turnContainer);
    
    turnContainer.addEventListener('click', function() {
    turnContainer.querySelector('.leftText').focus();
    turnContainer.querySelector('.leftText').select();
  });
}
});
      
}}

if (foundNPC.magic){

let textContent = foundNPC.class === 'Cleric' ? 'Orsons' : 'Spells';

const container = document.getElementById(editor.buildSection(textContent, foundNPC)); 

foundNPC.magic.forEach(spell => {
  const spellContainer = document.createElement('div');
  //console.log(spell)
  
  let spellBlock =
  `<h3><label class="expandable orange" data-content-type="rule" divId="${spell}">
  ${spell} 
  </label>
  <br></h3>`;
  
  spellContainer.innerHTML = spellBlock;
  container.appendChild(spellContainer);
  
  spellContainer.addEventListener('click', function() {
  let spellObj = load.Data.spells.find(spellObj => spellObj.name === spell)
  editor.createForm(spellObj);
  });
  });

}

if(foundNPC.savingThrows){

  const container = document.getElementById(editor.buildSection('Saving Throws', foundNPC)); 

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
  container.appendChild(saveContainer);
  
  saveContainer.addEventListener('click', function() {
  saveContainer.querySelector('.centreNumber').focus();
  saveContainer.querySelector('.centreNumber').select();
  });
  }});
};


//Make Inventory
if(foundNPC){

}

if (foundNPC.treasure) {

  const container = document.getElementById(editor.buildSection('Treasure', foundNPC));
const treasureContainer = document.createElement('div');

let treasure = foundNPC.treasure[0]

console.log(foundNPC.name, treasure)
const allEmptyOrZero = Object.values(treasure).every(value => value.length === 0 || value === 0);

let treasureContent = 

`${!allEmptyOrZero ? `` : '' }`  +

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
container.appendChild(treasureContainer);

treasureContainer.addEventListener('click', function() {
treasureContainer.querySelector('.centreNumber').focus();
treasureContainer.querySelector('.centreNumber').select();
});

};


expandable.showFloatingExpandable();

}},

};

// Export the NPCs module
export default NPCs;
