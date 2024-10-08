//Toolbar.js
import ref from "./ref.js";
import Map   from "./map.js";
import Add   from "./add.js";
import editor from "./editor.js"; 
import form from "./form.js";
import Events from "./events.js";
import load from "./load.js";
import save   from "./save.js";
import Storyteller from "./storyteller.js";
import party from "./party.js";
import helper from "./helper.js";
import battleMap from "./battleMap.js";

class Toolbar{


init() {  

load.loadDefault();
load.checkStoredData();
toolbar.loadQuery();
party.dragPartyScreen();
battleMap.enablePencilTool(ref.annotations);


//Enable Persistent Loops
setInterval(helper.updateEventContent, 10000);
setInterval(helper.updateAttackContent, 5000);


// Add an input event listener to ref.locationLabel
ref.locationLabel.addEventListener('input', () => {
helper.adjustFontSize();
});


Events.loadEventListeners();

//mainToolbar
ref.partyButton.addEventListener('click', this.partyButton);
ref.gridButton.addEventListener('click', this.gridButton);
ref.projectButton.addEventListener('click', this.projectButton);
ref.dataButton.addEventListener('click', this.dataButton);
ref.addButton.addEventListener('click', this.addButton); 
ref.editButton.addEventListener('click', this.editButton);
ref.saveButton.addEventListener('click', this.saveButton);  
ref.copyButton.addEventListener('click', this.copyButton);  
ref.newButton.addEventListener('click', this.newButton); 
ref.deleteButton.addEventListener('click', this.deleteButton);
ref.moveButton.addEventListener('click', this.moveButton);
ref.queryButton.addEventListener('click', this.queryButton);
ref.queryCloseButton.addEventListener('click', this.queryCloseButton);
ref.speakButton.addEventListener('click', this.speakButton);

load.saveToBrowser();

};

projectButton(){

if(editor.projecting === false){

editor.projecting = true
    
let secondWindow = window.open('', '', `width=${screen.availWidth},height=${screen.availHeight}`);
toolbar.secondWindow = secondWindow;

    // Fetch the HTML file from your directory
fetch('player.html')
.then(response => response.text()) // Convert the response to text
.then(html => {
  // Write the fetched HTML content to the new window
  secondWindow.document.write(html);

  // Once the content is loaded, you can call the drawGrid function
  const battleMapPlayer = secondWindow.document.getElementById('battleMap-player')
  battleMapPlayer.style.display = 'block';
  const annotationsPlayer = secondWindow.document.getElementById('annotations-player')
  annotationsPlayer.style.display = 'block';
 
  battleMap.drawGrid(battleMapPlayer);

})
.catch(error => console.error('Error loading player.html:', error));
    
}else if (!toolbar.secondWindow || toolbar.secondWindow.closed) {
        editor.projecting = false
        toolbar.projectButton()
}else{
    const battleMapPlayer = toolbar.secondWindow.document.getElementById('battleMap-player')
    battleMap.drawGrid(battleMapPlayer);

}

};

speakButton(){

if(Storyteller.speaking === false){

Storyteller.speaking = true
Storyteller.textToSpeech(ref.Storyteller.textContent, Storyteller.speaking);
}else{

Storyteller.speaking = false
Storyteller.textToSpeech(ref.Storyteller.textContent, Storyteller.speaking);
}

}

loadQuery(){

ref.queryPre.innerHTML = 
`<pre>
<span class = "hotpink"> Warning! Back up your data.</span> 

<code>
function sortData(data) {
for (const key in data) {
let obj = data[key];

obj = obj.map(entry => {
</code>
</pre>`

ref.queryPost.innerHTML = 

`<pre>
<code>
return entry;
});

data[key] = obj;
console.log(data[key]);
}}
</code>
</pre>`



};

queryCloseButton(){
ref.queryWindow.style.display = "none";
}

queryButton() {
const codeInput = document.getElementById('queryText').value; // Get the user-provided code
const data = load.Data; // Assume load.Data is your data object

for (const key in data) {
let obj = data[key];

try {

if(key !== 'miscInfo'){
// Create a new function with the user code integrated into the predefined structure
const userFunction = new Function('obj', `
    return obj.map(entry => {
        ${codeInput} // Inject user-provided code here
        return entry;
    });
`);

// Apply the user code to the obj array
data[key] = userFunction(obj);

}

} catch (error) {
console.error('Error executing user code:', error);
}

}

if(editor.editMode){
editor.loadList(load.Data)
}
};

gridButton() {  

const mapElement = document.getElementById('mapElement');
let labels = document.querySelectorAll('.position-div');
const drawToolButton = document.getElementById('drawToolButton')

if(battleMap.gridShowing === false){

battleMap.gridShowing = true;
ref.battleMap.style.display = 'block';
ref.iconContainer.style.display = 'block';
ref.annotations.style.display = 'block';
drawToolButton.style.display = 'block';
labels.forEach(div => {div.style.display = 'none'});
helper.changeIconVis('block');

}else{

battleMap.gridShowing = false;
ref.battleMap.style.display = 'none';
ref.iconContainer.style.display = 'none';
ref.annotations.style.display = 'none';
drawToolButton.style.display = 'none';
labels.forEach(div => {div.style.display = 'block'});
helper.changeIconVis('none')

}};


partyButton(){

if(ref.leftParty.style.display === 'block'){
partyButton.classList.remove('click-button')
ref.leftParty.style.display = 'none'


}else{
partyButton.classList.add('click-button')
party.loadParty()



}

}

escButton(){
//console.log('esc')
window.speechSynthesis.pause();

if(ref.leftExpand.style.display !== 'none'){
ref.leftExpand.style.display = "none";
ref.leftExpand.innerHTML = ``;
return
}

// if(battleMap.gridShowing === true){
//     gridButton.click();
//     return
//     }

if(Add.addMode){
addButton.click();
return
}

//Close search and empty search box.
ref.eventManager.value = '';
ref.Editor.style.display = 'none';

//Reset fullScreen mode on descriptionText.
const textBox = document.getElementById('descriptionText');
if(textBox && ref.Centre.style.display !== "none"){
ref.Left.style.display = "block";
editor.fullScreen = false;
ref.Centre.classList.remove("fullScreen");
ref.Centre.classList.add("Centre");
textBox.classList.remove("fullScreenText");
textBox.classList.add("centreText");
textBox.style.height = 'auto';
textBox.style.height = descriptionText.scrollHeight + 'px';
}

if(ref.Left.style.display === "none" && ref.Centre.style.display === "none"){

if(Storyteller.currentLocationId === Storyteller.grandParentLocationId){

helper.showPrompt('Do you want to create a new outer level?', 'yesNo');

helper.handleConfirm = function(confirmation) {
const promptBox = document.querySelector('.prompt');

if (confirmation) {
Map.newMasterLocation();
promptBox.style.display = 'none';
} else{
promptBox.style.display = 'none';
}

};


}else{
//Go out one Level
const currentObj = load.Data.locations.find(entry => parseInt(entry.id) === parseInt(Storyteller.currentLocationId));
Storyteller.changeContent(currentObj.parentId)

}

}else {
ref.Centre.style.display = "none";
ref.Left.style.display = "none";

}

};



dataButton() {
ref.fileInput.addEventListener('change', (event) => {
load.loadSaveFile(event, 'whole');
});

fileInput.click();

};

newButton(){

newButton.classList.add('click-button');

if(!editor.makeNew){
//Select a header type and it will generate a blank version. 
editor.makeNew = true;
ref.eventManager.value = '';

editor.sectionHeadDisplay = 'none'
editor.subSectionHeadDisplay = 'none'
editor.subSectionEntryDisplay =  'none'
editor.EntryDisplay = 'none'

editor.loadList(load.Data);

}else if (editor.makeNew){

editor.makeNew = false;
newButton.classList.remove('click-button');
if(!editor.editMode){
ref.Editor.style.display = 'none';
};
}
};

deleteButton(){
save.deleteDataEntry();
};

moveButton() {
console.log('moveButton Clicked')
const mapElement = document.getElementById('mapElement');


if(!Add.moveMode){
Add.moveMode = true;
console.log('Adding Map Events Listeners')
mapElement.addEventListener('mousedown', Add.handleMouseDown);
mapElement.addEventListener('mousemove', Add.handleMouseMove); 

ref.locationDivs.forEach((selection) => {
selection.style.pointerEvents = 'none';
});

}else{if(Add.moveMode){

Add.moveMode = false;
console.log('Removing Map Events Listeners')
mapElement.removeEventListener('mousedown', Add.handleMouseDown);
mapElement.removeEventListener('mousemove', Add.handleMouseMove); 

ref.locationDivs.forEach((selection) => {
selection.style.pointerEvents = 'auto';
});
}}
};

addButton() {
console.log('addButton Clicked')
const mapElement = document.getElementById('mapElement');


if(!Add.addMode){
Add.addMode = true;
addButton.classList.add('click-button');

// Add the event listeners
mapElement.addEventListener('mousedown', Add.handleMouseDown);
mapElement.addEventListener('mousemove', Add.handleMouseMove);   
ref.mainToolbar.style.pointerEvents = 'none';
ref.locationDivs.forEach((selection) => {
selection.style.pointerEvents = 'none';
});

}else{if(Add.addMode){

Add.addMode = false;
addButton.classList.remove('click-button');

// Remove the event listeners
mapElement.removeEventListener('mousedown', Add.handleMouseDown);
mapElement.removeEventListener('mousemove', Add.handleMouseMove);
ref.mainToolbar.style.pointerEvents = 'auto';
ref.locationDivs.forEach((selection) => {
selection.style.pointerEvents = 'auto';
});
}}
};

editButton() {

//Change editMode Booleon
if(!editor.editMode){
editor.editMode = true
}else{
editor.editMode = false};

//Visualise Edit Button Click Effect
if(editor.editMode){
editButton.classList.add('click-button')
}else{
editButton.classList.remove('click-button')
};

//Changes to Form (Left Panels)
const editVisibleDivs = document.querySelectorAll('.editVisible');

if(editor.editMode){


const obj = load.Data.locations.find(obj => obj.name === ref.locationLabel.value);

if(obj && ref.Left.style.display === 'none'){
form.createForm(obj);
}

//Show Extra Controls
editVisibleDivs.forEach(div => {   
div.style.display = 'block';
})

ref.Editor.style.display = 'block';

}else{

//Hide Extra Controls
editVisibleDivs.forEach(div => {   
div.style.display = 'none'; 
})

};

//Changes to Right Panel 

if(editor.editMode){

//List Display Variables
editor.sectionHeadDisplay = 'none',
editor.subSectionHeadDisplay = 'none',
editor.subSectionEntryDisplay =  'none',
editor.EntryDisplay = 'none',
editor.loadList(load.Data);


// Add the event listeners to each .selection element
ref.locationDivs.forEach((div) => {
div.addEventListener('mouseenter', editor.handleMouseHover);
div.addEventListener('mouseleave', editor.handleMouseHover);
});

}else{

//Show Storyteller
ref.eventManager.style.display = 'block';
ref.Storyteller.style.display = 'block';
ref.Storyteller.innerHTML = '';

Storyteller.refreshLocation();

//Hide Editor
ref.Editor.style.display = 'none';

// Remove the event listeners from each .selection element
ref.locationDivs.forEach((div) => {
div.removeEventListener('mouseenter', editor.handleMouseHover);
div.removeEventListener('mouseleave', editor.handleMouseHover);
});



}
}

saveButton(){

saveButton.classList.add('click-button');
setTimeout(() => {
saveButton.classList.remove('click-button');
}, 1000); // 1000 milliseconds = 1 second

save.saveDataEntry();

}

copyButton(){

const currentId = parseInt(document.getElementById('currentId').value);
const currentKey = document.getElementById('key').getAttribute('pair');
const address = {key: currentKey, id: currentId};
//console.log(address);
const obj = helper.getObjfromTag(address);

helper.showPrompt('How many copies of ' +  obj.name + '?', 'input');
ref.promptBox.focus();

helper.handleConfirm = function(response, promptBox) {
if (response !== null) {
// Check if the response is a valid number
const numCopies = parseInt(response);
if (!isNaN(numCopies)) {
// Valid number, proceed with creating copies
form.makeMultipleObjs(numCopies, obj, obj.key);
} else {
// Invalid input, show error message or handle accordingly
alert('Please enter a valid number.');
}
} else {
// User cancelled
console.log('User cancelled');
}
// Hide the prompt box
promptBox.style.display = 'none';
};

}

showMasterLocation(){

// console.log(
// 'locId:', Storyteller.currentLocationId,
// 'parentId:', Storyteller.parentLocationId,
// 'gParentId:', Storyteller.grandParentLocationId
// );

//Find entry where id and parentId match. 
const masterLocation = load.Data.locations.find(entry => parseInt(entry.id) === parseInt(entry.parentId))
Storyteller.changeContent(masterLocation.id)

Storyteller.parentLocationId = masterLocation.id
Storyteller.grandParentLocationId = masterLocation.id

}


};

const toolbar = new Toolbar();
toolbar.init(); // Initialize the toolbar

export default toolbar;