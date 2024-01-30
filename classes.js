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


//Character Sheet
this.id = data.id;
this.name = data.name;
this.tags = data.tags;

this.level = data.level || 1;
this.class = data.class;
this.monsterTemplate = data.monsterTemplate;

this.str = data.str || NPCbuild.rollScore(this, "str"); 
this.dex = data.dex || NPCbuild.rollScore(this, "dex");
this.int = data.int || NPCbuild.rollScore(this, "int");
this.wis = data.wis || NPCbuild.rollScore(this, "wis");
this.con = data.con || NPCbuild.rollScore(this, "con");
this.cha = data.cha || NPCbuild.rollScore(this, "cha");
this.Backstory = data.Backstory;


NPCbuild.getModifiers(this);
NPCbuild.getCharacterSkills(this);
NPCbuild.getHitPoints(this);
NPCbuild.getMagic(this);
NPCbuild.getInventory(this);
NPCbuild.getSavingThrows(this);
NPCbuild.getAttackBonus(this);

if(this.monsterTemplate !== undefined){
NPCbuild.getMonster(this);} else {this.treasure = ''};

}

// Function to calculate the actual amount for each treasure type
static genLoot(treasureDetails) {
const result = {};

for (const resource in treasureDetails) {
const { percentage, dice } = treasureDetails[resource];

if (resource !== 'Gems' && resource !== 'Jewelry' && resource !== 'magicItems') {

if(Math.random() * 100 < percentage){
result[resource] = NPCbuild.rollDice(dice);
} else {
result[resource] = 0;
}

}else if (resource === 'Gems'){

if(Math.random() * 100 < percentage){

const quant = NPCbuild.rollDice(dice);

const gemsResult = [];  // Use a different variable here

for (let i = 0; i < quant; i++) {
const gem = NPCbuild.genGem();
gemsResult.push(gem);
}

result[resource] = gemsResult; 

} else {
result[resource] = '';
}

} else if (resource === 'Jewelry'){

if(Math.random() * 100 < percentage){

const quant = NPCbuild.rollDice(dice);

const jewResults = [];  // Use a different variable here

for (let i = 0; i < quant; i++) {
const Jew = NPCbuild.genJew();
jewResults.push(Jew);
}

result[resource] = jewResults;

} else {
result[resource] = '';
}

} else if (resource === 'magicItems'){

if(Math.random() * 100 < percentage){

const quant = NPCbuild.rollDice(dice);

const magicItemResults = [];  // Use a different variable here

for (let i = 0; i < quant; i++) {
const magicItem = NPCbuild.genMagicItems();
magicItemResults.push(magicItem);
}

result[resource] = magicItemResults;

} else {
result[resource] = '';
}

}

}

return result;
}
static genMagicItems() {

const rollmagicItemType = NPCbuild.rollDice('1d100');

const itemTypeEntry = NPCbuild.itemTypeTable.find(entry => {    
return rollmagicItemType >= entry.range[0] && rollmagicItemType <= entry.range[1];
});

const itemType = itemTypeEntry.item;

if(itemType === 'Miscellaneous Items'){

const miscRoll = NPCbuild.rollDice('1d100');

const miscTableEntry = NPCbuild.miscellaneousItemsTable.find(entry => {    
return miscRoll >= entry.range[0] && miscRoll <= entry.range[1];
});

const subTable = miscTableEntry.subtable;
let miscEffect 
let miscFormType 

if(subTable === 'Effect Subtable 1'){

const subTableRoll = NPCbuild.rollDice('1d100');

const subTableEntry = NPCbuild.effectSubtable1.find(entry => {    
return subTableRoll >= entry.range[0] && subTableRoll <= entry.range[1];
});

miscEffect = subTableEntry.effect;
miscFormType = subTableEntry.form;

} else if(subTable === 'Effect Subtable 2'){

const subTableRoll = NPCbuild.rollDice('1d100');

const subTableEntry = NPCbuild.effectSubtable2.find(entry => {    
return subTableRoll >= entry.range[0] && subTableRoll <= entry.range[1];
});

miscEffect = subTableEntry.effect;
miscFormType = subTableEntry.form;

}

const formRoll = NPCbuild.rollDice('1d100');
// Accessing the chance ranges for the specified letter
const formTypeTable = NPCbuild.formTable[miscFormType];

const formTypeEntry = formTypeTable.find(entry => {    
return formRoll >= entry.chance[0] && formRoll <= entry.chance[1];
});

const form = formTypeEntry.item; 


return {
tag: 'Misc Item',
name: form + ' of ' + miscEffect,
bonus: '',
};

}

if(itemType === 'Wand, Staff, or Rod'){

const wandRoll = NPCbuild.rollDice('1d100');

const wandTableEntry = NPCbuild.wandsStavesRodsTable.find(entry => {    
return wandRoll >= entry.range[0] && wandRoll <= entry.range[1];
});

const wandName = wandTableEntry.type;

return {
tag: 'Wand, Staff, or Rod',
name: wandName,
bonus: '',
};

}

if(itemType === 'Scroll'){

const scrollRoll = NPCbuild.rollDice('1d100');

const scrollTableEntry = NPCbuild.scrollsTable.find(entry => {    
return scrollRoll >= entry.range[0] && scrollRoll <= entry.range[1];
});

const scrollName = scrollTableEntry.type;

return {
tag: 'Scroll',
name: scrollName,
bonus: '',
};

}

if(itemType === 'Potion'){

const PotionRoll = NPCbuild.rollDice('1d100');

const potionTableEntry = NPCbuild.potionsTable.find(entry => {    
return PotionRoll >= entry.range[0] && PotionRoll <= entry.range[1];
});

const potionName = potionTableEntry.type;

return {
type: 'Potion',
name: potionName + ' Potion',
bonus: '',
};

}

if(itemType === 'Armour'){

const armourTypeRoll = NPCbuild.rollDice('1d100');

const armourTypeEntry = NPCbuild.magicArmourTable.find(entry => {    
return armourTypeRoll >= entry.range[0] && armourTypeRoll <= entry.range[1];
});

const armourName = armourTypeEntry.armour;

const armourAbilityRoll = NPCbuild.rollDice('1d100')

const armourAbilityEntry = NPCbuild.magicArmourAbilityTable.find(entry => {    
return armourAbilityRoll >= entry.range[0] && armourAbilityRoll <= entry.range[1];
});

const armourBonus = armourAbilityEntry.armour

return {
type: 'Armour',
name: armourName,
bonus: armourBonus,
};

}

if(itemType === 'Weapon'){

const weaponTypeRoll = NPCbuild.rollDice('1d100');

const weaponTypeEntry = NPCbuild.magicWeaponTable.find(entry => {    
return weaponTypeRoll >= entry.range[0] && weaponTypeRoll <= entry.range[1];
});

const weaponName = weaponTypeEntry.weapon;
const weaponType = weaponTypeEntry.type

const weaponBonusRoll = NPCbuild.rollDice('1d100');
let weaponBonusEntry

if(weaponType === 'Melee'){

weaponBonusEntry = NPCbuild.meleeWeaponBonusTable.find(entry => {    
return weaponBonusRoll >= entry.range[0] && weaponBonusRoll <= entry.range[1];
});

} else if (weaponType === 'Ranged'){

weaponBonusEntry = NPCbuild.rangedWeaponBonusTable.find(entry => {    
return weaponBonusRoll >= entry.range[0] && weaponBonusRoll <= entry.range[1];
});

}

const weaponBonus = weaponBonusEntry.bonus

return {
type: weaponType + ' Weapon',
name: weaponName,
bonus: weaponBonus,
};

}

}
// Function to generate a gem or jewelry item
static genGem() {
const gemValueEntry = NPCbuild.gemsValueTable[Math.floor(Math.random() * NPCbuild.gemsValueTable.length)];
const roll = NPCbuild.rollDice('1d100');

const gemTypeEntry = NPCbuild.gemTypeTable.find(entry => {    
return roll >= entry.range[0] && roll <= entry.range[1];
});

const valueAdjustmentEntry = NPCbuild.valueAdjustmentTable[Math.floor(Math.random() * NPCbuild.valueAdjustmentTable.length)];

const adjustedValue = gemValueEntry.baseValue * valueAdjustmentEntry.adjustment;
const numFound = NPCbuild.rollDice('1d6'); // Assume 1d6 for the number of found gems

return {
type: gemValueEntry.type,
gemType: gemTypeEntry.type,
baseValue: adjustedValue,
numberFound: numFound,
};
}
// Function to generate a jewelry item
static genJew() {
const roll = NPCbuild.rollDice('1d100');

const jewelryEntry = NPCbuild.jewelryTable.find(entry => {  
return roll >= entry.range[0] && roll <= entry.range[1];
});

const gem = NPCbuild.genGem()

return {
type: gem.type +' '+ gem.gemType,
jewelryType: jewelryEntry.type,
baseValue: NPCbuild.rollDice('2d8') * 100, // Standard items of jewelry are valued at 2d8x100 gp value
};
}

static getMonster(npc){

// Find Monster
const stats = Monsters.monstersArray.filter(monster => monster.Name === npc.monsterTemplate);

//Saving Throws
const saveAs = stats[0].SaveAs;
const monsterLevel = parseInt(saveAs.match(/\d+/)[0], 10);
let savingThrows = NPCbuild.mapSkills(NPCbuild.fighterSavingThrowTable, monsterLevel, ['deathRay', 'magicWands', 'paralysisPetrify','dragonBreath',  'spells']);

npc.savingThrows = savingThrows;


//HitPoints
const matches = stats[0].HD.match(/(\d+)(?:\+(\d+))?(?:\*(\d+))?/);
const baseDice = parseInt(matches[1], 10);
const bonusDice = matches[2] ? parseInt(matches[2], 10) : 0;
const specialBonus = matches[3] ? parseInt(matches[3], 10) : 0;
const totalHitPoints = baseDice * 8 + bonusDice + specialBonus;

npc.hitPoints = totalHitPoints;
npc.attackBonus = baseDice;
npc.AC = stats[0].AC;
npc.attacks = stats[0].Attacks;
npc.damage = stats[0].Damage;
npc.XP = stats[0].XP;
npc.class = stats[0].Type;
npc.level = monsterLevel;
npc.movement = stats[0].Movement;

//Treasure
const treasureType = stats[0].Treasure
const lootEntry = NPCbuild.treasureTable[treasureType];
const loot = NPCbuild.genLoot(lootEntry);

npc.treasure = loot;

}

