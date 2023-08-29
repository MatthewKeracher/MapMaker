
import Edit from "./edit.js";
import Map from "./map.js";

class Hotkeys{

init() {

document.addEventListener('keydown', (event) => {
const key = event.key.toLowerCase(); // Convert the pressed key to lowercase
const Sidebar = document.querySelector('.sidebar');
const editMode = Edit.editMode

if (!Sidebar.contains(document.activeElement)) {

if (!editMode){
switch (key) {
case 'm':
    mapButton.click();
    break;
case 'a':
    addButton.click();
    break;
case 's':
    saveButton.click();
    break;
case 'e':
    editButton.click();
    break;
case 'd':
    dataButton.click();
    break;
case ',':
    Map.increaseOpacity();
    break
 case '.':
    Map.decreaseOpacity();
 break;

// Add more cases for additional hotkeys here
}
}else{if(editMode){
switch (key) {
case 'e':
    editButton.click();
    break;
case 's':
    editSaveButton.click();
    break;
case 'c':
    editClearButton.click();
    break;
case 'd':
    editDeleteButton.click();
    break;
case 'n':
    nextButton.click();
break;
case 'p':
    prevButton.click();
break;

}}}

}


});  



}

spreadsheetHotkeys() {
   

}

};

const hotkeys = new Hotkeys();
hotkeys.init(); 
export default hotkeys;

