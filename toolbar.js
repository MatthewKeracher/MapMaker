//Toolbar.js
import Ref from "./ref.js";
import Map   from "./map.js";
import Add   from "./add.js";
import Array from "./array.js";
import Edit from "./edit.js";
import Ambience from "./ambience.js";
import NPCs from "./npcs.js";
import Monsters from "./monsters.js";
import Items  from "./items.js";
import Spells  from "./spells.js";

class Toolbar{

init() {       
//Base Load Arrays
Monsters.loadMonstersArray();
Items.loadItemsArray();
Spells.loadSpellsArray();
Ambience.loadAmbienceArray();

//Edit.addPredictiveContent();
Edit.init();

Monsters.addMonsterSearch();
Ambience.addAmbienceSearch();
NPCs.addNPCSearch();
Spells.addSpellSearch();
Items.addItemSearch();

//Ambience.getAmbience();

//mainToolbar
Ref.mapButton.addEventListener('click', this.handleMapButtonClick);
Ref.dataButton.addEventListener('click', this.handleDataButtonClick);
Ref.addButton.addEventListener('click', this.handleAddButtonClick); 
Ref.editButton.addEventListener('click', this.handleEditButtonClick);
Ref.saveButton.addEventListener('click', this.handleSaveButtonClick);  
Ref.fileInput.addEventListener('change', Array.handleFileInputChange); 

//eventManager
Ref.enableEventButton.addEventListener('click', this.handleeventEnableClick);
Ref.disableEventButton.addEventListener('click', this.handleeventDisableClick);

//editToolbar
Ref.editEditButton.addEventListener('click', this.handleEditButtonClick);
Ref.editSaveButton.addEventListener('click', this.handleeditSaveButtonButtonClick);
Ref.editClearButton.addEventListener('click', this.handleeditClearButtonClick); 
Ref.editDeleteButton.addEventListener('click', this.handleeditDeleteButtonClick);

//bottomToolbar
Ref.nextButton.addEventListener('click', this.handleNextButtonClick);
Ref.prevButton.addEventListener('click', this.handleeditPrevButtonButtonClick);

//Data Import & Export
Ref.exportData.addEventListener('click', this.handleexportDataClick);
Ref.importData.addEventListener('click', this.handleimportDataClick);
Ref.csvFileInput.addEventListener('change', Array.handleCSVFileInputChange); 

}

handleeventEnableClick() {
    const selectedEvent = Ref.eventManagerInput.value; // Get the selected event from the dropdown
  
    // Search for the selected event in the ambienceArray
    const foundEvent = Ambience.ambienceArray.find(event => event.title === selectedEvent);
  
    if (foundEvent) {
      foundEvent.active = 1; // Set the 'active' property to 1
      console.log('Event Enabled')
      Ambience.showcurrentEvents();
     
      //Ref.extraInfo.classList.remove('showExtraInfo');
      Ref.extraInfo2.classList.remove('showExtraInfo');
   }
 
  }
  

handleeventDisableClick(){
    const selectedEvent = Ref.eventManagerInput.value; // Get the selected event from the dropdown
  
    // Search for the selected event in the ambienceArray
    const foundEvent = Ambience.ambienceArray.find(event => event.title === selectedEvent);
  
    if (foundEvent) {
      foundEvent.active = 0; // Set the 'active' property to 0
      console.log('Event Disabled')
      Ambience.showcurrentEvents();

      //Ref.extraInfo.classList.remove('showExtraInfo');
      Ref.extraInfo2.classList.remove('showExtraInfo');
    }

};

handleMapButtonClick() {  
Map.fetchAndProcessImage()
document.getElementById('Banner').style.display = "none";
};

handleDataButtonClick() {
const fileInput = document.getElementById('fileInput');
fileInput.click();
};

handleAddButtonClick() {
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

handleEditButtonClick() {

Edit.editPage = 1;

if (!Edit.editMode) {
Edit.editMode = true;
editEditButton.classList.add('click-button');

//Hide Storyteller, pageChange()
Edit.pageChange(Edit.editPage)
Ref.EditorContainer.style.display = 'flex';
Ref.editLocationName.style.display = 'flex';

Ref.eventManagerContainer.style.display = 'none';
Ref.Storyteller.style.display = 'none';
Ref.locationLabel.style.display = 'none';

//Switch Toolbars
Ref.mainToolbar.style.display = 'none';
Ref.editToolbar.style.display = 'flex';
Ref.bottomToolbar.style.display = 'flex';

// Add the event listeners to each .selection element
Ref.locationDivs.forEach((div) => {
div.addEventListener('mouseenter', Edit.handleMouseHover);
div.addEventListener('mouseleave', Edit.handleMouseHover);
});
} else {

if (Edit.editMode) {
Edit.editMode = false;
editEditButton.classList.remove('click-button');

//Show Storyteller, pageChange()
Edit.pageChange(1);
Ref.EditorContainer.style.display = 'none';
Ref.editLocationName.style.display = 'none';

Ref.eventManagerContainer.style.display = '';
Ref.Storyteller.style.display = 'flex';
Ref.locationLabel.style.display = 'flex';

//Switch Toolbars
Ref.mainToolbar.style.display = 'flex';
Ref.editToolbar.style.display = 'none';
Ref.bottomToolbar.style.display = 'flex';

// Remove the event listeners from each .selection element
Ref.locationDivs.forEach((div) => {
div.removeEventListener('mouseenter', Edit.handleMouseHover);
div.removeEventListener('mouseleave', Edit.handleMouseHover);
});
}}};

handleSaveButtonClick(){
Array.exportArray();
};  

handleeditSaveButtonButtonClick(){

const Page = Edit.editPage

editSaveButton.classList.add('click-button');
setTimeout(() => {
editSaveButton.classList.remove('click-button');
}, 1000); // 1000 milliseconds = 1 second

switch (Page) {
case 1:
Edit.saveLocation();
break;

case 2:
NPCs.saveNPC();
NPCs.loadNPC(NPCs.npcArray)
break;

case 3:
Monsters.saveMonster();
Monsters.loadMonsterList(Monsters.monstersArray);
break;

case 4:
Items.saveItem();
Items.loadItemsList(Items.itemsArray);
break;

case 5:
Spells.saveSpell();
Spells.loadSpellsList(Spells.spellsArray);
break;

case 6:
Ambience.saveAmbience();
Ambience.loadEventsList(Ambience.ambienceArray);
Ambience.getEvent();
break;

default:

break;

}

};

handleeditClearButtonClick(){

const Page = Edit.editPage

editClearButton.classList.add('click-button');
setTimeout(() => {
editClearButton.classList.remove('click-button');
}, 1000); // 1000 milliseconds = 1 second

switch (Page) {
case 1:
document.getElementById('textLocation').value = "";
break;

case 2:
NPCs.clearForm(Ref.npcForm);
break;

case 3:
NPCs.clearForm(Ref.monsterForm);
break;

case 4:
NPCs.clearForm(Ref.itemForm);
break;

case 5:
NPCs.clearForm(Ref.spellsForm);
break;

case 6:
NPCs.clearForm(Ref.ambienceForm);
break;

default:

break;
}}

handleeditMoveButtonButtonClick(){

if (!Edit.moveMode) {
Edit.moveMode = true;
editMoveButton.classList.add('click-button');

} else {
if (Edit.editMode) {
Edit.moveMode = false;
editMoveButton.classList.remove('click-button');

}}};

handleeditDeleteButtonClick(){
Edit.deleteLocation();
};

handleNextButtonClick(){
if (Edit.editPage < 6) {
Edit.editPage = Edit.editPage + 1;
Edit.pageChange(Edit.editPage);
}};

handleeditPrevButtonButtonClick(){

if (Edit.editPage > 1) {
Edit.editPage = Edit.editPage - 1;
Edit.pageChange(Edit.editPage)
}};

handleexportDataClick(){
Array.exportNPCArrayToCSV();
}

handleimportDataClick(){
const CSVfileInput = document.getElementById('csvFileInput');
CSVfileInput.click();
}

};

const toolbar = new Toolbar();
toolbar.init(); // Initialize the toolbar

export default toolbar;