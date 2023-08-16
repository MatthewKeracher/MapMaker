//Toolbar.js

import Map from "./map.js";

class Toolbar{

init() {

const newButton = document.getElementById('newButton');
newButton.addEventListener('click', this.handleNewButtonClick);

const addButton = document.getElementById('addButton');
addButton.addEventListener('click', this.handleAddButtonClick); 

}

handleNewButtonClick() {  
Map.fetchAndProcessImage()
};

handleAddButtonClick() {

console.log(Map.addMode)
const mapElement = document.getElementById('mapElement');

if(!Map.addMode){
// Add the event listeners
Map.addMode = true;
addButton.classList.add('click-button');
mapElement.addEventListener('mousedown', Map.handleMouseDown);
mapElement.addEventListener('mousemove', Map.handleMouseMove);
mapElement.addEventListener('mouseup', Map.handleMouseUp);
}else{if(Map.addMode){
// Remove the event listeners
Map.addMode = false;
addButton.classList.remove('click-button');
mapElement.removeEventListener('mousedown', Map.handleMouseDown);
mapElement.removeEventListener('mousemove', Map.handleMouseMove);
mapElement.removeEventListener('mouseup', Map.handleMouseUp);
}}



};

}

const toolbar = new Toolbar();
toolbar.init(); // Initialize the toolbar

export default toolbar;