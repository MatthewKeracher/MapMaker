// Import the necessary module
import Edit from "./edit.js";
import Array from "./array.js";
import Ref from "./ref.js";
import Items from "./items.js";
import Monsters from "./monsters.js";
import Spells from "./spells.js";
import Events from "./events.js";
import Storyteller from "./storyteller.js";
import NPCs from "./npcs.js";

// classes.js

class NPCbuild {
constructor(data) {

//Tables for each Class

//Magic User
this.magicUserTable = [
{ level: 1, exp: 0, hitDice: '1d4', spells: [1, 0, 0, 0, 0, 0] },
{ level: 2, exp: 2500, hitDice: '2d4', spells: [2, 0, 0, 0, 0, 0] },
{ level: 3, exp: 5000, hitDice: '3d4', spells: [2, 1, 0, 0, 0, 0] },
{ level: 4, exp: 10000, hitDice: '4d4', spells: [2, 2, 0, 0, 0, 0] },
{ level: 5, exp: 20000, hitDice: '5d4', spells: [2, 2, 1, 0, 0, 0] },
{ level: 6, exp: 40000, hitDice: '6d4', spells: [3, 2, 2, 0, 0, 0] },
{ level: 7, exp: 80000, hitDice: '7d4', spells: [3, 2, 2, 1, 0, 0] },
{ level: 8, exp: 150000, hitDice: '8d4', spells: [3, 3, 2, 2, 0, 0] },
{ level: 9, exp: 300000, hitDice: '9d4', spells: [3, 3, 2, 2, 1, 0] },
{ level: 10, exp: 450000, hitDice: '9d4+1', spells: [4, 3, 3, 2, 2, 0] },
{ level: 11, exp: 600000, hitDice: '9d4+2', spells: [4, 4, 3, 2, 2, 1] },
{ level: 12, exp: 750000, hitDice: '9d4+3', spells: [4, 4, 3, 3, 2, 2] },
{ level: 13, exp: 900000, hitDice: '9d4+4', spells: [4, 4, 4, 3, 2, 2] },
{ level: 14, exp: 1050000, hitDice: '9d4+5', spells: [4, 4, 4, 3, 3, 2] },
{ level: 15, exp: 1200000, hitDice: '9d4+6', spells: [5, 4, 4, 3, 3, 2] },
{ level: 16, exp: 1350000, hitDice: '9d4+7', spells: [5, 5, 4, 3, 3, 2] },
{ level: 17, exp: 1500000, hitDice: '9d4+8', spells: [5, 5, 4, 4, 3, 3] },
{ level: 18, exp: 1650000, hitDice: '9d4+9', spells: [6, 5, 4, 4, 3, 3] },
{ level: 19, exp: 1800000, hitDice: '9d4+10', spells: [6, 5, 5, 4, 3, 3] },
{ level: 20, exp: 1950000, hitDice: '9d4+11', spells: [6, 5, 5, 4, 4, 3] },
];

//Thief General
this.thiefTable = [
{ level: 1, exp: 0, hitDice: '1d4' },
{ level: 2, exp: 1250, hitDice: '2d4' },
{ level: 3, exp: 2500, hitDice: '3d4' },
{ level: 4, exp: 5000, hitDice: '4d4' },
{ level: 5, exp: 10000, hitDice: '5d4' },
{ level: 6, exp: 20000, hitDice: '6d4' },
{ level: 7, exp: 40000, hitDice: '7d4' },
{ level: 8, exp: 75000, hitDice: '8d4' },
{ level: 9, exp: 150000, hitDice: '9d4' },
{ level: 10, exp: 225000, hitDice: '9d4+2' },
{ level: 11, exp: 300000, hitDice: '9d4+4' },
{ level: 12, exp: 375000, hitDice: '9d4+6' },
{ level: 13, exp: 450000, hitDice: '9d4+8' },
{ level: 14, exp: 525000, hitDice: '9d4+10' },
{ level: 15, exp: 600000, hitDice: '9d4+12' },
{ level: 16, exp: 675000, hitDice: '9d4+14' },
{ level: 17, exp: 750000, hitDice: '9d4+16' },
{ level: 18, exp: 825000, hitDice: '9d4+18' },
{ level: 19, exp: 900000, hitDice: '9d4+20' },
{ level: 20, exp: 975000, hitDice: '9d4+22' },
];

//Thief Skills Table
this.thiefSkillsTable = [
{ level: 1, openLocks: 25, removeTraps: 20, pickPockets: 30, moveSilently: 25, climbWalls: 80, hide: 10, listen: 30 },
{ level: 2, openLocks: 30, removeTraps: 25, pickPockets: 35, moveSilently: 30, climbWalls: 81, hide: 15, listen: 34 },
{ level: 3, openLocks: 35, removeTraps: 30, pickPockets: 40, moveSilently: 35, climbWalls: 82, hide: 20, listen: 38 },
{ level: 4, openLocks: 40, removeTraps: 35, pickPockets: 45, moveSilently: 40, climbWalls: 83, hide: 25, listen: 42 },
{ level: 5, openLocks: 45, removeTraps: 40, pickPockets: 50, moveSilently: 45, climbWalls: 84, hide: 30, listen: 46 },
{ level: 6, openLocks: 50, removeTraps: 45, pickPockets: 55, moveSilently: 50, climbWalls: 85, hide: 35, listen: 50 },
{ level: 7, openLocks: 55, removeTraps: 50, pickPockets: 60, moveSilently: 55, climbWalls: 86, hide: 40, listen: 54 },
{ level: 8, openLocks: 60, removeTraps: 55, pickPockets: 65, moveSilently: 60, climbWalls: 87, hide: 45, listen: 58 },
{ level: 9, openLocks: 65, removeTraps: 60, pickPockets: 70, moveSilently: 65, climbWalls: 88, hide: 50, listen: 62 },
{ level: 10, openLocks: 68, removeTraps: 63, pickPockets: 74, moveSilently: 68, climbWalls: 89, hide: 53, listen: 65 },
{ level: 11, openLocks: 71, removeTraps: 66, pickPockets: 78, moveSilently: 71, climbWalls: 90, hide: 56, listen: 68 },
{ level: 12, openLocks: 74, removeTraps: 69, pickPockets: 82, moveSilently: 74, climbWalls: 91, hide: 59, listen: 71 },
{ level: 13, openLocks: 77, removeTraps: 72, pickPockets: 86, moveSilently: 77, climbWalls: 92, hide: 62, listen: 74 },
{ level: 14, openLocks: 80, removeTraps: 75, pickPockets: 90, moveSilently: 80, climbWalls: 93, hide: 65, listen: 77 },
{ level: 15, openLocks: 83, removeTraps: 78, pickPockets: 94, moveSilently: 83, climbWalls: 94, hide: 68, listen: 80 },
{ level: 16, openLocks: 84, removeTraps: 79, pickPockets: 95, moveSilently: 85, climbWalls: 95, hide: 69, listen: 83 },
{ level: 17, openLocks: 85, removeTraps: 80, pickPockets: 96, moveSilently: 87, climbWalls: 96, hide: 70, listen: 86 },
{ level: 18, openLocks: 86, removeTraps: 81, pickPockets: 97, moveSilently: 89, climbWalls: 97, hide: 71, listen: 89 },
{ level: 19, openLocks: 87, removeTraps: 82, pickPockets: 98, moveSilently: 91, climbWalls: 98, hide: 72, listen: 92 },
{ level: 20, openLocks: 88, removeTraps: 83, pickPockets: 99, moveSilently: 93, climbWalls: 99, hide: 73, listen: 95 },
];

//Fighter
this.fighterTable = [
{ level: 1, expPoints: 0, hitDice: '1d8' },
{ level: 2, expPoints: 2000, hitDice: '2d8' },
{ level: 3, expPoints: 4000, hitDice: '3d8' },
{ level: 4, expPoints: 8000, hitDice: '4d8' },
{ level: 5, expPoints: 16000, hitDice: '5d8' },
{ level: 6, expPoints: 32000, hitDice: '6d8' },
{ level: 7, expPoints: 64000, hitDice: '7d8' },
{ level: 8, expPoints: 120000, hitDice: '8d8' },
{ level: 9, expPoints: 240000, hitDice: '9d8' },
{ level: 10, expPoints: 360000, hitDice: '9d8+2' },
{ level: 11, expPoints: 480000, hitDice: '9d8+4' },
{ level: 12, expPoints: 600000, hitDice: '9d8+6' },
{ level: 13, expPoints: 720000, hitDice: '9d8+8' },
{ level: 14, expPoints: 840000, hitDice: '9d8+10' },
{ level: 15, expPoints: 960000, hitDice: '9d8+12' },
{ level: 16, expPoints: 1080000, hitDice: '9d8+14' },
{ level: 17, expPoints: 1200000, hitDice: '9d8+16' },
{ level: 18, expPoints: 1320000, hitDice: '9d8+18' },
{ level: 19, expPoints: 1440000, hitDice: '9d8+20' },
{ level: 20, expPoints: 1560000, hitDice: '9d8+22' },
];

//Cleric
// Cleric
this.clericTable = [
{ level: 1, expPoints: 0, hitDice: '1d6', spells: [0, 0, 0, 0, 0, 0] },
{ level: 2, expPoints: 1500, hitDice: '2d6', spells: [1, 0, 0, 0, 0, 0] },
{ level: 3, expPoints: 3000, hitDice: '3d6', spells: [2, 0, 0, 0, 0, 0] },
{ level: 4, expPoints: 6000, hitDice: '4d6', spells: [2, 1, 0, 0, 0, 0] },
{ level: 5, expPoints: 12000, hitDice: '5d6', spells: [2, 2, 0, 0, 0, 0] },
{ level: 6, expPoints: 24000, hitDice: '6d6', spells: [2, 2, 1, 0, 0, 0] },
{ level: 7, expPoints: 48000, hitDice: '7d6', spells: [3, 2, 2, 0, 0, 0] },
{ level: 8, expPoints: 90000, hitDice: '8d6', spells: [3, 2, 2, 1, 0, 0] },
{ level: 9, expPoints: 180000, hitDice: '9d6', spells: [3, 3, 2, 2, 0, 0] },
{ level: 10, expPoints: 270000, hitDice: '9d6+1', spells: [3, 3, 2, 2, 1, 0] },
{ level: 11, expPoints: 360000, hitDice: '9d6+2', spells: [4, 3, 3, 2, 2, 0] },
{ level: 12, expPoints: 450000, hitDice: '9d6+3', spells: [4, 4, 3, 2, 2, 1] },
{ level: 13, expPoints: 540000, hitDice: '9d6+4', spells: [4, 4, 3, 3, 2, 2] },
{ level: 14, expPoints: 630000, hitDice: '9d6+5', spells: [4, 4, 4, 3, 2, 2] },
{ level: 15, expPoints: 720000, hitDice: '9d6+6', spells: [4, 4, 4, 3, 3, 2] },
{ level: 16, expPoints: 810000, hitDice: '9d6+7', spells: [5, 4, 4, 3, 3, 2] },
{ level: 17, expPoints: 900000, hitDice: '9d6+8', spells: [5, 5, 4, 3, 3, 2] },
{ level: 18, expPoints: 990000, hitDice: '9d6+9', spells: [5, 5, 4, 4, 3, 3] },
{ level: 19, expPoints: 1080000, hitDice: '9d6+10', spells: [6, 5, 4, 4, 3, 3] },
{ level: 20, expPoints: 1170000, hitDice: '9d6+11', spells: [6, 5, 5, 4, 3, 3] },
];


//Character Sheet

this.name = data.name;
this.occupation = data.occupation;

this.level = data.level || 0;
this.class = data.class || 'Peasant';

this.str = data.str || this.rollScore(); 
this.dex = data.dex || this.rollScore();
this.int = data.int || this.rollScore();
this.wis = data.wis || this.rollScore();
this.con = data.con || this.rollScore();
this.cha = data.cha || this.rollScore();

this.Backstory = data.Backstory;
this.getHitPoints(this.class, this.level);
this.getMagic(this.class, this.level);
this.getThiefSkills(this.class, this.level);
this.getInventory(this.class, this.occupation, this.name);

}

rollScore() {
return Math.floor(Math.random() * (18 - 3 + 1)) + 3;
}

getThiefSkills(characterClass, characterLevel) {
let skillTable;
let level = parseInt(characterLevel, 10);

if (characterClass === 'Thief') {
skillTable = this.thiefSkillsTable;
} else {
// Return null or handle the case where the class is not 'Thief'
return null;
}

const levelEntry = skillTable.find(entry => entry.level === level);

if (levelEntry) {
// Assigning an object to this.thiefSkills property
this.thiefSkills = {
openLocks: levelEntry.openLocks,
removeTraps: levelEntry.removeTraps,
pickPockets: levelEntry.pickPockets,
moveSilently: levelEntry.moveSilently, 
climbWalls: levelEntry.climbWalls,
hide: levelEntry.hide,
listen: levelEntry.listen
};
} 
}

getMagic(characterClass, characterLevel) {
let classTable;
let level = parseInt(characterLevel, 10);

if (characterClass === 'Magic User') {
classTable = this.magicUserTable;
} else if (characterClass === 'Cleric') {
classTable = this.clericTable;
}

if (classTable) {
// Find spellSlots for NPC's Level
const levelEntry = classTable.find(entry => entry.level === level);
const spellBook = Spells.spellsArray.filter(spell => spell.Class === characterClass);
this.magic = '';

// Start at Level 1
let levelCheck = 0;

// Loop through spellSlots, assigning spells.
for (let levelIndex = 0; levelIndex < level; levelIndex++) {
const spellCount = levelEntry.spells[levelIndex];
const levelSpells = spellBook.filter(spell => spell.Level === (levelIndex + 1).toString());

// Loop through spellCount, choose random spells.
for (let spellSlot = 0; spellSlot < spellCount; spellSlot++) {
const randomIndex = Math.floor(Math.random() * levelSpells.length);
const chosenSpell = levelSpells[randomIndex];
levelSpells.splice(randomIndex, 1);

// Check for End of Loop
if (levelCheck < chosenSpell.Level) {
this.magic += `<br> LEVEL ${levelIndex + 1} SPELLS <br>`;
levelCheck = chosenSpell.Level;
}

this.magic += `~${chosenSpell.Name}~<br>`;

}
}
}
}

rollHitDice(hitDice) {
const regex = /(\d+)d(\d+)([+-]\d+)?/; // Regular expression to match dice notation
const match = hitDice.match(regex);

if (!match) {
throw new Error('Invalid hit dice notation');
}

const numDice = parseInt(match[1], 10);
const diceType = parseInt(match[2], 10);
const modifier = match[3] ? parseInt(match[3], 10) : 0;

let total = 0;

for (let i = 0; i < numDice; i++) {
total += Math.floor(Math.random() * diceType) + 1;
}

total += modifier;
return total;
}

getHitPoints(characterClass, characterLevel) {
let classTable;
let level = parseInt(characterLevel, 10);

if (characterClass === 'Magic User') {
classTable = this.magicUserTable;
} else if (characterClass === 'Cleric') {
classTable = this.clericTable;
} else if (characterClass === 'Fighter') {
classTable = this.fighterTable;
} else if (characterClass === 'Thief') {
classTable = this.thiefTable;
} else {
this.hitPoints = Math.floor(Math.random() * (5 - 1 + 1));
}

if(classTable){

let levelEntry = classTable.find(entry => entry.level === level);
let hitDice = levelEntry.hitDice;

// Calculate hit points using the rollHitDice function
this.hitPoints = this.rollHitDice(hitDice); 
}

}

getInventory(characterClass, occupation, characterName) {
  // Filter itemsArray based on characterClass and occupation
  const filteredItems = Items.itemsArray.filter(item => {
    const itemTags = item.Tags ? item.Tags.split(',').map(tag => tag.trim()) : [];

    // Check if the item matches the criteria
    return (
      (characterClass === '' || itemTags.includes(characterClass) || itemTags.includes(characterName)) ||
      (occupation && occupation.split(',').map(tag => tag.trim()).some(tag => itemTags.includes(tag)))
    );
  });

  // Format each item and add to this.inventory
  this.inventory = filteredItems.map(item => item.Name);

  // Log the names of the items
  //console.log(this.inventory.length !== 0 ? "Character Inventory:" + JSON.stringify(this.inventory) : '');
}

}

export default NPCbuild;



