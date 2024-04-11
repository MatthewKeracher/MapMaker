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
fullScreen: false,
divIds : ['textLocation', 'npcBackStory','ambienceDescription'],
sectionShow:[],

//List Display Variables
 sectionHeadDisplay: 'none',
 subSectionHeadDisplay: 'none',
 subSectionEntryDisplay:  'none',
 EntryDisplay: 'none',

readAddressBook: function (data){
let addressBook = [];

const excludedKeys = ['townText', 'npcs'];

for (const key in load.Data) {
if (load.Data.hasOwnProperty(key) && !excludedKeys.includes(key)) {
const dataArray = load.Data[key];

dataArray.forEach(obj => {

let objs = obj.tags.filter(item => parseInt(item.id) === parseInt(data.id) && item.key === data.key);

if(objs.length > 0){addressBook.push({key: obj.key, id: obj.id})}

})
}}

return addressBook;

},

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

//List Display Variables
let sectionHeadDisplay = this.sectionHeadDisplay //'block'
let keyshow = sectionHeadDisplay === 'block'? "true" : "false"
let subSectionHeadDisplay = this.subSectionHeadDisplay //'block';
let sectionShow = subSectionHeadDisplay === 'block'? "true" : "false"
let subSectionEntryDisplay = this.subSectionEntryDisplay //'block';
let subsectionShow = subSectionEntryDisplay === 'block'? "true" : "false"
let EntryDisplay = this.EntryDisplay //'block';

console.log(keyshow)

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
nameDiv.setAttribute('style', "display:" + sectionHeadDisplay);

let entryName = entry[type] === ''? 'Misc' : entry[type];

nameDiv.innerHTML = 
`<span
id = "${entryName}"
class = "cyan"
style="font-family:'SoutaneBlack'"> 
<hr>
&nbsp;${entryName}
</span>`;

//3.2 subSection Heads --- subType values.
} else if (entry.subSectionHead){
currentSubSection++

nameDiv.setAttribute("scope", 'subsection');
nameDiv.setAttribute("id", currentSubSection);
nameDiv.setAttribute('style', "display:" + subSectionHeadDisplay);

let entryName = entry[type] === ''? 'Misc' : entry[subType];

nameDiv.innerHTML= 
`<span 
id = "${entryName}"
class ="hotpink"
style="font-family:'SoutaneBlack'">
<hr>
&nbsp; ${this.proper(subType)} ${entryName}
</span>`;

//3.3 subSection Entries   
}else if (entry[type] && entry[subType]){
nameDiv.setAttribute('id', entry.id)
nameDiv.setAttribute('style', "display:" + subSectionEntryDisplay)

nameDiv.innerHTML = 
`<span 
id = "${entry.id}"
class ="white">
&nbsp;&nbsp;&nbsp;&nbsp;${entry.name}
</span>`;

//3.4 no subSection
}else if (entry[type]){
nameDiv.setAttribute('id', entry.id)
nameDiv.setAttribute('style', "display:" + EntryDisplay)

nameDiv.innerHTML = 
`<span 
id = "${entry.id}" 
class ="white">
&nbsp;&nbsp;${entry.name}
</span>`;

//3.5 Other Entries
}else {
nameDiv.setAttribute('id', entry.id)
nameDiv.setAttribute('style', "display:" + EntryDisplay)

nameDiv.innerHTML = 
`<span 
id = "${entry.id}" 
class = "gray"> 
&nbsp;&nbsp;${entry.name}
</span>`;

}

nameDiv.setAttribute('key', key)
nameDiv.setAttribute('keyShow', keyshow)
nameDiv.setAttribute('section', currentSection)
nameDiv.setAttribute('sectionShow', sectionShow)
nameDiv.setAttribute('subsection', currentSubSection)
nameDiv.setAttribute('subsectionShow', subsectionShow)

