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

optionsListMonster: document.getElementById('MonsteroptionsList'),
expandableElements: document.querySelectorAll('.expandable'),
extraInfo: document.querySelector('.extraInfo'),

//npcForm
npcForm: document.querySelector('.npcForm'),
NPCoptionslist: document.getElementById('NPCoptionslist'),

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