import ref from "./ref.js";
import load from "./load.js";
import Storyteller from "./storyteller.js";
import NPCs from "./npcs.js";
import expandable from "./expandable.js";
import Events from "./events.js";
import helper from "./helper.js";
import party from "./party.js";
import Map from "./map.js";
import form from "./form.js";


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

loadList: function(data) {
//console.log('loading List')
//console.log(data)
//Where to put list...
let target = ref.Editor
target.innerHTML = '';
target.style.display = 'block'; 
const excludedKeys = ['miscInfo'];
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

//console.log(keyshow)

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

// if(key !== 'locations'){

if(obj.length < 2){

//Not enough entries to run comparison. No need to either.

}else{

// 1. Sort the items by item type alphabetically and then by subType alphabetically or numerically.
obj.sort((a, b) => {
const typeComparison = a[type].localeCompare(b[type]);

if (typeComparison !== 0) {
// If types are different, return the result of type comparison
return typeComparison;
} else {
// If types are the same, sort by subType
const subTypeA = parseFloat(a[subType]);
const subTypeB = parseFloat(b[subType]);


if (!isNaN(subTypeA) && !isNaN(subTypeB)) {
// If subTypes can be converted to numbers, sort them numerically
return subTypeA - subTypeB || a.name.localeCompare(b.name);
} else {
// Otherwise, sort them alphabetically
try{
return a[subType].localeCompare(b[subType]) || a.name.localeCompare(b.name);
}catch{}
}
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
// }else{

// //For Locations, sort by Order.
// if(obj.length < 2){

//     //Not enough entries to run comparison. No need to either.
//     }else{

//         //Sort by Order
//         obj.sort((a, b) => {
         
//             return parseInt(a.order) - parseInt(b.order);
            
//             });

//     }
// }


//list Title
const titleDiv = document.createElement('div');

titleDiv.setAttribute("scope", 'key');
titleDiv.setAttribute("id", key);
titleDiv.classList.add('misc');

titleDiv.innerHTML = 
`<h2>
<span
style="display: block; letter-spacing: 0.18vw;">
${helper.proper(key)}
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

let entryName = entry[type] === ''? 'Misc' : entry[type];

nameDiv.setAttribute("scope", 'section');
nameDiv.setAttribute("id", currentSection);
nameDiv.setAttribute("name", entryName);
nameDiv.setAttribute('style', "display:" + sectionHeadDisplay);

nameDiv.innerHTML = 
`<span
id = "${entryName}"
class = "cyan"
style="font-family:'SoutaneBlack'"> 
<hr>
&nbsp;${helper.proper(entryName)}
</span>`;

//3.2 subSection Heads --- subType values.
} else if (entry.subSectionHead){
currentSubSection++


let entryName = entry[subType] === ''? 'Misc' : entry[subType];

nameDiv.setAttribute("scope", 'subsection');
//nameDiv.setAttribute("parent", currentSection);
nameDiv.setAttribute("id", currentSubSection);
nameDiv.setAttribute("name", entryName);
nameDiv.setAttribute('style', "display:" + subSectionHeadDisplay);

let displayName;
if (!isNaN(entryName) && !isNaN(parseFloat(entryName))) {
displayName = `Level: ${entryName}`;
} else {
displayName = helper.proper(entryName);
}

nameDiv.innerHTML= 
`<span 
id = "${entryName}"
class ="hotpink"
style="font-family:'SoutaneBlack'">
<hr>
&nbsp;  ${helper.proper(displayName)}
</span>`;

//${helper.proper(subType)}

//3.3 subSection Entries   
}else if (entry[type] && entry[subType]){
nameDiv.setAttribute('id', entry.id)
nameDiv.setAttribute('style', "display:" + subSectionEntryDisplay)

// if(key === 'locations'){

// nameDiv.innerHTML = 
// `<span 
// id = "${entry.id}"
// style ="color: ${entry.color}">
// &nbsp;${entry.order + '. ' + entry.name}
// </span>`;

// }else{

nameDiv.innerHTML = 
`<span 
id = "${entry.id}"
style ="color: ${entry.color}">
&nbsp;&nbsp;&nbsp;&nbsp;${entry.name}
</span>`;


// }

//3.4 no subSection
}else if (entry[type]){
nameDiv.setAttribute('id', entry.id)
nameDiv.setAttribute('style', "display:" + EntryDisplay)
currentSubSection++

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

//Add Option to import extra Data to project.
editor.addLibrary();
editor.runQuery();

},

listHeaderEvents: function (div, event) {
const scope = div.getAttribute("scope");
let items

if (scope === 'key'){ //has clicked on a keyHeading

let key = div.getAttribute("id")

if(editor.makeNew === true){ // to make new Entries
let randomNumber = Math.floor(Math.random() * load.Data[key].length);
console.log(randomNumber)
if(key === 'npcs'){
NPCs.makeNewNPC(load.Data[key][randomNumber])
}else{
form.createForm(load.Data[key][randomNumber])
}
editor.makeNew = false;
newButton.classList.remove('click-button');
div.classList.remove('item');   
div.classList.add('misc');

}else{

items = document.querySelectorAll(`[key="${key}"]`); 

items.forEach(item => {

//Shift-Click
if(event.shiftKey && ref.Left.style.display === 'block'){   
//Bulk-Add    


}else{
//Show-Hide
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
}
})


}}

else if (scope === 'section'){ //has clicked on a section heading

let key = div.getAttribute("key")
let section = div.getAttribute("id")
let entryName = div.getAttribute("name")
items = document.querySelectorAll(`[key="${key}"][section="${section}"]`);

if(event.shiftKey && ref.Left.style.display === 'block') {

event.preventDefault();

helper.showPrompt('Add all items, or add random item?', 'custom', 'All', 'Random');
ref.promptBox.focus();

helper.handleConfirm = function(confirmation) {
    const promptBox = document.querySelector('.prompt');
    if (confirmation) { //'Add All Items'
    
        items.forEach(item => {
            let noScope = item.getAttribute("scope");

            if(!noScope){   
                event.preventDefault();

                helper.bulkAdd(item);  
            }});
        
      
    promptBox.style.display = 'none';

    } else{ //'Add Random Item from each subSection'
    
    let leftKey = document.getElementById("key"); //Find out if a Tag is open in Form

    //get Section/Group Name
    let sectionDiv = document.querySelectorAll(`[key="${key}"][section="${section}"][scope="section"]`);
    let sectionName = sectionDiv[0].getAttribute("name")

    //If onto a tag, store the instruction to apply random item to inheritors of that tag.
    if(leftKey.value.trim() === 'Tags'){
    
    helper.addInstruction(entryName, key, 'group', sectionName)

    

    //Else, deal out a random item.
    }else{
    const subSections = document.querySelectorAll(`[key="${key}"][section="${section}"][scope="subSection"]`);
   
    subSections.forEach(selection => {

        let key = selection.getAttribute("key")
        let section = selection.getAttribute("section")
        let subSection = selection.getAttribute("id")
        items = document.querySelectorAll(`[key="${key}"][section="${section}"][subsection="${subSection}"]`);

        const randomIndex = Math.floor(Math.random() * items.length);
        helper.bulkAdd(items[randomIndex]);


    })}
    

    promptBox.style.display = 'none';

    }}

}else{
//Show-Hide
items.forEach((item,index) => {

if(index > 0){

const sectionShow = item.getAttribute('sectionShow');

const newSectionShow = sectionShow === 'true'? 'false' : 'true';
item.setAttribute('sectionShow', newSectionShow); 

const sectionDisplay = newSectionShow === 'true'? 'block' : 'none';
item.style.display = sectionDisplay;

item.setAttribute('subSectionShow', "true")
}
}) 
}}

else if (scope === 'subsection'){ //has clicked on a subSection Heading

let key = div.getAttribute("key")
let section = div.getAttribute("section")
let entryName = div.getAttribute("name")
let subSection = div.getAttribute("id")
items = document.querySelectorAll(`[key="${key}"][section="${section}"][subsection="${subSection}"]`);

//get Section/Group Name
let sectionDiv = document.querySelectorAll(`[key="${key}"][section="${section}"][scope="section"]`);
let sectionName = sectionDiv[0].getAttribute("name")

if(event.shiftKey && ref.Left.style.display === 'block') {
event.preventDefault();

helper.showPrompt('Add all items, or add random item?', 'custom', 'All', 'Random');
ref.promptBox.focus();

helper.handleConfirm = function(confirmation) {
    const promptBox = document.querySelector('.prompt');
    if (confirmation) { //'Add All Items'

        items.forEach(item => {
            let noScope = item.getAttribute("scope");

            if(!noScope){   
                event.preventDefault();

                helper.bulkAdd(item);  
            }});
        
      
    promptBox.style.display = 'none';

    } else{ //'Add Random Item'

    let leftKey = document.getElementById("key"); //Find out if a Tag is open in Form
    let leftID = document.getElementById("currentId");

    //If onto a tag, apply random item to inheritors of that tag.
    if(leftKey.value.trim() === 'Tags'){

    //Need to send name of group for spells
    helper.addInstruction(entryName, key, 'subGroup', sectionName)
    
    //Else, deal out a random item.
    }else{

    const randomIndex = Math.floor(Math.random() * items.length);

    helper.bulkAdd(items[randomIndex]);

    }

    promptBox.style.display = 'none';

    }}

}else{
//Show-Hide
items.forEach((item,index) => {

if(index > 0){

const subSectionShow = item.getAttribute('subsectionshow');

const newSubSectionShow = subSectionShow === 'true'? 'false' : 'true';
item.setAttribute('subSectionShow', newSubSectionShow); 

const subSectionDisplay = newSubSectionShow === 'true'? 'block' : 'none';
item.style.display = subSectionDisplay;

item.setAttribute('sectionShow', "true")

}
})
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
//Clicked on Header...
div.addEventListener('click', (event) => {

this.listHeaderEvents(div, event);


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

//When you click on a list item...
div.addEventListener('click', (event) => {

//... if shift-click
//...add NPC to Party
if(event.shiftKey && ref.leftParty.style.display === 'block'){
event.preventDefault();
const clickId = div.getAttribute('id')
const clickKey = div.getAttribute('key')

if(clickKey === 'npcs' || clickKey ==='monsters'){
load.Data.miscInfo.party.push({key: clickKey, id: clickId, type: 'hero'})
}

//Repackage.
party.buildParty();
party.loadParty();

}
//add Tag
else if(event.shiftKey && ref.Left.style.display === 'block'){
event.preventDefault();

//Key-ID pairs and Indexes for both Objs -- clicked and current.

const clickId = div.getAttribute('id')
const clickKey = div.getAttribute('key')
const clickIndex = load.Data[clickKey].findIndex(item => parseInt(item.id) === parseInt(clickId));
const clickArray = {id: clickId, key: clickKey, index: clickIndex}

console.log(document.getElementById('currentId'))

const currentId = document.getElementById('currentId').value; 
const currentKey = document.getElementById('key').getAttribute('pair');
const currentIndex = load.Data[currentKey].findIndex(item => parseInt(item.id) === parseInt(currentId));
const currentArray = {id: currentId, key: currentKey, index: currentIndex}

//Not sure if need this.
editor.addItem = false;

//...add the Tag to the Obj, and vice versa.
helper.addTagtoItem(clickArray, currentArray);

//Finally, Repackage to reflect change.
form.createForm(load.Data[currentKey][currentIndex]);
NPCs.buildNPC();



//Return to Default List
// this.sectionHeadDisplay = 'none',
// this.subSectionHeadDisplay = 'none',
// this.subSectionEntryDisplay =  'none',
// this.EntryDisplay = 'none',
// this.loadList(load.Data)

if(editor.editMode === false){
ref.Editor.style.display = 'none';
}

}
//load Forms
else{
form.createForm(entry)
}
});

}},

searchAllData: function (searchText, data) {
const resultsByKeys = {}; // Object to store results grouped by keys
const excludedKeys = ['miscInfo'];

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
ref.Editor.style.display = 'none';
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

runQuery(){

//list Title
const div = document.createElement('div');

div.innerHTML = 
`<h2>
<span
style="color:orange; display: block; letter-spacing: 0.18vw;">
Run Query
</span></h2>`;

ref.Editor.appendChild(div)

div.addEventListener('click', function() {
ref.queryWindow.style.display = 'flex';
});

div.addEventListener('mouseover', function() {
this.classList.add('highlight');
});

div.addEventListener('mouseout', function() {
this.classList.remove('highlight');
});

},

addLibrary(){

//list Title
const div = document.createElement('div');

div.innerHTML = 
`<h2>
<span
style="color:orange; display: block; letter-spacing: 0.18vw;">
Import Data
</span></h2>`;

ref.Editor.appendChild(div)

div.addEventListener('mouseover', function() {
this.classList.add('highlight');
});

div.addEventListener('mouseout', function() {
this.classList.remove('highlight');
});

div.addEventListener('click', () => {
ref.importData.addEventListener('change', (event) => {
console.log('happening')
load.loadSaveFile(event, 'part');
});

importData.click();


});

},


};

export default editor;