// nameDiv.setAttribute('key', key)
// nameDiv.setAttribute('keyShow', "true")
// nameDiv.setAttribute('section', currentSection)
// nameDiv.setAttribute('sectionShow', "true")
// nameDiv.setAttribute('subsection', currentSubSection)
// nameDiv.setAttribute('subsectionShow', "true")

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
div.addEventListener('click', (event) => {

//if shift-click, add Tag
if(event.shiftKey && Ref.Left.style.display === 'block'){
//console.log(div)
event.preventDefault();
const itemId = div.getAttribute('id')
const key = div.getAttribute('key')
editor.addItem = false;
editor.addTagtoItem(itemId, key);

//Return to Default List
// this.sectionHeadDisplay = 'none',
// this.subSectionHeadDisplay = 'none',
// this.subSectionEntryDisplay =  'none',
// this.EntryDisplay = 'none',
// this.loadList(load.Data)

if(editor.editMode === false){
Ref.Editor.style.display = 'none';
}

}
else if(key === 'npcs' && editor.addItem === false){
NPCs.addNPCInfo(entry.name, Ref.Left);
} 
else{
editor.createForm(entry)
}
});

}},

addTagtoItem(itemId, tagKey){

//console.log(editor.addItem);
//Item adding tag to.
const currentId = document.getElementById('currentId').value;
const currentKey = document.getElementById('key').value;
const homeObjAddress = {key: currentKey, id: currentId};
const homeObj = load.Data[currentKey].find(obj => parseInt(obj.id) === parseInt(currentId));
//console.log('home object', homeObj);
const homeObjIndex = load.Data[currentKey].findIndex(item => parseInt(item.id) === parseInt(currentId));
const homeObjTags = homeObj.tags //.split(',').map(tag => tag.trim());


//Item tag refers to.
const tagObjAddress = {key: tagKey, id: itemId};
const tagObj = load.Data[tagKey].find(obj => parseInt(obj.id) === parseInt(itemId));
//console.log('tag object', tagObj)
const tagObjName = tagObj.name
const tagItemIndex = load.Data[tagKey].findIndex(item => parseInt(item.id) === parseInt(itemId));
const tagObjTags = tagObj.tags //.split(',').map(tag => tag.trim());

//Check for duplicates.
const duplicateCheckHome = homeObjTags.find(obj => tagKey === obj.key && itemId === obj.id)? true: false;
const duplicateCheckTag = tagObjTags.find(obj => currentKey === obj.key && currentId === obj.id)? true: false;
const addtoSelfCheck = tagObj === homeObj? true:false;

if(duplicateCheckHome === false && addtoSelfCheck === false){
homeObjTags.push(tagObjAddress)
}

if(duplicateCheckTag === false && addtoSelfCheck === false){
tagObjTags.push(homeObjAddress);  
}

//Append tagObjName as tag to homeObj
//console.log(tagObj, homeObj)

//Replace current tags with appended tags.
load.Data[currentKey][homeObjIndex].tags = homeObjTags;
load.Data[tagKey][tagItemIndex].tags = tagObjTags;
//console.log(load.Data[currentKey][homeObjIndex].tags)

if(currentKey === 'npcs'){
NPCs.addNPCInfo(homeObj.name)
}else{
editor.createForm(load.Data[currentKey][homeObjIndex]);
};


//Repackage.
NPCs.buildNPC();
//editor.loadList(load.Data);

},

