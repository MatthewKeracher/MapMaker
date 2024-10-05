
import form from "./form.js";
import helper from "./helper.js";
import load from "./load.js";
import ref from "./ref.js";
import expandable from "./expandable.js";
import party from "./party.js";
import Map from "./map.js";
import Storyteller from "./storyteller.js";
import toolbar from "./toolbar.js";


const battleMap = {

hexCenters: [],
gridShowing: false,
erasing: false,

enablePencilTool(canvas) {
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let isShiftPressed = false;

    function startDrawing(e) {
        isDrawing = true;
        [lastX, lastY] = [e.offsetX, e.offsetY]; // Start drawing from the current position
    }

    function draw(e) {
        if (!isDrawing) return;

        if (battleMap.erasing) {
            ctx.globalCompositeOperation = 'destination-out'; // Set to erase mode
            ctx.lineWidth = 20; // Eraser thickness
        } else {
            ctx.strokeStyle = Storyteller.gridColour; // Pencil color
            ctx.globalCompositeOperation = 'source-over'; // Set to normal drawing mode
            ctx.lineWidth = 6; // Pencil thickness
        }

        ctx.lineJoin = 'round';    // Smooth line joins
        ctx.lineCap = 'round';     // Smooth line ends

        ctx.beginPath();
        ctx.moveTo(lastX, lastY); // Move to the last point

        if (isShiftPressed) {
            // Draw a preview straight line
            const dx = Math.abs(e.offsetX - lastX);
            const dy = Math.abs(e.offsetY - lastY);

            if (dx > dy) {
                // Constrain to horizontal line
                ctx.lineTo(e.offsetX, lastY);
            } else {
                // Constrain to vertical line
                ctx.lineTo(lastX, e.offsetY);
            }
        } else {
            // Normal drawing behavior
            ctx.lineTo(e.offsetX, e.offsetY);
        }

        ctx.stroke();

        // Update last position for normal drawing
        if (!isShiftPressed) {
            [lastX, lastY] = [e.offsetX, e.offsetY]; // Update last position only if not drawing straight
        }
    }

    function stopDrawing() {
        isDrawing = false;
        ctx.beginPath(); // Reset the path
        battleMap.cloneDrawingToSecondWindow();
    }

    // Listen for keydown and keyup events to track Shift key state
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Shift') {
            isShiftPressed = true; // Shift key is held down
        }
    });

    window.addEventListener('keyup', (e) => {
        if (e.key === 'Shift') {
            isShiftPressed = false; // Shift key is released
        }
    });

    // Attach event listeners for drawing
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    // Create and add the button
    const button = document.createElement('button');
    button.id = 'drawToolButton'; // Button ID
    button.style.display = 'none';

    // Set initial icon for drawing mode (pencil icon)
    button.style.backgroundImage = 'url("gifs/pencil.png")';
    button.style.backgroundSize = 'cover'; // Adjust size to cover the button
    button.style.backgroundRepeat = 'no-repeat'; // Prevent repeat of the image
    button.style.backgroundPosition = 'center'; // Center the image

    button.addEventListener('click', () => {
        if (this.erasing === true) {
            this.erasing = false;
            button.style.backgroundImage = 'url("gifs/pencil.png")'; 
        } else {
            this.erasing = true;
            button.style.backgroundImage = 'url("gifs/eraser.png")'; 
        }
    });

    // Append the button to the icon container
    ref.iconContainer.appendChild(button);
},


cloneDrawingToSecondWindow() {
    if (!toolbar.secondWindow || toolbar.secondWindow.closed) {
        return;
    }

    // Get the data URL from the main canvas
    const dataURL = ref.annotations.toDataURL();

    // Create a new image in the second window
    const img = toolbar.secondWindow.document.createElement('img');
    img.src = dataURL;

    img.onload = () => {
        const secondCanvas = toolbar.secondWindow.document.getElementById('annotations-player'); // Ensure this ID matches the second window's canvas ID
        const ctx = secondCanvas.getContext('2d');
        
        // Clear the second canvas before drawing
        ctx.clearRect(0, 0, secondCanvas.width, secondCanvas.height);

        // Draw the image onto the second canvas
        ctx.drawImage(img, 0, 0);
    };
},

