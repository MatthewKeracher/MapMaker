import Edit from "./edit.js";

const Ref = {

//Map
// Get references to the elements
imageContainer: document.querySelector('.image-container'),
radiantDisplay: document.getElementById('radiantDisplay'),
mapElement: document.getElementById('mapElement'),
locationDivs: document.querySelectorAll('.selection'), 

//Storyteller
locationLabel: document.getElementById('locationLabel'),
Storyteller: document.getElementById('Storyteller'),

//EditContainer
EditorContainer: document.querySelector('.EditorContainer'),
editLocationName: document.querySelector('.editLocationName'),

textLocation: document.getElementById('textLocation'),

itemList: document.getElementById('itemList'),
expandableElements: document.querySelectorAll('.expandable'),
extraInfo: document.querySelector('.extraInfo'),

//objectForm
objectForm: document.querySelector('.objectForm'),

//monsterForm
monsterForm: document.querySelector('.monsterForm'),

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


    npcName: document.getElementById('npcName'),
    npcOccupation: document.getElementById('npcOccupation'),

    MorningLocation: document.getElementById('MorningLocation'),
    MorningActivity: document.getElementById('MorningActivity'),

    AfternoonLocation: document.getElementById('AfternoonLocation'),
    AfternoonActivity: document.getElementById('AfternoonActivity'),

    NightLocation: document.getElementById('NightLocation'),
    NightActivity: document.getElementById('NightActivity'),

    npcLevel: document.getElementById('npcLevel'),
    npcClass: document.getElementById('npcClass'),

    STR: document.getElementById('STR'),
    DEX: document.getElementById('DEX'),
    INT: document.getElementById('INT'),
    WIS: document.getElementById('WIS'),
    CON: document.getElementById('CON'),
    CHA: document.getElementById('CHA'),

    Backstory: document.getElementById('npcBackStory'),
   
//Table
tableForm: document.getElementById('tableForm'),

//Ambience
AmbienceContainer: document.querySelector('.AmbienceContainer'),
//Interior or Exterior 
radianceDropdown: document.getElementById("radianceDropdown"),
//Hommlet or Dungeon
contextDropdown: document.getElementById("contextDropdown"),
//Spring, Summer, Autumn, Winter
mainAmbienceDropdown: document.getElementById("mainAmbienceDropdown"),
//Morning, Afternoon, Night
secondAmbienceDropdown: document.getElementById("secondAmbienceDropdown"),

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