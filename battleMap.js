
import form from "./form.js";
import helper from "./helper.js";
import load from "./load.js";
import ref from "./ref.js";
import expandable from "./expandable.js";
import party from "./party.js";



const battleMap = {

hexCenters: [],

enablePencilTool(canvas) {
  const ctx = canvas.getContext('2d');
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;

  function startDrawing(e) {
      isDrawing = true;
      [lastX, lastY] = [e.offsetX, e.offsetY]; // Start drawing from the current position
  }

  function draw(e) {
      if (!isDrawing) return;
      
      ctx.strokeStyle = 'red'; // Pencil color
      ctx.lineJoin = 'round';    // Smooth line joins
      ctx.lineCap = 'round';     // Smooth line ends
      ctx.lineWidth = 3;         // Pencil thickness
      
      ctx.beginPath();
      ctx.moveTo(lastX, lastY); // Move to the last point
      ctx.lineTo(e.offsetX, e.offsetY); // Draw to the new point
      ctx.stroke();
      [lastX, lastY] = [e.offsetX, e.offsetY]; // Update last position
  }

  function stopDrawing() {
      isDrawing = false;
      ctx.beginPath(); // Reset the path
  }

  // Attach event listeners for drawing
  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseout', stopDrawing);
},

loadIcons() {

    let members = party.currentParty;
    
        // Map members to icons with necessary properties
        let icons = members.map((member,index) => ({
            id:member.id,
            name: member.name,
            color: member.color,
            img: new Image(),
            x: member.x || 80,   // Center horizontally
            y: member.y || 40 * (index + 1), // Center vertically
            width: member.width || 40,  // Default icon size
            height: member.height || 40,
            src: member.image === ''? 'gifs/blankhead.png' : member.image     // Image source from member object
        }));


        const existingIcons = document.querySelectorAll('.icon');
        existingIcons.forEach(icon => icon.remove()); // Remove each existing icon element
    
console.log(icons)
// Function to create and position icons as HTML elements
icons.forEach(icon => {
    // Create img element for each icon
    const imgElement = document.createElement('img');
    imgElement.src = icon.src;
    imgElement.classList.add('icon'); 
    imgElement.dataset.iconId = `icon-${icon.name}`;

    // Set initial position and size based on icon data
    imgElement.style.position = 'absolute';
    imgElement.style.left = `${icon.x}px`;
    imgElement.style.top = `${icon.y}px`;
    imgElement.style.width = `${icon.width}px`;
    imgElement.style.height = `${icon.height}px`;

    // Add the img element to the document
    const container = document.getElementById('imageContainer');
    container.appendChild(imgElement);

    // Save a reference to the img element inside the icon object for later use
    icon.imgElement = imgElement;

    // Hover label handling
    imgElement.addEventListener('mouseover', (event) => {
        showLabel(icon, event.clientX, event.clientY);

        try{
        const nameDiv = ref.Storyteller.querySelector(`.npcBlock[data-icon-id="icon-${icon.name}"]`);

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

// Helper function to check if mouse is over an icon (No longer needed for HTML elements)

// Display the label near the icon when hovered
function showLabel(icon, x, y) {
    const container = document.getElementById('imageContainer');
    const scrollX = container.scrollLeft;
    const scrollY = container.scrollTop;

    const label = document.createElement('div');
    label.textContent = icon.name;
    label.className = 'icon-label';
    label.style.position = 'absolute';
    label.style.color = icon.color;
    label.style.left = `${x - scrollX}px`;  // Position label near the icon
    label.style.top = `${y - scrollY}px`;
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
        offsetX = event.clientX - icon.x;
        offsetY = event.clientY - icon.y;


 // Bring the icon to the front
 iconElement.style.zIndex = 1000;

 const iconLabels = document.querySelectorAll(".icon-label")
 iconLabels.forEach(label => {label.style.display = 'none'})

 event.preventDefault(); // Prevent default behavior
    }
}

// Stop dragging
function stopDragging() {
    if (selectedIcon) {
        selectedIcon.imgElement.style.zIndex = 0;
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
}


expandable.showIcon()
  // Draw the hex grid
  battleMap.drawGrid();

},


// Function to draw the hex grid
drawGrid() {

    const canvas = document.getElementById('drawingCanvas');
    this.hexCenters = [];
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const mapElement = document.getElementById('mapElement');
    mapElement.style.opacity = 0.8;
   
    const width = canvas.width;
    const height = canvas.height;
    const a = Math.PI / 3;
    const r= 25;

    for (let y = r; y + r * Math.sin(a) < height; y += r * Math.sin(a)) {
        for (let x = r, j = 0; x + r * (1 + Math.cos(a)) < width; x += r * (1 + Math.cos(a)), y += (-1) ** j++ * r * Math.sin(a)) {
          
          // Calculate the center of the hexagon
          const centerX = x + (j % 2) * (r * (1 + Math.cos(a)) / 2); // Offset for staggered rows
          const centerY = y;

          // Store the center coordinates
          this.hexCenters.push({ x: centerX, y: centerY });

          this.drawHexagon(x, y, a, r);
          
        }
      }

      //console.log(this.hexCenters)
  },

// Function to draw a single hexagon
drawHexagon(x, y, a, r) {

    const canvas = document.getElementById('drawingCanvas')
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = "gold"

    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      ctx.lineTo(x + r * Math.cos(a * i), y + r * Math.sin(a * i));
    }
    ctx.closePath();
    ctx.stroke();
}



};

export default battleMap;