static getCharacterSkills(npc) {
let skillTable;
let level = parseInt(npc.level, 10);
let skills = {};

// Determine the skill table based on character class
switch (npc.class) {
case 'Ranger':
skillTable = NPCbuild.rangerSkillsTable;
skills = NPCbuild.mapSkills(skillTable, level, ['tracking', 'moveSilently', 'hide']);
break;
case 'Thief':
skillTable = NPCbuild.thiefSkillsTable;
skills = NPCbuild.mapSkills(skillTable, level, ['openLocks', 'removeTraps', 'pickPockets', 'moveSilently', 'climbWalls', 'hide', 'listen']);
break;
case 'Assassin':
skillTable = NPCbuild.assassinSkillsTable;
skills = NPCbuild.mapSkills(skillTable, level, ['openLocks', 'pickPockets', 'moveSilently', 'climbWalls', 'hide', 'listen', 'poison']);
break;
case 'Cleric':
skillTable = NPCbuild.clericsVsUndeadTable;
skills = NPCbuild.mapSkills(skillTable, level, ['Skeleton', 'Zombie', 'Ghoul', 'Wight', 'Wraith', 'Mummy', 'Spectre', 'Vampire', 'Ghost']);
break;
default:
// Return null or handle the case where the class is not supported
return null;
}

// Assign the skills object to the corresponding property
npc.Skills = skills;
}

static mapSkills(skillTable, level, skillNames) {
const levelEntry = skillTable.find(entry => entry.level === level);
const skills = {};

if (levelEntry) {
// Populate the skills object based on the provided skill names
skillNames.forEach(skillName => {
skills[skillName] = levelEntry[skillName];
});
}

return skills;
}

static getSavingThrows(npc) {
let skillTable;
let level = parseInt(npc.level, 10);
let savingThrows = {};

switch (npc.class) {
case 'Fighter':
skillTable = NPCbuild.fighterSavingThrowTable;

break;
case 'Ranger':
skillTable = NPCbuild.fighterSavingThrowTable;

break;
case 'Thief':
skillTable = NPCbuild.thiefSavingThrowTable;

break;
case 'Assassin':
skillTable = NPCbuild.thiefSavingThrowTable;

break;
case 'Cleric':
skillTable = NPCbuild.clericSavingThrowTable;

break;
case 'Magic User':
skillTable = NPCbuild.magicUserSavingThrowTable;

break;
default:
return null;
}

savingThrows = NPCbuild.mapSkills(skillTable, level, ['deathRay', 'magicWands', 'paralysisPetrify','dragonBreath',  'spells']);
npc.savingThrows = savingThrows;
}

static getAttackBonus(npc){

let Table;
let level = parseInt(npc.level, 10);

switch (npc.class) {
case 'Fighter':
Table = NPCbuild.fighterTable;

break;
case 'Ranger':
Table = NPCbuild.fighterTable;

break;
case 'Thief':
Table = NPCbuild.thiefTable;

break;
case 'Assassin':
Table = NPCbuild.thiefTable;

break;
case 'Cleric':
Table = NPCbuild.clericTable;

break;
case 'Magic User':
Table = NPCbuild.magicUserTable;
break;

default:
return null;
}

let tableReturn = NPCbuild.mapSkills(Table, level, ['attackBonus']);
npc.attackBonus = tableReturn.attackBonus;
}

static getMagic(npc) {
let classTable;
let level = parseInt(npc.level, 10);

if (npc.class === 'Magic User') {
classTable = NPCbuild.magicUserTable;
} else if (npc.class === 'Cleric') {
classTable = NPCbuild.clericTable;
}

if (classTable) {
// Find spellSlots for NPC's Level
const levelEntry = classTable.find(entry => entry.level === level);
const spellBook = Spells.spellsArray.filter(spell => spell.Class === npc.class);
npc.magic =  `${npc.class === 'Cleric' ? `<span class="expandable cyan" data-content-type="rule" divId="Orsons">Orsons:</span>`:
`<span class="expandable cyan" data-content-type="rule" divId="Spellcasting">Spells:</span>`}<br><br>`

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
npc.magic += `LEVEL ${levelIndex + 1} SPELLS <br>`;
//Bug here if Character is over level 15?
levelCheck = chosenSpell.Level;
}

npc.magic += `~${chosenSpell.Name}~<br>`;

}
}
}
}

static getHitPoints(npc) {
let classTable;
let level = parseInt(npc.level, 10);

if (npc.class === 'Magic User') {
classTable = NPCbuild.magicUserTable;
} else if (npc.class === 'Cleric') {
classTable = NPCbuild.clericTable;
} else if (npc.class === 'Fighter') {
classTable = NPCbuild.fighterTable;
} else if (npc.class === 'Thief') {
classTable = NPCbuild.thiefTable;
} else if (npc.class === 'Ranger') {
classTable = NPCbuild.rangerTable;
} else if (npc.class === 'Assassin') {
classTable = NPCbuild.assassinTable;
} else {
npc.hitPoints = Math.floor(Math.random() * (5 - 1 + 1));
}

if(classTable){

let levelEntry = classTable.find(entry => entry.level === level);
let hitDice = levelEntry.hitDice;

// Calculate hit points using the rollHitDice function
npc.hitPoints = NPCbuild.rollHitDice(hitDice); 
}

}

static getInventory(npc) {
// Filter itemsArray based on characterClass and tags
const filteredItems = Items.itemsArray.filter(item => {
const itemTags = item.Tags ? item.Tags.split(',').map(tag => tag.trim()) : [];

// Check if the item matches the criteria
return (
(npc.class === '' || itemTags.includes(npc.class) || itemTags.includes(npc.name)) ||
(npc.tags && npc.tags.split(',').map(tag => tag.trim()).some(tag => itemTags.includes(tag)))
);
});

//If the tag is preceded by '?' there is only a chance they have the item, or only one of that type.

// Format each item and add to npc.inventory
npc.inventory = filteredItems.map(item => ({
Name: item.Name,
Tag: item.Tags ? item.Tags.split(',').map(tag => tag.trim()).find(tag => 
tag === npc.class || 
tag === npc.name  ||
(npc.tags && npc.tags.split(',').map(tag => tag.trim()).some(occTag => occTag === tag))
) : ''
}));

// Sort the inventory alphabetically by item.Tag
npc.inventory.sort((a, b) => (a.Tag > b.Tag) ? 1 : -1);

}

//Ability Scores & Modifiers
static abilityScoreTable = [
{ range: { min: 3, max: 3 }, bonus: -3 },
{ range: { min: 4, max: 5 }, bonus: -2 },
{ range: { min: 6, max: 8 }, bonus: -1 },
{ range: { min: 9, max: 12 }, bonus: 0 },
{ range: { min: 13, max: 15 }, bonus: 1 },
{ range: { min: 16, max: 17 }, bonus: 2 },
{ range: { min: 18, max: 18 }, bonus: 3 },
// Add more ranges as needed
];

static getModifiers(npc) {
// Array of ability scores
const abilityScores = [npc.str, npc.dex, npc.int, npc.wis, npc.con, npc.cha];

// Calculate modifiers for each ability score
const modifiers = abilityScores.map(score => {
const modifierEntry = NPCbuild.abilityScoreTable.find(entry => score >= entry.range.min && score <= entry.range.max);
return modifierEntry ? modifierEntry.bonus : 0;
});

// Assign modifiers back to the respective properties
[npc.strMod, npc.dexMod, npc.intMod, npc.wisMod, npc.conMod, npc.chaMod] = modifiers;

npc.Modifiers = modifiers;
}


//---ROLL FUNCTIONS