loadIcons() {

let members = [...party.currentParty];

//add subLocations
const subLocationHeaders = document.querySelectorAll('h2[key="subLocations"]');
subLocationHeaders.forEach(div => {

const id = div.getAttribute('id');
const key = div.getAttribute('key');
const obj = helper.getObjfromTag({key: key, id: id});

members.push(obj);
    
})


let icons = members.map((member, index) => {
    // Find the position matching the current location
    let position = '';
        
    if(member.position){
        position = member.position.find(entry => entry.location === Storyteller.currentLocationId)
    };

    let defaultImage = '';

    console.log(member.key)

    switch (member.key) {
    case 'monsters':
    defaultImage = 'gifs/goblin.gif';
    break;
    case 'npcs':
    defaultImage = 'gifs/blankHead.png';
    break;
    case 'subLocations':
    defaultImage = 'gifs/door.gif';
    break;
    };
    
    
    return {
        location: Storyteller.currentLocationId,
        id: member.id,
        key: member.key,
        name: member.name,
        color: member.color,
        img: new Image(),
        position: position? 'absolute' : 'fixed',
        x: position ? position.x :  80,   
        y: position ? position.y : 40, 
        width: member.width || 40 * (member.size? member.size : 1),  
        height: member.height || 40 * (member.size? member.size : 1),
        src: member.image === '' ? defaultImage : member.image 
    };
});


let existingIcons = [...document.querySelectorAll('.icon'), ...document.querySelectorAll('.icon-label')];
const secondWindowIcons = toolbar.secondWindow? toolbar.secondWindow.document.querySelectorAll('.icon'): [];
existingIcons = [...existingIcons, ...secondWindowIcons]
existingIcons.forEach(icon => icon.remove()); // Remove each existing icon element

// Function to create and position icons as HTML elements
icons.forEach(icon => {
// Create img element for each icon
const imgElement = document.createElement('img');
imgElement.src = icon.src;
imgElement.setAttribute('key', icon.key);
imgElement.id = icon.id;
imgElement.classList.add('icon'); 
imgElement.dataset.iconId = `icon-${icon.name}`;

// Set initial position and size based on icon data
imgElement.style.position = `${icon.position}`;
imgElement.style.left = `${icon.x}px`;
imgElement.style.top = `${icon.y}px`;
imgElement.style.width = `${icon.width}px`;
imgElement.style.height = `${icon.height}px`;

// Add the img element to the document
ref.iconContainer.appendChild(imgElement);

// Save a reference to the img element inside the icon object for later use
icon.imgElement = imgElement;

//Project Icons
if(imgElement.style.position === 'absolute'){
battleMap.projectIcon(icon.x, icon.y, icon)
};

// Hover label handling
imgElement.addEventListener('mouseover', (event) => {
showLabel(icon, event.clientX, event.clientY);

try{
let nameDiv

if(icon.key === "npcs" || icon.key === "monsters"){
nameDiv = ref.Storyteller.querySelector(`.npcBlock[data-icon-id="icon-${icon.name}"]`);
}

if(icon.key === "subLocations"){
nameDiv = ref.Storyteller.querySelector(`h2[key="subLocations"][id="${icon.id}"]`);
}

nameDiv.scrollIntoView({ 
behavior: 'smooth', // Smooth scrolling effect
block: 'start',     // Align the nameDiv to the top of storyteller
inline: 'nearest'   // Optional for horizontal scrolling
});
}catch{}

});

imgElement.addEventListener('mouseleave', () => {
clearLabels();
});

// Add drag functionality to each icon
imgElement.addEventListener('mousedown', startDragging);
imgElement.addEventListener('mousemove', drag);
imgElement.addEventListener('mouseup', stopDragging);
imgElement.addEventListener('mouseleave', stopDragging);
});

// Display the label near the icon when hovered
function showLabel(icon, x, y) {
const container = document.getElementById('battleMap');
const scrollX = window.scrollLeft;
const scrollY = window.scrollTop;

const label = document.createElement('div');
label.textContent = icon.name;
label.className = 'icon-label';
label.style.position = 'absolute';
label.style.color = icon.color;
label.style.left = `${icon.x}px`; 
label.style.top = `${icon.y}px`;
document.body.appendChild(label);

// Store the reference to the label for later removal
icon.label = label;
}

// Remove label when not hovering over the icon
function clearLabels() {
icons.forEach(icon => {
if (icon.label) {
document.body.removeChild(icon.label);
icon.label = null;
}
});
}

// Variables for dragging
let isDragging = false;
let selectedIcon = null;
let offsetX = 0;
let offsetY = 0;

// Start dragging an icon
function startDragging(event) {
const iconElement = event.target;
const icon = icons.find(icon => icon.imgElement === iconElement);

if (icon) {
isDragging = true;
selectedIcon = icon;

if(icon.imgElement.style.position === 'absolute'){
offsetX = event.clientX - icon.x;
offsetY = event.clientY - icon.y;
}else{
offsetX = event.clientX - (scrollX + icon.x);
offsetY = event.clientY - (scrollY + icon.y); 
}

// Bring the icon to the front
iconElement.style.zIndex = 100;

const iconLabels = document.querySelectorAll(".icon-label")
iconLabels.forEach(label => {label.style.display = 'none'})

event.preventDefault(); // Prevent default behavior
}
}

// Stop dragging
function stopDragging() {
if (selectedIcon) {
selectedIcon.imgElement.style.position = 'absolute'; 
isDragging = false;
selectedIcon = null;
}
}

// Drag an icon
function drag(event) {
if (!isDragging || !selectedIcon) return;

// Update the icon's position
const newX = event.clientX - offsetX;
const newY = event.clientY - offsetY;

selectedIcon.x = newX;
selectedIcon.y = newY;

// Update the position of the img element
selectedIcon.imgElement.style.left = `${newX}px`;
selectedIcon.imgElement.style.top = `${newY}px`;
battleMap.projectIcon(newX, newY, selectedIcon);

}

expandable.showIcon()
},

