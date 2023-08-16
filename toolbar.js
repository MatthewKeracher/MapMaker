//Toolbar.js

import Map from "./map.js";
import Add from "./add.js";

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

}

const toolbar = new Toolbar();
toolbar.init(); // Initialize the toolbar

export default toolbar;