const ref = {

//Map
mapContainer: document.getElementById('mapContainer'),
imageContainer: document.querySelector('.image-container'),
mapElement: document.getElementById('mapElement'),
locationDivs: document.querySelectorAll('.selection'), 
Banner: document.getElementById('Banner'),


//battleMap
gridContainer: document.getElementById('gridContainer'),
iconContainer: document.getElementById('iconContainer'),
battleMap: document.getElementById('battleMap'),
annotations: document.getElementById('annotations'),

//SearchBar
eventManager: document.getElementById('eventManager'),

//Storyteller
labelContainer : document.getElementById('labelContainer'),
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
leftExpand: document.getElementById('leftExpand'),
leftParty: document.getElementById('leftParty'),

//Toolbar
mainToolbar: document.getElementById('mainToolbar'),
partyButton: document.getElementById('partyButton'),
gridButton: document.getElementById('gridButton'),
hideButton: document.getElementById('hideButton'),
dataButton: document.getElementById('dataButton'),
addButton: document.getElementById('addButton'),
editButton: document.getElementById('editButton'),
saveButton: document.getElementById('saveButton'),
copyButton: document.getElementById('copyButton'),
fileInput: document.getElementById('fileInput'),
importData: document.getElementById('importData'),
newButton: document.getElementById('newButton'),
deleteButton: document.getElementById('deleteButton'),
moveButton: document.getElementById('moveButton'),
promptBox: document.getElementById('promptBox'),
speakButton: document.getElementById('speakButton'),

//Query
queryWindow: document.getElementById('queryWindow'),
queryText: document.getElementById('queryText'),
queryButton: document.getElementById('queryButton'),
queryCloseButton: document.getElementById('queryCloseButton'),
queryPre: document.getElementById('queryPre'),
queryPost: document.getElementById('queryPost'),


};

export default ref;