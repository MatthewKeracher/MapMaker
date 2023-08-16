// const imageCanvas = document.getElementById('imageCanvas');

// let isCanvasDragging = false;
// let canvasStartX, canvasStartY;
// let currentScale = 1.0;

// imageCanvas.addEventListener('mousedown', (e) => {
//     isCanvasDragging = true;
//     canvasStartX = e.clientX;
//     canvasStartY = e.clientY;
//     imageCanvas.style.transition = 'none';
//     imageCanvas.style.cursor = 'grabbing';

//     document.addEventListener('mousemove', handleCanvasDragging);
//     document.addEventListener('mouseup', stopCanvasDragging);
// });

// function handleCanvasDragging(e) {
//     if (!isCanvasDragging) return;

//     const offsetX = e.clientX - canvasStartX;
//     const offsetY = e.clientY - canvasStartY;

//     // Calculate the new background position
//     let newBackgroundX = parseFloat(getComputedStyle(imageCanvas).backgroundPositionX) + offsetX;
//     let newBackgroundY = parseFloat(getComputedStyle(imageCanvas).backgroundPositionY) + offsetY;

//     // Apply the new background position
//     imageCanvas.style.backgroundPositionX = newBackgroundX + 'px';
//     imageCanvas.style.backgroundPositionY = newBackgroundY + 'px';

//     canvasStartX = e.clientX;
//     canvasStartY = e.clientY;
// }

// function stopCanvasDragging() {
//     isCanvasDragging = false;
//     imageCanvas.style.transition = ''; // Reset transition
//     imageCanvas.style.cursor = 'grab';
//     document.removeEventListener('mousemove', handleCanvasDragging);
//     document.removeEventListener('mouseup', stopCanvasDragging);
// }

// imageCanvas.addEventListener('wheel', (e) => {
//     e.preventDefault(); // Prevent the default zoom behavior

//     const zoomSpeed = 0.01;
//     const zoomDelta = e.deltaY * zoomSpeed;

//     const currentScale = Math.max(0.2, parseFloat(imageCanvas.style.transform.replace('scale(', '').replace(')', '')) - zoomDelta);
//     imageCanvas.style.transform = `scale(${currentScale})`;
// });
