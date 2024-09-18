
import editor from "./editor.js"; 
import form from "./form.js";
import Map from "./map.js";
import toolbar from "./toolbar.js";
import Ref from "./ref.js";

class Hotkeys{

init() {

document.addEventListener('keydown', (event) => {
const key = event.key.toLowerCase(); // Convert the pressed key to lowercase

if (key === 'escape') {
toolbar.escButton();
}


if (
    !Ref.Centre.contains(document.activeElement) && 
    !Ref.Right.contains(document.activeElement) &&
    !Ref.Storyteller.contains(document.activeElement) &&
    !Ref.Left.contains(document.activeElement) &&
    !Ref.leftParty.contains(document.activeElement) &&
    !Ref.promptBox.contains(document.activeElement) && 
    !Ref.queryWindow.contains(document.activeElement)

    ) {

switch (key) {
case 'p':
partyButton.click();
break;
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
case 'l':
    dataButton.click();
    break;
case ',':
    Map.increaseOpacity();
    break
 case '.':
    Map.decreaseOpacity();
 break;
 case 'n':
    newButton.click();
    break;
case 'd':
    deleteButton.click();
    break;
case 'q':
    if(Ref.queryWindow.style.display === 'flex'){
    Ref.queryWindow.style.display = 'none'; 
    }else{
    Ref.queryWindow.style.display = 'flex';
    }
break;

}

}

});  



}


};

const hotkeys = new Hotkeys();
hotkeys.init(); 
export default hotkeys;

