import Ref from "./ref.js";
import Array from "./array.js";
import Storyteller from "./storyteller.js";
import NPCs from "./npcs.js";
import Monsters from "./monsters.js";
import Items from "./items.js";
import Events from "./events.js";
import Spells from "./spells.js";

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
filteredItems = Items.itemsArray.filter(item =>
item.Name.toLowerCase().includes(searchText.toLowerCase())
);
} else if (openAsteriskIndex > openBraceIndex && openAsteriskIndex > openTildeIndex) { // Modify this condition
searchText = text.substring(openAsteriskIndex + 1, cursorPosition);
filteredItems = Monsters.monstersArray.filter(monster =>
monster.name.toLowerCase().includes(searchText.toLowerCase())
);
} else {
searchText = text.substring(openTildeIndex + 1, cursorPosition); // Handle ~ case
filteredItems = Spells.spellsArray.filter(spell =>
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

let target = Ref.Editor
//target.innerHTML = '';
target.style.display = 'block'; 

// 0. Iterate over each property in the data object
for (const key in data) {

let obj = data[key];

// 1. Sort the items by item type alphabetically and then by Level numerically.
obj.sort = obj.slice().sort((a, b) => {
const typeComparison = a.type.localeCompare(b.type);

if (typeComparison !== 0) {
// If classes are different, return the result of class comparison
return typeComparison;
} else {
// If classes are the same, sort by Level numerically
return a.subType - b.subType || a.name.localeCompare(b.name);
}
});

// 2. Attach Section Heads.
obj = obj.reduce((result, currentEntry, index, array) => {
const reversedArray = array.slice(0, index).reverse();
const lastEntryIndex = reversedArray.findIndex(entry => entry.type === currentEntry.type);

if (lastEntryIndex === -1 || currentEntry.type !== reversedArray[lastEntryIndex].type) {
// For a new class, push the class as the type and set the level as a subSectionHead
result.push({type: currentEntry.type, sectionHead: true, subSectionHead: currentEntry.subType});
if(currentEntry.subType){
result.push({type: currentEntry.subType, subSectionHead: currentEntry.subType})};
} else if (currentEntry.subType !== reversedArray[lastEntryIndex].subType) {
// If the Level changes within the same class, push the Level as a subSectionHead
result.push({type: currentEntry.subType, subSectionHead: currentEntry.subType});
}

result.push(currentEntry);
return result;
}, []);

//list Title
const titleDiv = document.createElement('titleDiv');

titleDiv.innerHTML = 
`<h3>
<span id = "${this.proper(key)}"
class ="hotpink"
style="display: block;"
show="true">
${this.proper(key)}
</span></h3>`;

target.appendChild(titleDiv);

titleDiv.addEventListener('click', ((section, subsection, dataType) => {
return () => {
this.showHide(section, subsection, dataType);
};
})("section", null, key));

let currentSection = 0; // Keep track of the current section.
let currentSubSection = 0;

// 3. Iterate through the sorted entries.
for (const entry of obj) {
const nameDiv = document.createElement('div');

nameDiv.innerHTML = 
`<span 
id = "${entry.type}"
key = "${key}"
keyShow = "false"
section ="${currentSection}"
subsection ="${currentSubSection}"></span>`

nameDiv.id = entry.name;

//3.1 Section Heads --- Type
if(entry.sectionHead){

//nameDiv.id = entry.type;
currentSection++
currentSubSection = 0;
nameDiv.innerHTML += 
`<span class ="cyan"> 
<hr>&nbsp;&nbsp;${entry.type}
</span>`;

//3.2 subSection Heads --- subType 
} else if (entry.subSectionHead){

//nameDiv.id = entry.subType;
currentSubSection++

nameDiv.innerHTML+= 
`<span class ="hotpink" style="display: none;">
<hr>&nbsp;&nbsp;&nbsp; Level ${entry.type}</span>`;

//3.3 subSection Entries   
}else if (entry.type && entry.subType){

nameDiv.innerHTML += 
`<span class ="white">
&nbsp;&nbsp;&nbsp;&nbsp;${entry.name}
</span>`;

//3.4 no subSection
}else if (entry.type){

nameDiv.innerHTML += 
`<span class ="white">
&nbsp;&nbsp;${entry.name}
</span>`;

//3.5 Other Entries
}else {

nameDiv.innerHTML = 
`<span id = "${entry.name}"
dataType = ${key}
class = "gray"> 
&nbsp;&nbsp;${entry.name}
</span>`;

}

target.appendChild(nameDiv);
this.entryDivEvents(entry, nameDiv, currentSection, currentSubSection, key);

}

};
},

showHide: function (section, subsection, key) {
console.log('showHide')
let items

if (section === 'section'){ //has clicked on a keyHeading
    
items = document.querySelectorAll(`[key="${key}"]`);

let showing = items[0].style.display
let display = showing === 'block'? 'none' : 'block';

items.forEach((item) => {

item.style.display = display;

})

}

else if (subsection === 'header'){ //has clicked on a sectionHeading

items = document.querySelectorAll(`[section="${section}"]`);

items.forEach((item, index) => {

if(index > 0){ 

const sectionShow = item.getAttribute('sectionShow');

const newSectionShow = sectionShow === 'true'? 'false' : 'true';
item.setAttribute('sectionShow', newSectionShow); 

const sectionDisplay = newSectionShow === 'true'? 'block' : 'none';
item.style.display = sectionDisplay;

//if(newSectionShow === 'true'){console.log('Now Showing')}else{console.log('Now Hiding.')};

//reset all subSectionShows

item.setAttribute('subSectionShow', "true");

}})}

else if(subsection){ //has clicked on a subSection

items = document.querySelectorAll(`[section="${section}"][subsection="${subsection}"]`);

items.forEach((item, index) => {

if(index > 0){ 

const subSectionShow = item.getAttribute('subSectionShow');

const newSubShow = subSectionShow === 'true'? 'false' : 'true'; 
item.setAttribute('subSectionShow', newSubShow);

const subSectionDisplay = newSubShow === 'true'? 'block' : 'none';
item.style.display = subSectionDisplay;

//if(newSubShow === 'true'){console.log('Now Showing')}else{console.log('Now Hiding.')};


}})}   

},

createForm: function (obj){

// Check if there is an existing form
const existingForm = document.getElementById('editForm');
if (existingForm) {
existingForm.remove(); // Remove the existing form
}

const form = document.createElement('form');
form.id = 'editForm'
form.classList.add('form');


for (const key in obj) {
if (obj.hasOwnProperty(key)) {
const label = document.createElement('label');
label.textContent = this.proper(key);
label.classList.add('leftLabel'); // Add a CSS class to the label

const textarea = document.createElement('textarea');
textarea.name = key;
textarea.classList.add('leftText'); // Add a CSS class to the textarea

// Check the initial height
textarea.value = obj[key] || '';
textarea.style.height = 'auto';
textarea.style.height = textarea.scrollHeight + 'px';

textarea.addEventListener('focus', function() {
// Calculate the height based on the scroll height of the textarea
this.style.height = 'auto';
this.style.height = this.scrollHeight + 'px';
// Set the caret position to the end
this.selectionStart = this.selectionEnd = this.value.length;
});

textarea.addEventListener('blur', function() {
// Calculate the height based on the scroll height of the textarea
this.style.height = '3vh'; // Set a default height
});

form.appendChild(label);
form.appendChild(document.createElement('br')); // Add a line break
form.appendChild(textarea);
}
}


return form;

},

entryDivEvents: function(entry, entryDiv, currentSection, currentSubSection, key){

if(entry.sectionHead === true){

//1. showHide
entryDiv.addEventListener('click', ((section, subsection, key) => {
return () => {
this.showHide(section, subsection, key);
};
})(currentSection, currentSubSection, key));

}else{

//1. showEntry
entryDiv.addEventListener('mouseover', () => {
this.addInfo(entry)
Ref.Centre.style.display = 'block';
});

//2. fillForm
entryDiv.addEventListener('click', () => {
const form = editor.createForm(entry)
Ref.Left.style.display = 'block';
Ref.Left.appendChild(form);
});

}},

addInfo(entry) {

let addInfo = [

`<h2><span class="spell">${entry.name}</span></h2>`,
`<h3><span class = "cyan">${entry.type} Level ${entry.subType}.</span><hr>`,

];

for (const key in entry) {
if (entry.hasOwnProperty(key)) {
const value = entry[key];
if (value) {
addInfo += `<span class="hotpink">${key.charAt(0).toUpperCase() + key.slice(1)}:</span> ${value}<br>`;
}
}
}

Ref.Centre.innerHTML = addInfo;

},

deleteLocation() {
let array;
let id;
let index;

switch (this.editPage) {

case 2:

array = Events.eventsArray;
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

array = NPCs.npcArray;
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

array = Monsters.monstersArray;
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

array = Items.itemsArray;
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

array = Spells.spellsArray;
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
array = Array.locationArray;
index = array.findIndex(entry => entry.divId === divId);

if (index !== -1) {
const confirmation = window.confirm("Are you sure you want to delete " + array[index].divId + "?");

if (confirmation) {
// Remove the entry from locationArray
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
const matchingEntry = Array.locationArray.find(entry => entry.divId === divId);

if (matchingEntry) {
// Update the corresponding entry in locationArray
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

for (const npc of NPCs.npcArray) {
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