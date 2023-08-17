//Toolbar.js

import Map   from "./map.js";
import Add   from "./add.js";
import Array from "./array.js";

class Toolbar{

init() {

const mapButton = document.getElementById('mapButton');
mapButton.addEventListener('click', this.handleMapButtonClick);

const dataButton = document.getElementById('dataButton');
dataButton.addEventListener('click', this.handleDataButtonClick);

const addButton = document.getElementById('addButton');
addButton.addEventListener('click', this.handleAddButtonClick); 

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
// Add the event listeners
Add.addMode = true;
addButton.classList.add('click-button');
mapElement.addEventListener('mousedown', Add.handleMouseDown);
mapElement.addEventListener('mousemove', Add.handleMouseMove);
mapElement.addEventListener('mouseup', Add.handleMouseUp);
}else{if(Add.addMode){
// Remove the event listeners
Add.addMode = false;
addButton.classList.remove('click-button');
mapElement.removeEventListener('mousedown', Add.handleMouseDown);
mapElement.removeEventListener('mousemove', Add.handleMouseMove);
mapElement.removeEventListener('mouseup', Add.handleMouseUp);
}}



};

handleSaveButtonClick(){

const projectName = prompt('Enter the project name:');
if (projectName) {
        
    // Export the array and download the image
    Array.exportArray(projectName);
    //Array.downloadImage(projectName + '.png');

}
};
   

}

const toolbar = new Toolbar();
toolbar.init(); // Initialize the toolbar

export default toolbar;