projectIcon(newX, newY, selectedIcon){

if (toolbar.secondWindow && !selectedIcon.duplicate) {
// Clone the selectedIcon's div
const clonedIcon = selectedIcon.imgElement.cloneNode(true);

// Apply any styles or attributes that are required for the cloned icon
clonedIcon.style.position = 'absolute'; // Make sure it's positioned absolutely
clonedIcon.style.left = `${newX}px`; // Set initial position
clonedIcon.style.top = `${newY}px`;

// Append the cloned icon to the secondWindow's document
toolbar.secondWindow.document.body.appendChild(clonedIcon);

// Store reference to the cloned icon for future updates
selectedIcon.duplicate = clonedIcon;
}

// If the duplicate exists, update its position as well
if (selectedIcon.duplicate) {
selectedIcon.duplicate.style.left = `${newX}px`;
selectedIcon.duplicate.style.top = `${newY}px`;
}

},

updateIconPosition(){
    const icons = document.querySelectorAll(".icon")
    
    icons.forEach(icon => {
    
const position = icon.style.position;
const display = icon.style.display;

if(position === "absolute" && display !== "none"){

    let x = icon.style.left
    let y = icon.style.top

    const iconPosition = {
    location: Storyteller.currentLocationId,
    key: icon.getAttribute('key'),
    id: icon.id,
    x: x.slice(0, -2),
    y: y.slice(0, -2),  
    }
    
    let obj = helper.getObjfromTag(iconPosition);
    if(!obj.position){obj.position = []}
    let exists = obj.position.find(entry => entry.location === iconPosition.location);
    if(exists){ //delete!
    obj.position = obj.position.filter(entry => entry.location !== iconPosition.location);   
    }
    obj.position.push(iconPosition);
    }
    });
    },
    

saveDrawing(canvas, stay){

const drawingDataURL = canvas.toDataURL('image/png'); 
const ctx = canvas.getContext('2d', { willReadFrequently: true });
const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
const isEmpty = imageData.data.every((value) => value === 0);

this.updateIconPosition();

if(!isEmpty){

const savedDrawing = {
    id: Storyteller.currentLocationId,
    drawing: drawingDataURL
};

let exists = load.Data.miscInfo.canvasData.find(entry => entry.id === savedDrawing.id);

if(exists){
    //console.log(exists, savedDrawing)
    exists.drawing = savedDrawing.drawing
   
}else{
    load.Data.miscInfo.canvasData.push(savedDrawing)
}

//console.log(load.Data.miscInfo.canvasData)
//console.log(helper.getSize(load.Data.miscInfo.canvasData))

if(!stay){
ctx.clearRect(0, 0, canvas.width, canvas.height);
}
}

},

loadDrawing(){

if(load.Data.miscInfo.canvasData.length > 0){

const locId = parseInt(Storyteller.currentLocationId);

const savedDrawing = load.Data.miscInfo.canvasData.find(entry => parseInt(entry.id) === locId)

if (savedDrawing) {
   
    const img = new Image();
    img.src = savedDrawing.drawing; 
    
    img.onload = () => {
        const canvas = ref.annotations; 
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(img, 0, 0); 
    };


}}},

// Function to draw the hex grid
drawGrid(canvas) { 

this.hexCenters = [];

const ctx = canvas.getContext('2d', { willReadFrequently: true });
ctx.clearRect(0, 0, canvas.width, canvas.height);
this.loadDrawing();

const a = Math.PI / 3;
const r= 25;

const width = canvas.width;
const height = canvas.height;



for (let y = r; y + r * Math.sin(a) < height; y += r * Math.sin(a)) {
for (let x = r, j = 0; x + r * (1 + Math.cos(a)) < width; x += r * (1 + Math.cos(a)), y += (-1) ** j++ * r * Math.sin(a)) {

// Calculate the center of the hexagon
const centerX = x + (j % 2) * (r * (1 + Math.cos(a)) / 2); // Offset for staggered rows
const centerY = y;

// Store the center coordinates
//this.hexCenters.push({ x: centerX, y: centerY });

//Drawing Style
ctx.strokeStyle = Storyteller.gridColour;
ctx.lineWidth = 2;
ctx.globalAlpha = 0.1;

ctx.beginPath();
for (let i = 0; i < 6; i++) {
ctx.lineTo(x + r * Math.cos(a * i), y + r * Math.sin(a * i));
}
ctx.closePath();
ctx.stroke();

}}

// if(toolbar.secondWindow){
// const battleMapPlayer = toolbar.secondWindow.document.getElementById('battleMap-player');
// battleMap.drawGrid(battleMapPlayer);
// }

},

};

export default battleMap;
