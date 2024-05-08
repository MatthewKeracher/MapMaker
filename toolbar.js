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

class Toolbar{

init() {  
    
    load.readMe();
    load.checkStoredData();

    // Add an input event listener to ref.locationLabel
ref.locationLabel.addEventListener('input', () => {
    helper.adjustFontSize();
});


Events.loadEventListeners();

//Ambience.getAmbience();

//mainToolbar
ref.partyButton.addEventListener('click', this.partyButton);
ref.mapButton.addEventListener('click', this.mapButton);
ref.dataButton.addEventListener('click', this.dataButton);
ref.addButton.addEventListener('click', this.addButon); 
ref.editButton.addEventListener('click', this.editButton);
ref.saveButton.addEventListener('click', this.saveButton);  
ref.copyButton.addEventListener('click', this.copyButton);  
ref.fileInput.addEventListener('change', load.loadSaveFile); 
ref.newButton.addEventListener('click', this.newButton); 
ref.deleteButton.addEventListener('click', this.deleteButton);

load.saveToBrowser();

};

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
console.log('esc')
window.speechSynthesis.cancel();

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

// Ref.centreToolbar.style.display = "none";
document.activeElement.blur();

if(load.fileName !== ''){
ref.Storyteller.innerHTML = '';

const readMe = ref.locationLabel.value;
helper.adjustFontSize();
console.log(readMe)

if(readMe === 'Read Me'){
Storyteller.showmiscInfo()
ref.locationLabel.disabled = false;
}else{
load.readMe();
};

};

}else {
ref.Centre.style.display = "none";
ref.Left.style.display = "none";

}

};

mapButton() {  
Map.fetchAndProcessImage()
document.getElementById('Banner').style.display = "none";
ref.Right.style.display = 'block';
ref.Storyteller.display = 'block';

};

dataButton() {
const fileInput = document.getElementById('fileInput');
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

addButon() {
const mapElement = document.getElementById('mapElement');
const ledgerCheck = document.querySelectorAll('.miscInfo').length === 0
console.log(ledgerCheck)

if(!ledgerCheck){
Storyteller.addNewEntry()
}

if(!Add.addMode && ledgerCheck){
Add.addMode = true;
addButton.classList.add('click-button');

// Add the event listeners
mapElement.addEventListener('mousedown', Add.handleMouseDown);
mapElement.addEventListener('mousemove', Add.handleMouseMove);
mapElement.addEventListener('mouseup', Add.handleMouseUp);   
ref.mainToolbar.style.pointerEvents = 'none';
ref.locationDivs.forEach((selection) => {
selection.style.pointerEvents = 'none';
});

}else{if(Add.addMode &&ledgerCheck){

Add.addMode = false;
addButton.classList.remove('click-button');

// Remove the event listeners
mapElement.removeEventListener('mousedown', Add.handleMouseDown);
mapElement.removeEventListener('mousemove', Add.handleMouseMove);
mapElement.removeEventListener('mouseup', Add.handleMouseUp);
ref.mainToolbar.style.pointerEvents = 'auto';
ref.locationDivs.forEach((selection) => {
selection.style.pointerEvents = 'auto';
});
}}
};

editButton() {

if (!editor.editMode) {

editor.editMode = true; // Now editing.

editButton.classList.add('click-button');

//By default, load Location in Form

const obj = load.Data.locations.find(obj => obj.name === ref.locationLabel.value);

if(obj && ref.Left.style.display === 'none'){
form.createForm(obj);
}

//Show Editor loadLists()
ref.Editor.style.display = 'block';
//Ref.Centre.style.display = 'block';
//Ref.Left.style.display = 'block';


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

} else { if (editor.editMode) {

editor.editMode = false; // Now Storytelling.

editButton.classList.remove('click-button');
// Ref.centreToolbar.style.display = "none";

//document.getElementById('miniBanner').style.display = "none";
//Ref.locationLabel.style.color = Storyteller.returnLocation.color;
//console.log(Ref.locationLabel.style.color )

//Show Storyteller
ref.eventManager.style.display = 'block';
ref.Storyteller.style.display = 'block';
ref.Storyteller.innerHTML = '';

Storyteller.refreshLocation();

if(ref.Storyteller.innerHTML === ''){
Storyteller.showmiscInfo();
}

//Hide Editor, Centre, Left
ref.Editor.style.display = 'none';
ref.Centre.style.display = 'none';
ref.Left.style.display = 'none';


// Remove the event listeners from each .selection element
ref.locationDivs.forEach((div) => {
div.removeEventListener('mouseenter', editor.handleMouseHover);
div.removeEventListener('mouseleave', editor.handleMouseHover);
});
}}};

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
    console.log(address);
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



};

const toolbar = new Toolbar();
toolbar.init(); // Initialize the toolbar

export default toolbar;