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

//Where to put list...
let target = Ref.Editor
target.innerHTML = '';
target.style.display = 'block'; 

// 0. Iterate over each property in the data object
for (const key in data) {
let obj = data[key];

// 1. Sort the items by item type alphabetically and then by Level numerically.
obj.sort((a, b) => {
const typeComparison = a.type.localeCompare(b.type);

if (typeComparison !== 0) {
// If classes are different, return the result of class comparison
return typeComparison;
} else {
// If classes are the same, sort by Level numerically
return a.subType - b.subType || a.name.localeCompare(b.name);
}
});


// 2. Attach Key, Section and subSection Heads.
obj = obj.reduce((result, currentEntry, index, array) => {

const reversedArray = array.slice(0, index).reverse();
const lastEntryIndex = reversedArray.findIndex(entry => entry.type === currentEntry.type);

if (lastEntryIndex === -1 || currentEntry.type !== reversedArray[lastEntryIndex].type) {

result.push({sectionHead: true, key: key, type: currentEntry.type, subType: currentEntry.subType});

if(currentEntry.subType){

result.push({subSectionHead: true, type: currentEntry.type, subType: currentEntry.subType})};

} else if (currentEntry.subType !== reversedArray[lastEntryIndex].subType) {

result.push({subSectionHead: true, type: currentEntry.type, subType: currentEntry.subType});

}

result.push(currentEntry);
return result;
}, []);

//list Title
const titleDiv = document.createElement(key);

titleDiv.setAttribute("scope", 'key');
titleDiv.setAttribute("id", key);

titleDiv.innerHTML = 
`<h3>
<span
class ="hotpink"
style="display: block;">
${this.proper(key)}
</span></h3>`;

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

let entryName = entry.type === ''? 'Misc' : entry.type;

nameDiv.innerHTML = 
`<span id = "${entryName}" class = "cyan"> 
<hr>&nbsp;${entryName}
</span>`;

//3.2 subSection Heads --- subType 
} else if (entry.subSectionHead){
currentSubSection++

nameDiv.setAttribute("scope", 'subsection');
nameDiv.setAttribute("id", currentSubSection);
nameDiv.setAttribute('style', "display: none")

let entryName = entry.type === ''? 'Misc' : entry.subType;

nameDiv.innerHTML= 
`<span id = "${entryName}" class ="hotpink">
<hr>&nbsp; Level ${entryName}</span>`;

//3.3 subSection Entries   
}else if (entry.type && entry.subType){

nameDiv.setAttribute('style', "display: none")

nameDiv.innerHTML = 
`<span id = "${entry.name}" class ="white">
&nbsp;&nbsp;&nbsp;&nbsp;${entry.name}
</span>`;

//3.4 no subSection
}else if (entry.type){

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
nameDiv.setAttribute('keyShow', "true")
nameDiv.setAttribute('section', currentSection)
nameDiv.setAttribute('sectionShow', "false")
nameDiv.setAttribute('subsection', currentSubSection)
nameDiv.setAttribute('subsectionShow', "false")

target.appendChild(nameDiv);
this.listEvents(entry, nameDiv);

}}

},

listEvents: function(entry, div){

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
const form = editor.createForm(entry)
Ref.Left.appendChild(form);

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
Ref.centreToolbar.style.display = 'flex';
    
const form = document.createElement('form');
form.id = 'editForm';
form.classList.add('form');

const excludedKeys = ['id', 'name', 'type', 'subType', 'description']; // Define keys to exclude

//0. Make Description Manually

const descArea = document.createElement('textarea');
descArea.id = 'nameArea';
descArea.classList.add('centreText'); 
descArea.value = obj.description || 'insert name here';

Ref.Centre.appendChild(descArea);

setTimeout(function() {
descArea.style.height = descArea.scrollHeight + 'px';
}, 0);

//1. Make Type Manually

const typeArea = document.createElement('textarea');
typeArea.id = 'typeArea';
typeArea.classList.add('centreType'); 
typeArea.value = obj.type || 'none';

Ref.Left.appendChild(typeArea);

//2. Make subType Manually

const subTypeArea = document.createElement('textarea');
subTypeArea.id = 'subTypeArea';
subTypeArea.classList.add('centreSubType'); 
subTypeArea.value = obj.subType || 'none';

Ref.Left.appendChild(subTypeArea);

//3. Make Name Manually

const nameArea = document.createElement('textarea');
nameArea.id = 'nameArea';
nameArea.classList.add('centreName'); 
nameArea.value = obj.name || 'insert name here';

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
// Create a container div for each label and textarea pair
const container = document.createElement('div');
container.classList.add('input-container');

// Create label element
const label = document.createElement('input');
label.value = this.proper(key);
label.classList.add('leftLabel'); // Add a CSS class to the label

// Create textarea element
const textarea = document.createElement('textarea');
textarea.name = key;
textarea.classList.add('leftText'); 
textarea.classList.add('white'); 
textarea.value = obj[key] || 'none';

textarea.addEventListener('input', function() {
// Calculate the height based on the scroll height of the textarea
this.style.height = 'auto'; 
this.style.height = this.scrollHeight + 'px';

});

textarea.addEventListener('blur', function() {
// Remove empty space at the end of the textarea value
this.value = this.value.trim();

});


// Append label and textarea to the container
container.appendChild(label);
container.appendChild(textarea);

// Append container to the form
form.appendChild(container);

setTimeout(function() {
textarea.style.height = textarea.scrollHeight + 'px';
}, 0);
}
}

//0. Make ID Manually

const existingId = document.getElementById('centreId');
if (existingId) {
existingId.remove(); // Remove the existing form
}

const idArea = document.createElement('textarea');
idArea.id = 'centreId';
idArea.classList.add('centreId'); 
idArea.value = obj.id || 'N/A';

Ref.Centre.appendChild(idArea);


return form;

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