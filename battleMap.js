
import form from "./form.js";
import helper from "./helper.js";
import load from "./load.js";
import ref from "./ref.js";
import Storyteller from "./storyteller.js";
import party from "./party.js";



const battleMap = {

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

enableMovableIcons() {

    let members = party.currentParty;

    let canvas = document.getElementById('drawingCanvas');

        const ctx = canvas.getContext('2d');
        let isDragging = false;
        let selectedIcon = null;
        let offsetX, offsetY;
    
        // Map members to icons with necessary properties
        let icons = members.map(member => ({
            id:member.id,
            name: member.name,
            color: member.color,
            img: new Image(),
            x: member.x || 200,   // Center horizontally
            y: member.y || 200, // Center vertically
            width: member.width || 40,  // Default icon size
            height: member.height || 40,
            src: member.image !== ''? member.image: 'gifs/goblin.gif'    // Image source from member object
        }));
    
        // Load all member icons and draw them on the canvas
        icons.forEach(icon => {
            icon.img.src = icon.src;
            icon.img.onload = () => {
                ctx.drawImage(icon.img, icon.x, icon.y, icon.width, icon.height);
            };
        });
    
        // Helper function to check if mouse is over an icon
        function isMouseOverIcon(mouseX, mouseY, icon) {
            return mouseX >= icon.x && mouseX <= icon.x + icon.width &&
                   mouseY >= icon.y && mouseY <= icon.y + icon.height;
        }
    
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
    
            // Store the reference to label for later removal
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
    
        // Start dragging an icon
        function startDragging(event) {
            const canvasRect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - canvasRect.left;
            const mouseY = event.clientY - canvasRect.top;
            canvas.style.zIndex = 1000;
    
            // Check if the mouse is over any icon
            icons.forEach(icon => {
                if (isMouseOverIcon(mouseX, mouseY, icon)) {
                    isDragging = true;
                    selectedIcon = icon;
                    offsetX = mouseX - icon.x;
                    offsetY = mouseY - icon.y;
                }
            });
        }
    
        // Stop dragging
        function stopDragging() {
            isDragging = false;
            selectedIcon = null;
            canvas.style.zIndex = 0;
        }
    
        // Drag an icon
        function drag(event) {
            if (!isDragging || !selectedIcon) return;
    
            const canvasRect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - canvasRect.left;
            const mouseY = event.clientY - canvasRect.top;

            //Remove Labels
            clearLabels();
    
            // Update the icon's position
            selectedIcon.x = mouseX - offsetX;
            selectedIcon.y = mouseY - offsetY;
    
            // Redraw the canvas with updated icon positions
            redrawCanvas();
        }
    
        // Redraw all icons on the canvas
        function redrawCanvas() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            icons.forEach(icon => {
                ctx.drawImage(icon.img, icon.x, icon.y, icon.width, icon.height);
                let saveIcon = party.currentParty.find(member => member.name === icon.name);
                saveIcon.x = icon.x;
                saveIcon.y = icon.y;

            });
        }
    
        // Handle mouse movement for hover labels
        canvas.addEventListener('mousemove', (event) => {
            const canvasRect = canvas.getBoundingClientRect();
            const mouseX = event.clientX - canvasRect.left;
            const mouseY = event.clientY - canvasRect.top;
    
            // Clear any previous labels
            clearLabels();
    
            // Check if hovering over any icon
            icons.forEach(icon => {
                if (isMouseOverIcon(mouseX, mouseY, icon)) {
                    showLabel(icon, mouseX, mouseY);
                }
            });
        });
    
        // Attach event listeners to the canvas
        canvas.addEventListener('mousedown', startDragging);
        canvas.addEventListener('mousemove', drag);
        canvas.addEventListener('mouseup', stopDragging);
        canvas.addEventListener('mouseleave', stopDragging);
    }
    



};

export default battleMap;
