//Toolbar.js
import Ref from "./ref.js";
import Map   from "./map.js";
import Add   from "./add.js";
import Array from "./array.js";
import editor from "./editor.js";
import Events from "./events.js";
import NPCs from "./npcs.js";
import Monsters from "./monsters.js";
import Items  from "./items.js";
import Spells  from "./spells.js";
import load from "./load.js";

class Toolbar{

init() {   

//Base Load Arrays
// Monsters.loadMonstersArray();
// Items.loadItemsArray();
// Spells.loadSpellsArray();
// Events.loadEventsArray();
load.loadDefault();

//editor.addPredictiveContent();
editor.init();

Monsters.addMonsterFormEvents();
Events.addEventsSearch();
NPCs.addNPCSearch();
Spells.addSearch();
Items.addItemSearch();

//Ambience.getAmbience();

//mainToolbar
Ref.mapButton.addEventListener('click', this.mapButton);
Ref.dataButton.addEventListener('click', this.dataButton);
Ref.addButton.addEventListener('click', this.addButon); 
Ref.editButton.addEventListener('click', this.editButton);
Ref.saveButton.addEventListener('click', this.saveButton);  
Ref.fileInput.addEventListener('change', Array.loadSaveFile); 

//eventManager -- change to a doubleClick.
// Ref.enableEventButton.addEventListener('click', () => this.changEventStatus(1, "one"));
// Ref.disableEventButton.addEventListener('click', () => this.changEventStatus(0, "one"));

//editToolbar
Ref.editEditButton.addEventListener('click', this.editButton);
Ref.editSaveButton.addEventListener('click', this.saveFormButton);
Ref.editClearButton.addEventListener('click', this.clearFormButton); 
Ref.editDeleteButton.addEventListener('click', this.deleteFormButton);

}

changEventStatus(y, scope) {

if (scope === 'one') {

const eventName = Ref.eventManager.value;
const eventEntry = Events.eventsArray.find(event => event.name === eventName);

if (eventEntry) {eventEntry.active = y} else {console.log('Event not found:', eventName)};

} else if(scope === 'many') {

const eventsToEnable = Events.eventsArray.filter(event => Events.searchArray.some(searchEvent => searchEvent.name === event.name));

if (eventsToEnable.length > 0) {eventsToEnable.forEach(event => {event.active = y})} else {console.log('No matching events found to Enable')}}

//console.log(Events.searchArray.length);
Events.loadEventsList(Events.eventsArray, Ref.Centre, 'eventsManager');

};

escButton(){

Ref.Centre.style.display = "none";
Ref.Left.style.display = "none";
document.activeElement.blur();
Ref.eventManager.value = '';


};

mapButton() {  
Map.fetchAndProcessImage()
document.getElementById('Banner').style.display = "none";
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

//Hide Storyteller
Ref.eventManager.style.display = 'none';
Ref.locationLabel.style.display = 'none';
Ref.Storyteller.style.display = 'none';

//Show Editor loadLists()
Ref.Editor.style.display = 'block';
//Ref.Centre.style.display = 'block';
//Ref.Left.style.display = 'block';

editor.loadList(load.Data);

//Switch Toolbars
Ref.mainToolbar.style.display = 'none';
Ref.editToolbar.style.display = 'flex';

// Add the event listeners to each .selection element
Ref.locationDivs.forEach((div) => {
div.addEventListener('mouseenter', editor.handleMouseHover);
div.addEventListener('mouseleave', editor.handleMouseHover);
});

} else { if (editor.editMode) {

editor.editMode = false; // Now Storytelling.

editEditButton.classList.remove('click-button');

//Show Storyteller
Ref.eventManager.style.display = 'block';
Ref.locationLabel.style.display = 'block';
Ref.Storyteller.style.display = 'block';

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
Array.exportArray();
};  

saveFormButton(){

const Page = editor.editPage

editSaveButton.classList.add('click-button');
setTimeout(() => {
editSaveButton.classList.remove('click-button');
}, 1000); // 1000 milliseconds = 1 second

switch (Page) {
case 1:
editor.saveLocation();
break;

case 2:
Events.saveEvent();
Events.loadEventsList(Events.eventsArray, Ref.Centre);
//Events.getEvent();
break;

case 3:
NPCs.saveNPC();
Events.saveEvent();
Events.loadEventsList(Events.eventsArray, Ref.Centre);
// NPCs.searchNPC(Ref.npcSearch.value.toLowerCase())
// NPCs.loadNPC(NPCs.npcSearchArray);
break;

case 4:
Monsters.saveMonster();
Spells.loadSpellsList(Monsters.monstersArray);
break;

case 5:
Items.saveItem();
Items.searchItem(itemSearch.value.toLowerCase());
break;

case 6:
Spells.saveSpell();
Spells.loadSpellsList(Spells.spellsArray);
break;



default:

break;

}

NPCs.buildNPC();

};

clearFormButton(){

const Page = editor.editPage

editClearButton.classList.add('click-button');
setTimeout(() => {
editClearButton.classList.remove('click-button');
}, 1000); // 1000 milliseconds = 1 second

switch (Page) {
case 1:
document.getElementById('textLocation').value = "";
break;

case 2:
NPCs.clearForm(Ref.eventForm);
Events.loadEventsList(Events.eventsArray, Ref.Centre);
break;

case 3:
NPCs.clearForm(Ref.npcForm);
Events.loadEventsList(Events.eventsArray, Ref.Centre);
break;

case 4:
NPCs.clearForm(Ref.monsterForm);

break;

case 5:
NPCs.clearForm(Ref.itemForm);

break;

case 6:
NPCs.clearForm(Ref.spellsForm);
break;

default:

break;
}}

deleteFormButton(){
editor.deleteLocation();
};


};

const toolbar = new Toolbar();
toolbar.init(); // Initialize the toolbar

export default toolbar;