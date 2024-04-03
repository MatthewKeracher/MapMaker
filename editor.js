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
makeNew: false,
moveMode: false,
addItem: false,
delItem: false,
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
//console.log('loading List')
//console.log(data)
//Where to put list...
let target = Ref.Editor
target.innerHTML = '';
target.style.display = 'block'; 
const excludedKeys = ['townText'];
const numKeys = Object.keys(data).length;
let startVisible = "false";

// 0. Iterate over each property in the data object
for (const key in data) {

if (!excludedKeys.includes(key)){

if(numKeys === 1){startVisible = "true"};

let obj = data[key]
//console.log(key)

if(obj[0]){
// Set type and subType
const type = obj[0].type;
const subType = obj[0].subType;


if(obj.length < 2){

//Not enough entries to run comparison. No need to either.

}else{

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

};

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
const titleDiv = document.createElement('div');

titleDiv.setAttribute("scope", 'key');
titleDiv.setAttribute("id", key);
titleDiv.classList.add('misc');

titleDiv.innerHTML = 
`<h2>
<span
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
nameDiv.setAttribute('id', entry.id)
nameDiv.setAttribute('style', "display: none")

nameDiv.innerHTML = 
`<span id = "${entry.id}" class ="white">
&nbsp;&nbsp;&nbsp;&nbsp;${entry.name}
</span>`;

//3.4 no subSection
}else if (entry[type]){
nameDiv.setAttribute('id', entry.id)
nameDiv.setAttribute('style', "display: none")

nameDiv.innerHTML = 
`<span id = "${entry.id}" class ="white">
&nbsp;&nbsp;${entry.name}
</span>`;

//3.5 Other Entries
}else {
nameDiv.setAttribute('id', entry.id)
nameDiv.setAttribute('style', "display: none")

nameDiv.innerHTML = 
`<span id = "${entry.id}" class = "gray"> 
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

//2.makeNew Hover
div.addEventListener('mouseover', function() {

if(editor.makeNew === true){ 
this.classList.remove('misc');   
this.classList.add('item');
}
});

div.addEventListener('mouseout', function() {

if(editor.makeNew === true){ 
this.classList.remove('item');   
this.classList.add('misc');
}

});

}else{

//1. showEntry
div.addEventListener('click', () => {

if(key === 'npcs'){
NPCs.addNPCInfo(entry.name, Ref.Left);
} 
else if(key === 'items' && editor.addItem === true){
console.log(div)
const itemId = div.getAttribute('id')
editor.addItemtoNPC(itemId);
}
else{
const form = editor.createForm(entry)
Ref.Left.appendChild(form);
}
});

}},

addItemtoNPC(itemId){

const currentId = document.getElementById('currentId').value;
const npc = load.Data.npcs.find(npc => parseInt(npc.id) === parseInt(currentId));
const npcName = npc.name
const itemIndex = load.Data.items.findIndex(item => parseInt(item.id) === parseInt(itemId));
load.Data.items[itemIndex].tags = npcName;
console.log(load.Data.items[itemIndex])
NPCs.buildNPC();
NPCs.addNPCInfo(npcName)

    
},

searchAllData: function (searchText) {
const resultsByKeys = {}; // Object to store results grouped by keys
const excludedKeys = ['townText'];

// Iterate over each key in load.Data
for (const key in load.Data) {
if (load.Data.hasOwnProperty(key) && !excludedKeys.includes(key)) {
// Get the array corresponding to the key
const dataArray = load.Data[key];

// Iterate over each object in the array
dataArray.forEach(obj => {
// Check if any property of the object contains the search string
for (const prop in obj) {
if (Object.prototype.hasOwnProperty.call(obj, prop)) {
const propValue = obj[prop];
// If the property value is a string and contains the search text
if (typeof propValue === 'string' && propValue.toLowerCase().includes(searchText.toLowerCase())) {
// Group the result by obj.key
if (!resultsByKeys[obj.key]) {
resultsByKeys[obj.key] = []; // Initialize array if not exist
}
resultsByKeys[obj.key].push(obj);
// Break out of the loop to avoid duplicate results
break;
}}}});
}}

if(searchText === ''){
this.loadList(load.Data)
}else{
this.loadList(resultsByKeys);
}

},

showHide: function (div) {
const scope = div.getAttribute("scope");
let items

if (scope === 'key'){ //has clicked on a keyHeading

let key = div.getAttribute("id")

if(editor.makeNew === true){ // to make new Entries
editor.createForm(load.Data[key][0])
editor.makeNew = false;
div.classList.remove('item');   
div.classList.add('misc');

}else{

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

})

}}

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

