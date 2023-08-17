
class Hotkeys{

init() {

document.addEventListener('keydown', (event) => {
const key = event.key.toLowerCase(); // Convert the pressed key to lowercase

switch (key) {
case 'm':
    // Simulate a click on the New Image button
    mapButton.click();
    break;
case 'a':
    // Simulate a click on the Add button
    addButton.click();
    break;
case 's':
    // Simulate a click on the Add button
    saveButton.click();
    break;
case 'd':
    // Simulate a click on the Add button
    dataButton.click();
    break;

// Add more cases for additional hotkeys here
}
});  

}

}

const hotkeys = new Hotkeys();
hotkeys.init(); 
export default hotkeys;