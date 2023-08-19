
class Hotkeys{

init() {

document.addEventListener('keydown', (event) => {
const key = event.key.toLowerCase(); // Convert the pressed key to lowercase
const EditorContainer = document.querySelector('.EditorContainer');

if (!EditorContainer.contains(document.activeElement)) {
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

// Add more cases for additional hotkeys here
}
}
});  

}

}

const hotkeys = new Hotkeys();
hotkeys.init(); 
export default hotkeys;

