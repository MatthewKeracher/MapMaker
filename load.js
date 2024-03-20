// Import the necessary module
import editor from "./editor.js";

import Ref from "./ref.js";
import Items from "./items.js";
import Monsters from "./monsters.js";
import Spells from "./spells.js";
import Events from "./events.js";
import Storyteller from "./storyteller.js";
import NPCs from "./npcs.js";

const load = {

Data : [],
fileName : '',

loadDefault(){
const url = 'data.json';

fetch(url)
.then(response => response.json())
.then(data => {
// Here, 'data' will be your JSON array
this.Data = data
//console.log(this.Data);
})
.catch(error => {
console.error('Error fetching data:', error);
});

},

generateUniqueId(array, scope) {

if(scope === 'array'){

const largestId = array.reduce((maxId, entry) => (entry.id && entry.id > maxId) ? entry.id : maxId, 0);
//console.log(largestId);
let newId = largestId + 1;

for (const entry of array) {
if (!entry.id) {
entry.id = newId;
newId++;
}
}}

else if(scope === 'entry'){

const largestId = array.reduce((maxId, entry) => (entry.id && entry.id > maxId) ? entry.id : maxId, 0);

return largestId + 1;

}},

loadSaveFile: async (event) => {
const file = event.target.files[0];
if (file) {
const reader = new FileReader();

// Wrap the file reading logic in a Promise
const readFile = () => {
return new Promise((resolve, reject) => {
reader.onload = (e) => {
const fileContent = e.target.result;
if (fileContent) {
    resolve({ content: fileContent, name: file.name });
} else {
    reject(new Error('Error: File content is empty.'));
}
};
reader.onerror = (error) => reject(error);
reader.readAsText(file);
});
};

try {
// Wait for the file reading process to complete
const { content, name } = await readFile();

// Remove the file extension from the name
const fileNameWithoutExtension = name.replace(/\.[^/.]+$/, "")

// Now you can call loadAndBuild safely
await NPCs.loadAndBuild(content);

// Return the file name
load.fileName = fileNameWithoutExtension;
Ref.locationLabel.textContent = load.fileName;

} catch (error) {
console.error('Error reading file:', error);
// Handle the error appropriately, e.g., display an error message to the user
}
}
},

handleFileLoad(fileContent) {
return new Promise((resolve, reject) => {

try {
if (fileContent) {

load.Data = JSON.parse(fileContent);
this.generateTags(load.Data);
this.sortData(load.Data);
console.log(load.Data)

try {
load.displayLocations(load.Data.locations);
} catch (error) {
console.error('Error loading file:', error);
reject(error);
}

resolve();
} else {
console.error('Error: File content is empty.');
reject('File content is empty.');
}
} catch (error) {
console.error('Error parsing JSON:', error);
reject(error);
}
});
},

generateTags(data) {
let tagsArray = [];

for (const key in data) {
let obj = data[key];

obj.forEach(entry => {
const tags = entry.tags ? entry.tags.split(',').map(tag => tag.trim()) : [];
tagsArray.push(...tags);
});
}

// Convert to a set to remove duplicates, then back to an array
const uniqueTagsArray = [...new Set(tagsArray)];

tagsArray = uniqueTagsArray.map((tag, index) => {
return {
//metadata
key: 'tags',
type: 'parent', 
subType: 'child',

//stay same
id: index,
name: tag, 
parent: 'type',
child: 'subType',
description: '',
}
});


load.Data.tags = tagsArray;

//console.log(load.Data);
},

sortData(data){

for (const key in data) {

let obj = data[key]

// if (key === 'spells') {
// obj = obj.map(spell => ({

// //metadata
// key: key,
// type: 'class', 
// subType: 'level',

// //change
// class: spell.type, 
// level: spell.subType, 

// //stay same
// id: spell.id,
// name: spell.name, 
// range: spell.range, 
// duration: spell.duration, 
// description: spell.description, 
// reverse: spell.reverse, 
// note: spell.note, 

// }));
// }

// if( key === 'monsters'){
// obj = obj.map(monster => ({

// //metadata
// key: key,
// type: 'class', 
// subType: 'level',

// //change
// class: monster.class, 
// level: monster.level, 

// //stay same
// id: monster.id,
// name: monster.name,
// hd: monster.hd,
// attacks: monster.attacks,
// damage: monster.damage,
// movement: monster.movement,
// noApp: monster.noApp,
// ac: monster.ac,
// morale: monster.morale,
// treasure: monster.treasure,
// lairTreasure: monster.lairTreasure,
// xp: monster.xp,
// description: monster.description,
// special: monster.special,

// }));
// }

// if( key === 'items'){
// obj = obj.map(item => ({

// //metadata
// key: key,
// type: 'group', 
// subType: 'size',

// //change
// group: item.type,

// //stay same
// id: item.id,
// name: item.name,
// size: item.size,
// weight: item.weight,
// volCubFt: item.volCubFt,
// volGal: item.volGal,
// volLbs: item.volLbs,
// cost: item.cost,
// damage: item.damage,
// range: item.range,
// ac: item.ac,
// description: item.description

// }));
// }

// if( key === 'events'){
// obj = obj.map(event => ({

// //metadata
// key: key,
// type: 'group', 
// subType: 'target',

// //change
// target: event.subType, 
// group: event.type, 

// //stay same
// id: event.id,
// active: event.active,
// name: event.name, 
// description: event.description, 
// location: event.location, 
// npc: event.npc, 

// }));
// }

// if( key === 'npcs'){
// obj = obj.map(npc => ({

// //metadata
// key: key,
// type: 'class', 
// subType: 'level',

// //same
// "id": npc.id,
// "name": npc.name,
// "tags": npc.tags,
// "level": npc.level,
// "class": npc.class,
// "monsterTemplate": npc.monsterTemplate,
// "str": npc.str,
// "dex": npc.dex,
// "int": npc.int,
// "wis": npc.wis,
// "con": npc.con,
// "cha": npc.cha,
// "description": npc.Backstory,
// // "strMod": npc.strMod,
// // "dexMod": npc.dexMod,
// // "intMod": npc.intMod,
// // "wisMod": npc.wisMod,
// // "conMod": npc.conMod,
// // "chaMod": npc.chaMod,
// // "Modifiers": npc.Modifiers,
// // "hitPoints": npc.hitPoints,
// "inventory": npc.inventory,
// // "savingThrows": npc.savingThrows,
// // "attackBonus": npc.attackBonus,
// // "AC": npc.AC,
// // "attacks": npc.attacks,
// // "damage": npc.damage,
// // "XP": npc.xp,
// // "movement": npc.movement,
// // "treasure": npc.treasure,

// }));
// }

// if( key === 'locations'){
// obj = obj.map(location => ({

// //metadata
// key: key,
// type: 'group', 
// subType: 'color',

// //add
// group: 'Test', //location.group, 
// color: 'hotpink', //location.faction, 

// //stay same
// id: null,//location.id,
// name: location.name, 
// tags: location.tags, 
// description: location.description,

// left: location.left, 
// top: location.top, 
// width: location.width, 
// height: location.height, 


// }));

// }

//Sort Ids
//doesn't work with generateTags
this.generateUniqueId(obj, 'array');

data[key]= obj;

}},

displayLocations(data) {
//Display loaded locations onto the Map.

// 1. Clear the existing content
var oldData = document.getElementsByClassName('selection');

while(oldData[0]) {
oldData[0].parentNode.removeChild(oldData[0]);
}

//load.Data.locations = [];

// 2. Set Colour
const colorList = ["lime", "orange", "cyan", "hotpink", "gold"];

// 3.  Add the loaded locations to the map and the array
data.forEach((location) => {
const newLoc = this.addLocationtoData(location);

// 4. Choose a random color from the colorList
// const randomColorIndex = Math.floor(Math.random() * colorList.length);
// const randomColor = colorList[randomColorIndex];

// 5. Set the chosen random color as the background color
newLoc.style.backgroundColor = location.color;

const imageContainer = document.querySelector('.image-container');
const firstChild = imageContainer.firstChild;
imageContainer.insertBefore(newLoc,firstChild);

//imageContainer.appendChild(newLoc);

//this.addLocationToArray(locationData);
//console.log("Adding to Map and Array: " + JSON.stringify(newLoc, null, 2));

//Add Events to Divs
this.addLocationEvents()

});

},

addLocationtoData(locationData) {
const { left, top, width, height, name} = locationData;

// Create a new location element with the specified properties
const newLoc = document.createElement('div');
newLoc.className = 'position-div selection';
newLoc.style.left = left + 'px';
newLoc.style.top = top + 'px';
newLoc.style.width = width + 'px';
newLoc.style.height = height + 'px';
newLoc.id = name;

// Create a label element for the div ID
const imageContainer = document.querySelector('.image-container');
const labelElement = document.createElement('div');
labelElement.className = 'div-id-label';
labelElement.textContent = name;
newLoc.appendChild(labelElement);

return newLoc;
},   

addLocationToArray(locationData) {
const { 
left, 
top, 
width, 
height, 
id,
name, 
tags, 
description,
group,
faction,
type,
subType } = locationData;

// Create a new location object with the specified properties
const newLocation = {
left, 
top, 
width, 
height, 
id,
name, 
tags, 
description,
group,
faction,
type,
subType 
};

load.Data.locations.push(newLocation);
//console.log("Adding to Array: " + JSON.stringify(newLocation, null, 2));
},

addLocationEvents() {
const locations = document.querySelectorAll('.selection');

locations.forEach((location) => {
if (!location.dataset.hasListener) {


location.addEventListener('click', () => {
Storyteller.changeContent(location);
NPCs.clearForm(Ref.npcForm);
});

//Show Form when Editing
location.addEventListener('click', () => {

if (editor.editMode){
const obj = load.Data.locations.find(obj => location.id === obj.name);
const form = editor.createForm(obj);
Ref.Left.appendChild(form);
}
});


location.dataset.hasListener = true;
}
});
},


}

export default load;