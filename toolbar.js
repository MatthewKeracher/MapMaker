//Toolbar.js

import Map   from "./map.js";
import Add   from "./add.js";
import Array from "./array.js";
import Edit from "./edit.js";

class Toolbar{

init() {


//toolbarMain
const mapButton = document.getElementById('mapButton');
mapButton.addEventListener('click', this.handleMapButtonClick);

const dataButton = document.getElementById('dataButton');
dataButton.addEventListener('click', this.handleDataButtonClick);

const addButton = document.getElementById('addButton');
addButton.addEventListener('click', this.handleAddButtonClick); 

const editButton = document.getElementById('editButton');
editButton.addEventListener('click', this.handleEditButtonClick);

const saveButton = document.getElementById('saveButton');
saveButton.addEventListener('click', this.handleSaveButtonClick);  

const fileInput = document.getElementById('fileInput'); // Add this line
fileInput.addEventListener('change', Array.handleFileInputChange); // Use "Array" here

//toolbarEdit
const editEditButton = document.getElementById('editEditButton');
editEditButton.addEventListener('click', this.handleEditButtonClick);

const editSaveButton = document.getElementById('editSaveButton');
editSaveButton.addEventListener('click', this.handleeditSaveButtonButtonClick);

const editMoveButton = document.getElementById('editMoveButton');
editMoveButton.addEventListener('click', this.handleeditMoveButtonButtonClick); 

const editDeleteButton = document.getElementById('editDeleteButton');
editDeleteButton.addEventListener('click', this.handleeditDeleteButtonButtonClick);

}

handleMapButtonClick() {  
Map.fetchAndProcessImage()
};

handleDataButtonClick() {

// Trigger the hidden file input element
const fileInput = document.getElementById('fileInput');
fileInput.click();


};

handleAddButtonClick() {

//console.log(Add.addMode)
const mapElement = document.getElementById('mapElement');

if(!Add.addMode){

Add.addMode = true;
addButton.classList.add('click-button');

    // Add the event listeners
    mapElement.addEventListener('mousedown', Add.handleMouseDown);
    mapElement.addEventListener('mousemove', Add.handleMouseMove);
    mapElement.addEventListener('mouseup', Add.handleMouseUp);

// Disable pointer events on the locations and mainToolbar while dragging
const mainToolbar = document.querySelector('.mainToolbar');        
mainToolbar.style.pointerEvents = 'none';


const selectionList = document.querySelectorAll('.selection');
selectionList.forEach((selection) => {
    selection.style.pointerEvents = 'none';
});



}else{if(Add.addMode){

Add.addMode = false;
addButton.classList.remove('click-button');

    // Remove the event listeners
    mapElement.removeEventListener('mousedown', Add.handleMouseDown);
    mapElement.removeEventListener('mousemove', Add.handleMouseMove);
    mapElement.removeEventListener('mouseup', Add.handleMouseUp);

// Enable pointer events on the locations and mainToolbar after dragging
const mainToolbar = document.querySelector('.mainToolbar');        
mainToolbar.style.pointerEvents = 'auto';

const selectionList = document.querySelectorAll('.selection');
selectionList.forEach((selection) => {
selection.style.pointerEvents = 'auto';

});
}}



};

handleEditButtonClick() {

const divs = document.querySelectorAll('.selection'); // Select all elements with the .selection class
const EditorContainer = document.querySelector('.EditorContainer');
const Storyteller = document.querySelector('.Storyteller');
const editToolbar = document.getElementById('editToolbar');
const mainToolbar = document.getElementById('mainToolbar');

if (!Edit.editMode) {
Edit.editMode = true;
editEditButton.classList.add('click-button');

//Show Edit Sidebar
EditorContainer.style.display = 'flex';
Storyteller.style.display = 'none';
//Switch Toolbars
mainToolbar.style.display = 'none';
editToolbar.style.display = 'flex';

// Add the event listeners to each .selection element
divs.forEach((div) => {
div.addEventListener('mouseenter', Edit.handleMouseHover);
div.addEventListener('mouseleave', Edit.handleMouseHover);
});
} else {
if (Edit.editMode) {
Edit.editMode = false;
editEditButton.classList.remove('click-button');

//Show Edit Sidebar
EditorContainer.style.display = 'none';
Storyteller.style.display = 'flex';
//Switch Toolbars
mainToolbar.style.display = 'flex';
editToolbar.style.display = 'none';

// Remove the event listeners from each .selection element
divs.forEach((div) => {
div.removeEventListener('mouseenter', Edit.handleMouseHover);
div.removeEventListener('mouseleave', Edit.handleMouseHover);
});
}
}
}

handleSaveButtonClick(){

    Array.exportArray();
    
};  

handleeditSaveButtonButtonClick(){

Edit.saveLocation();

};

handleeditMoveButtonButtonClick(){

if (!Edit.moveMode) {
    Edit.moveMode = true;
    editMoveButton.classList.add('click-button');
    
} else {
if (Edit.editMode) {
    Edit.moveMode = false;
    editMoveButton.classList.remove('click-button');

}}};

handleeditDeleteButtonButtonClick(){

Edit.deleteLocation();

};

}

const toolbar = new Toolbar();
toolbar.init(); // Initialize the toolbar

export default toolbar;