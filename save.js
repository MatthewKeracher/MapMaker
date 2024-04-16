import load from "./load.js";
import NPCs from "./npcs.js";
import ref from "./ref.js";
import editor from "./editor.js";
import Storyteller from "./storyteller.js";


const save = {


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

//console.log(labels, inputs);

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

try{
saveEntry['key'] = document.getElementById('key').getAttribute('pair');

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

// Change type/subType for all objects in load.Data[key]
load.Data[key] = load.Data[key].map(obj => ({
    ...obj, // Spread the properties of the original object
    type: saveEntry['type'], // Modify the type property
    subType: saveEntry['subType'] // Modify the subType property
}));

if(index === -1){
load.Data[key].push(saveEntry)
}else{
load.Data[key][index] = saveEntry
}

//Reset programme with new Data.
NPCs.buildNPC();

//Reset Editor and Search 
if(ref.eventManager.value === ''){   
editor.loadList(load.Data);
}else{
let searchText = ref.eventManager.value.toLowerCase();

if(editor.editMode === true){
editor.searchAllData(searchText, load.Data);
};
}

if(editor.editMode === false){
ref.Editor.style.display = 'none';
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
const key = document.getElementById('key').getAttribute('pair');
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
ref.Left.style.display = 'none';
ref.Centre.style.display = 'none';

//remove Tags 
for (const key in load.Data) {
    let obj = load.Data[key];

    if (key !== 'townText') {
        for (const entry of obj) {
            let tagsToSearch = entry.tags;

            // Use filter to remove deleteTag from tagsToSearch
            entry.tags = tagsToSearch.filter(tag => !(tag.key === key && parseInt(tag.id) === parseInt(id)));

        }
    }

    load.Data[key] = obj;
}



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



saveFile(content, filename, mimeType) {
const blob = new Blob([content], { type: mimeType });
saveAs(blob, filename);
},

exportArray: function () {

const json = JSON.stringify(load.Data, null, 2);
const mimeType = 'application/json';

// Prompt the user to enter a filename
const filename = prompt('Enter the filename for the JSON file:', load.fileName + '.json');

if (filename) {
// Call the function to save the JSON string as a file
this.saveFile(json, filename, mimeType);
} else {
console.log('Filename not provided, file not saved.');
}

}, 

handleFileSave(event, blob, blobUrl) {
const file = event.target.files[0];
if (file) {
// Create an anchor element for the download link
const downloadLink = document.createElement('a');
downloadLink.href = blobUrl;

// Set the filename for the download
downloadLink.download = file.name; // Use the chosen filename

// Programmatically trigger a click event on the anchor element to start the download
downloadLink.click();

// Clean up: remove the anchor element and revoke the Blob URL
downloadLink.remove();
URL.revokeObjectURL(blobUrl);
}

// Clean up: remove the file input element
event.target.remove();
},

}

export default save;