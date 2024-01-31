import Edit from "./edit.js";

const Ref = {

//Map
// Get references to the elements
imageContainer: document.querySelector('.image-container'),
radiantDisplay: document.getElementById('radiantDisplay'),
mapElement: document.getElementById('mapElement'),
locationDivs: document.querySelectorAll('.selection'), 
stateLabel: document.getElementById('stateLabel'),

//SettingContainer
SettingsContainer: document.querySelector('.SettingsContainer'),

//eventManager
eventManagerContainer: document.querySelector('.eventManagerContainer'),
eventManagerInput: document.getElementById('eventManagerInput'),
enableEventButton: document.getElementById('enableEventButton'),
disableEventButton: document.getElementById('disableEventButton'),
enableGroupEventButton: document.getElementById('enableGroupEventButton'),
disableGroupEventButton: document.getElementById('disableGroupEventButton'),

//Storyteller
locationLabel: document.getElementById('locationLabel'),
Storyteller: document.getElementById('Storyteller'),

//EditContainer
locationGroup: document.querySelector('.locationGroup'),
EditorContainer: document.querySelector('.EditorContainer'),
editLocationName: document.getElementById('editLocationName'),
editLocationTags: document.getElementById('editLocationTags'),

textLocation: document.getElementById('textLocation'),

//Centre: document.getElementById('Centre'),
expandableElements: document.querySelectorAll('.expandable'),
Centre: document.querySelector('.Centre'),
Left: document.querySelector('.Left'),


//spellsForm
spellsForm: document.querySelector('.spellsForm'),

spellId: document.getElementById('spellId'),
spellName: document.getElementById('spellName'),
spellClass: document.getElementById('spellClass'),
spellLevel: document.getElementById('spellLevel'),
spellDescription: document.getElementById('spellDescription'),
spellReverse: document.getElementById('spellReverse'),
spellNote: document.getElementById('spellNote'),
spellRange: document.getElementById('spellRange'),
spellDuration: document.getElementById('spellDuration'),


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


//objectForm
itemForm: document.querySelector('.itemForm'),
itemId: document.getElementById('itemId'),
itemSearch: document.getElementById('itemSearch'),
itemName: document.getElementById('itemName'),
itemType: document.getElementById('itemType'),
itemTags: document.getElementById('itemTags'),
itemSize: document.getElementById('itemSize'),
itemWeight: document.getElementById('itemWeight'),
itemCost: document.getElementById('itemCost'),
itemDamage: document.getElementById('itemDamage'),
itemRange: document.getElementById('itemRange'),
itemAC: document.getElementById('itemAC'),
itemDescription: document.getElementById('itemDescription'),

//monsterForm
monsterForm: document.querySelector('.monsterForm'),

monsterId: document.getElementById('monsterId'),
monsterSearch: document.getElementById('monsterSearch'),

monsterName: document.getElementById('monsterName'),
monsterType: document.getElementById('monsterType'),
monsterAppearing: document.getElementById('monsterAppearing'),
monsterMorale: document.getElementById('monsterMorale'),
monsterMovement: document.getElementById('monsterMovement'),
monsterAC: document.getElementById('monsterAC'),
monsterHD: document.getElementById('monsterHD'),
monsterHDRange: document.getElementById('monsterHDRange'),
monsterAttacks: document.getElementById('monsterAttacks'),
monsterDamage: document.getElementById('monsterDamage'),
monsterSpecial: document.getElementById('monsterSpecial'),
monsterSaveAs: document.getElementById('monsterSaveAs'),
monsterTreasure: document.getElementById('monsterTreasure'),
monsterXP: document.getElementById('monsterXP'),
monsterDescription: document.getElementById('monsterDescription'),

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

bottomToolbar: document.getElementById('bottomToolbar'),
nextButton: document.getElementById('nextButton'),
prevButton: document.getElementById('prevButton'),

//Export .csv
exportData: document.getElementById('exportData'),
importData: document.getElementById('importData'),
csvFileInput: document.getElementById('csvFileInput'),


};

export default Ref;