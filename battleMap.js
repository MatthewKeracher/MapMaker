
import form from "./form.js";
import helper from "./helper.js";
import load from "./load.js";
import ref from "./ref.js";
import Storyteller from "./storyteller.js";



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

enableMovableIcons(canvas, members) {
    const ctx = canvas.getContext('2d');
    let isDragging = false;
    let selectedIcon = null;
    let offsetX, offsetY;

    // Map members to icons with necessary properties
    let icons = members.map(member => ({
        img: new Image(),
        x: member.x || 0,   // Default position (x, y)
        y: member.y || 0,
        width: member.width || 50,  // Default icon size
        height: member.height || 50,
        src: member.image    // Image source from member object
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

    // Start dragging an icon
    function startDragging(event) {
        const canvasRect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - canvasRect.left;
        const mouseY = event.clientY - canvasRect.top;

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
    }

    // Drag an icon
    function drag(event) {
        if (!isDragging || !selectedIcon) return;

        const canvasRect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - canvasRect.left;
        const mouseY = event.clientY - canvasRect.top;

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
        });
    }

    // Attach event listeners to the canvas
    canvas.addEventListener('mousedown', startDragging);
    canvas.addEventListener('mousemove', drag);
    canvas.addEventListener('mouseup', stopDragging);
    canvas.addEventListener('mouseleave', stopDragging);
}




};

export default battleMap;
