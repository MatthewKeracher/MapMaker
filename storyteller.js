
import Events from "./events.js";
import expandable from "./expandable.js";
import load from "./load.js";
import NPCs from "./npcs.js";
import helper from "./helper.js";

import editor from "./editor.js"; 
import form from "./form.js";
import ref from "./ref.js";

const Storyteller = {

returnLocation: '',
miscInfo: '',

async changeContent(locationDiv) {

let Story = ``
const locId = locationDiv.id;

const locObj = load.Data.locations.find(entry => parseInt(entry.id) === parseInt(locId));
const locName = locObj.name

//Change Location Label Contents
ref.locationLabel.value = locName;
helper.adjustFontSize();
ref.locationLabel.disabled = true;
ref.locationLabel.style.color = locObj.color;

//Set new Return Location
const returnLocationName = ref.locationLabel.value;
const returnLocation = load.Data.locations.find(entry => entry.name === returnLocationName);
Storyteller.returnLocation = returnLocation;

if (locObj) {
Events.getEvent(locObj);

Story += `
<span class="withbreak">${Events.eventDesc}</span>
`;

//Finish Up.
ref.Storyteller.innerHTML = Story;
this.addImagestoStory();

//Tell expandable Divs what to show.
expandable.expandExtend(ref.Storyteller, ref.Centre);
expandable.showFloatingExpandable();
//---
//window.speechSynthesis.cancel();
//this.textToSpeech(ref.Storyteller.textContent);

};
}, 

addImagestoStory() {
    // Get all <hr> elements in the Storyteller
    const hrElements = ref.Storyteller.querySelectorAll('hr');

    // Iterate over each <hr> element
    hrElements.forEach(hr => {
        // Create a <div> container to hold both the <hr> and the <img> elements
        const container = document.createElement('div');
        container.classList.add('hr-with-image');
        const name = hr.getAttribute('name');
        if(name === 'blank'){return};

        const gifBox = [
            {name: "subLocHR", src: 'gifs/door.gif'},
            {name: "inventHR", src: 'gifs/backpack.png'},
            {name: "npcHR", src:  'gifs/goblin.gif'},
            {name: "tagHR", src: 'gifs/scroll.png'},
            {name: "itemHR", src: 'gifs/chest.gif'},
            {name: "fighterHR", src: 'gifs/fighter.gif'},
            {name: "clericHR", src: 'gifs/cleric.gif'},
            {name: "thiefHR", src: 'gifs/thief.gif'},
            {name: "magicuserHR", src: 'gifs/magicuser.gif'},
        ]

        // Create an <img> element for the torch
        let img 
        
        img = document.createElement('img');
        let imgEntry = gifBox.find(entry => entry.name === name);
    
    
        img.src = imgEntry === undefined? name : imgEntry.src;
        img.alt = name;
        img.classList.add('torch');

        //img.addEventListener('click', this.textToSpeech())

        // Append the <hr> and <img> elements to the container
        container.appendChild(hr.cloneNode()); // Clone the <hr> element
        container.appendChild(img);

        // Replace the <hr> element with the container
        hr.replaceWith(container);
    });
},

textToSpeech(text){

//Add Button
const speakButton = document.createElement('div');
let buttonHTML =  `<button id="fullScreenButton" class="speakButton">[Speak]</button>`;
speakButton.innerHTML = buttonHTML;
document.body.appendChild(speakButton);

let speaking = false;

speakButton.addEventListener('click',() => {
// Check if the browser supports the SpeechSynthesis API
if ('speechSynthesis' in window) {
const synth = window.speechSynthesis;

// Function to speak the provided text
function speak(text) {
// Create a new SpeechSynthesisUtterance instance
const utterance = new SpeechSynthesisUtterance(text);

// Speak the text
synth.speak(utterance);
}

if(speaking === false){
speak(text);
speaking = true
}else{
window.speechSynthesis.cancel();
speaking = false
}

} else {
// Browser doesn't support SpeechSynthesis API
console.error('Speech synthesis is not supported in this browser.');
}
});

},

refreshLocation(){

if(Storyteller.returnLocation !== ''){
const returnLocation = Storyteller.returnLocation;
Storyteller.changeContent(returnLocation);
}

else if(load.fileName !== ''){
ref.locationLabel.value = load.fileName;
helper.adjustFontSize();
ref.locationLabel.disabled = false;
}else{
ref.locationLabel.value = 'No fileName';  
helper.adjustFontSize();
ref.locationLabel.disabled = false;  
}


},

showmiscInfo() {

let fileInformation = load.Data.miscInfo.ledger;
ref.locationLabel.value = load.Data.miscInfo.fileName;
helper.adjustFontSize();

if (fileInformation.length === 0){Storyteller.addNewEntry()} 


// Clear the existing content of ref.Storyteller
ref.Storyteller.innerHTML = '';

fileInformation.forEach((file, index) => {
// Generate unique identifiers for each header and text element

// Create the header element
const header = document.createElement('h2');

if(index > 0){
header.innerHTML = `<br>`
}

header.innerHTML += `

<input type="text" value="${file.name}" id="${index}" class="miscInfo rightHeader" showHide="show" toHide="${index}" style="display: block; letter-spacing: 0.18vw; text-align: left;">
`;

// Create the text area element
const text = document.createElement('textarea');
text.id = index;
text.classList.add('rightText');
text.classList.add('miscInfo');

//As default, show only first sentence.
let firstPeriodIndex = file.description.indexOf('.');
let firstSentence = file.description.slice(0, firstPeriodIndex + 1);
text.textContent = firstSentence;

ref.Storyteller.appendChild(header);
ref.Storyteller.appendChild(text);

})

this.addMiscEvents();

},

addNewEntry(){

// Create the header element
const header = document.createElement('h2');
header.innerHTML = `

<br><input type="text" value="Add New Entry" id="newHeader" class="rightHeader" showHide="show" toHide="newEntry" style="display: block; letter-spacing: 0.18vw; text-align: left;">
`;

// Create the text area element
const text = document.createElement('textarea');
text.id = 'newEntry';
text.classList.add('rightText')
text.style.display = 'block';
text.textContent = 'Insert text here. Shift-Click to Expand/Hide and Save.';

ref.Storyteller.appendChild(header);
ref.Storyteller.appendChild(text);

load.Data.miscInfo.ledger.push({name: 'Add New Entry', description: text.textContent})
this.addMiscEvents();

},

addMiscEvents(){

const headers = document.querySelectorAll('.rightHeader')

// Attach event listener to each header element
headers.forEach((header, index) => {
header.addEventListener('click', (event) => {

if(event.shiftKey){
    helper.showPrompt('Are you sure you want to delete ' + header.value +'?', 'yesNo');

    helper.handleConfirm = function(confirmation) {
    const promptBox = document.querySelector('.prompt');
        
    if (confirmation) {
    load.Data.miscInfo.ledger.splice(index, 1)
    Storyteller.showmiscInfo();
    promptBox.style.display = 'none';
    } else{
    promptBox.style.display = 'none';
    }
}

}
});

header.addEventListener('focusout', () => {    
//Save Data
const index = header.getAttribute('id');
const entry = load.Data.miscInfo.ledger[index];

try{
entry.name = header.value;
}catch{
console.error('Could not find save location.')
}
});

});

// Attach event listener to each input element
const inputs = document.querySelectorAll('.rightText')
inputs.forEach((input, index) => {

const file = load.Data.miscInfo.ledger[index];

input.addEventListener('focusout', () => {  
//Save Data
let firstPeriodIndex = file.description.indexOf('.');
let firstSentence = file.description.slice(0, firstPeriodIndex + 1);
if(input.value !== firstSentence){
const index = input.getAttribute('id');
const entry = load.Data.miscInfo.ledger[index];
load.fileName = locationLabel.value;
try{
entry.description = input.value;
}catch{
load.Data.miscInfo.ledger.push({name: 'Insert Name.', description: input.value});
}
}
});

input.addEventListener('input', () => {
// Change height.
input.style.height = 'auto';
input.style.height = input.scrollHeight + 'px';
});


input.addEventListener('click', (event) => {

let firstPeriodIndex = file.description.indexOf('.');
let firstSentence = file.description.slice(0, firstPeriodIndex + 1);

if(input.value === firstSentence){
input.value = file.description;
// Change height.
input.style.height = 'auto';
input.style.height = input.scrollHeight + 'px';
};

if(event.shiftKey){
//Save Data
if(input.value !== firstSentence){
const index = input.getAttribute('id');
const entry = load.Data.miscInfo.ledger[index];
load.fileName = locationLabel.value;
try{
entry.description = input.value;
}catch{
load.Data.miscInfo.ledger.push({name: 'Insert Name.', description: input.value});
}
}

//Return to one-sentence view.
let firstPeriodIndex = file.description.indexOf('.');
let newFirstSentence = file.description.slice(0, firstPeriodIndex + 1);

input.value = newFirstSentence;
input.style.height = 'auto';
input.style.height = input.scrollHeight + 'px';
}
   
});

input.addEventListener('focus', () => {
input.setSelectionRange(input.value.length, input.value.length);
});

// Set the initial height based on the scroll height of the content
input.style.height = 'auto';
input.style.height = input.scrollHeight + 'px';

});


},



};




export default Storyteller;

