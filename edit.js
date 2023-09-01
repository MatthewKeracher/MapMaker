import Ref from "./ref.js";
import Array from "./array.js";
import Storyteller from "./storyteller.js";
import NPCs from "./npcs.js";

const Edit = {

    editMode : false,
    moveMode: false,
    editPage: 1,

    filterEmptyEntries(npcArray) {
      return npcArray.filter(npc => {
          // Check if any of the key values is not an empty string
          for (const key in npc) {
              if (npc.hasOwnProperty(key) && npc[key] !== "") {
                  return true;
              }
          }
          return false;
      });
  },
  


    deleteLocation() {
      switch (this.editPage) {
        case 2:
          const npcName = document.getElementById('npcName').value;
          const npcIndex = NPCs.npcArray.findIndex(npc => npc.name === npcName);
          const npcForm = document.getElementById('npcForm');
      
          if (npcIndex !== -1) {
              const confirmation = window.confirm("Are you sure you want to delete this NPC?");
              if (confirmation) {
                  NPCs.npcArray.splice(npcIndex, 1); // Remove NPC from npcArray
      
                  // Filter and update npcArray to remove empty entries
                  //NPCs.npcArray = this.filterEmptyEntries(NPCs.npcArray);
      
                  NPCs.loadNPC(); // Refresh the NPC form with updated npcArray
                  npcForm.reset(); // Call the reset() method to clear the form fields
              }
          }
          break;
                   
          default:
            // For any other case
            const divId = Ref.locationLabel.textContent;

            const matchingEntryIndex = Array.locationArray.findIndex(entry => entry.divId === divId);

            if (matchingEntryIndex !== -1) {
                const confirmation = window.confirm("Are you sure you want to delete this entry?");
                if (confirmation) {
                    // Remove the entry from locationArray
                    Array.locationArray.splice(matchingEntryIndex, 1);

                    // Remove the corresponding <div> element from the DOM
                    const divToRemove = document.getElementById(divId);
                    if (divToRemove) {
                        divToRemove.remove();
                    }
                }
            }
            break;
    }

      
  },

// Move a Location -- Unfinished
moveLocation(source,target) {

    if (!Edit.moveMode) {
        
        
    } else {

    if (Edit.editMode) { 

    const sourceDivId = Ref.locationLabel.textContent;

    console.log('Moving ' + targetDivId + ' to ' + sourceDivId)

    const sourceEntry = Array.locationArray.find(entry => entry.divId === sourceDivId);
    const targetEntryIndex = Array.locationArray.find(entry => entry.divId === targetDivId);

    if (sourceEntry !== -1 && targetEntryIndex !== -1) {
        const sourceEntry = Array.locationArray[sourceEntry];
        const targetEntry = Array.locationArray[targetEntryIndex];

        // Copy information from sourceEntry to targetEntry
        targetEntry.player = sourceEntry.player;


        // Optionally, you can clear the source entry information
        sourceEntry.player = '';

    }

    editMoveButton.click();

}}},

// Save a Location
saveLocation() {
const divId = Ref.locationLabel.textContent; // Get the divId for the location you're saving

// Get the spreadsheet data
const spreadsheetData = [];
const spreadsheetCells = document.querySelectorAll('.spreadsheet td input');
spreadsheetCells.forEach(input => {
  const cell = input.parentNode;
  const row = cell.parentNode.rowIndex //- 1; // Adjust for skipping the column headers
  const col = cell.cellIndex //- 1; // Adjust for skipping the row numbers
  const content = input.value.trim(); // Trim whitespace
  //console.log(content)
  if (content !== "") { // Skip empty cells
    const cellData = {
      row: row,
      col: col,
      content: content
    };
    spreadsheetData.push(cellData);
  }
});


//Find correct place to save...
const matchingEntry = Array.locationArray.find(entry => entry.divId === divId);


if (matchingEntry) {
    // Update the corresponding entry in locationArray
    matchingEntry.player = Ref.textLocation.value;
    matchingEntry.divId = Ref.editLocationName.value;

            //Update the spreadsheet data
            matchingEntry.spreadsheetData = spreadsheetData;

    //Update the Existing Divs
    const locationDiv = document.getElementById(divId);
    locationDiv.setAttribute('id',Ref.editLocationName.value);
    locationDiv.querySelector('.div-id-label').textContent = Ref.editLocationName.value;

    //console.log("Updated Entry: " + JSON.stringify(matchingEntry, null, 2));

    //Refresh
    const savedLocation = document.getElementById(Ref.editLocationName.value);
    Storyteller.changeContent(savedLocation);

}

// Update the new location name in npcArray!

for (const npc of NPCs.npcArray) {
  if (npc.MorningLocation === divId) {
    npc.MorningLocation = Ref.editLocationName.value;
  }
  if (npc.AfternoonLocation === divId) {
    npc.AfternoonLocation = Ref.editLocationName.value;
  }
  if (npc.NightLocation === divId) {
    npc.NightLocation = Ref.editLocationName.value;
  }
}



}, 

//Remove or Add editContainer contents depending on editPage no.
pageChange(newPage){

NPCs.fixDisplay();


switch (newPage) {
case 1:

//Show
Ref.editLocationName.style.display  = "flex";
Ref.textLocationLabel.style.display = "flex";
Ref.textLocation.style.display = "flex";

//Hide
Ref.npcForm.style.display = "none"
Ref.tableForm.style.display = "none";
Ref.AmbienceContainer.style.display = "none";
break;

case 2:
//Show
Ref.npcForm.style.display = "flex"


//Hide
Ref.editLocationName.style.display  = "none";
Ref.textLocationLabel.style.display = "none";
Ref.textLocation.style.display = "none";
Ref.tableForm.style.display = "none";
Ref.AmbienceContainer.style.display = "none";

NPCs.loadNPC();

break;

case 3:

//Show
Ref.tableForm.style.display = "flex";


//Hide
Ref.npcForm.style.display = "none"
Ref.editLocationName.style.display  = "none";
Ref.textLocationLabel.style.display = "none";
Ref.textLocation.style.display = "none";

Ref.AmbienceContainer.style.display = "none";
break;

case 4:
//Show
Ref.AmbienceContainer.style.display = "flex";

//Hide
Ref.npcForm.style.display = "none"
Ref.tableForm.style.display = "none";
Ref.editLocationName.style.display  = "none";
Ref.textLocationLabel.style.display = "none";
Ref.textLocation.style.display = "none";

break;

default:
// Handle any other cases
break;
}

},

generateTable(){

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
        //Hotkeys.spreadsheetHotkeys();
     // });
    //});
  }



};
    
export default Edit;