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

class Toolbar{

init() {   


toolbar.getStoredData();
Storyteller.showmiscInfo();


//editor.addPredictiveContent();

Events.loadEventListeners();

//Ambience.getAmbience();

//mainToolbar
ref.partyButton.addEventListener('click', this.partyButton);
ref.mapButton.addEventListener('click', this.mapButton);
ref.dataButton.addEventListener('click', this.dataButton);
ref.addButton.addEventListener('click', this.addButon); 
ref.editButton.addEventListener('click', this.editButton);
ref.saveButton.addEventListener('click', this.saveButton);  
ref.fileInput.addEventListener('change', load.loadSaveFile); 
ref.newButton.addEventListener('click', this.newButton); 
ref.deleteButton.addEventListener('click', this.deleteButton);

toolbar.saveToBrowser();

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
ref.locationLabel.textContent = load.fileName;
ref.Storyteller.innerHTML = '';

Storyteller.showmiscInfo();
    

}else{
//   
}

}else {
ref.Centre.style.display = "none";
ref.Left.style.display = "none";

}

};

readMe(){
const readMe =
`<span class="withbreak">
Welcome to Excel_DM, a hypertextual Game Master worldbuilding and game running tool.

All you need to do to being is select [M]ap button and load an image file. [D]ata is loaded from, and saved to a .json file.

*Link to Library*

Matthew Keracher, 2024.
keracher@uwm.edu
</span>
`;

return readMe
}

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

if(!Add.addMode){
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

}else{if(Add.addMode){

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

const obj = load.Data.locations.find(obj => obj.name === ref.locationLabel.textContent);

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

if(ref.Centre.style.display === 'block'){
//Save whole file.
save.saveDataEntry();

}else{
//Save whole file.
save.exportArray();
};
}

getStoredData(){

if (localStorage.getItem('myData')) {
let storedData = localStorage.getItem('myData');
let parsedData = JSON.parse(storedData);
load.Data = parsedData;
Storyteller.miscInfo = load.Data.miscInfo.description? load.Data.miscInfo.description: toolbar.readMe();
locationLabel.textContent = load.Data.miscInfo.fileName;
load.fileName = load.Data.miscInfo.fileName;
} 

}

saveToBrowser(){

window.addEventListener('beforeunload', function() {
localStorage.setItem('myData', JSON.stringify(load.Data));
});
    
}

};

const toolbar = new Toolbar();
toolbar.init(); // Initialize the toolbar

export default toolbar;