searchAllData: function (searchText, data) {
const resultsByKeys = {}; // Object to store results grouped by keys
const excludedKeys = ['townText'];

// Iterate over each key in load.Data
for (const key in data) {
if (data.hasOwnProperty(key) && !excludedKeys.includes(key)) {
// Get the array corresponding to the key
const dataArray = data[key];

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
this.sectionHeadDisplay = 'none',
this.subSectionHeadDisplay = 'none',
this.subSectionEntryDisplay =  'none',
this.EntryDisplay = 'none',
this.loadList(data)

if(editor.editMode === false){
console.log("click")
Ref.Editor.style.display = 'none';
}

}else{
//List Display Variables
this.sectionHeadDisplay = 'block',
this.subSectionHeadDisplay = 'block',
this.subSectionEntryDisplay =  'block',
this.EntryDisplay = 'block',
this.loadList(resultsByKeys);
}

},

showHide: function (div) {
const scope = div.getAttribute("scope");
let items

if (scope === 'key'){ //has clicked on a keyHeading

let key = div.getAttribute("id")

if(editor.makeNew === true){ // to make new Entries
let randomNumber = Math.floor(Math.random() * load.Data[key].length) + 1;
if(key === 'npcs'){
NPCs.addNPCInfo(load.Data[key][randomNumber].name)
}else{
editor.createForm(load.Data[key][randomNumber])
}
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

buildSection: function (headerValue, obj){

    const sectionHeadDiv = document.createElement('div');
    let headerHTML = 
    `<hr> <h3>
    <span style="font-family:'SoutaneBlack'; color:${obj.color}" id="${headerValue}Header">
    ${headerValue} [...]
    </span></h3>`;
    
    sectionHeadDiv.innerHTML = headerHTML;
    Ref.Left.appendChild(sectionHeadDiv);
    
    //let isFrozen = false;
    let headerDiv = headerValue + 'Header'
    let headerContent = document.getElementById(headerDiv);
    let index = editor.sectionShow.findIndex(entry => entry.section === headerDiv);
    
    let currentShow
    if(index === -1){
    currentShow = 'none';
    } else {
    currentShow = editor.sectionShow[index].visible === 1? 'block' : 'none';
    }

    // Add Show/Hide on Header for Section
    sectionHeadDiv.addEventListener('click', function() {
    
    //if (!isFrozen) {
    
    // 1 --- Show
    if(container.style.display === "none") {
    
    container.style.display = "block";
    headerContent.textContent = headerValue + ':';
    
    //}

    let sectionData = {section: headerDiv, visible: 1};

        //Update sectionShow data.
        if(index === -1){
        editor.sectionShow.push(sectionData);
        }else{
        editor.sectionShow[index] = sectionData; 
        }
        } 

    //2 --- Hide
    else if(container.style.display === "block") {
    //isFrozen = true; // Set the freeze flag

    container.style.display = "none";
    headerContent.textContent = headerValue + ' [...]';

    let sectionData = {section: headerDiv, visible: 0};

        //Update sectionShow data.
        if(index === -1){
        editor.sectionShow.push(sectionData);
        }else{
        editor.sectionShow[index] = sectionData; 
        }
        
    // // Unfreeze after 2 seconds (adjust the delay as needed)
    // setTimeout(() => {
    // isFrozen = false; // Unset the freeze flag
    // }, 1000); // 2000 milliseconds = 2 seconds

    }
    });
    
    //Add Container -- Settings
    const newContainer = document.createElement('div');
    let containerName = headerValue + 'Container'
    newContainer.setAttribute('id', containerName);
    newContainer.classList.add('no-hover');
    newContainer.classList.add('collapse');
    Ref.Left.appendChild(newContainer);
    const container = document.getElementById(containerName);
    container.style.display = currentShow;

    return containerName

},

createForm: function (obj){

let color
let fullScreen = false

//Initialise Form.
if(obj){
//0.1. Set Colour of Form
if(obj.color){
color = obj.color;
}else{
color = 'cyan';
};

//0.2. Clear Form of old HTML divs.
['editForm', 'typeArea', 'nameArea', 'subTypeArea', 'breaker', 'newArea'].forEach(id => {
const element = document.getElementById(id);
if (element) {
element.remove();
}
});

//0.3. Reset displays to Default for new Form.
const fullScreenDivs = document.querySelectorAll('.fullScreen');


if (fullScreenDivs.length === 0) {
Ref.Left.style.display = 'block';
} else{
fullScreen = true;
}

Ref.Centre.innerHTML = '';
Ref.Centre.style.display = 'block';
Ref.Left.innerHTML = '';


const form = document.createElement('form');
form.id = 'editForm';
form.classList.add('form');
}

//If needed, make copy Obj for basis of new data entry.
if (editor.makeNew === true) {

const reservedTerms = ['id', 'key', 'type', 'subtype', 'active', 'order','color'];

// Create a deep copy of the original object
const newObj = JSON.parse(JSON.stringify(obj));

// Generate a unique ID for the new object
newObj.id = load.generateUniqueId(load.Data[obj.key], 'entry');
//newObj.active = 1;
//newObj.order = 1;
newObj.color = obj.color
const properKey = this.proper(obj.key.slice(0, -1));
newObj.name = 'New ' + properKey + ' ' + newObj.id;
newObj.description = 'An unknown entity.'

// Iterate over each property in the new object
// for (let key in newObj) {
// // Check if the property is not reserved
// if (newObj.hasOwnProperty(key) && !reservedTerms.includes(key)) {
// // Update the value of each property to 'Insert Value Here'

// newObj[key] = 'Insert ' + key;
// }
// }

obj = newObj
// Print the first spell in load.Data to see if it's modified
//console.log(load.Data.spells[0]);

}

//Use Obj to fill Form.
if (obj) {

//Define key groups for different areas of the form.
const excludedKeys = ['id', 'name', 'type', 'subType', 'description', 'key', 'tags']; 
const universalKeys = ['group', 'color'];

//Make MetaData elements -- key and id.
if(obj){
//Make Key and Make Invisible
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
    id="key"
    divId= "edit${obj.key}"
    value="${obj.key}"></h3>`;
    
    keyArea.innerHTML = keyContent;
    Ref.Left.appendChild(keyArea);
}

//Make ID Manually
if(obj.id){
const existingId = document.getElementById('currentId');
if (existingId) {
existingId.remove(); // Remove the existing form
}

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
value="${obj.id || 'N/A'} ">`;

idArea.innerHTML = idContent;
Ref.Left.appendChild(idArea);
}
}

//Make Description Manually
if(obj){

const description = document.createElement('div');
const centreText = fullScreen === true? 'fullScreenText' : 'centreText'

let centreContent =  
`<h2>
<label class="entry-label"
style="font-family:'SoutaneBlack'; color: ${color}; width: auto;"
divId="description">
${obj.name}
</label>
<button id="fullScreenButton" class="singButton">
[...]
</button>
<hr></h2>
<textarea
id="descriptionText"
class="entry-input ${centreText}" 
>`;

description.innerHTML = centreContent;
Ref.Centre.appendChild(description);
Ref.Centre.style.display = 'block';

const button = document.getElementById('fullScreenButton');
const textBox = document.getElementById('descriptionText');
button.addEventListener('click', () => {
if(editor.fullScreen === true){
//Make normal.
Ref.Left.style.display = "block";
editor.fullScreen = false;
Ref.Centre.classList.remove("fullScreen");
Ref.Centre.classList.add("Centre");
textBox.classList.remove("fullScreenText");
textBox.classList.add("centreText");
//Set Height
const descriptionText = document.getElementById('descriptionText');
descriptionText.textContent = obj.description || 'Insert information about ' + obj.name + ' here.';

// Set the initial height based on the scroll height of the content
descriptionText.style.height = 'auto';
descriptionText.style.height = descriptionText.scrollHeight + 'px';
}else if (editor.fullScreen === false){
//Make fullScreen.
Ref.Left.style.display = "none";
Ref.Centre.classList.remove("Centre");
Ref.Centre.classList.add("fullScreen");
textBox.classList.remove("centreText");
textBox.classList.add("fullScreenText");
editor.fullScreen = true;
//Set Height
const descriptionText = document.getElementById('descriptionText');
descriptionText.textContent = obj.description || 'Insert information about ' + obj.name + ' here.';

// Set the initial height based on the scroll height of the content
descriptionText.style.height = 'auto';
descriptionText.style.height = descriptionText.scrollHeight + 'px';
};
});

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

//Make Top Area -- Name, Type, subType.
if(obj){
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

// //5. Add Breaker
// const breaker = document.createElement('hr')
// breaker.id = 'breaker';
// topArea.appendChild(breaker);


}

//Make Form Section with Universal Keys
if(obj){

const container = document.getElementById(this.buildSection('General Settings', obj));

for (const key in obj) {
if (obj.hasOwnProperty(key) && !excludedKeys.includes(key) && universalKeys.includes(key)) { // Check if key is not excluded

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
container.appendChild(elementContainer);

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
elementContainer.querySelector('.leftTextshort').focus();
elementContainer.querySelector('.leftTextshort').select();
});

}
}


};

//Make Form Section with ${key} specific Keys.
if(obj){

const properKey = this.proper(obj.key)
const container = document.getElementById(this.buildSection(properKey + ' Settings', obj));

for (const key in obj) {
if (obj.hasOwnProperty(key) && !excludedKeys.includes(key) && !universalKeys.includes(key)) { // Check if key is not excluded

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
container.appendChild(elementContainer);

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
elementContainer.querySelector('.leftTextshort').focus();
elementContainer.querySelector('.leftTextshort').select();
});

}
}
}

// if(obj.key === 'items'){
if(obj){

const container = document.getElementById(this.buildSection('Tags', obj));

if(obj.tags && editor.makeNew === false){
//console.log(obj.tags)
let tagsToAdd = obj.tags//.split(',').map(tag => tag.trim());  
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

taggedArea.addEventListener('click', function(event){

if(event.shiftKey){ //shift-click
//Remove tag from item.
event.preventDefault();
obj.tags = obj.tags.filter(item => item.id !== tag.id);

//Remove item from other item's tags.

let delTags = load.Data[tag.key][index].tags
console.log(delTags, obj.id)
delTags = delTags.filter(item => parseInt(item.id) !== obj.id);
console.log(delTags)
load.Data[tag.key][index].tags = delTags;

//Repackage.
NPCs.buildNPC();
editor.createForm(obj);  
}

else if(event.button === 0){ //left-click
//find tagObj based on Name!
if(tag.key === 'npcs'){
    NPCs.addNPCInfo(load.Data[tag.key][index].name);
    }else{
    editor.createForm(load.Data[tag.key][index]);   
    }
}

});

});

}
}
}

