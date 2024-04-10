//Toolbar.js
import Ref from "./ref.js";
import Map   from "./map.js";
import Add   from "./add.js";

import editor from "./editor.js";
import Events from "./events.js";
import NPCs from "./npcs.js";
import Monsters from "./monsters.js";
import Items  from "./items.js";
import Spells  from "./spells.js";
import load from "./load.js";
import save   from "./save.js";
import Storyteller from "./storyteller.js";

class Toolbar{

init() {   

load.loadDefault();
Ref.locationLabel.textContent = 'Information';
Ref.editToolbar.style.display = 'none';


//Readme.
Ref.Storyteller.innerHTML = 
`<span class="withbreak">
Welcome to Excel_DM, a hypertextual Game Master worldbuilding and game running tool.

All you need to do to being is select [M]ap button and load an image file. [D]ata is loaded from, and saved to a .json file.

*Link to Library*

Matthew Keracher, 2024.
keracher@uwm.edu
</span>
`;

//editor.addPredictiveContent();
editor.init();

Monsters.addMonsterFormEvents();
Events.loadEventListeners();
Spells.addSearch();
Items.addItemSearch();

//Ambience.getAmbience();

//mainToolbar
Ref.mapButton.addEventListener('click', this.mapButton);
Ref.dataButton.addEventListener('click', this.dataButton);
Ref.addButton.addEventListener('click', this.addButon); 
Ref.editButton.addEventListener('click', this.editButton);
Ref.saveButton.addEventListener('click', this.saveButton);  
Ref.fileInput.addEventListener('change', load.loadSaveFile); 

//eventManager -- change to a doubleClick.
// Ref.enableEventButton.addEventListener('click', () => this.changEventStatus(1, "one"));
// Ref.disableEventButton.addEventListener('click', () => this.changEventStatus(0, "one"));

//editToolbar
Ref.editEditButton.addEventListener('click', this.editButton);
Ref.editSaveButton.addEventListener('click', this.saveFormButton);
Ref.editNewButton.addEventListener('click', this.newButton); 
Ref.editDeleteButton.addEventListener('click', this.deleteFormButton);

// //centreToolbar
// Ref.centreSaveButton.addEventListener('click', this.saveFormButton);
};

changEventStatus(y, scope) {

if (scope === 'one') {

const eventName = Ref.eventManager.value;
const eventEntry = load.Data.events.find(event => event.name === eventName);

if (eventEntry) {eventEntry.active = y} else {console.log('Event not found:', eventName)};

} else if(scope === 'many') {

const eventsToEnable = load.Data.events.filter(event => Events.searchArray.some(searchEvent => searchEvent.name === event.name));

if (eventsToEnable.length > 0) {eventsToEnable.forEach(event => {event.active = y})} else {console.log('No matching events found to Enable')}}

//console.log(Events.searchArray.length);
Events.loadEventsList(load.Data.events, Ref.Centre, 'eventsManager');

};

escButton(){

window.speechSynthesis.cancel();

//Close search and empty search box.
Ref.eventManager.value = '';
Ref.Editor.style.display = 'none';

if(Ref.Centre.style.display !== "none"){
const textBox = document.getElementById('descriptionText');
//Make normal.
Ref.Left.style.display = "block";
editor.fullScreen = false;
Ref.Centre.classList.remove("fullScreen");
Ref.Centre.classList.add("Centre");
textBox.classList.remove("fullScreenText");
textBox.classList.add("centreText");
//Set Height
const descriptionText = document.getElementById('descriptionText');
// Set the initial height based on the scroll height of the content
descriptionText.style.height = 'auto';
descriptionText.style.height = descriptionText.scrollHeight + 'px';
}

if(Ref.Left.style.display === "none" && Ref.Centre.style.display === "none"){

// Ref.centreToolbar.style.display = "none";
document.activeElement.blur();


// if(editor.editMode === true){
// Ref.mainToolbar.style.display = "none";
// Ref.editToolbar.style.display = "flex";
// } else if (editor.editMode === false){
// Ref.mainToolbar.style.display = "flex";
// Ref.editToolbar.style.display = "none";
// }

if(load.fileName !== ''){
Ref.locationLabel.textContent = load.fileName;
Ref.Storyteller.innerHTML = '';

Storyteller.showTownText();
    

}else{
Ref.locationLabel.textContent = 'Information';    
}

}else {
Ref.Centre.style.display = "none";
Ref.Left.style.display = "none";

}

};

mapButton() {  
Map.fetchAndProcessImage()
document.getElementById('Banner').style.display = "none";
Ref.Right.style.display = 'block';
Ref.Storyteller.display = 'block';
};

dataButton() {
const fileInput = document.getElementById('fileInput');
fileInput.click();

};

addButon() {
const mapElement = document.getElementById('mapElement');
if(!Add.addMode){
Add.addMode = true;
addButton.classList.add('click-button');

// Add the event listeners
mapElement.addEventListener('mousedown', Add.handleMouseDown);
mapElement.addEventListener('mousemove', Add.handleMouseMove);
mapElement.addEventListener('mouseup', Add.handleMouseUp);   
Ref.mainToolbar.style.pointerEvents = 'none';
Ref.locationDivs.forEach((selection) => {
selection.style.pointerEvents = 'none';
});

}else{if(Add.addMode){

Add.addMode = false;
addButton.classList.remove('click-button');

// Remove the event listeners
mapElement.removeEventListener('mousedown', Add.handleMouseDown);
mapElement.removeEventListener('mousemove', Add.handleMouseMove);
mapElement.removeEventListener('mouseup', Add.handleMouseUp);
Ref.mainToolbar.style.pointerEvents = 'auto';
Ref.locationDivs.forEach((selection) => {
selection.style.pointerEvents = 'auto';
});
}}
};

editButton() {

if (!editor.editMode) {

editor.editMode = true; // Now editing.

editEditButton.classList.add('click-button');

//Switch Toolbars
Ref.mainToolbar.style.display = 'none';
Ref.editToolbar.style.display = 'flex';

//By default, load Location in Form

const obj = load.Data.locations.find(obj => obj.name === Ref.locationLabel.textContent);

if(obj){
editor.createForm(obj);
}
//Ref.locationLabel.textContent = load.fileName;

//Hide Storyteller
//Ref.eventManager.style.display = 'none';
//Ref.locationLabel.style.display = 'none';


//Show Editor loadLists()
Ref.Editor.style.display = 'block';
//Ref.Centre.style.display = 'block';
//Ref.Left.style.display = 'block';

editor.loadList(load.Data);



// Add the event listeners to each .selection element
Ref.locationDivs.forEach((div) => {
div.addEventListener('mouseenter', editor.handleMouseHover);
div.addEventListener('mouseleave', editor.handleMouseHover);
});

} else { if (editor.editMode) {

editor.editMode = false; // Now Storytelling.

editEditButton.classList.remove('click-button');
// Ref.centreToolbar.style.display = "none";

//document.getElementById('miniBanner').style.display = "none";
//Ref.locationLabel.style.color = Storyteller.returnLocation.color;
//console.log(Ref.locationLabel.style.color )

//Show Storyteller
Ref.eventManager.style.display = 'block';
Ref.Storyteller.style.display = 'block';
Ref.Storyteller.innerHTML = '';

Storyteller.refreshLocation();

if(Ref.Storyteller.innerHTML === ''){
Storyteller.showTownText();
}

//Hide Editor, Centre, Left
Ref.Editor.style.display = 'none';
Ref.Centre.style.display = 'none';
Ref.Left.style.display = 'none';

//Switch Toolbars
Ref.mainToolbar.style.display = 'flex';
Ref.editToolbar.style.display = 'none';

// Remove the event listeners from each .selection element
Ref.locationDivs.forEach((div) => {
div.removeEventListener('mouseenter', editor.handleMouseHover);
div.removeEventListener('mouseleave', editor.handleMouseHover);
});
}}};

saveButton(){
    
//Save whole file.
if(Ref.Centre.style.display === 'none'){

saveButton.classList.add('click-button');
setTimeout(() => {
saveButton.classList.remove('click-button');
}, 1000); // 1000 milliseconds = 1 second

save.exportArray();

//Save this form.
}else{

editSaveButton.classList.add('click-button');
setTimeout(() => {
editSaveButton.classList.remove('click-button');
}, 1000); // 1000 milliseconds = 1 second

      
editor.saveDataEntry();

};
}

saveFormButton(){

editSaveButton.classList.add('click-button');
setTimeout(() => {
editSaveButton.classList.remove('click-button');
}, 1000); // 1000 milliseconds = 1 second


editor.saveDataEntry();


}

newButton(){

editNewButton.classList.add('click-button');
setTimeout(() => {
editNewButton.classList.remove('click-button');
}, 1000); // 1000 milliseconds = 1 second

//Select a header type and it will generate a blank version. 
editor.makeNew = true;

}

deleteFormButton(){
editor.deleteDataEntry();
};


};

const toolbar = new Toolbar();
toolbar.init(); // Initialize the toolbar

export default toolbar;