const color = obj.color? obj.color : 'cyan';

['editForm', 'typeArea', 'nameArea', 'subTypeArea', 'breaker', 'newArea'].forEach(id => {
const element = document.getElementById(id);
if (element) {
element.remove();
}
});

Ref.Centre.innerHTML = '';
Ref.Centre.style.display = 'block';
Ref.Left.innerHTML = '';
Ref.Left.style.display = 'block';

const form = document.createElement('form');
form.id = 'editForm';
form.classList.add('form');

if (obj) {
if (editor.makeNew === true) {
const reservedTerms = ['id', 'key', 'type', 'subtype'];

// Create a deep copy of the original object
const newObj = JSON.parse(JSON.stringify(obj));

// Generate a unique ID for the new object
newObj.id = load.generateUniqueId(load.Data[obj.key], 'entry');

// Iterate over each property in the new object
for (let key in newObj) {
// Check if the property is not reserved
if (newObj.hasOwnProperty(key) && !reservedTerms.includes(key)) {
// Update the value of each property to 'Insert Value Here'
const properKey = this.proper(obj.key.slice(0, -1));
newObj[key] = 'New ' + this.proper(properKey) + ' ' + this.proper(key);
}
}

obj = newObj
// Print the first spell in load.Data to see if it's modified
console.log(load.Data.spells[0]);

// Now you can use newObj with modified values
}

const excludedKeys = ['id', 'name', 'type', 'subType', 'description', 'key']; // Define keys to exclude

//12. Make ID Manually
if(obj.id){
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
style="display:none"
divId="id"
id="dataEntryId"
value="${obj.id || 'N/A'} ">`;

idArea.innerHTML = idContent;
Ref.Left.appendChild(idArea);
}

//1. Make Description Manually
if(obj){

const description = document.createElement('div');

let centreContent =  
`<h3>
<label class="entry-label"
style="font-family:'SoutaneBlack'; color: ${color}; width: auto;"
divId="description">
Description
</label>
<hr></h3>
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
}

const topArea = document.createElement('div');
topArea.style.display = 'block'; 

//2. Make Type Manually
const topAreaTop = document.createElement('div');
topAreaTop.style.display = 'flex'; // Set the display property to flex


if(obj.type){
const type = obj.type
topArea.id = 'typeArea';

let typeContent =  
`<label 
style="display: none"
divId="type">
</label>
<input
pair="${type}" 
class="centreType" 
style="font-family:'SoutaneBlack'; color:${color}"
id="typeEntry"
value="${obj[type] || 'none'} ">`;

topAreaTop.innerHTML = typeContent;
Ref.Left.appendChild(topAreaTop);
Ref.Left.appendChild(topArea);
}

//3. Make subType Manually
if(obj.subType){
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
class="centreSubType" 
style="font-family:'SoutaneBlack'; color:${color}"
id="subTypeEntry"
value="${obj[subType] || 'none'} ">`;

topAreaTop.innerHTML += subTypeContent;
}

//4. Make Name Manually
if(obj.name){
const nameArea = document.createElement('div');
nameArea.id = 'nameArea';

let nameContent =  
`<label class="entry-label" 
style="display: none"
divId="name">
</label>
<input 
class="entry-input centreName" 
style="font-family:'SoutaneBlack'; color:${color}"
type="text" 
divId="name"
value="${obj.name || 'insert name here'} ">`;

nameArea.innerHTML = nameContent;
topArea.appendChild(nameArea);

setTimeout(function() {
nameArea.style.height = nameArea.scrollHeight + 'px';
}, 0);
}

//5. Add Breaker
const breaker = document.createElement('hr')
breaker.id = 'breaker';
topArea.appendChild(breaker);

//6. Make Key and Make Invisible
if(obj.key){
const keyArea = document.createElement('div');

let keyContent =  
`<label class="entry-label" 
style="display: none"
divId="key">
</label>
<input 
class="leftText white entry-input"
style="display:none" 
id="dataEntryKey"
divId= "edit${obj.key}"
value="${obj.key}"></h3>`;

keyArea.innerHTML = keyContent;
Ref.Left.appendChild(keyArea);
}

//7. Generate Settings Fields Dynamically

//Add Settings Header
const settingsHeader = document.createElement('div');
let settingsHeadContent = 
`<h3>
<span style="font-family:'SoutaneBlack'; color:${color}" id="settingsHeadContent">
Settings [...]
</span></h3>`;

settingsHeader.innerHTML = settingsHeadContent;
Ref.Left.appendChild(settingsHeader);

//Add Show/Hide on Header for Section
settingsHeader.addEventListener('click', function() {
const headerContent = document.getElementById('settingsHeadContent')

if(settingsContainer.style.display === "none"){
settingsContainer.style.display = "block"
headerContent.textContent = 'Settings:';

}else{
settingsContainer.style.display = "none"
headerContent.textContent = 'Settings [...]';
}

});

//Add Container
const container = document.createElement('div');
container.setAttribute('id', 'settingsContainer');
container.classList.add('no-hover');
Ref.Left.appendChild(container);
const settingsContainer = document.getElementById('settingsContainer');
settingsContainer.style.display = "none";


for (const key in obj) {
if (obj.hasOwnProperty(key) && !excludedKeys.includes(key)) { // Check if key is not excluded

const elementContainer = document.createElement('div');

let elementContent =  
`<h3>
<label class="expandable entry-label" 
style="font-family:'SoutaneBlack'; color:${color}"
data-content-type="rule" 
divId="${[key]}">
${this.proper(key)}
</label>
<input class="leftTextshort white entry-input" 
id= "edit${[key]}">
</input>
</h3>`;

elementContainer.innerHTML = elementContent;
settingsContainer.appendChild(elementContainer);

const elementText = document.getElementById('edit' + key);
const lineHeight = parseFloat(window.getComputedStyle(elementText).lineHeight);
const numLines = Math.floor(elementText.scrollHeight / lineHeight);

elementText.value = obj[key] || '';

// if(numLines === 2){
// elementText.style.height = Math.max(elementText.scrollHeight - lineHeight, lineHeight) + 'px';
// } else {
// elementText.style.height = elementText.scrollHeight + 'px';
// }

elementText.addEventListener('input', function() {
// Set the height based on the scroll height of the content
this.style.height = 'auto';
this.style.height = this.scrollHeight + 'px';
elementContainer.style.height = this.scrollHeight + lineHeight + 'px';
});

elementContainer.addEventListener('click', function() {
elementContainer.querySelector('.leftText').focus();
elementContainer.querySelector('.leftText').select();
});

}
}

//8. Add field for New
// if(obj){
// const newArea = document.createElement('div');

// let newContent =  
// `<hr><h3>
// <input class="leftText orange entry-label" 
// style="font-family:'SoutaneBlack'; width: auto;"
// data-content-type="rule" 
// divId="newField"
// value="New Field">
// <input 
// class="leftText white entry-input" 
// type="text" 
// divId= "newContent"
// value="Insert New Value"></h3>`;

// newArea.innerHTML = newContent;
// Ref.Left.appendChild(newArea);
// }

//10. Add Events in Same Location
if(obj.key === 'locations' || obj.key === 'events'){
//get data
let locEvents
let parentLocation
if(obj.key === 'locations'){
locEvents = load.Data.events.filter(event => event.target === 'NPC' && event.location === obj.name);
parentLocation = obj.name
}

else if (obj.key === 'events' && obj.target === 'Location'){
locEvents = load.Data.events.filter(event => event.target === 'NPC' && event.location === obj.name);
parentLocation = obj.name;
} 

else if (obj.key === 'events' && obj.target === 'NPC'){
locEvents = load.Data.events.filter(event => event.target === 'NPC' && event.location === obj.location);
parentLocation = obj.location;
}

//Add Header
const locEventsHeader = document.createElement('div');
let locEventsHeaderContent = 
`<hr><h3>
<span 
id="locEventsHeaderContent"
style="font-family:'SoutaneBlack'; color:${color}">
${parentLocation} Events [...]
</span></h3>`

locEventsHeader.innerHTML = locEventsHeaderContent;
Ref.Left.appendChild(locEventsHeader);

//Add Show/Hide on Header for Section
locEventsHeader.addEventListener('click', function() {
    const headerContent = document.getElementById('locEventsHeaderContent')
    
    if(locEventsContainer.style.display === "none"){
        locEventsContainer.style.display = "block"
    headerContent.textContent = parentLocation + ' Events:';
    
    }else{
    locEventsContainer.style.display = "none"
    headerContent.textContent = parentLocation + ' Events [...]';
    }
    
    });

//Add Container
const container = document.createElement('div');
container.setAttribute('id', 'locEventsContainer');
container.classList.add('no-hover');
Ref.Left.appendChild(container);
const locEventsContainer = document.getElementById('locEventsContainer');
locEventsContainer.style.display = "none";


//Make New Event.
const newEventArea = document.createElement('div');
let newEventContent = `<h3><span class = 'leftText'>[Add New Event]</span></h3>`;

newEventArea.innerHTML = newEventContent;
locEventsContainer.appendChild(newEventArea);

newEventArea.style.color = 'lightgray'

newEventArea.addEventListener('mouseenter', function(){
this.style.color = 'lime';
})

newEventArea.addEventListener('mouseleave', function(){
this.style.color = 'lightgray';
})

newEventArea.addEventListener('click', function(){

const newsubLoc = {

//metadata
id: load.generateUniqueId(load.Data.events, 'entry'),
key: 'events',
type: 'target', 
subType: 'group',

name: 'New Event', 
active: 1,
tags: '',
target: 'NPC',
group: '',
location: parentLocation,
npc: 'All', 

description: 'They are smiling.',

}
editor.createForm(newsubLoc)  
})

//Add locEvents
if(locEvents){
locEvents.forEach(locEv => {

const subLocArea = document.createElement('div');
let subLocContent = `<h3><span>${locEv.name}</span></h3>`;

subLocArea.innerHTML = subLocContent;
locEventsContainer.appendChild(subLocArea);

if(parseInt(locEv.active) === 1){
subLocArea.style.color = 'lightgray'
}else{
subLocArea.style.color = 'gray'
}
subLocArea.addEventListener('mouseenter', function(){
this.style.color = 'lime';
})
subLocArea.addEventListener('mouseleave', function(){
if(parseInt(locEv.active) === 1){
subLocArea.style.color = 'lightgray'
}else{
subLocArea.style.color = 'gray'
}
})
subLocArea.addEventListener('click', function(){
editor.createForm(locEv);
})
});
}

}

//11. Add Events in Same Group
if(obj.key === 'locations' || obj.key === 'events'){
//get data
let groupEvents
let group
if(obj.key === 'locations'){
groupEvents = load.Data.events.filter(event => event.target === 'NPC' && event.group === obj.group);
group = obj.group;
}

else if (obj.key === 'events' && obj.target === 'Location'){
groupEvents = load.Data.events.filter(event => event.target === 'NPC' && event.group === obj.group);
group = obj.group;
} 

else if (obj.key === 'events' && obj.target === 'NPC'){
//Events affecting same NPC. 
groupEvents = load.Data.events.filter(event => event.target === 'NPC' && event.group === obj.group);
group = obj.group;
}

//Add Header
const groupEventsHeader = document.createElement('div');
let groupEventsHeaderContent = 
`<hr><h3>
<span 
style="font-family:'SoutaneBlack'; color:${color}"
id="groupEventsHeaderContent">
${group} Group Events [...]
</span></h3>`

groupEventsHeader.innerHTML = groupEventsHeaderContent;
Ref.Left.appendChild(groupEventsHeader);

//Add Show/Hide on Header for Section
groupEventsHeader.addEventListener('click', function() {
const headerContent = document.getElementById('groupEventsHeaderContent')

if(groupEventsContainer.style.display === "none"){
groupEventsContainer.style.display = "block"
headerContent.textContent = group + ' Group Events:';

}else{
groupEventsContainer.style.display = "none"
headerContent.textContent = group + ' Group Events [...]';
}

});

//Add Container
const container = document.createElement('div');
container.setAttribute('id', 'groupEventsContainer');
container.classList.add('no-hover');
Ref.Left.appendChild(container);
const groupEventsContainer = document.getElementById('groupEventsContainer');
groupEventsContainer.style.display = "none";

//Make New Event.
const groupEventArea = document.createElement('div');
let groupEventContent = `<h3><span class = 'leftText'>[Add New Event]</span></h3>`;

groupEventArea.innerHTML = groupEventContent;
groupEventsContainer.appendChild(groupEventArea);

groupEventArea.style.color = 'lightgray'

groupEventArea.addEventListener('mouseenter', function(){
this.style.color = 'lime';
})

groupEventArea.addEventListener('mouseleave', function(){
this.style.color = 'lightgray';
})

groupEventArea.addEventListener('click', function(){

const newGroupEv = {

//metadata
id: load.generateUniqueId(load.Data.events, 'entry'),
key: 'events',
type: 'target', 
subType: 'group',

name: 'New Event', 
active: 1,
tags: '',
target: 'NPC',
group: group,
location: obj.location,
npc: group, 

description: 'They are smiling.',

}
editor.createForm(newGroupEv)  
})

//Add locEvents
groupEvents.forEach(locEv => {

const subLocArea = document.createElement('div');
let subLocContent = `<h3><span>${locEv.name}</span></h3>`;

subLocArea.innerHTML = subLocContent;
groupEventsContainer.appendChild(subLocArea);

if(parseInt(locEv.active) === 1){
subLocArea.style.color = 'lightgray'
}else{
subLocArea.style.color = 'gray'
}

subLocArea.addEventListener('mouseenter', function(){
this.style.color = 'lime';
})

subLocArea.addEventListener('mouseleave', function(){
if(parseInt(locEv.active) === 1){
subLocArea.style.color = 'lightgray'
}else{
subLocArea.style.color = 'gray'
}
})

subLocArea.addEventListener('click', function(){
editor.createForm(locEv);
})


});

}

//12. Add Events affecting same NPCs
if(obj.key === 'events'){
if(obj.target === 'NPC'){
// Split the obj.tags into an array
const tags = obj.npc.split(',').map(item => item.trim());
const matchedEvents = {};

// Iterate over each event
load.Data.events.forEach(event => {
// Split the event tag string into an array of tags
const eventTags = event.npc.split(',').map(item => item.trim());
const commonTags = tags.filter(tag => eventTags.includes(tag));

// Iterate over each common tag associated with the NPC
commonTags.forEach(tag => {
if (!matchedEvents[tag]) {
matchedEvents[tag] = [];
}

if(obj.id !== event.id){
matchedEvents[tag].push(event.id);
};
});
});

for (const tag in matchedEvents) {
if (matchedEvents.hasOwnProperty(tag)) {

// Add Header
const evHeaderObj = load.Data.events.find(event => event.npc === tag && event.target === 'NPC');
//console.log(tag, evHeaderObj)

const relationshipHeader = document.createElement('div');
let relationshipContent = 
`<hr><h3>
<span 
id="tagEventHead"
style="font-family:'SoutaneBlack'; color:${color}">
${tag} Events [...]
</span></h3>`;

relationshipHeader.innerHTML = relationshipContent;

if(matchedEvents[tag].length > 0){
Ref.Left.appendChild(relationshipHeader);

//Add Show/Hide on Header for Section
relationshipHeader.addEventListener('click', function() {
const headerContent = document.getElementById('tagEventHead')
    
if(tagContainer.style.display === "none"){
    tagContainer.style.display = "block"
headerContent.textContent = tag + 'Events:';

}else{
    tagContainer.style.display = "none"
headerContent.textContent = tag + 'Events [...]';
}
    
});

//Add Container
const container = document.createElement('div');
container.setAttribute('id', 'tagContainer');
container.classList.add('no-hover');
Ref.Left.appendChild(container);
const tagContainer = document.getElementById('tagContainer');
tagContainer.style.display = "none";

relationshipHeader.addEventListener('click', function(){
editor.createForm(evHeaderObj);
})
};

// Add Names
const evIds = matchedEvents[tag];
evIds.forEach(evId => {
const evObj = load.Data.events.find(event => parseInt(event.id) === evId);

const evNameArea = document.createElement('div');
let evNameContent = `<h3><span>${evObj.name}</span></h3>`;

evNameArea.innerHTML = evNameContent;
container.appendChild(evNameArea);

evNameArea.style.color = 'lightgray';

evNameArea.addEventListener('mouseenter', function(){
this.style.color = 'white';
})

evNameArea.addEventListener('mouseleave', function(){
evNameArea.style.color = 'lightgray'
})

evNameArea.addEventListener('click', function(){
editor.createForm(evObj)
})


});
}}}
}

//12. Add Sub-Locations
if(obj.key === 'locations' || obj.key === 'events' && obj.target === 'Location'){
//get data
let subLocations
let parentLocation
if(obj.key === 'locations'){
subLocations = load.Data.events.filter(event => event.target === 'Location' && event.location === obj.name);
parentLocation = obj.name
}

else if (obj.key === 'events' && obj.target === 'Location'){

subLocations = load.Data.events.filter(event => event.target === 'Location' && event.location === obj.location);
parentLocation = obj.location;
}

// else if (obj.key === 'events' && obj.target === 'NPC'){
// try{
// let helper1 = load.Data.events.find(event => event.name === obj.location);
// let helper2 = helper1.location
// subLocations = load.Data.events.filter(event => event.target === 'Location' && event.location === helper2);
// parentLocation = helper2;
// }catch{
// subLocations = load.Data.events.filter(event => event.target === 'Location' && event.location === obj.location);
// parentLocation = obj.location;
// }
// }

//Add Header
const subLocationHeader = document.createElement('div');
let subLocationHeaderContent = 
`<hr><h3>
<span 
id="subLocationHead"
style="font-family:'SoutaneBlack'; color:${color}">
In ${parentLocation} [...]
</span></h3>`

subLocationHeader.innerHTML = subLocationHeaderContent;
Ref.Left.appendChild(subLocationHeader);

//Add Show/Hide on Header for Section
subLocationHeader.addEventListener('click', function() {
    const headerContent = document.getElementById('subLocationHead')
    
    if(subLocationContainer.style.display === "none"){
    subLocationContainer.style.display = "block"
    headerContent.textContent = 'In ' + parentLocation + ':';
    
    }else{
    subLocationContainer.style.display = "none"
    headerContent.textContent = 'In ' + parentLocation + ' [...]';
    }
    
    });

//Add Container
const container = document.createElement('div');
container.setAttribute('id', 'subLocationContainer');
container.classList.add('no-hover');
Ref.Left.appendChild(container);
const subLocationContainer = document.getElementById('subLocationContainer');
subLocationContainer.style.display = "none";

//Make New Sublocation.
const subLocArea = document.createElement('div');
let subLocContent = `<h3><span class = 'leftText'>[Add New Sub-Location]</span></h3>`;

subLocArea.innerHTML = subLocContent;
subLocationContainer.appendChild(subLocArea);

subLocArea.style.color = 'lightgray'

subLocArea.addEventListener('mouseenter', function(){
this.style.color = 'lime';
})

subLocArea.addEventListener('mouseleave', function(){
this.style.color = 'lightgray';
})

subLocArea.addEventListener('click', function(){

const newsubLoc = {

//metadata
id: load.generateUniqueId(load.Data.events, 'entry'),
key: 'events',
type: 'target', 
subType: 'group',

name: 'New subLocation', 
active: 1,
tags: '',
target: 'Location',
group: '',
location: parentLocation,
npc: '', 

description: 'Add Description Here.',

}
editor.createForm(newsubLoc)  
})

//Add subLocations
subLocations.forEach(subLoc => {

const subLocArea = document.createElement('div');
let subLocContent = `<h3><span>${subLoc.name}</span></h3>`;

subLocArea.innerHTML = subLocContent;
subLocationContainer.appendChild(subLocArea);

if(parseInt(subLoc.active) === 1){
subLocArea.style.color = 'lightgray'
}else{
subLocArea.style.color = 'gray'
}

subLocArea.addEventListener('mouseenter', function(){
this.style.color = 'lime';
})

subLocArea.addEventListener('mouseleave', function(){
if(parseInt(subLoc.active) === 1){
subLocArea.style.color = 'lightgray'
}else{
subLocArea.style.color = 'gray'
}
})

subLocArea.addEventListener('click', function(){
editor.createForm(subLoc);
})

});
}

}

return form;

},