//Add associated events.
if(obj){

//Add Events in Same Location
if(obj.key === 'events' && obj.target === 'Location'){
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

const container = document.getElementById(this.buildSection('Events Happening Here', obj));

//Make New Event.
const newEventArea = document.createElement('div');
let newEventContent = `<h3><span class = 'leftText'>[Add New Event]</span></h3>`;

newEventArea.innerHTML = newEventContent;
container.appendChild(newEventArea);

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
color: obj.color,

name: 'New Event', 
active: 1,
tags: '',
target: 'NPC',
group: parentLocation,
location: parentLocation,
npc: 'All', 

description: 'They are in the ' + parentLocation,

}
editor.createForm(newsubLoc)  
})

//Add locEvents
if(locEvents){
locEvents.forEach(locEv => {

const subLocArea = document.createElement('div');
let subLocContent = `<h3><span>${locEv.name}</span></h3>`;

subLocArea.innerHTML = subLocContent;
container.appendChild(subLocArea);

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
if(obj.key === 'events' && obj.target === 'NPC'){
//get data
let groupEvents = [];
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

const container = document.getElementById(this.buildSection('Events in Group', obj));

//Make New Event.
const groupEventArea = document.createElement('div');
let groupEventContent = `<h3><span class = 'leftText'>[Add New Event]</span></h3>`;

groupEventArea.innerHTML = groupEventContent;
container.appendChild(groupEventArea);

groupEventArea.style.color = 'lightgray'

groupEventArea.addEventListener('mouseenter', function(){
this.style.color = 'lime';
})

groupEventArea.addEventListener('mouseleave', function(){
this.style.color = 'lightgray';
})

groupEventArea.addEventListener('click', function(){

const newGroupEv = {

//metadata -- New Event in the SAME GROUP
id: load.generateUniqueId(load.Data.events, 'entry'),
key: 'events',
type: 'target', 
subType: 'group',
color: obj.color,

name: 'New ' + group + ' Event', 
active: 1,
tags: '',
target: 'NPC',
group: group,
location: obj.location,
npc: group, 

description: 'They are a kind of ' + group,

}
editor.createForm(newGroupEv)  
})

//Add locEvents
groupEvents.forEach(locEv => {

const subLocArea = document.createElement('div');
let subLocContent = `<h3><span>${locEv.name}</span></h3>`;

subLocArea.innerHTML = subLocContent;
container.appendChild(subLocArea);

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

const evHeaderObj = load.Data.events.find(event => event.npc === tag && event.target === 'NPC');
//console.log(tag, evHeaderObj)

const container = document.getElementById(this.buildSection('Events Affecting Target', obj));

//Make New Event.
const groupEventArea = document.createElement('div');
let groupEventContent = `<h3><span class = 'leftText'>[Add New ${tag} Event]</span></h3>`;

groupEventArea.innerHTML = groupEventContent;
container.appendChild(groupEventArea);

groupEventArea.style.color = 'lightgray'

groupEventArea.addEventListener('mouseenter', function(){
this.style.color = 'lime';
})

groupEventArea.addEventListener('mouseleave', function(){
this.style.color = 'lightgray';
})

groupEventArea.addEventListener('click', function(){

const newTagEvent = {

//metadata -- New Event with SAME TAG
id: load.generateUniqueId(load.Data.events, 'entry'),
key: 'events',
type: 'target', 
subType: 'group',
color: obj.color,

name: 'New ' + tag + ' Event', 
active: 1,
tags: tag,
target: 'NPC',
group: '',
location: obj.location,
npc: tag, 

description: 'What are the ' + tag + 's doing?',

}
editor.createForm(newTagEvent)  
})

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
if(obj.key === 'locations'){
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

const container = document.getElementById(this.buildSection('Sub-Locations', obj));

//Make New Sublocation.
const subLocArea = document.createElement('div');
let subLocContent = `<h3><span class = 'leftText'>[Add New Sub-Location]</span></h3>`;

subLocArea.innerHTML = subLocContent;
container.appendChild(subLocArea);

subLocArea.style.color = 'lightgray'

subLocArea.addEventListener('mouseenter', function(){
this.style.color = 'lime';
})

subLocArea.addEventListener('mouseleave', function(){
this.style.color = 'lightgray';
})

subLocArea.addEventListener('click', function(){

const newsubLoc = {

//metadata -- New SUBLOCATION
id: load.generateUniqueId(load.Data.events, 'entry'),
order: subLocations.length + 1,
key: 'events',
type: 'target', 
subType: 'group',
color: obj.color,

name: parentLocation + ' subLocation', 
active: 1,
tags: '',
target: 'Location',
group: '',
location: parentLocation,
npc: '', 

description: 'There is a blank space here lacking details. ',

}
editor.createForm(newsubLoc)  
})

//Add subLocations
subLocations.forEach(subLoc => {

const subLocArea = document.createElement('div');
let subLocContent = `<h3><span>${subLoc.name}</span></h3>`;

subLocArea.innerHTML = subLocContent;
container.appendChild(subLocArea);

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

//get Array of tag addresses
const tagElements = document.querySelectorAll('.tag');
const tags = [];

tagElements.forEach(input => {
const tagId  = input.getAttribute('tagid');
const tagKey = input.getAttribute('tagkey');
tags.push({key: tagKey, id: tagId});

});

//Edit saveEntry object for type and subType -- will need to change if to be user-access'

//console.log(document.getElementById('subTypeEntry').getAttribute('pair'))
try{
saveEntry['type'] = document.getElementById('typeEntry').getAttribute('pair');
saveEntry['subType']= document.getElementById('subTypeEntry').getAttribute('pair');
}catch{console.error("No type or subType found.")}
saveEntry['id'] = parseInt(saveEntry['id']);
saveEntry['tags'] = tags;

const key = saveEntry && saveEntry['key'];
const id = saveEntry && saveEntry['id'];
const index = key && id && load.Data[key].findIndex(entry => entry.id === parseInt(id));

//console.log('saving...');
//console.log('Updated saveEntry:');
//console.log(saveEntry)
// console.log(load.Data[key][index]);

if(index === -1){
load.Data[key].push(saveEntry)
}else{
load.Data[key][index] = saveEntry
}

//Reset programme with new Data.
NPCs.buildNPC();

//Reset Editor and Search 
if(Ref.eventManager.value === ''){   
editor.loadList(load.Data);
}else{
let searchText = Ref.eventManager.value.toLowerCase();

if(editor.editMode === true){
editor.searchAllData(searchText, load.Data);
};
}

if(editor.editMode === false){
Ref.Editor.style.display = 'none';
}

//Reload Map to reflect changes.
load.displayLocations(load.Data.locations);

//Reload form to reflect changes.
if(key === 'npcs'){
NPCs.addNPCInfo(saveEntry.name)
}else{
editor.createForm(saveEntry);
}

//Reload location to reflect changes.
Storyteller.refreshLocation();

},

deleteDataEntry: function(){

//Retrieve key and id of entry for deletion.
const key = document.getElementById('key').getAttribute('value');
const id = document.getElementById('currentId').getAttribute('value');
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