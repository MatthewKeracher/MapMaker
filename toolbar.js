//Toolbar.js

import Map   from "./map.js";
import Add   from "./add.js";
import Array from "./array.js";
import Edit from "./edit.js";

class Toolbar{

init() {

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

// Disable pointer events on the locations and toolbar while dragging
const toolbar = document.querySelector('.toolbar');        
toolbar.style.pointerEvents = 'none';


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

// Enable pointer events on the locations and toolbar after dragging
const toolbar = document.querySelector('.toolbar');        
toolbar.style.pointerEvents = 'auto';

const selectionList = document.querySelectorAll('.selection');
selectionList.forEach((selection) => {
selection.style.pointerEvents = 'auto';

});
}}



};

handleEditButtonClick() {

const divs = document.querySelectorAll('.selection'); // Select all elements with the .selection class
const editBox = document.querySelector('.textbox-container');

if (!Edit.editMode) {
Edit.editMode = true;
editButton.classList.add('click-button');

//Show Edit Sidebar
editBox.style.display = 'flex';

// Add the event listeners to each .selection element
divs.forEach((div) => {
div.addEventListener('mouseenter', Edit.handleMouseHover);
div.addEventListener('mouseleave', Edit.handleMouseHover);
});
} else {
if (Edit.editMode) {
Edit.editMode = false;
editButton.classList.remove('click-button');

//Show Edit Sidebar
editBox.style.display = 'none';

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

}

const toolbar = new Toolbar();
toolbar.init(); // Initialize the toolbar

export default toolbar;