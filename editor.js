import Ref from "./ref.js";
import load from "./load.js";
import Storyteller from "./storyteller.js";
import NPCs from "./npcs.js";
import Monsters from "./monsters.js";
import Items from "./items.js";
import Events from "./events.js";
import Spells from "./spells.js";
import Map from "./map.js";

const editor = {

editMode : false,
moveMode: false,
divIds : ['textLocation', 'npcBackStory','ambienceDescription'],

init: function () {
this.divIds.forEach((divId) => {
const divElement = document.getElementById(divId);
if (divElement) {
divElement.addEventListener('input', (event) => {
const text = event.target.value;
const cursorPosition = event.target.selectionStart;
const openBraceIndex = text.lastIndexOf('#', cursorPosition);
const openAsteriskIndex = text.lastIndexOf('*', cursorPosition);
const openTildeIndex = text.lastIndexOf('~', cursorPosition); // Add this line for ~

if (openBraceIndex !== -1 || openAsteriskIndex !== -1 || openTildeIndex !== -1) { // Add openTildeIndex here
let searchText;
let filteredItems;

if (openBraceIndex > openAsteriskIndex && openBraceIndex > openTildeIndex) { // Modify this condition
searchText = text.substring(openBraceIndex + 1, cursorPosition);
filteredItems = load.Data.items.filter(item =>
item.Name.toLowerCase().includes(searchText.toLowerCase())
);
} else if (openAsteriskIndex > openBraceIndex && openAsteriskIndex > openTildeIndex) { // Modify this condition
searchText = text.substring(openAsteriskIndex + 1, cursorPosition);
filteredItems = load.Data.monsters.filter(monster =>
monster.name.toLowerCase().includes(searchText.toLowerCase())
);
} else {
searchText = text.substring(openTildeIndex + 1, cursorPosition); // Handle ~ case
filteredItems = load.Data.spells.filter(spell =>
spell.Name.toLowerCase().includes(searchText.toLowerCase())
);
}

console.log(searchText);

// Show Centre
Ref.Centre.style.display = 'block';
Ref.Centre.innerHTML = ''; // Clear existing content

filteredItems.forEach(item => {
const option = document.createElement('div');
option.textContent = item.Name || item; // Use "Name" property if available
option.addEventListener('click', () => {
const replacement = openBraceIndex !== -1
? `#${item.Name}#`
: openAsteriskIndex !== -1
? `*${item.Name}*`
: openTildeIndex !== -1 // Add this line
? `~${item.Name}~` // Add this line
: ''; // Add this line for ~

const newText = text.substring(
0,
openBraceIndex !== -1
? openBraceIndex
: openAsteriskIndex !== -1
? openAsteriskIndex
: openTildeIndex // Add this line for ~
) + replacement + text.substring(cursorPosition);
event.target.value = newText;

//Ref.Centre.style.display = 'none'; // Hide Ref.optionsList
});
Ref.Centre.appendChild(option);
});
} else {

}
});
}
});
},

proper(string) {
return string.charAt(0).toUpperCase() + string.slice(1);
},

loadList: function(data) {

//Where to put list...
let target = Ref.Editor
target.innerHTML = '';
target.style.display = 'block'; 

// 0. Iterate over each property in the data object
for (const key in data) {
let obj = data[key]

//Set type and subType
const type = obj[0].type;
const subType = obj[0].subType;

// 1. Sort the items by item type alphabetically and then by Level numerically.
obj.sort((a, b) => {
const typeComparison = a[type].localeCompare(b[type]);

if (typeComparison !== 0) {
// If classes are different, return the result of class comparison
return typeComparison;
} else {
// If classes are the same, sort by Level numerically
return a[subType] - b[subType] || a.name.localeCompare(b.name);
}
});


// 2. Attach Key, Section and subSection Heads.
obj = obj.reduce((result, currentEntry, index, array) => {

const reversedArray = array.slice(0, index).reverse();
const lastEntryIndex = reversedArray.findIndex(entry => entry[type] === currentEntry[type]);

if (lastEntryIndex === -1 || currentEntry[type] !== reversedArray[lastEntryIndex][type]) {

result.push({sectionHead: true, key: key, [type]: currentEntry[type], [subType]: currentEntry[subType]});

if(currentEntry[subType]){

result.push({subSectionHead: true, [type]: currentEntry[type], [subType]: currentEntry[subType]})};

} else if (currentEntry[subType] !== reversedArray[lastEntryIndex][subType]) {

result.push({subSectionHead: true, [type]: currentEntry[type], [subType]: currentEntry[subType]});

}

result.push(currentEntry);
return result;
}, []);

//list Title
const titleDiv = document.createElement(key);

titleDiv.setAttribute("scope", 'key');
titleDiv.setAttribute("id", key);

titleDiv.innerHTML = 
`<h2>
<span
class ="misc"
style="display: block; letter-spacing: 0.18vw;">
${this.proper(key)}
</span></h2>`;

target.appendChild(titleDiv)
this.listEvents(null, titleDiv);

let currentSection = 0; // Keep track of the current section.
let currentSubSection = 0;


// 3. Iterate through the sorted entries.
for (const entry of obj) {
const nameDiv = document.createElement('div');

//3.1 Section Heads --- Type
if(entry.sectionHead){
currentSection++
currentSubSection = 0;

nameDiv.setAttribute("scope", 'section');
nameDiv.setAttribute("id", currentSection);
nameDiv.setAttribute('style', "display: none");

let entryName = entry[type] === ''? 'Misc' : entry[type];

nameDiv.innerHTML = 
`<span id = "${entryName}" class = "cyan" style="font-family:'SoutaneBlack'"> 
<hr>&nbsp;${entryName}
</span>`;

//3.2 subSection Heads --- subType values.
} else if (entry.subSectionHead){
currentSubSection++

nameDiv.setAttribute("scope", 'subsection');
nameDiv.setAttribute("id", currentSubSection);
nameDiv.setAttribute('style', "display: none");

let entryName = entry[type] === ''? 'Misc' : entry[subType];

nameDiv.innerHTML= 
`<span id = "${entryName}" class ="hotpink" style="font-family:'SoutaneBlack'">
<hr>&nbsp; ${this.proper(subType)} ${entryName}</span>`;

//3.3 subSection Entries   
}else if (entry[type] && entry[subType]){

nameDiv.setAttribute('style', "display: none")

nameDiv.innerHTML = 
`<span id = "${entry.name}" class ="white">
&nbsp;&nbsp;&nbsp;&nbsp;${entry.name}
</span>`;

//3.4 no subSection
}else if (entry[type]){

nameDiv.setAttribute('style', "display: none")

nameDiv.innerHTML = 
`<span id = "${entry.name}" class ="white">
&nbsp;&nbsp;${entry.name}
</span>`;

//3.5 Other Entries
}else {

nameDiv.setAttribute('style', "display: none")

nameDiv.innerHTML = 
`<span id = "${entry.name}" class = "gray"> 
&nbsp;&nbsp;${entry.name}
</span>`;

}


nameDiv.setAttribute('key', key)
nameDiv.setAttribute('keyShow', "false")
nameDiv.setAttribute('section', currentSection)
nameDiv.setAttribute('sectionShow', "false")
nameDiv.setAttribute('subsection', currentSubSection)
nameDiv.setAttribute('subsectionShow', "false")

target.appendChild(nameDiv);
this.listEvents(entry, nameDiv, key);

}}

},

listEvents: function(entry, div, key){

div.addEventListener('mouseover', function() {
this.classList.add('highlight');
});

div.addEventListener('mouseout', function() {
this.classList.remove('highlight');
});

if(div.getAttribute('scope')){
//1. showHide
div.addEventListener('click', () => {
this.showHide(div);
});

}else{

//1. showEntry
div.addEventListener('click', () => {

if(key === 'npcs'){
NPCs.addNPCInfo(entry.name, Ref.Left);
}else{
const form = editor.createForm(entry)
Ref.Left.appendChild(form);
}
});



}},

showHide: function (div) {
const scope = div.getAttribute("scope");
let items

if (scope === 'key'){ //has clicked on a keyHeading

let key = div.getAttribute("id")

items = document.querySelectorAll(`[key="${key}"]`); 


items.forEach(item => {

const keyShow = item.getAttribute('keyShow');
const isHeader = item.getAttribute('subSection') === '0'? true : false;

if(isHeader){

const newKeyShow = keyShow === 'true'? 'false' : 'true';
item.setAttribute('keyShow', newKeyShow); 

const keyDisplay = newKeyShow === 'true'? 'block' : 'none';
item.style.display = keyDisplay;

}else{

item.style.display = 'none';

}

item.setAttribute('sectionShow', "false")
item.setAttribute('subSectionShow', "false")

})}

else if (scope === 'section'){ //has clicked on a section heading

let key = div.getAttribute("key")
let section = div.getAttribute("id")

items = document.querySelectorAll(`[key="${key}"][section="${section}"]`);

items.forEach((item,index) => {

if(index > 0){

const sectionShow = item.getAttribute('sectionShow');

const newSectionShow = sectionShow === 'true'? 'false' : 'true';
item.setAttribute('sectionShow', newSectionShow); 

const sectionDisplay = newSectionShow === 'true'? 'block' : 'none';
item.style.display = sectionDisplay;

item.setAttribute('subSectionShow', "true")

}}) 
}

else if (scope === 'subsection'){ //has clicked on a subSection Heading

let key = div.getAttribute("key")
let section = div.getAttribute("section")
let subSection = div.getAttribute("id")

items = document.querySelectorAll(`[key="${key}"][section="${section}"][subsection="${subSection}"]`);

items.forEach((item,index) => {

if(index > 0){

const subSectionShow = item.getAttribute('subsectionshow');

const newSubSectionShow = subSectionShow === 'true'? 'false' : 'true';
item.setAttribute('subSectionShow', newSubSectionShow); 

const subSectionDisplay = newSubSectionShow === 'true'? 'block' : 'none';
item.style.display = subSectionDisplay;

item.setAttribute('sectionShow', "true")

}

})  }

},

createForm: function (obj){

console.log(obj);

['editForm', 'typeArea', 'nameArea', 'subTypeArea', 'breaker'].forEach(id => {
const element = document.getElementById(id);
if (element) {
element.remove();
}
});

Ref.Centre.innerHTML = '';
Ref.Centre.style.display = 'block';
Ref.Left.innerHTML = '';
Ref.Left.style.display = 'block';
//Ref.centreToolbar.style.display = 'flex';

const form = document.createElement('form');
form.id = 'editForm';
form.classList.add('form');

const excludedKeys = ['id', 'name', 'type', 'subType', 'description']; // Define keys to exclude

//0. Make Description Manually

const description = document.createElement('div');

let centreContent =  
`<label class="entry-label"
style="display: none"
divId="description">
</label>
<textarea
id="descriptionText"
class="entry-input centreText" 
>`;

description.innerHTML = centreContent;
Ref.Centre.appendChild(description);
Ref.Centre.style.display = 'block';

const descriptionText = document.getElementById('descriptionText');
descriptionText.textContent = obj.description || 'Insert information about ' + obj.name + ' here.';

    // Set the initial height based on the scroll height of the content
    descriptionText.style.height = 'auto';
    descriptionText.style.height = descriptionText.scrollHeight + 'px';

//Ref.Centre.style.height = descriptionText.scrollHeight + 'px';

descriptionText.addEventListener('input', function() {
    // Set the height based on the scroll height of the content
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
    //Ref.Centre.style.height = this.scrollHeight + 'px';
});

//1. Make Type Manually
const type = obj.type

const topArea = document.createElement('div');
topArea.id = 'typeArea';

let typeContent =  
`<label 
style="display: none"
divId="type">
</label>
<input
pair="${type}" 
class="centreType teal" 
style="font-family:'SoutaneBlack'"
id="typeEntry"
value="${obj[type] || 'none'} ">`;

topArea.innerHTML = typeContent;
Ref.Left.appendChild(topArea);

//2. Make subType Manually
const subType = obj.subType

const subTypeArea = document.createElement('div');
subTypeArea.id = 'subTypeArea';

let subTypeContent =  
`<label
style="display: none"
divId="subType">
</label>
<input
pair="${subType}" 
class="centreSubType teal" 
style="font-family:'SoutaneBlack'"
id="subTypeEntry"
value="${obj[subType] || 'none'} ">`;

topArea.innerHTML += subTypeContent;

//3. Make Name Manually

const nameArea = document.createElement('div');
nameArea.id = 'nameArea';

let nameContent =  
`<label class="entry-label" 
style="display: none"
divId="name">
</label>
<input 
class="entry-input centreName cyan" 
style="font-family:'SoutaneBlack'"
type="text" 
divId="name"
value="${obj.name || 'insert name here'} ">`;

nameArea.innerHTML = nameContent;
Ref.Left.appendChild(nameArea);

setTimeout(function() {
nameArea.style.height = nameArea.scrollHeight + 'px';
}, 0);


const breaker = document.createElement('hr')
breaker.id = 'breaker';
Ref.Left.appendChild(breaker);

//4. Generate Fields Dynamically

for (const key in obj) {
if (obj.hasOwnProperty(key) && !excludedKeys.includes(key)) { // Check if key is not excluded

const elementContainer = document.createElement('div');

let elementContent =  
`<h3>
<label class="expandable orange entry-label" 
data-content-type="rule" 
divId="${[key]}">
${this.proper(key)}
</label>
<input 
class="leftText white entry-input" 
type="text" 
divId= "edit${obj[key]}"
value="${obj[key]}"></h3>`;

elementContainer.innerHTML = elementContent;
Ref.Left.appendChild(elementContainer);

elementContainer.addEventListener('click', function() {
elementContainer.querySelector('.leftText').focus();
elementContainer.querySelector('.leftText').select();
});

const inputElement = elementContainer.querySelector('.entry-input');

// inputElement.addEventListener('blur', function() {
//     console.log('saving...');
//     this.saveDataEntry();
// }.bind(this)); // Ensure `this` refers to the correct context inside the event listener

// elementContainer.addEventListener('input', function() {
// // Calculate the height based on the scroll height of the textarea
// this.style.height = 'auto'; 
// this.style.height = this.scrollHeight + 'px';

// });

// elementContainer.addEventListener('blur', function() {
// // Remove empty space at the end of the textarea value
// this.value = this.value.trim();

// });

setTimeout(function() {
elementContainer.style.height = elementContainer.scrollHeight + 'px';
}, 0);
}
}

//0. Make ID Manually

const existingId = document.getElementById('centreId');
if (existingId) {
existingId.remove(); // Remove the existing form
}

const idArea = document.createElement('div');
idArea.id = 'centreId';

let idContent =  
`<label class="entry-label" 
style="display: none"
divId="id">
</label>
<input
class="entry-input centreId" 
style="font-family:'SoutaneBlack'"
divId="id"
value="${obj.id || 'N/A'} ">`;

idArea.innerHTML += idContent;
Ref.Left.appendChild(idArea);

return form;

},

saveDataEntry: function() {

const saveEntry = {};

// get array of label divIds.
const labelElements = document.querySelectorAll('.entry-label');
const labels = [];

labelElements.forEach(label => {
    const divId = label.getAttribute('divId');
    labels.push(divId);
});

//get array of input divIds
const inputElements = document.querySelectorAll('.entry-input');
const inputs = [];

inputElements.forEach(input => {
    const value = input.value;
    inputs.push(value);
});

// Pair the contents of the labels and inputs arrays to create the saveEntry object
for (let i = 0; i < labels.length; i++) {
    saveEntry[labels[i]] = inputs[i];
}

//Edit saveEntry object for type and subType -- will need to change if to be user-access'

console.log(document.getElementById('subTypeEntry').getAttribute('pair'))

saveEntry['type'] = document.getElementById('typeEntry').getAttribute('pair');
saveEntry['subType']= document.getElementById('subTypeEntry').getAttribute('pair');

saveEntry['id'] = parseInt(saveEntry['id']);

const key = saveEntry && saveEntry['key'];
const id = saveEntry && saveEntry['id'];
const index = key && id && load.Data[key].findIndex(entry => entry.id === parseInt(id));
console.log(key, id, index);
console.log(saveEntry);
//console.log('Existing saveEntry:' + load.Data[key][index].class)

load.Data[key][index] = saveEntry;
editor.loadList(load.Data);
load.displayLocations(load.Data.locations);
// console.log('Updated saveEntry:');
// console.log(load.Data[key][index]);

},

deleteLocation() {
let array;
let id;
let index;

switch (this.editPage) {

case 2:

array = load.Data.events;
id = Ref.eventId.value;
index = array.findIndex(entry => parseInt(entry.id) === parseInt(id));

if (index !== -1) {
const confirmation = window.confirm("Are you sure you want to delete " + array[index].name + "?");

if (confirmation) {
array.splice(index, 1); 
Events.loadEventsList(array, Ref.Centre);
Ref.eventForm.reset();
}
}

break;

case 3:

array = load.Data.npcs;
id = Ref.npcId.value;
index = array.findIndex(entry => parseInt(entry.id) === parseInt(id));

if (index !== -1) {
const confirmation = window.confirm("Are you sure you want to delete " + array[index].name + "?");

if (confirmation) {
array.splice(index, 1); 
NPCs.loadNPC(array, Ref.Centre);
Ref.npcForm.reset();
}
}

break;

case 4:

array = load.Data.monsters;
id = Ref.monsterId.value;
index = array.findIndex(entry => parseInt(entry.id) === parseInt(id));

if (index !== -1) {
const confirmation = window.confirm("Are you sure you want to delete " + array[index].name + "?");

if (confirmation) {
array.splice(index, 1); 
editor.loadList(array, "All Monsters");
Ref.monsterForm.reset();
}
}

break;

case 5:

array = load.Data.items;
id = Ref.itemId.value;
index = array.findIndex(entry => parseInt(entry.id) === parseInt(id));

if (index !== -1) {
const confirmation = window.confirm("Are you sure you want to delete " + array[index].name + "?");

if (confirmation) {
array.splice(index, 1); 
editor.loadList(array, "All Items");
Ref.itemForm.reset();
}
}

break;

case 6:

array = load.Data.spells;
id = Ref.spellId.value;
index = array.findIndex(entry => parseInt(entry.id) === parseInt(id));

if (index !== -1) {
const confirmation = window.confirm("Are you sure you want to delete " + array[index].name + "?");

if (confirmation) {
array.splice(index, 1); 
editor.loadList(array, "All Spells");
Ref.form.reset();
}
}

break;

default:
// For locations.
const divId = Ref.locationLabel.textContent;
array = load.Data.locations;
index = array.findIndex(entry => entry.divId === divId);

if (index !== -1) {
const confirmation = window.confirm("Are you sure you want to delete " + array[index].divId + "?");

if (confirmation) {
// Remove the entry from Data.locations
array.splice(index, 1);

// Remove the corresponding <div> element from the DOM
const divToRemove = document.getElementById(divId);
if (divToRemove) {
divToRemove.remove();
}
}
}
break;
}
},

// Save a Location
saveLocation() {
const divId = Ref.locationLabel.textContent; // Get the divId for the location you're saving

//Find correct place to save...
const matchingEntry = load.Data.locations.find(entry => entry.divId === divId);

if (matchingEntry) {
// Update the corresponding entry in Data.locations
console.log(matchingEntry)
matchingEntry.description = Ref.textLocation.value;
matchingEntry.divId = Ref.editLocationName.value;
matchingEntry.tags = Ref.editLocationTags.value;

//Update the Existing Divs
const locationDiv = document.getElementById(divId);
locationDiv.setAttribute('id',Ref.editLocationName.value);
locationDiv.querySelector('.div-id-label').textContent = Ref.editLocationName.value;

//console.log("Updated Entry: " + JSON.stringify(matchingEntry, null, 2));

//Refresh
const savedLocation = document.getElementById(Ref.editLocationName.value);
Storyteller.changeContent(savedLocation);

}

// Update the new location name in npcArray!

for (const npc of load.Data.npcs) {
if (npc.MorningLocation === divId) {
npc.MorningLocation = Ref.editLocationName.value;
}
if (npc.AfternoonLocation === divId) {
npc.AfternoonLocation = Ref.editLocationName.value;
}
if (npc.NightLocation === divId) {
npc.NightLocation = Ref.editLocationName.value;
}
}



}, 

};

export default editor;