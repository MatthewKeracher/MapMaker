import editor from "./editor.js";

const Ref = {

//Map
// Get references to the elements
imageContainer: document.querySelector('.image-container'),
radiantDisplay: document.getElementById('radiantDisplay'),
mapElement: document.getElementById('mapElement'),
locationDivs: document.querySelectorAll('.selection'), 


//eventManager
eventManager: document.getElementById('eventManager'),
enableEventButton: document.getElementById('enableEventButton'),
disableEventButton: document.getElementById('disableEventButton'),
enableGroupEventButton: document.getElementById('enableGroupEventButton'),
disableGroupEventButton: document.getElementById('disableGroupEventButton'),

//Storyteller
locationLabel: document.getElementById('locationLabel'),
Storyteller: document.getElementById('Storyteller'),

//EditContainer
locationGroup: document.querySelector('.locationGroup'),
Editor: document.getElementById('Editor'),
editLocationName: document.getElementById('editLocationName'),
editLocationTags: document.getElementById('editLocationTags'),

textLocation: document.getElementById('textLocation'),

//Screensections...

//Centre: document.getElementById('Centre'),
expandableElements: document.querySelectorAll('.expandable'),
Right: document.getElementById('Right'),
Centre: document.querySelector('.Centre'),
Left: document.querySelector('.Left'),


//eventForm:

timePassingCheckbox : document.getElementById('timePassingCheckbox'),
eventForm: document.querySelector('.eventForm'),
eventId: document.getElementById('eventId'),
eventSearch: document.getElementById('eventSearch'),
eventName: document.getElementById('eventName'),
eventTags: document.getElementById('eventTags'),
eventLocation: document.getElementById('eventLocation'),
eventNPC: document.getElementById('eventNPC'),
eventTarget: document.getElementById('npcCheckbox'),
locationCheck: document.getElementById('locationCheckbox'),
npcCheckbox: document.getElementById('npcCheckbox'),
eventDescription: document.getElementById('ambienceDescription'),



//npcForm
npcForm: document.querySelector('.npcForm'),

npcId: document.getElementById('npcId'),
npcSearch: document.getElementById('npcSearch'),
npcName: document.getElementById('npcName'),
npcTags: document.getElementById('npctags'),
npcLevel: document.getElementById('npcLevel'),
npcClass: document.getElementById('npcClass'),
monsterTemplate: document.getElementById('monsterTemplate'),

STR: document.getElementById('STR'),
DEX: document.getElementById('DEX'),
INT: document.getElementById('INT'),
WIS: document.getElementById('WIS'),
CON: document.getElementById('CON'),
CHA: document.getElementById('CHA'),

Backstory: document.getElementById('npcBackStory'),

//Table
tableForm: document.getElementById('tableForm'),

//Toolbars
editToolbar: document.getElementById('editToolbar'),
editEditButton: document.getElementById('editEditButton'),
editSaveButton: document.getElementById('editSaveButton'),
editClearButton: document.getElementById('editClearButton'),
editDeleteButton: document.getElementById('editDeleteButton'),

mainToolbar: document.getElementById('mainToolbar'),
mapButton: document.getElementById('mapButton'),
dataButton: document.getElementById('dataButton'),
addButton: document.getElementById('addButton'),
editButton: document.getElementById('editButton'),
saveButton: document.getElementById('saveButton'),
fileInput: document.getElementById('fileInput'),

// centreToolbar: document.getElementById('centreToolbar'),
// centreSaveButton: document.getElementById('centreSaveButton'),

//Export .csv
exportData: document.getElementById('exportData'),
importData: document.getElementById('importData'),
csvFileInput: document.getElementById('csvFileInput'),


};

export default Ref;