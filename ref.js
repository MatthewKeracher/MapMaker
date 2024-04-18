import editor from "./editor.js";

const ref = {

//Map
mapContainer: document.getElementById('mapContainer'),
imageContainer: document.querySelector('.image-container'),
mapElement: document.getElementById('mapElement'),
locationDivs: document.querySelectorAll('.selection'), 

//SearchBar
eventManager: document.getElementById('eventManager'),

//Storyteller
locationLabel: document.getElementById('locationLabel'),
Storyteller: document.getElementById('Storyteller'),

//EditContainer
locationGroup: document.querySelector('.locationGroup'),
Editor: document.getElementById('Editor'),

//Screensections...
expandableElements: document.querySelectorAll('.expandable'),
Right: document.getElementById('Right'),
Centre: document.querySelector('.Centre'),
Left: document.querySelector('.Left'),

//Toolbar
mainToolbar: document.getElementById('mainToolbar'),
    mapButton: document.getElementById('mapButton'),
    dataButton: document.getElementById('dataButton'),
    addButton: document.getElementById('addButton'),
    editButton: document.getElementById('editButton'),
    saveButton: document.getElementById('saveButton'),
    fileInput: document.getElementById('fileInput'),
    newButton: document.getElementById('newButton'),
    deleteButton: document.getElementById('deleteButton'),


//Export .csv
exportData: document.getElementById('exportData'),
importData: document.getElementById('importData'),
csvFileInput: document.getElementById('csvFileInput'),


};

export default ref;