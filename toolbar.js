//Toolbar.js
import ref from "./ref.js";
import Map   from "./map.js";
import Add   from "./add.js";
import editor from "./editor.js";
import Events from "./events.js";
import load from "./load.js";
import save   from "./save.js";
import Storyteller from "./storyteller.js";

class Toolbar{

init() {   

toolbar.getStoredData();
ref.editToolbar.style.display = 'none';
Storyteller.showTownText();

//Readme.
// ref.Storyteller.innerHTML = 
// `<span class="withbreak">
// Welcome to Excel_DM, a hypertextual Game Master worldbuilding and game running tool.

// All you need to do to being is select [M]ap button and load an image file. [D]ata is loaded from, and saved to a .json file.

// *Link to Library*

// Matthew Keracher, 2024.
// keracher@uwm.edu
// </span>
// `;

//editor.addPredictiveContent();
editor.init();

Events.loadEventListeners();

//Ambience.getAmbience();

//mainToolbar
ref.mapButton.addEventListener('click', this.mapButton);
ref.dataButton.addEventListener('click', this.dataButton);
ref.addButton.addEventListener('click', this.addButon); 
ref.editButton.addEventListener('click', this.editButton);
ref.saveButton.addEventListener('click', this.saveButton);  
ref.fileInput.addEventListener('change', load.loadSaveFile); 

//editToolbar
ref.editEditButton.addEventListener('click', this.editButton);
ref.editSaveButton.addEventListener('click', this.saveFormButton);
ref.editNewButton.addEventListener('click', this.newButton); 
ref.editDeleteButton.addEventListener('click', this.deleteFormButton);

toolbar.saveToBrowser();

};

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

// if(editor.editMode === true){
// Ref.mainToolbar.style.display = "none";
// Ref.editToolbar.style.display = "flex";
// } else if (editor.editMode === false){
// Ref.mainToolbar.style.display = "flex";
// Ref.editToolbar.style.display = "none";
// }

if(load.fileName !== ''){
ref.locationLabel.textContent = load.fileName;
ref.Storyteller.innerHTML = '';

Storyteller.showTownText();
    

}else{
//   
}

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

editEditButton.classList.add('click-button');

//Switch Toolbars
ref.mainToolbar.style.display = 'none';
ref.editToolbar.style.display = 'flex';

//By default, load Location in Form

const obj = load.Data.locations.find(obj => obj.name === ref.locationLabel.textContent);

if(obj && ref.Left.style.display === 'none'){
editor.createForm(obj);
}
//Ref.locationLabel.textContent = load.fileName;

//Hide Storyteller
//Ref.eventManager.style.display = 'none';
//Ref.locationLabel.style.display = 'none';


//Show Editor loadLists()
ref.Editor.style.display = 'block';
//Ref.Centre.style.display = 'block';
//Ref.Left.style.display = 'block';


//List Display Variables
this.sectionHeadDisplay = 'none',
this.subSectionHeadDisplay = 'none',
this.subSectionEntryDisplay =  'none',
this.EntryDisplay = 'none',
editor.loadList(load.Data);



// Add the event listeners to each .selection element
ref.locationDivs.forEach((div) => {
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
ref.eventManager.style.display = 'block';
ref.Storyteller.style.display = 'block';
ref.Storyteller.innerHTML = '';

Storyteller.refreshLocation();

if(ref.Storyteller.innerHTML === ''){
Storyteller.showTownText();
}

//Hide Editor, Centre, Left
ref.Editor.style.display = 'none';
ref.Centre.style.display = 'none';
ref.Left.style.display = 'none';

//Switch Toolbars
ref.mainToolbar.style.display = 'flex';
ref.editToolbar.style.display = 'none';

// Remove the event listeners from each .selection element
ref.locationDivs.forEach((div) => {
div.removeEventListener('mouseenter', editor.handleMouseHover);
div.removeEventListener('mouseleave', editor.handleMouseHover);
});
}}};

saveButton(){
//Save this form.

if(ref.Centre.style.display === 'block'){
editSaveButton.classList.add('click-button');
setTimeout(() => {
editSaveButton.classList.remove('click-button');
}, 1000); // 1000 milliseconds = 1 second

save.saveDataEntry();

//Save whole file.
}else{

saveButton.classList.add('click-button');
setTimeout(() => {
saveButton.classList.remove('click-button');
}, 1000); // 1000 milliseconds = 1 second

save.exportArray();
};
}

saveFormButton(){

editSaveButton.classList.add('click-button');
setTimeout(() => {
editSaveButton.classList.remove('click-button');
}, 1000); // 1000 milliseconds = 1 second


save.saveDataEntry();


}

newButton(){

editNewButton.classList.add('click-button');
setTimeout(() => {
editNewButton.classList.remove('click-button');
}, 1000); // 1000 milliseconds = 1 second

//Select a header type and it will generate a blank version. 
editor.makeNew = true;
ref.eventManager.value = '';

    editor.sectionHeadDisplay = 'none'
    editor.subSectionHeadDisplay = 'none'
    editor.subSectionEntryDisplay =  'none'
    editor.EntryDisplay = 'none'
    
editor.loadList(load.Data);

}

deleteFormButton(){
save.deleteDataEntry();
};

getStoredData(){

if (localStorage.getItem('myData')) {
let storedData = localStorage.getItem('myData');
let parsedData = JSON.parse(storedData);
load.Data = parsedData;
Storyteller.townText = load.Data.townText.description;
locationLabel.textContent = load.Data.townText.name;
load.fileName = load.Data.townText.name;
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