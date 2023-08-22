import Array from "./array.js";
import Storyteller from "./storyteller.js";

const Edit = {

    editMode : false,
    moveMode: false,
    editPage: 1,

// Delete a Location
deleteLocation() {
    const locationLabel = document.querySelector('.locationLabel');
    const divId = locationLabel.textContent;

    const matchingEntryIndex = Array.locationArray.findIndex(entry => entry.divId === divId);

    if (matchingEntryIndex !== -1) {
        const confirmation = window.confirm("Are you sure you want to delete this location?");
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
},

// Move a Location -- Unfinished
moveLocation(source,target) {

    if (!Edit.moveMode) {
        
        
    } else {

    if (Edit.editMode) { 

    const locationLabel = document.querySelector('.locationLabel');
    const sourceDivId = locationLabel.textContent;

    console.log('Moving ' + targetDivId + ' to ' + sourceDivId)

    const sourceEntry = Array.locationArray.find(entry => entry.divId === sourceDivId);
    const targetEntryIndex = Array.locationArray.find(entry => entry.divId === targetDivId);

    if (sourceEntry !== -1 && targetEntryIndex !== -1) {
        const sourceEntry = Array.locationArray[sourceEntry];
        const targetEntry = Array.locationArray[targetEntryIndex];

        // Copy information from sourceEntry to targetEntry
        targetEntry.player = sourceEntry.player;
        targetEntry.gm = sourceEntry.gm;
        targetEntry.misc = sourceEntry.misc;

        // Optionally, you can clear the source entry information
        sourceEntry.player = '';
        sourceEntry.gm = '';
        sourceEntry.misc = '';
    }

    editMoveButton.click();

}}},

// Save a Location
saveLocation() {
const locationLabel = document.querySelector('.locationLabel');
const divId = locationLabel.textContent; // Get the divId for the location you're saving

//Places that have info we want to save...
const editLocationName = document.querySelector('.editLocationName').value;
const editPlayerText = document.getElementById('editPlayerText').value; // Get the value of the input field
const editGMText = document.getElementById('editGMText').value;
const editMiscText = document.getElementById('editMiscText').value;
//Find correct place to save...
const matchingEntry = Array.locationArray.find(entry => entry.divId === divId);


if (matchingEntry) {
    // Update the corresponding entry in locationArray
    matchingEntry.player = editPlayerText;
    matchingEntry.gm = editGMText;
    matchingEntry.misc = editMiscText;
    matchingEntry.divId = editLocationName;
    //Update the Existing Divs
    const locationDiv = document.getElementById(divId);
    locationDiv.setAttribute('id',editLocationName);
    locationDiv.querySelector('.div-id-label').textContent = editLocationName;

    console.log("Updated Entry: " + JSON.stringify(matchingEntry, null, 2));

    //Refresh
    const savedLocation = document.getElementById(editLocationName);
    Storyteller.changeContent(savedLocation);

}
}, 

//Remove or Add editContainer contents depending on editPage no.
pageChange(newPage){

const player = document.getElementById('editPlayerText')
const playerLabel = document.getElementById('playerLabel')

const gm = document.getElementById('editGMText')
const gmLabel = document.getElementById('gmLabel')

const misc = document.getElementById('editMiscText')
const miscLabel = document.getElementById('miscLabel')

switch (newPage) {
    case 1:

      //Show
      playerLabel.style.display = "flex";
      player.style.display = "flex";

      //Hide
      gmLabel.style.display = "none";
      gm.style.display = "none";
      miscLabel.style.display = "none";
      misc.style.display = "none";
      break;
      
    case 2:

      //Show
      gmLabel.style.display = "flex";
      gm.style.display = "flex";


      //Hide
 
      playerLabel.style.display = "none";
      player.style.display = "none";
      miscLabel.style.display = "none";
      misc.style.display = "none";
      break;
      
    case 3:

      //Show
      miscLabel.style.display = "flex";
      misc.style.display = "flex";

      //Hide
      playerLabel.style.display = "none";
      player.style.display = "none";
      gmLabel.style.display = "none";
      gm.style.display = "none";

      break;
      
    default:
      // Handle any other cases
      break;
  }
console.log('Changed Page to ' + newPage)


},

};
    
export default Edit;