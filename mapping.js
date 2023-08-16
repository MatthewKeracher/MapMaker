const newButton = document.getElementById('newButton');
const addButton = document.getElementById('addButton');
const pressedButton = document.getElementById('myButton');

newButton.addEventListener('click', () => {
    fetchAndProcessImage()
});

addButton.addEventListener('click', () => {
    add();
    pressedButton.classList.add('addButton');
});

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
        
async function fetchAndProcessImage() {
var imageUrl = "https://i.redd.it/z6m7wtth36y51.png";
            
// Fetch the image and convert the response to a Blob
var response = await fetch(imageUrl);
var imageBlob = await response.blob();
            
// Do something with the imageBlob, such as displaying it or further processing
var blobUrl = URL.createObjectURL(imageBlob);
var mapElement = new Image();
mapElement.src = blobUrl;
mapElement.id = "mapElement";

// Add a class to the <img> element for styling
mapElement.className = "map-image";

document.body.appendChild(mapElement);
        
}

function add(){         
const mapElement = document.getElementById('mapElement');
const rect = mapElement.getBoundingClientRect();
//Create a position div of size drag area.
let isDragging = false;
let startX, startY, endX, endY;
let previewDiv;
let lastClickTime = 0;
const doubleClickInterval = 300;

mapElement.addEventListener('mousedown', (e) => {
const currentTime = new Date().getTime();

if (currentTime - lastClickTime < doubleClickInterval) {
// Double-click behavior (e.g., do not initiate drawing)
console.log('double click')
return;
}

lastClickTime = currentTime;

isDragging = true;
startX = e.clientX - rect.left;
startY = e.clientY - rect.top;

// console.log('isDragging: ' + isDragging);
// console.log('start: ' + startX + ',' + startY);

// Create a temporary preview div
previewDiv = document.createElement('div');
previewDiv.className = 'position-div preview';
document.body.appendChild(previewDiv);

});

mapElement.addEventListener('mousemove', (e) => {

e.preventDefault();
            
if (isDragging) {
    endX = e.clientX - rect.left;
    endY = e.clientY - rect.top;

    // Calculate position and size for the preview div
    const left = Math.min(startX, endX);
    const top = Math.min(startY, endY);
    const width = Math.abs(endX - startX);
    const height = Math.abs(endY - startY);

    // Update styles for the preview div
    previewDiv.style.left = left + 'px';
    previewDiv.style.top = top + 'px';
    previewDiv.style.width = width + 'px';
    previewDiv.style.height = height + 'px';
}

});

mapElement.addEventListener('mouseup', () => {

// Calculate position and size for the selection div     
const left = Math.min(startX, endX);
const top = Math.min(startY, endY);
const width = Math.abs(endX - startX);
const height = Math.abs(endY - startY);
    
// Create and style the selection div
var positionDiv = document.createElement('div');
positionDiv.className = 'position-div selection';
positionDiv.style.left = left + 'px';
positionDiv.style.top = top + 'px';
positionDiv.style.width = width + 'px';
positionDiv.style.height = height + 'px';
    
document.body.appendChild(positionDiv);

console.log(left + ',' + top + ' ; ' + width + ',' + height);

isDragging = false;
previewDiv.remove();

});                

}

