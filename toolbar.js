//Toolbar.js

import Map   from "./map.js";
import Add   from "./add.js";
import Array from "./array.js";
import Edit from "./edit.js";
import Ambience from "./ambience.js";
import Hotkeys from "./hotkeys.js";
import NPCs from "./npcs.js";
import Storyteller from "./storyteller.js";
import Monsters from "./monsters.js";

class Toolbar{

init() {

Ambience.initializeAmbienceDropdowns();
Monsters.addPredictiveMonsters();

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

//bottomToolbar

const nextButton = document.getElementById('nextButton');
nextButton.addEventListener('click', this.handleNextButtonClick);

const prevButton = document.getElementById('prevButton');
prevButton.addEventListener('click', this.handleeditPrevButtonButtonClick);

//table maker

const generateTableButton = document.getElementById('generateTable');
generateTableButton.addEventListener('click', this.handleeditgenerateTableButtonClick);
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
const LocationName = document.getElementById('locationLabel');
const Storyteller = document.querySelector('.Storyteller');
const editToolbar = document.getElementById('editToolbar');
const mainToolbar = document.getElementById('mainToolbar');
const bottomToolbar = document.getElementById('bottomToolbar');

const EditorContainer = document.querySelector('.EditorContainer');
const editLocationName = document.querySelector('.editLocationName');

Edit.editPage = 1;

if (!Edit.editMode) {
Edit.editMode = true;
editEditButton.classList.add('click-button');

//Hide Storyteller, pageChange()
Edit.pageChange(Edit.editPage)
EditorContainer.style.display = 'flex';
editLocationName.style.display = 'flex';
Storyteller.style.display = 'none';
LocationName.style.display = 'none';
//Switch Toolbars
mainToolbar.style.display = 'none';
editToolbar.style.display = 'flex';
bottomToolbar.style.display = 'flex';

// Add the event listeners to each .selection element
divs.forEach((div) => {
div.addEventListener('mouseenter', Edit.handleMouseHover);
div.addEventListener('mouseleave', Edit.handleMouseHover);
});
} else {
if (Edit.editMode) {
Edit.editMode = false;
editEditButton.classList.remove('click-button');

//Show Storyteller, pageChange()
Edit.pageChange(1);
EditorContainer.style.display = 'none';
editLocationName.style.display = 'none';
Storyteller.style.display = 'flex';
LocationName.style.display = 'flex';
//Switch Toolbars
mainToolbar.style.display = 'flex';
editToolbar.style.display = 'none';
bottomToolbar.style.display = 'none';

// Remove the event listeners from each .selection element
divs.forEach((div) => {
div.removeEventListener('mouseenter', Edit.handleMouseHover);
div.removeEventListener('mouseleave', Edit.handleMouseHover);
});
}
}
};

handleSaveButtonClick(){

    Array.exportArray();
    
};  

handleeditSaveButtonButtonClick(){

Edit.saveLocation();
NPCs.saveNPC();
NPCs.loadNPC();

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

handleNextButtonClick(){

    if (Edit.editPage < 5) {
        Edit.editPage = Edit.editPage + 1;
        Edit.pageChange(Edit.editPage);
    }

};

handleeditPrevButtonButtonClick(){

    if (Edit.editPage > 1) {
        Edit.editPage = Edit.editPage - 1;
        Edit.pageChange(Edit.editPage)
        console.log(Edit.editPage)
    }

};

handleeditgenerateTableButtonClick(){

//document.addEventListener("DOMContentLoaded", function () {
    //const generateTableButton = document.getElementById("generateTable");
  
    //generateTableButton.addEventListener("click", function () {
      const tableContainer = document.getElementById("tableContainer");
      const numRows = parseInt(document.getElementById("numRows").value);
      const numCols = parseInt(document.getElementById("numCols").value);
  
      const table = document.createElement("table");
      table.classList.add("spreadsheet");
  
      // Create a row for column labels
      const labelRow = document.createElement("tr");
      for (let j = 1; j <= numCols; j++) { // Start at 1 to skip the first column
        const cell = document.createElement("td");
        const input = document.createElement("input");
        input.type = "text";
        
        
        // Add an event listener for column header editing
        input.addEventListener("blur", function () {
          cell.value = input.value;
        });
        
        cell.appendChild(input);
        labelRow.appendChild(cell);
      }
      table.appendChild(labelRow);
  
      // Create data rows
      for (let i = 1; i <= numRows; i++) { // Start at 1 to skip the first row
      const row = document.createElement("tr");
      for (let j = 1; j <= numCols; j++) {
      const cell = document.createElement("td");
      const input = document.createElement("input");
      input.type = "text";

      // Add an event listener for cell editing
      input.addEventListener("blur", function () {
      cell.textContent = input.value;
      });

      // Set the ID based on x and y coordinates
      input.id = `cell-${i}-${j}`;

      cell.appendChild(input);
      row.appendChild(cell);
      }
      table.appendChild(row);
      }
  
      tableContainer.innerHTML = ""; // Clear previous content
      tableContainer.appendChild(table);
      Hotkeys.spreadsheetHotkeys();
   // });
  //});
};



};

const toolbar = new Toolbar();
toolbar.init(); // Initialize the toolbar

export default toolbar;