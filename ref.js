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

playerLabel: document.getElementById('playerLabel'),
editPlayerText: document.getElementById('editPlayerText'),

gmLabel: document.getElementById('gmLabel'),
editGMText: document.getElementById('editGMText'),

miscLabel: document.getElementById('miscLabel'),
editMiscText: document.getElementById('editMiscText'),

//npcForm
npcForm: document.querySelector('.npcForm'),

    npcName: document.getElementById('npcName').value,
    npcOccupation: document.getElementById('npcOccupation').value,

    MorningLocation: document.getElementById('MorningLocation').value,
    MorningActivity: document.getElementById('MorningActivity').value,

    AfternoonLocation: document.getElementById('AfternoonLocation').value,
    AfternoonActivity: document.getElementById('AfternoonActivity').value,

    NightLocation: document.getElementById('NightLocation').value,
    NightActivity: document.getElementById('NightActivity').value,

    npcLevel: document.getElementById('npcLevel').value,
    npcClass: document.getElementById('npcClass').value,

    STR: document.getElementById('STR').value,
    DEX: document.getElementById('DEX').value,
    INT: document.getElementById('INT').value,
    WIS: document.getElementById('WIS').value,
    CON: document.getElementById('CON').value,
    CHA: document.getElementById('CHA').value,

    npcPhysicalAppearance: document.getElementById('npcPhysicalAppearance').value,
    npcEmotionalAppearance: document.getElementById('npcEmotionalAppearance').value,
    npcSocialAppearance: document.getElementById('npcSocialAppearance').value,

//Table
tableForm: document.getElementById('tableForm'),

//Ambience 
AmbienceContainer: document.querySelector('.AmbienceContainer'),
mainAmbience: document.getElementById("mainAmbienceDropdown"),
allPhases: document.getElementById("secondAmbienceDropdown"),

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