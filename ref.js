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
leftParty: document.getElementById('leftParty'),

//Toolbar
mainToolbar: document.getElementById('mainToolbar'),
partyButton: document.getElementById('partyButton'),
mapButton: document.getElementById('mapButton'),
dataButton: document.getElementById('dataButton'),
addButton: document.getElementById('addButton'),
editButton: document.getElementById('editButton'),
saveButton: document.getElementById('saveButton'),
copyButton: document.getElementById('copyButton'),
fileInput: document.getElementById('fileInput'),
newButton: document.getElementById('newButton'),
deleteButton: document.getElementById('deleteButton'),

promptBox: document.getElementById('promptBox'),


};

export default ref;