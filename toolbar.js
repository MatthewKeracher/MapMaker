//Toolbar.js

import Map   from "./map.js";
import Add   from "./add.js";
import Array from "./array.js";

class Toolbar{

init() {

const newButton = document.getElementById('newButton');
newButton.addEventListener('click', this.handleNewButtonClick);

const addButton = document.getElementById('addButton');
addButton.addEventListener('click', this.handleAddButtonClick); 

const saveButton = document.getElementById('saveButton');
saveButton.addEventListener('click', this.handleSaveButtonClick); 

const loadButton = document.getElementById('loadButton');
loadButton.addEventListener('click', this.handleLoadButtonClick); 

const fileInput = document.getElementById('fileInput'); // Add this line
fileInput.addEventListener('change', Array.handleFileInputChange); // Use "Array" here

}

handleNewButtonClick() {  
Map.fetchAndProcessImage()
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
    // Update the title container with the project name
    const projectTitleElement = document.getElementById('projectTitle');
    projectTitleElement.textContent = projectName;
    
    // Export the array and download the image
    Array.exportArray(projectName);
    Array.downloadImage(projectName + '.png');
}
};

handleLoadButtonClick() {
    // Trigger the hidden file input element
    const fileInput = document.getElementById('fileInput');
    fileInput.click();
};


    

}

const toolbar = new Toolbar();
toolbar.init(); // Initialize the toolbar

export default toolbar;