static rollHitDice(hitDice) {
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

static rollDice(diceNotation) {
//diceNotation, example '1d20'.
const [numDice, numSides] = diceNotation.split('d').map(Number);
let total = 0;

for (let i = 0; i < numDice; i++) {
total += Math.floor(Math.random() * numSides) + 1;
}

return total;
}

static rollScore(npc, score) {

let prime

switch (npc.class) {
case 'Fighter':
prime = 'str'

break;
case 'Ranger':
prime = 'dex'
break;
case 'Thief':
prime = 'dex'

break;
case 'Assassin':
prime = 'dex'

break;
case 'Cleric':
prime = 'wis'

break;
case 'Magic User':
prime = 'int'

break;
default:
return "";
}

if(prime === score){

return Math.floor(Math.random() * (18 - 10 + 1));


}else{

return Math.floor(Math.random() * (18 - 3 + 1));

}
}

//---TABLES----

//Magic User
static magicUserTable = [
{ level: 1, exp: 0, hitDice: '1d4', spells: [1, 0, 0, 0, 0, 0], attackBonus: 1},
{ level: 2, exp: 2500, hitDice: '2d4', spells: [2, 0, 0, 0, 0, 0], attackBonus: 1},
{ level: 3, exp: 5000, hitDice: '3d4', spells: [2, 1, 0, 0, 0, 0], attackBonus: 1},
{ level: 4, exp: 10000, hitDice: '4d4', spells: [2, 2, 0, 0, 0, 0], attackBonus: 2},
{ level: 5, exp: 20000, hitDice: '5d4', spells: [2, 2, 1, 0, 0, 0], attackBonus: 2},
{ level: 6, exp: 40000, hitDice: '6d4', spells: [3, 2, 2, 0, 0, 0], attackBonus: 3},
{ level: 7, exp: 80000, hitDice: '7d4', spells: [3, 2, 2, 1, 0, 0], attackBonus: 3},
{ level: 8, exp: 150000, hitDice: '8d4', spells: [3, 3, 2, 2, 0, 0], attackBonus: 3},
{ level: 9, exp: 300000, hitDice: '9d4', spells: [3, 3, 2, 2, 1, 0], attackBonus: 4},
{ level: 10, exp: 450000, hitDice: '9d4+1', spells: [4, 3, 3, 2, 2, 0], attackBonus: 4},
{ level: 11, exp: 600000, hitDice: '9d4+2', spells: [4, 4, 3, 2, 2, 1], attackBonus: 4},
{ level: 12, exp: 750000, hitDice: '9d4+3', spells: [4, 4, 3, 3, 2, 2], attackBonus: 4},
{ level: 13, exp: 900000, hitDice: '9d4+4', spells: [4, 4, 4, 3, 2, 2], attackBonus: 5},
{ level: 14, exp: 1050000, hitDice: '9d4+5', spells: [4, 4, 4, 3, 3, 2], attackBonus: 5},
{ level: 15, exp: 1200000, hitDice: '9d4+6', spells: [5, 4, 4, 3, 3, 2], attackBonus: 5},
{ level: 16, exp: 1350000, hitDice: '9d4+7', spells: [5, 5, 4, 3, 3, 2], attackBonus: 6},
{ level: 17, exp: 1500000, hitDice: '9d4+8', spells: [5, 5, 4, 4, 3, 3], attackBonus: 6},
{ level: 18, exp: 1650000, hitDice: '9d4+9', spells: [6, 5, 4, 4, 3, 3], attackBonus: 6},
{ level: 19, exp: 1800000, hitDice: '9d4+10', spells: [6, 5, 5, 4, 3, 3], attackBonus: 7},
{ level: 20, exp: 1950000, hitDice: '9d4+11', spells: [6, 5, 5, 4, 4, 3], attackBonus: 7},
];

// Magic-User Saving Throws
static magicUserSavingThrowTable = [
{ level: 1, deathRay: 13, magicWands: 14, paralysisPetrify: 13, dragonBreath: 16, spells: 15 },
{ level: 2, deathRay: 13, magicWands: 14, paralysisPetrify: 13, dragonBreath: 15, spells: 14 },
{ level: 3, deathRay: 13, magicWands: 14, paralysisPetrify: 13, dragonBreath: 15, spells: 14 },
{ level: 4, deathRay: 12, magicWands: 13, paralysisPetrify: 12, dragonBreath: 15, spells: 13 },
{ level: 5, deathRay: 12, magicWands: 12, paralysisPetrify: 11, dragonBreath: 14, spells: 13 },
{ level: 6, deathRay: 11, magicWands: 11, paralysisPetrify: 10, dragonBreath: 14, spells: 12 },
{ level: 7, deathRay: 11, magicWands: 11, paralysisPetrify: 10, dragonBreath: 13, spells: 12 },
{ level: 8, deathRay: 10, magicWands: 10, paralysisPetrify: 9, dragonBreath: 13, spells: 11 },
{ level: 9, deathRay: 10, magicWands: 9, paralysisPetrify: 9, dragonBreath: 13, spells: 11 },
{ level: 10, deathRay: 9, magicWands: 9, paralysisPetrify: 8, dragonBreath: 12, spells: 10 },
{ level: 11, deathRay: 9, magicWands: 8, paralysisPetrify: 7, dragonBreath: 12, spells: 11 },
{ level: 12, deathRay: 8, magicWands: 7, paralysisPetrify: 6, dragonBreath: 11, spells: 11 },
{ level: 13, deathRay: 8, magicWands: 7, paralysisPetrify: 6, dragonBreath: 11, spells: 10 },
{ level: 14, deathRay: 7, magicWands: 6, paralysisPetrify: 5, dragonBreath: 10, spells: 10 },
{ level: 15, deathRay: 7, magicWands: 6, paralysisPetrify: 5, dragonBreath: 10, spells: 9 },
{ level: 16, deathRay: 6, magicWands: 5, paralysisPetrify: 4, dragonBreath: 9, spells: 9 },
{ level: 17, deathRay: 6, magicWands: 5, paralysisPetrify: 4, dragonBreath: 9, spells: 8 },
{ level: 18, deathRay: 5, magicWands: 4, paralysisPetrify: 3, dragonBreath: 8, spells: 8 },
{ level: 19, deathRay: 5, magicWands: 4, paralysisPetrify: 3, dragonBreath: 8, spells: 7 },
{ level: 20, deathRay: 4, magicWands: 3, paralysisPetrify: 2, dragonBreath: 7, spells: 6 },
// Add more levels as needed
];

//Thief General
static thiefTable = [
{ level: 1, exp: 0, hitDice: '1d4' , attackBonus: 1, attackBonus: 1},
{ level: 2, exp: 1250, hitDice: '2d4' , attackBonus: 1},
{ level: 3, exp: 2500, hitDice: '3d4' , attackBonus: 2},
{ level: 4, exp: 5000, hitDice: '4d4' , attackBonus: 2},
{ level: 5, exp: 10000, hitDice: '5d4' , attackBonus: 3},
{ level: 6, exp: 20000, hitDice: '6d4' , attackBonus: 3},
{ level: 7, exp: 40000, hitDice: '7d4' , attackBonus: 4},
{ level: 8, exp: 75000, hitDice: '8d4' , attackBonus: 4},
{ level: 9, exp: 150000, hitDice: '9d4' , attackBonus: 5},
{ level: 10, exp: 225000, hitDice: '9d4+2' , attackBonus: 5},
{ level: 11, exp: 300000, hitDice: '9d4+4' , attackBonus: 5},
{ level: 12, exp: 375000, hitDice: '9d4+6' , attackBonus: 6},
{ level: 13, exp: 450000, hitDice: '9d4+8' , attackBonus: 6},
{ level: 14, exp: 525000, hitDice: '9d4+10' , attackBonus: 6},
{ level: 15, exp: 600000, hitDice: '9d4+12' , attackBonus: 7},
{ level: 16, exp: 675000, hitDice: '9d4+14' , attackBonus: 7},
{ level: 17, exp: 750000, hitDice: '9d4+16' , attackBonus: 7},
{ level: 18, exp: 825000, hitDice: '9d4+18' , attackBonus: 8},
{ level: 19, exp: 900000, hitDice: '9d4+20' , attackBonus: 8},
{ level: 20, exp: 975000, hitDice: '9d4+22' , attackBonus: 8},
];

//Thief Skills Table
static thiefSkillsTable = [
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

// Thief Saving Throw Progression
static thiefSavingThrowTable = [
{ level: 1, deathRay: 13, magicWands: 14, paralysisPetrify: 13, dragonBreath: 16, spells: 15 },
{ level: 2, deathRay: 12, magicWands: 14, paralysisPetrify: 12, dragonBreath: 15, spells: 14 },
{ level: 3, deathRay: 12, magicWands: 14, paralysisPetrify: 12, dragonBreath: 15, spells: 14 },
{ level: 4, deathRay: 11, magicWands: 13, paralysisPetrify: 12, dragonBreath: 14, spells: 13 },
{ level: 5, deathRay: 11, magicWands: 13, paralysisPetrify: 11, dragonBreath: 13, spells: 13 },
{ level: 6, deathRay: 10, magicWands: 12, paralysisPetrify: 11, dragonBreath: 12, spells: 12 },
{ level: 7, deathRay: 10, magicWands: 12, paralysisPetrify: 11, dragonBreath: 12, spells: 12 },
{ level: 8, deathRay: 9, magicWands: 12, paralysisPetrify: 10, dragonBreath: 11, spells: 11 },
{ level: 9, deathRay: 9, magicWands: 10, paralysisPetrify: 10, dragonBreath: 10, spells: 11 },
{ level: 10, deathRay: 8, magicWands: 10, paralysisPetrify: 9, dragonBreath: 9, spells: 10 },
{ level: 11, deathRay: 7, magicWands: 9, paralysisPetrify: 9, dragonBreath: 8, spells: 9 },
{ level: 12, deathRay: 7, magicWands: 9, paralysisPetrify: 8, dragonBreath: 7, spells: 9 },
{ level: 13, deathRay: 6, magicWands: 8, paralysisPetrify: 8, dragonBreath: 6, spells: 8 },
{ level: 14, deathRay: 6, magicWands: 8, paralysisPetrify: 8, dragonBreath: 6, spells: 8 },
{ level: 15, deathRay: 6, magicWands: 8, paralysisPetrify: 8, dragonBreath: 6, spells: 8 },
{ level: 16, deathRay: 6, magicWands: 8, paralysisPetrify: 8, dragonBreath: 6, spells: 8 },
{ level: 17, deathRay: 6, magicWands: 8, paralysisPetrify: 8, dragonBreath: 6, spells: 8 },
{ level: 18, deathRay: 6, magicWands: 8, paralysisPetrify: 8, dragonBreath: 6, spells: 8 },
{ level: 19, deathRay: 6, magicWands: 8, paralysisPetrify: 8, dragonBreath: 6, spells: 8 },
{ level: 20, deathRay: 6, magicWands: 8, paralysisPetrify: 8, dragonBreath: 6, spells: 8 },
];

//Fighter
static fighterTable = [
{ level: 1, expPoints: 0, hitDice: '1d8' , attackBonus: 1},
{ level: 2, expPoints: 2000, hitDice: '2d8' , attackBonus: 2},
{ level: 3, expPoints: 4000, hitDice: '3d8' , attackBonus: 2},
{ level: 4, expPoints: 8000, hitDice: '4d8' , attackBonus: 3},
{ level: 5, expPoints: 16000, hitDice: '5d8' , attackBonus: 4},
{ level: 6, expPoints: 32000, hitDice: '6d8' , attackBonus: 4},
{ level: 7, expPoints: 64000, hitDice: '7d8' , attackBonus: 5},
{ level: 8, expPoints: 120000, hitDice: '8d8' , attackBonus: 6},
{ level: 9, expPoints: 240000, hitDice: '9d8' , attackBonus: 6},
{ level: 10, expPoints: 360000, hitDice: '9d8+2' , attackBonus: 6},
{ level: 11, expPoints: 480000, hitDice: '9d8+4' , attackBonus: 7},
{ level: 12, expPoints: 600000, hitDice: '9d8+6' , attackBonus: 7},
{ level: 13, expPoints: 720000, hitDice: '9d8+8' , attackBonus: 8},
{ level: 14, expPoints: 840000, hitDice: '9d8+10' , attackBonus: 8},
{ level: 15, expPoints: 960000, hitDice: '9d8+12' , attackBonus: 8},
{ level: 16, expPoints: 1080000, hitDice: '9d8+14' , attackBonus: 9},
{ level: 17, expPoints: 1200000, hitDice: '9d8+16' , attackBonus: 9},
{ level: 18, expPoints: 1320000, hitDice: '9d8+18' , attackBonus: 10},
{ level: 19, expPoints: 1440000, hitDice: '9d8+20' , attackBonus: 10},
{ level: 20, expPoints: 1560000, hitDice: '9d8+22' , attackBonus: 10},
];

// Fighter Saving Throw Progression
static fighterSavingThrowTable = [
{ level: 0, deathRay: 13, magicWands: 14, paralysisPetrify: 15, dragonBreath: 16, spells: 18 },
{ level: 1, deathRay: 12, magicWands: 13, paralysisPetrify: 14, dragonBreath: 15, spells: 17 },
{ level: 2, deathRay: 11, magicWands: 12, paralysisPetrify: 14, dragonBreath: 15, spells: 16 },
{ level: 3, deathRay: 11, magicWands: 11, paralysisPetrify: 13, dragonBreath: 14, spells: 15 },
{ level: 4, deathRay: 10, magicWands: 11, paralysisPetrify: 12, dragonBreath: 14, spells: 15 },
{ level: 5, deathRay: 10, magicWands: 10, paralysisPetrify: 11, dragonBreath: 13, spells: 14 },
{ level: 6, deathRay: 9, magicWands: 9, paralysisPetrify: 10, dragonBreath: 12, spells: 14 },
{ level: 7, deathRay: 9, magicWands: 9, paralysisPetrify: 10, dragonBreath: 12, spells: 14 },
{ level: 8, deathRay: 8, magicWands: 8, paralysisPetrify: 9, dragonBreath: 13, spells: 13 },
{ level: 9, deathRay: 8, magicWands: 8, paralysisPetrify: 9, dragonBreath: 13, spells: 13 },
{ level: 10, deathRay: 7, magicWands: 7, paralysisPetrify: 8, dragonBreath: 12, spells: 12 },
{ level: 11, deathRay: 7, magicWands: 7, paralysisPetrify: 8, dragonBreath: 12, spells: 12 },
{ level: 12, deathRay: 6, magicWands: 6, paralysisPetrify: 7, dragonBreath: 11, spells: 11 },
{ level: 13, deathRay: 6, magicWands: 6, paralysisPetrify: 7, dragonBreath: 11, spells: 11 },
{ level: 14, deathRay: 5, magicWands: 5, paralysisPetrify: 6, dragonBreath: 10, spells: 10 },
{ level: 15, deathRay: 5, magicWands: 5, paralysisPetrify: 6, dragonBreath: 10, spells: 10 },
{ level: 16, deathRay: 4, magicWands: 4, paralysisPetrify: 5, dragonBreath: 9, spells: 9 },
{ level: 17, deathRay: 4, magicWands: 4, paralysisPetrify: 5, dragonBreath: 9, spells: 9 },
{ level: 18, deathRay: 3, magicWands: 3, paralysisPetrify: 4, dragonBreath: 8, spells: 8 },
{ level: 19, deathRay: 3, magicWands: 3, paralysisPetrify: 4, dragonBreath: 8, spells: 8 },
{ level: 20, deathRay: 2, magicWands: 2, paralysisPetrify: 3, dragonBreath: 7, spells: 7 },
// Add more levels as needed
];

//Cleric
static clericTable = [
{ level: 1, expPoints: 0, hitDice: '1d6', spells: [0, 0, 0, 0, 0, 0] , attackBonus: 1},
{ level: 2, expPoints: 1500, hitDice: '2d6', spells: [1, 0, 0, 0, 0, 0] , attackBonus: 1},
{ level: 3, expPoints: 3000, hitDice: '3d6', spells: [2, 0, 0, 0, 0, 0] , attackBonus: 2},
{ level: 4, expPoints: 6000, hitDice: '4d6', spells: [2, 1, 0, 0, 0, 0] , attackBonus: 2},
{ level: 5, expPoints: 12000, hitDice: '5d6', spells: [2, 2, 0, 0, 0, 0] , attackBonus: 3},
{ level: 6, expPoints: 24000, hitDice: '6d6', spells: [2, 2, 1, 0, 0, 0] , attackBonus: 3},
{ level: 7, expPoints: 48000, hitDice: '7d6', spells: [3, 2, 2, 0, 0, 0] , attackBonus: 4},
{ level: 8, expPoints: 90000, hitDice: '8d6', spells: [3, 2, 2, 1, 0, 0] , attackBonus: 4},
{ level: 9, expPoints: 180000, hitDice: '9d6', spells: [3, 3, 2, 2, 0, 0] , attackBonus: 5},
{ level: 10, expPoints: 270000, hitDice: '9d6+1', spells: [3, 3, 2, 2, 1, 0] , attackBonus: 5},
{ level: 11, expPoints: 360000, hitDice: '9d6+2', spells: [4, 3, 3, 2, 2, 0] , attackBonus: 5},
{ level: 12, expPoints: 450000, hitDice: '9d6+3', spells: [4, 4, 3, 2, 2, 1] , attackBonus: 6},
{ level: 13, expPoints: 540000, hitDice: '9d6+4', spells: [4, 4, 3, 3, 2, 2] , attackBonus: 6},
{ level: 14, expPoints: 630000, hitDice: '9d6+5', spells: [4, 4, 4, 3, 2, 2] , attackBonus: 6},
{ level: 15, expPoints: 720000, hitDice: '9d6+6', spells: [4, 4, 4, 3, 3, 2] , attackBonus: 7},
{ level: 16, expPoints: 810000, hitDice: '9d6+7', spells: [5, 4, 4, 3, 3, 2] , attackBonus: 7},
{ level: 17, expPoints: 900000, hitDice: '9d6+8', spells: [5, 5, 4, 3, 3, 2] , attackBonus: 7},
{ level: 18, expPoints: 990000, hitDice: '9d6+9', spells: [5, 5, 4, 4, 3, 3] , attackBonus: 8},
{ level: 19, expPoints: 1080000, hitDice: '9d6+10', spells: [6, 5, 4, 4, 3, 3] , attackBonus: 8},
{ level: 20, expPoints: 1170000, hitDice: '9d6+11', spells: [6, 5, 5, 4, 3, 3] , attackBonus: 8},
];

//Cleric Turn Undead
static clericsVsUndeadTable = [
{ level: 1, Skeleton: 13, Zombie: 17, Ghoul: 19, Wight: 'No', Wraith: 'No', Mummy: 'No', Spectre: 'No', Vampire: 'No', Ghost: 'No' },
{ level: 2, Skeleton: 11, Zombie: 15, Ghoul: 18, Wight: 20, Wraith: 'No', Mummy: 'No', Spectre: 'No', Vampire: 'No', Ghost: 'No' },
{ level: 3, Skeleton: 9, Zombie: 13, Ghoul: 17, Wight: 19, Wraith: 'No', Mummy: 'No', Spectre: 'No', Vampire: 'No', Ghost: 'No' },
{ level: 4, Skeleton: 7, Zombie: 11, Ghoul: 15, Wight: 18, Wraith: 20, Mummy: 'No', Spectre: 'No', Vampire: 'No', Ghost: 'No' },
{ level: 5, Skeleton: 5, Zombie: 9, Ghoul: 13, Wight: 17, Wraith: 19, Mummy: 'No', Spectre: 'No', Vampire: 'No', Ghost: 'No' },
{ level: 6, Skeleton: 3, Zombie: 7, Ghoul: 11, Wight: 15, Wraith: 18, Mummy: 20, Spectre: 'No', Vampire: 'No', Ghost: 'No' },
{ level: 7, Skeleton: 2, Zombie: 5, Ghoul: 9, Wight: 13, Wraith: 17, Mummy: 19, Spectre: 'No', Vampire: 'No', Ghost: 'No' },
{ level: 8, Skeleton: 'Automatic', Zombie: 3, Ghoul: 7, Wight: 11, Wraith: 15, Mummy: 18, Spectre: 20, Vampire: 'No', Ghost: 'No' },
{ level: 9, Skeleton: 'Automatic', Zombie: 2, Ghoul: 5, Wight: 9, Wraith: 13, Mummy: 17, Spectre: 19, Vampire: 'No', Ghost: 'No' },
{ level: 10, Skeleton: 'Automatic', Zombie: 'Automatic', Ghoul: 3, Wight: 7, Wraith: 11, Mummy: 15, Spectre: 18, Vampire: 20, Ghost: 'No' },
{ level: 11, Skeleton: 'Damaged', Zombie: 'Automatic', Ghoul: 2, Wight: 5, Wraith: 9, Mummy: 13, Spectre: 17, Vampire: 19, Ghost: 'No' },
{ level: 12, Skeleton: 'Damaged', Zombie: 'Automatic', Ghoul: 'Automatic', Wight: 3, Wraith: 7, Mummy: 11, Spectre: 15, Vampire: 18, Ghost: 20 },
{ level: 13, Skeleton: 'Damaged', Zombie: 'Damaged', Ghoul: 'Automatic', Wight: 2, Wraith: 5, Mummy: 9, Spectre: 13, Vampire: 17, Ghost: 19 },
{ level: 14, Skeleton: 'Damaged', Zombie: 'Damaged', Ghoul: 'Automatic', Wight: 'Automatic', Wraith: 3, Mummy: 7, Spectre: 11, Vampire: 15, Ghost: 18 },
{ level: 15, Skeleton: 'Damaged', Zombie: 'Damaged', Ghoul: 'Damaged', Wight: 'Automatic', Wraith: 2, Mummy: 5, Spectre: 9, Vampire: 13, Ghost: 17 },
{ level: 16, Skeleton: 'Damaged', Zombie: 'Damaged', Ghoul: 'Damaged', Wight: 'Automatic', Wraith: 'Automatic', Mummy: 3, Spectre: 7, Vampire: 11, Ghost: 15 },
{ level: 17, Skeleton: 'Damaged', Zombie: 'Damaged', Ghoul: 'Damaged', Wight: 'Damaged', Wraith: 'Automatic', Mummy: 2, Spectre: 5, Vampire: 9, Ghost: 13 },
{ level: 18, Skeleton: 'Damaged', Zombie: 'Damaged', Ghoul: 'Damaged', Wight: 'Damaged', Wraith: 'Automatic', Mummy: 'Automatic', Spectre: 3, Vampire: 7, Ghost: 11 },
{ level: 19, Skeleton: 'Damaged', Zombie: 'Damaged', Ghoul: 'Damaged', Wight: 'Damaged', Wraith: 'Damaged', Mummy: 'Automatic', Spectre: 2, Vampire: 5, Ghost: 9 },
{ level: 20, Skeleton: 'Damaged', Zombie: 'Damaged', Ghoul: 'Damaged', Wight: 'Damaged', Wraith: 'Damaged', Mummy: 'Automatic', Spectre: 'Automatic', Vampire: 3, Ghost: 7 },
];

//Cleric Saving Throwns
static clericSavingThrowTable = [
{ level: 1, deathRay: 11, magicWands: 12, paralysisPetrify: 14, dragonBreath: 16, spells: 15 },
{ level: 2, deathRay: 10, magicWands: 11, paralysisPetrify: 13, dragonBreath: 15, spells: 14 },
{ level: 3, deathRay: 9, magicWands: 10, paralysisPetrify: 13, dragonBreath: 15, spells: 14 },
{ level: 4, deathRay: 9, magicWands: 10, paralysisPetrify: 12, dragonBreath: 14, spells: 13 },
{ level: 5, deathRay: 8, magicWands: 9, paralysisPetrify: 12, dragonBreath: 14, spells: 13 },
{ level: 6, deathRay: 8, magicWands: 9, paralysisPetrify: 11, dragonBreath: 13, spells: 12 },
{ level: 7, deathRay: 7, magicWands: 8, paralysisPetrify: 11, dragonBreath: 13, spells: 12 },
{ level: 8, deathRay: 7, magicWands: 8, paralysisPetrify: 10, dragonBreath: 12, spells: 11 },
{ level: 9, deathRay: 6, magicWands: 7, paralysisPetrify: 10, dragonBreath: 12, spells: 11 },
{ level: 10, deathRay: 6, magicWands: 7, paralysisPetrify: 9, dragonBreath: 11, spells: 10 },
{ level: 11, deathRay: 5, magicWands: 6, paralysisPetrify: 9, dragonBreath: 11, spells: 10 },
{ level: 12, deathRay: 5, magicWands: 6, paralysisPetrify: 8, dragonBreath: 10, spells: 9 },
{ level: 13, deathRay: 4, magicWands: 5, paralysisPetrify: 8, dragonBreath: 10, spells: 9 },
{ level: 14, deathRay: 4, magicWands: 5, paralysisPetrify: 7, dragonBreath: 9, spells: 8 },
{ level: 15, deathRay: 3, magicWands: 4, paralysisPetrify: 7, dragonBreath: 9, spells: 8 },
{ level: 16, deathRay: 3, magicWands: 4, paralysisPetrify: 6, dragonBreath: 8, spells: 7 },
{ level: 17, deathRay: 2, magicWands: 3, paralysisPetrify: 6, dragonBreath: 8, spells: 7 },
{ level: 18, deathRay: 2, magicWands: 3, paralysisPetrify: 5, dragonBreath: 7, spells: 6 },
{ level: 19, deathRay: 1, magicWands: 2, paralysisPetrify: 5, dragonBreath: 7, spells: 6 },
{ level: 20, deathRay: 1, magicWands: 2, paralysisPetrify: 4, dragonBreath: 6, spells: 5 },
// Add more levels as needed
];

// Ranger
static rangerTable = [
{ level: 1, expPoints: 0, hitDice: '1d8' },
{ level: 2, expPoints: 2200, hitDice: '2d8' },
{ level: 3, expPoints: 4400, hitDice: '3d8' },
{ level: 4, expPoints: 8800, hitDice: '4d8' },
{ level: 5, expPoints: 17600, hitDice: '5d8' },
{ level: 6, expPoints: 35200, hitDice: '6d8' },
{ level: 7, expPoints: 70400, hitDice: '7d8' },
{ level: 8, expPoints: 132000, hitDice: '8d8' },
{ level: 9, expPoints: 264000, hitDice: '9d8' },
{ level: 10, expPoints: 396000, hitDice: '9d8+2' },
{ level: 11, expPoints: 528000, hitDice: '9d8+4' },
{ level: 12, expPoints: 660000, hitDice: '9d8+6' },
{ level: 13, expPoints: 792000, hitDice: '9d8+8' },
{ level: 14, expPoints: 924000, hitDice: '9d8+10' },
{ level: 15, expPoints: 1056000, hitDice: '9d8+12' },
{ level: 16, expPoints: 1188000, hitDice: '9d8+14' },
{ level: 17, expPoints: 1320000, hitDice: '9d8+16' },
{ level: 18, expPoints: 1452000, hitDice: '9d8+18' },
{ level: 19, expPoints: 1584000, hitDice: '9d8+20' },
{ level: 20, expPoints: 1716000, hitDice: '9d8+22' },
// Add more levels as needed
];

//Ranger Skills
static rangerSkillsTable = [
{ level: 1, moveSilently: 25, hide: 10, tracking: 40 },
{ level: 2, moveSilently: 30, hide: 15, tracking: 44 },
{ level: 3, moveSilently: 35, hide: 20, tracking: 48 },
{ level: 4, moveSilently: 40, hide: 25, tracking: 52 },
{ level: 5, moveSilently: 45, hide: 30, tracking: 56 },
{ level: 6, moveSilently: 50, hide: 35, tracking: 60 },
{ level: 7, moveSilently: 55, hide: 40, tracking: 64 },
{ level: 8, moveSilently: 60, hide: 45, tracking: 68 },
{ level: 9, moveSilently: 65, hide: 50, tracking: 72 },
{ level: 10, moveSilently: 68, hide: 53, tracking: 75 },
{ level: 11, moveSilently: 71, hide: 56, tracking: 78 },
{ level: 12, moveSilently: 74, hide: 59, tracking: 81 },
{ level: 13, moveSilently: 77, hide: 62, tracking: 84 },
{ level: 14, moveSilently: 80, hide: 65, tracking: 87 },
{ level: 15, moveSilently: 83, hide: 68, tracking: 90 },
{ level: 16, moveSilently: 85, hide: 69, tracking: 91 },
{ level: 17, moveSilently: 87, hide: 70, tracking: 92 },
{ level: 18, moveSilently: 89, hide: 71, tracking: 93 },
{ level: 19, moveSilently: 91, hide: 72, tracking: 94 },
{ level: 20, moveSilently: 93, hide: 73, tracking: 95 },
// Add more levels as needed
];

//Assassin
static assassinTable = [
{ level: 1, expPoints: 0, hitDice: '1d4' },
{ level: 2, expPoints: 1375, hitDice: '2d4' },
{ level: 3, expPoints: 2750, hitDice: '3d4' },
{ level: 4, expPoints: 5500, hitDice: '4d4' },
{ level: 5, expPoints: 11000, hitDice: '5d4' },
{ level: 6, expPoints: 22000, hitDice: '6d4' },
{ level: 7, expPoints: 44000, hitDice: '7d4' },
{ level: 8, expPoints: 82500, hitDice: '8d4' },
{ level: 9, expPoints: 165000, hitDice: '9d4' },
{ level: 10, expPoints: 247500, hitDice: '9d4+2' },
{ level: 11, expPoints: 330000, hitDice: '9d4+4' },
{ level: 12, expPoints: 412500, hitDice: '9d4+6' },
{ level: 13, expPoints: 495000, hitDice: '9d4+8' },
{ level: 14, expPoints: 577500, hitDice: '9d4+10' },
{ level: 15, expPoints: 660000, hitDice: '9d4+12' },
{ level: 16, expPoints: 742500, hitDice: '9d4+14' },
{ level: 17, expPoints: 825000, hitDice: '9d4+16' },
{ level: 18, expPoints: 907500, hitDice: '9d4+18' },
{ level: 19, expPoints: 990000, hitDice: '9d4+20' },
{ level: 20, expPoints: 1072500, hitDice: '9d4+22' },
// Add more levels as needed
];

// Assassin Abilities
static assassinSkillsTable = [
{ level: 1, openLocks: 15, pickPockets: 20, moveSilently: 20, climbWalls: 70, hide: 5, listen: 25, poison: 25 },
{ level: 2, openLocks: 19, pickPockets: 25, moveSilently: 25, climbWalls: 72, hide: 10, listen: 29, poison: 30 },
{ level: 3, openLocks: 23, pickPockets: 30, moveSilently: 30, climbWalls: 74, hide: 15, listen: 33, poison: 35 },
{ level: 4, openLocks: 27, pickPockets: 35, moveSilently: 35, climbWalls: 76, hide: 20, listen: 37, poison: 40 },
{ level: 5, openLocks: 31, pickPockets: 40, moveSilently: 40, climbWalls: 78, hide: 25, listen: 41, poison: 45 },
{ level: 6, openLocks: 35, pickPockets: 45, moveSilently: 45, climbWalls: 80, hide: 30, listen: 45, poison: 50 },
{ level: 7, openLocks: 39, pickPockets: 50, moveSilently: 50, climbWalls: 82, hide: 35, listen: 49, poison: 55 },
{ level: 8, openLocks: 43, pickPockets: 55, moveSilently: 55, climbWalls: 84, hide: 40, listen: 53, poison: 60 },
{ level: 9, openLocks: 47, pickPockets: 60, moveSilently: 60, climbWalls: 86, hide: 45, listen: 57, poison: 65 },
{ level: 10, openLocks: 50, pickPockets: 63, moveSilently: 63, climbWalls: 87, hide: 48, listen: 60, poison: 69 },
{ level: 11, openLocks: 53, pickPockets: 66, moveSilently: 66, climbWalls: 88, hide: 51, listen: 63, poison: 73 },
{ level: 12, openLocks: 56, pickPockets: 69, moveSilently: 69, climbWalls: 89, hide: 54, listen: 66, poison: 77 },
{ level: 13, openLocks: 59, pickPockets: 72, moveSilently: 72, climbWalls: 90, hide: 57, listen: 69, poison: 81 },
{ level: 14, openLocks: 62, pickPockets: 75, moveSilently: 75, climbWalls: 91, hide: 60, listen: 72, poison: 85 },
{ level: 15, openLocks: 65, pickPockets: 78, moveSilently: 78, climbWalls: 92, hide: 63, listen: 75, poison: 89 },
{ level: 16, openLocks: 66, pickPockets: 79, moveSilently: 80, climbWalls: 93, hide: 64, listen: 77, poison: 91 },
{ level: 17, openLocks: 67, pickPockets: 80, moveSilently: 82, climbWalls: 94, hide: 65, listen: 79, poison: 93 },
{ level: 18, openLocks: 68, pickPockets: 81, moveSilently: 84, climbWalls: 95, hide: 66, listen: 81, poison: 95 },
{ level: 19, openLocks: 69, pickPockets: 82, moveSilently: 86, climbWalls: 96, hide: 67, listen: 83, poison: 97 },
{ level: 20, openLocks: 70, pickPockets: 83, moveSilently: 88, climbWalls: 97, hide: 68, listen: 85, poison: 99 },
// Add more levels as needed

];

//Treasure Table
static treasureTable = {
A: {
Copper: { percentage: 50, dice: '5d6' },
Silver: { percentage: 60, dice: '5d6' },
Electrum: { percentage: 40, dice: '5d4' },
Gold: { percentage: 70, dice: '10d6' },
Platinum: { percentage: 50, dice: '1d10' },
Gems: { percentage: 50, dice: '6d6' },
Jewelry: { percentage: 50, dice: '6d6' },
magicItems: { percentage: 50, dice: '6d6' }
},
B: {
Copper: { percentage: 75, dice: '5d10' },
Silver: { percentage: 50, dice: '5d6' },
Electrum: { percentage: 50, dice: '5d4' },
Gold: { percentage: 50, dice: '3d6' },
Platinum: { percentage: 0, dice: null },
Gems: { percentage: 25, dice: '1d6' },
Jewelry: { percentage: 50, dice: '6d6' },
magicItems: { percentage: 25, dice: '1d6' }
},
C: {
Copper: { percentage: 60, dice: '6d6' },
Silver: { percentage: 60, dice: '5d4' },
Electrum: { percentage: 30, dice: '2d6' },
Gold: { percentage: 0, dice: null },
Platinum: { percentage: 0, dice: null },
Gems: { percentage: 25, dice: '1d4' },
Jewelry: { percentage: 50, dice: '6d6' },
magicItems: { percentage: 25, dice: '1d4' },
Special: { percentage: 15, dice: '1d2' }
},
D: {
Copper: { percentage: 30, dice: '4d6' },
Silver: { percentage: 45, dice: '6d6' },
Electrum: { percentage: 0, dice: null },
Gold: { percentage: 90, dice: '5d8' },
Platinum: { percentage: 0, dice: null },
Gems: { percentage: 30, dice: '1d8' },
Jewelry: { percentage: 50, dice: '6d6' },
magicItems: { percentage: 30, dice: '1d8' },
Special: { percentage: 20, dice: '1d2', additional: '+ 1 potion' }
},
E: {
Copper: { percentage: 30, dice: '2d8' },
Silver: { percentage: 60, dice: '6d10' },
Electrum: { percentage: 50, dice: '3d8' },
Gold: { percentage: 50, dice: '4d10' },
Platinum: { percentage: 0, dice: null },
Gems: { percentage: 10, dice: '1d10' },
Jewelry: { percentage: 50, dice: '6d6' },
magicItems: { percentage: 10, dice: '1d10' },
Special: { percentage: 30, dice: '1d4', additional: '+ 1 scroll' }
},
F: {
Copper: { percentage: 0, dice: null },
Silver: { percentage: 40, dice: '3d8' },
Electrum: { percentage: 50, dice: '4d8' },
Gold: { percentage: 85, dice: '6d10' },
Platinum: { percentage: 70, dice: '2d8' },
Gems: { percentage: 20, dice: '2d12' },
Jewelry: { percentage: 50, dice: '6d6' },
magicItems: { percentage: 10, dice: '1d12' },
Special: { percentage: 35, dice: '1d4', exceptions: ['weapons'], additional: ['+ 1 potion', '+ 1 scroll'] }
},
G: {
Copper: { percentage: 0, dice: null },
Silver: { percentage: 0, dice: null },
Electrum: { percentage: 0, dice: null },
Gold: { percentage: 90, dice: '4d6x10' },
Platinum: { percentage: 75, dice: '5d8' },
Gems: { percentage: 25, dice: '3d6' },
Jewelry: { percentage: 50, dice: '6d6' },
magicItems: { percentage: 25, dice: '1d10' },
Special: { percentage: 50, dice: '1d4', additional: '+ 1 scroll' }
},
H: {
Copper: { percentage: '*', dice: '8d10' },
Silver: { percentage: '*', dice: '6d10x10' },
Electrum: { percentage: '*', dice: '3d10x10' },
Gold: { percentage: '*', dice: '5d8x10' },
Platinum: { percentage: '*', dice: '9d8' },
Gems: { percentage: 25, dice: '3d6' },
Jewelry: { percentage: 50, dice: '6d6' },
magicItems: { percentage: 25, dice: '1d10' },
Special: { percentage: 50, dice: '1d4', additional: '+ 1 scroll' }
},
I: {
Copper: { percentage: 0, dice: null },
Silver: { percentage: 0, dice: null },
Electrum: { percentage: 0, dice: null },
Gold: { percentage: 0, dice: null },
Platinum: { percentage: 80, dice: '3d10' },
Gems: { percentage: 50, dice: '2d6' },
Jewelry: { percentage: 50, dice: '6d6' },
magicItems: { percentage: 50, dice: '2d6' },
Special: { percentage: 15, dice: 'any 1' }
},
J: {
Copper: { percentage: 45, dice: '3d8' },
Silver: { percentage: 45, dice: '1d8' },
Electrum: { percentage: 0, dice: null },
Gold: { percentage: 0, dice: null },
Platinum: { percentage: 0, dice: null },
Gems: { percentage: 0, dice: null },
Jewelry: { percentage: 50, dice: '6d6' },
magicItems: { percentage: 0, dice: null }
},
K: {
Copper: { percentage: 0, dice: null },
Silver: { percentage: 90, dice: '2d10' },
Electrum: { percentage: 35, dice: '1d8' },
Gold: { percentage: 0, dice: null },
Platinum: { percentage: 0, dice: null },
Gems: { percentage: 100, dice: '1d4' },
Jewelry: { percentage: 100, dice: '1d4' },
magicItems: { percentage: 100, dice: '1d4' }
},
L: {
Copper: { percentage: 0, dice: null },
Silver: { percentage: 0, dice: null },
Electrum: { percentage: 0, dice: null },
Gold: { percentage: 0, dice: null },
Platinum: { percentage: 0, dice: null },
Gems: { percentage: 50, dice: '1d4' },
Jewelry: { percentage: 50, dice: '6d6' },
magicItems: { percentage: 0, dice: null }
},
M: {
Copper: { percentage: 0, dice: null },
Silver: { percentage: 0, dice: null },
Electrum: { percentage: 0, dice: null },
Gold: { percentage: 90, dice: '4d10' },
Platinum: { percentage: 90, dice: '2d8x10' },
Gems: { percentage: 55, dice: '5d4' },
Jewelry: { percentage: 50, dice: '6d6' },
magicItems: { percentage: 45, dice: '2d6' }
},
N: {
Copper: { percentage: 0, dice: null },
Silver: { percentage: 0, dice: null },
Electrum: { percentage: 0, dice: null },
Gold: { percentage: 0, dice: null },
Platinum: { percentage: 0, dice: null },
Gems: { percentage: 0, dice: null },
Jewelry: { percentage: 50, dice: '6d6' },
magicItems: { percentage: 0, dice: null },
Special: { percentage: 40, dice: '2d4', additional: 'potions' }
},
O: {
Copper: { percentage: 0, dice: null },
Silver: { percentage: 0, dice: null },
Electrum: { percentage: 0, dice: null },
Gold: { percentage: 0, dice: null },
Platinum: { percentage: 0, dice: null },
Gems: { percentage: 0, dice: null },
Jewelry: { percentage: 50, dice: '6d6' },
magicItems: { percentage: 0, dice: null },
Special: { percentage: 50, dice: '1d4', additional: 'scrolls' }
},
P: {
Copper: { percentage: 0, dice: '3d8' },
Silver: { percentage: 0, dice: null },
Electrum: { percentage: 0, dice: null },
Gold: { percentage: 0, dice: null },
Platinum: { percentage: 0, dice: null },
Gems: { percentage: 0, dice: null },
Jewelry: { percentage: 50, dice: '6d6' },
magicItems: { percentage: 0, dice: null }
},
Q: {
Copper: { percentage: 0, dice: null },
Silver: { percentage: 0, dice: '3d6' },
Electrum: { percentage: 0, dice: null },
Gold: { percentage: 0, dice: null },
Platinum: { percentage: 0, dice: null },
Gems: { percentage: 0, dice: null },
Jewelry: { percentage: 50, dice: '6d6' },
magicItems: { percentage: 0, dice: null }
},
R: {
Copper: { percentage: 0, dice: null },
Silver: { percentage: 0, dice: null },
Electrum: { percentage: 0, dice: '2d6' },
Gold: { percentage: 0, dice: null },
Platinum: { percentage: 0, dice: null },
Gems: { percentage: 0, dice: null },
Jewelry: { percentage: 50, dice: '6d6' },
magicItems: { percentage: 0, dice: null }
},
S: {
Copper: { percentage: 0, dice: null },
Silver: { percentage: 0, dice: null },
Electrum: { percentage: 0, dice: null },
Gold: { percentage: 0, dice: '2d4' },
Platinum: { percentage: 0, dice: null },
Gems: { percentage: 0, dice: null },
Jewelry: { percentage: 50, dice: '6d6' },
magicItems: { percentage: 0, dice: null }
},
T: {
Copper: { percentage: 0, dice: null },
Silver: { percentage: 0, dice: null },
Electrum: { percentage: 0, dice: null },
Gold: { percentage: 0, dice: null },
Platinum: { percentage: 0, dice: '1d6' },
Gems: { percentage: 0, dice: null },
Jewelry: { percentage: 50, dice: '6d6' },
magicItems: { percentage: 0, dice: null }
},
U: {
Copper: { percentage: 50, dice: '1d20' },
Silver: { percentage: 50, dice: '1d20' },
Electrum: { percentage: 0, dice: null },
Gold: { percentage: 25, dice: '1d20' },
Platinum: { percentage: 0, dice: null },
Gems: { percentage: 5, dice: '1d4' },
Jewelry: { percentage: 50, dice: '6d6' },
magicItems: { percentage: 5, dice: '1d4' },
Special: { percentage: 2, dice: 'any 1' }
},
V: {
Copper: { percentage: 0, dice: null },
Silver: { percentage: 25, dice: '1d20' },
Electrum: { percentage: 25, dice: '1d20' },
Gold: { percentage: 50, dice: '1d20' },
Platinum: { percentage: 25, dice: '1d20' },
Gems: { percentage: 10, dice: '1d4' },
Jewelry: { percentage: 50, dice: '6d6' },
magicItems: { percentage: 10, dice: '1d4' },
Special: { percentage: 5, dice: 'any 1' }
}
};

//Gems & Jewelry Tables
static gemsValueTable = [
{ type: 'Ornamental', baseValue: 10, numberFound: '1d10' },
{ type: 'Semiprecious', baseValue: 50, numberFound: '1d8' },
{ type: 'Fancy', baseValue: 100, numberFound: '1d6' },
{ type: 'Precious', baseValue: 500, numberFound: '1d4' },
{ type: 'Gem', baseValue: 1000, numberFound: '1d2' },
{ type: 'Jewel', baseValue: 5000, numberFound: '1' },
];

static gemTypeTable = [
{ range: [1, 5], type: 'Alexandrite' },
{ range: [6, 12], type: 'Amethyst' },
{ range: [13, 20], type: 'Aventurine' },
{ range: [21, 30], type: 'Chlorastrolite' },
{ range: [31, 40], type: 'Diamond' },
{ range: [41, 43], type: 'Emerald' },
{ range: [44, 48], type: 'Fire Opal' },
{ range: [49, 57], type: 'Fluorospar' },
{ range: [58, 63], type: 'Garnet' },
{ range: [64, 68], type: 'Heliotrope' },
{ range: [69, 78], type: 'Malachite' },
{ range: [79, 88], type: 'Rhodonite' },
{ range: [89, 91], type: 'Ruby' },
{ range: [92, 95], type: 'Sapphire' },
{ range: [96, 100], type: 'Topaz' },
];

static valueAdjustmentTable = [
{ roll: 2, adjustment: 0.5 }, // Next Lower Value Row
{ roll: 3, adjustment: 0.5 },
{ roll: 4, adjustment: 0.75 },
{ roll: 5, adjustment: 1 },   // Normal Value
{ roll: 6, adjustment: 1 },   // Normal Value
{ roll: 7, adjustment: 1 },   // Normal Value
{ roll: 8, adjustment: 1 },   // Normal Value
{ roll: 9, adjustment: 1 },   // Normal Value
{ roll: 10, adjustment: 1.5 },
{ roll: 11, adjustment: 2 },
{ roll: 12, adjustment: 2 },  // Next Higher Value Row
];

static jewelryTable = [
{ range: [1, 6], type: 'Anklet' },
{ range: [7, 12], type: 'Belt' },
{ range: [13, 14], type: 'Bowl' },
{ range: [15, 21], type: 'Bracelet' },
{ range: [22, 27], type: 'Brooch' },
{ range: [28, 32], type: 'Buckle' },
{ range: [33, 37], type: 'Chain' },
{ range: [38, 40], type: 'Choker' },
{ range: [41, 42], type: 'Circlet' },
{ range: [43, 47], type: 'Clasp' },
{ range: [48, 51], type: 'Comb' },
{ range: [52, 52], type: 'Crown' },
{ range: [53, 55], type: 'Cup' },
{ range: [56, 62], type: 'Earring' },
{ range: [63, 65], type: 'Flagon' },
{ range: [66, 68], type: 'Goblet' },
{ range: [69, 73], type: 'Knife' },
{ range: [74, 77], type: 'Letter Opener' },
{ range: [78, 80], type: 'Locket' },
{ range: [81, 82], type: 'Medal' },
{ range: [83, 89], type: 'Necklace' },
{ range: [90, 90], type: 'Plate' },
{ range: [91, 95], type: 'Pin' },
{ range: [96, 96], type: 'Scepter' },
{ range: [97, 99], type: 'Statuette' },
{ range: [100, 100], type: 'Tiara' },
];

// Type of Item Table
static itemTypeTable = [
{ range: [1, 25], item: 'Weapon' },
{ range: [26, 35], item: 'Armour' },
{ range: [36, 55], item: 'Potion' },
{ range: [56, 85], item: 'Scroll' },
{ range: [86, 90], item: 'Wand, Staff, or Rod' },
{ range: [91, 97], item: 'Miscellaneous Items' },
{ range: [98, 100], item: 'Rare Items' },
];

// Magic Weapons Table
static magicWeaponTable = [
{ range: [1, 2], weapon: 'Great Axe', type: 'Melee' },
{ range: [3, 9], weapon: 'Battle Axe', type: 'Melee' },
{ range: [10, 11], weapon: 'Hand Axe', type: 'Melee' },
{ range: [12, 19], weapon: 'Shortbow', type: 'Ranged' },
{ range: [20, 27], weapon: 'Shortbow Arrow', type: 'Ranged' },
{ range: [28, 31], weapon: 'Longbow', type: 'Ranged' },
{ range: [32, 35], weapon: 'Longbow Arrow', type: 'Ranged' },
{ range: [36, 43], weapon: 'Light Quarrel', type: 'Ranged' },
{ range: [44, 47], weapon: 'Heavy Quarrel', type: 'Ranged' },
{ range: [48, 59], weapon: 'Dagger', type: 'Melee' },
{ range: [60, 65], weapon: 'Shortsword', type: 'Melee' },
{ range: [66, 79], weapon: 'Longsword', type: 'Melee' },
{ range: [80, 81], weapon: 'Scimitar', type: 'Melee' },
{ range: [82, 83], weapon: 'Two-Handed Sword', type: 'Melee' },
{ range: [84, 86], weapon: 'Warhammer', type: 'Melee' },
{ range: [87, 94], weapon: 'Mace', type: 'Melee' },
{ range: [95, 95], weapon: 'Maul', type: 'Melee' },
{ range: [96, 96], weapon: 'Pole Arm', type: 'Melee' },
{ range: [97, 97], weapon: 'Sling Bullet', type: 'Ranged' },
{ range: [98, 100], weapon: 'Spear', type: 'Melee' },
];


// Special Enemy Table
static specialEnemyTable = [
'Dragons', 'Enchanted', 'Lycanthropes', 'Regenerators', 'Spell Users', 'Undead'
];

// Special Ability Table
static specialAbilityTable = [
'Casts Light on Command', 'Charm Person', 'Drains Energy', 'Flames on Command', 
'Locate Objects', 'Wishes'
];

static magicArmourTable = [
{ range: [1, 9], armour: 'Leather Armour' },
{ range: [10, 28], armour: 'Chain Mail' },
{ range: [29, 43], armour: 'Plate Mail' },
{ range: [44, 100], armour: 'Shield' },
];

static magicArmourAbilityTable = [
{ range: [1, 50], armour: '+1' },
{ range: [51, 80], armour: '+2' },
{ range: [81, 90], armour: '+3' },
{ range: [91, 95], armour: `Cursed: -${Math.floor(Math.random() * 3) + 1}`},
{ range: [96, 100], armour: 'Cursed: AC 11 (Appears +1)' },
];

static rangedWeaponBonusTable = [
{ range: [1, 64],  bonus: `+${Math.floor(Math.random() * 3) + 1}`},
{ range: [65, 94], bonus: `+${Math.floor(Math.random() * 3) + 1} vs. ${NPCbuild.specialEnemyTable[Math.floor(Math.random() * NPCbuild.specialEnemyTable.length)]}`},
{ range: [95, 98], bonus: `+${Math.floor(Math.random() * 3) + 1} and ${NPCbuild.specialAbilityTable[Math.floor(Math.random() * NPCbuild.specialAbilityTable.length)]}`},
{ range: [99, 100], bonus: 'Cursed, -1*' },
];

// Weapon Bonus Tables
static meleeWeaponBonusTable = [
{ range: [1, 40], bonus: '+1' },
{ range: [41, 50], bonus: '+2' },
{ range: [51, 55], bonus: '+3' },
{ range: [56, 57], bonus: '+4' },
{ range: [58, 58], bonus: '+5' },
{ range: [59, 85], bonus: `+${Math.floor(Math.random() * 3) + 1} vs. ${NPCbuild.specialEnemyTable[Math.floor(Math.random() * NPCbuild.specialEnemyTable.length)]}`},
{ range: [86, 95], bonus: `+${Math.floor(Math.random() * 3) + 1} and ${NPCbuild.specialAbilityTable[Math.floor(Math.random() * NPCbuild.specialAbilityTable.length)]}`},
{ range: [96, 100], bonus: `Cursed: -${Math.floor(Math.random() * 3) + 1}`},
];

//Potions Table
static potionsTable = [
{ range: [1, 3], type: 'Clairaudience' },
{ range: [4, 6], type: 'Clairvoyance' },
{ range: [7, 8], type: 'Cold Resistance' },
{ range: [9, 11], type: 'Control Animal' },
{ range: [12, 13], type: 'Control Dragon' },
{ range: [14, 16], type: 'Control Giant' },
{ range: [17, 19], type: 'Control Human' },
{ range: [20, 22], type: 'Control Plant' },
{ range: [23, 25], type: 'Control Undead' },
{ range: [26, 32], type: 'Delusion' },
{ range: [33, 35], type: 'Diminution' },
{ range: [36, 39], type: 'Fire Resistance' },
{ range: [40, 43], type: 'Flying' },
{ range: [44, 47], type: 'Gaseous Form' },
{ range: [48, 51], type: 'Giant Strength' },
{ range: [52, 55], type: 'Growth' },
{ range: [56, 59], type: 'Healing' },
{ range: [60, 63], type: 'Heroism' },
{ range: [64, 68], type: 'Invisibility' },
{ range: [69, 72], type: 'Invulnerability' },
{ range: [73, 76], type: 'Levitation' },
{ range: [77, 80], type: 'Longevity' },
{ range: [81, 84], type: 'Mind Reading' },
{ range: [85, 86], type: 'Poison' },
{ range: [87, 89], type: 'Polymorph Self' },
{ range: [90, 97], type: 'Speed' },
{ range: [98, 100], type: 'Treasure Finding' },
];

static scrollsTable = [
{ range: [1, 3], type: 'Cleric Spell Scroll (1 Spell)' },
{ range: [4, 6], type: 'Cleric Spell Scroll (2 Spells)' },
{ range: [7, 8], type: 'Cleric Spell Scroll (3 Spells)' },
{ range: [9, 9], type: 'Cleric Spell Scroll (4 Spells)' },
{ range: [10, 15], type: 'Magic-User Spell Scroll (1 Spell)' },
{ range: [16, 20], type: 'Magic-User Spell Scroll (2 Spells)' },
{ range: [21, 25], type: 'Magic-User Spell Scroll (3 Spells)' },
{ range: [26, 29], type: 'Magic-User Spell Scroll (4 Spells)' },
{ range: [30, 32], type: 'Magic-User Spell Scroll (5 Spells)' },
{ range: [33, 34], type: 'Magic-User Spell Scroll (6 Spells)' },
{ range: [35, 35], type: 'Magic-User Spell Scroll (7 Spells)' },
{ range: [36, 40], type: 'Cursed Scroll' },
{ range: [41, 46], type: 'Scroll of Protection from Elementals' },
{ range: [47, 56], type: 'Scroll of Protection from Lycanthropes' },
{ range: [57, 61], type: 'Scroll of Protection from Magic' },
{ range: [62, 75], type: 'Scroll of Protection from Undead' },
{ range: [76, 85], type: 'Map to Treasure Type A' },
{ range: [86, 89], type: 'Map to Treasure Type E' },
{ range: [90, 92], type: 'Map to Treasure Type G' },
{ range: [93, 100], type: 'Map to 1d4 Magic Items' },
];

static wandsStavesRodsTable = [
{ range: [1, 8], type: 'Rod of Cancellation' },
{ range: [9, 13], type: 'Snake Staff' },
{ range: [14, 17], type: 'Staff of Commanding' },
{ range: [18, 28], type: 'Staff of Healing' },
{ range: [29, 30], type: 'Staff of Power' },
{ range: [31, 34], type: 'Staff of Striking' },
{ range: [35, 35], type: 'Staff of Wizardry' },
{ range: [36, 40], type: 'Wand of Cold' },
{ range: [41, 45], type: 'Wand of Enemy Detection' },
{ range: [46, 50], type: 'Wand of Fear' },
{ range: [51, 55], type: 'Wand of Fireballs' },
{ range: [56, 60], type: 'Wand of Illusion' },
{ range: [61, 65], type: 'Wand of Lightning Bolts' },
{ range: [66, 73], type: 'Wand of Magic Detection' },
{ range: [74, 79], type: 'Wand of Paralysis' },
{ range: [80, 84], type: 'Wand of Polymorph' },
{ range: [85, 92], type: 'Wand of Secret Door Detection' },
{ range: [93, 100], type: 'Wand of Trap Detection' },
];

static miscellaneousItemsTable = [
{ range: [1, 57], subtable: 'Effect Subtable 1' },
{ range: [58, 100], subtable: 'Effect Subtable 2' },
];

static effectSubtable1 = [
{ range: [1, 1], effect: 'Blasting', form: 'G' },
{ range: [2, 5], effect: 'Blending', form: 'F' },
{ range: [6, 13], effect: 'Cold Resistance', form: 'F' },
{ range: [14, 17], effect: 'Comprehension', form: 'E' },
{ range: [18, 22], effect: 'Control Animal', form: 'C' },
{ range: [23, 29], effect: 'Control Human', form: 'C' },
{ range: [30, 35], effect: 'Control Plant', form: 'C' },
{ range: [36, 37], effect: 'Courage', form: 'G' },
{ range: [38, 40], effect: 'Deception', form: 'F' },
{ range: [41, 52], effect: 'Delusion', form: 'A' },
{ range: [53, 55], effect: 'Djinni Summoning', form: 'C' },
{ range: [56, 67], effect: 'Doom', form: 'G' },
{ range: [68, 80], effect: 'Fire Resistance', form: 'F' },
{ range: [81, 85], effect: 'Invisibility', form: 'F' },
{ range: [86, 95], effect: 'Levitation', form: 'B' },
{ range: [96, 97], effect: 'Mind Reading', form: 'C' },
{ range: [98, 100], effect: 'Panic', form: 'G' },
];

static effectSubtable2 = [
{ range: [1, 7], effect: 'Protection +1', form: 'F' },
{ range: [8, 10], effect: 'Protection +2', form: 'F' },
{ range: [11, 11], effect: 'Protection +3', form: 'F' },
{ range: [12, 14], effect: 'Protection from Energy Drain', form: 'F' },
{ range: [15, 20], effect: 'Protection from Scrying', form: 'F' },
{ range: [21, 23], effect: 'Regeneration', form: 'C' },
{ range: [24, 29], effect: 'Scrying', form: 'H' },
{ range: [30, 32], effect: 'Scrying, Superior', form: 'H' },
{ range: [33, 39], effect: 'Speed', form: 'B' },
{ range: [40, 42], effect: 'Spell Storing', form: 'C' },
{ range: [43, 50], effect: 'Spell Turning', form: 'F' },
{ range: [51, 69], effect: 'Stealth', form: 'B' },
{ range: [70, 72], effect: 'Telekinesis', form: 'C' },
{ range: [73, 74], effect: 'Telepathy', form: 'C' },
{ range: [75, 76], effect: 'Teleportation', form: 'C' },
{ range: [77, 78], effect: 'True Seeing', form: 'D' },
{ range: [79, 88], effect: 'Water Walking', form: 'B' },
{ range: [89, 99], effect: 'Weakness', form: 'C' },
{ range: [100, 100], effect: 'Wishes', form: 'C' },
];

static formTable = {

A : [
{ item: "Bell (or Chime)", chance: [1,2]},
{ item: "Belt or Girdle", chance: [2,5]},
{ item: "Boots", chance: [6,13]},
{ item: "Bowl", chance: [14,15]},
{ item: "Cloak", chance: [16,28]},
{ item: "Crystal Ball or Orb", chance: [29,31]},
{ item: "Drums", chance: [32,33]},
{ item: "Helm", chance: [34,38]},
{ item: "Horn", chance: [39,43]},
{ item: "Lens", chance: [44,46]},
{ item: "Mirror", chance: [47,49]},
{ item: "Pendant", chance: [50,67]},
{ item: "Ring", chance: [68,100]}
],

B : [
{ item: "Boots", chance: [1,25] },
{ item: "Pendant", chance: [26,50]},
{ item: "Ring", chance: [51,100]}
],

C : [
{ item: "Pendant", chance: [1,40]},
{ item: "Ring", chance: [41,100]}
],

D : [
{ item: "Lens", chance: [1,17]},
{ item: "Mirror", chance: [18,21]},
{ item: "Pendant", chance: [22,50]},
{ item: "Ring", chance: [51,100]}
],

E : [
{ item: "Helm", chance: [1,40] },
{ item: "Pendant", chance: [41,80]},
{ item: "Ring", chance: [81,100]}
],

F : [
{ item: "Belt or Girdle", chance: [1,7] },
{ item: "Cloak", chance: [8,38] },
{ item: "Pendant", chance: [39,50] },
{ item: "Ring", chance: [51,100] }
],

G : [
{ item: "Bell (or Chime)", chance: [1,17]},
{ item: "Drums", chance: [18,50]},
{ item: "Horn", chance: [51,100]},
],

H : [ 
{ item: "Bowl", chance: [1,17]},   
{ item: "Crystal Ball or Orb", chance:[18,67]}, 
{ item: "Mirror", chance:[68,100]}, 
]

}

}

export default NPCbuild;



