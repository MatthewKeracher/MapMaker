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

        try{
        const selection = document.querySelector('.selection');
        selection.style.pointerEvents = 'none';}
        catch{}


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

        try{
        const selection = document.querySelector('.selection');
        selection.style.pointerEvents = 'auto';}
        catch{}
}}



};

handleEditButtonClick(){

//console.log(Edit.editMode)

if(!Edit.editMode){

Edit.editMode = true;
editButton.classList.add('click-button');

}else{if(Edit.editMode){

Edit.editMode = false;
editButton.classList.remove('click-button');

}
}
};

handleSaveButtonClick(){

    Array.exportArray();
    
};

  

}

const toolbar = new Toolbar();
toolbar.init(); // Initialize the toolbar

export default toolbar;