saveDataEntry: function() {

const saveEntry = {};

// get array of label divIds.
const labelElements = document.querySelectorAll('.entry-label');
const labels = [];

labelElements.forEach(label => {

const divId = label.getAttribute('divId');

if(divId === 'newField' ){

if(label.value !== "New Field"){
const newField = label.value 
console.log('Saving newField...', newField)
labels.push(newField)   
}else{//Do Nothing
}

}else{
labels.push(divId);
}
});

//get array of input divIds
const inputElements = document.querySelectorAll('.entry-input');
const inputs = [];

inputElements.forEach(input => {
const value = input.value;
const divId = input.getAttribute('divId');

if(divId === 'newContent'){
if(value !== 'Insert New Value'){
const newValue = value 
console.log('Saving newContent...', newValue)
inputs.push(newValue)   
}else{//Do Nothing
}

}else{
inputs.push(value.trim());

}
});

console.log(labels, inputs);

// Pair the contents of the labels and inputs arrays to create the saveEntry object
for (let i = 0; i < labels.length; i++) {
saveEntry[labels[i]] = inputs[i];
}

//Edit saveEntry object for type and subType -- will need to change if to be user-access'

//console.log(document.getElementById('subTypeEntry').getAttribute('pair'))

saveEntry['type'] = document.getElementById('typeEntry').getAttribute('pair');
saveEntry['subType']= document.getElementById('subTypeEntry').getAttribute('pair');

saveEntry['id'] = parseInt(saveEntry['id']);

console.log(saveEntry);

const key = saveEntry && saveEntry['key'];
const id = saveEntry && saveEntry['id'];
const index = key && id && load.Data[key].findIndex(entry => entry.id === parseInt(id));
console.log(key, id, index);

//console.log('Existing saveEntry:' + load.Data[key][index].class)

if(index === -1){
load.Data[key].push(saveEntry)
}else{
load.Data[key][index] = saveEntry;
}

if(key === 'npcs'){
NPCs.buildNPC();
NPCs.addNPCInfo(saveEntry.name)
}else{
editor.createForm(saveEntry);
}


// console.log('Updated saveEntry:');
// console.log(load.Data[key][index]);

},

deleteDataEntry: function(){

//Retrieve key and id of entry for deletion.
const key = document.getElementById('dataEntryKey').getAttribute('value');
const id = document.getElementById('dataEntryId').getAttribute('value');
//console.log(key, id);

//Use key and id to find index.
const index = key && id && load.Data[key].findIndex(entry => entry.id === parseInt(id));
//console.log(index)

//Delete index and refresh.
if (index !== -1) { // Check if index was found
// Confirm deletion
const confirmation = confirm('Are you sure you want to delete this entry?');
if (confirmation) {
// Remove entry at index
load.Data[key].splice(index, 1);
editor.loadList(load.Data);
Ref.Left.style.display = 'none';
Ref.Centre.style.display = 'none';

//if Location then delete locationDiv
if(key === 'locations'){
load.displayLocations(load.Data.locations);
}

// Refresh or update UI as needed
} else {
console.log('Deletion canceled.');
}
} else {
console.log('Entry not found or invalid key/id.');
}},


};

export default editor;