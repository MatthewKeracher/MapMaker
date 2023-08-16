
class Hotkeys{

init() {

document.addEventListener('keydown', (event) => {
const key = event.key.toLowerCase(); // Convert the pressed key to lowercase

switch (key) {
case 'n':
    // Simulate a click on the New Image button
    newButton.click();
    break;
case 'a':
    // Simulate a click on the Add button
    addButton.click();
    break;
// Add more cases for additional hotkeys here
}
});  

}

}

const hotkeys = new Hotkeys();
hotkeys.init(); 
export default hotkeys;