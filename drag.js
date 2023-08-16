// const Drag = {
//     mapElement: document.getElementById('mapElement'),
//     isDragging: false,
//     startX: 0,
//     startY: 0,
  
//     handleMouseDown(e) {
//       this.isDragging = true;
//       this.startX = e.clientX - this.mapElement.offsetLeft;
//       this.startY = e.clientY - this.mapElement.offsetTop;
//     },
  
//     handleMouseMove(e) {
//       e.preventDefault();
//       if (this.isDragging) {
//         const newX = e.clientX - this.startX;
//         const newY = e.clientY - this.startY;
//         this.mapElement.style.left = newX + 'px';
//         this.mapElement.style.top = newY + 'px';
//       }
//     },
  
//     handleMouseUp() {
//       this.isDragging = false;
//     },
  
//     init() {
//       window.mapElement.addEventListener('mousedown', (e) => this.handleMouseDown(e));
//       window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
//       window.addEventListener('mouseup', () => this.handleMouseUp());
//     },
//   };
  
//   Drag.init();
  
