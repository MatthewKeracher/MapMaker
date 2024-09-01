
import Events from "./events.js";
import expandable from "./expandable.js";
import load from "./load.js";
import NPCs from "./npcs.js";
import helper from "./helper.js";
import Map from "./map.js";
import editor from "./editor.js"; 
import form from "./form.js";
import ref from "./ref.js";

const Storyteller = {

//locID
returnLocation: 0,
miscInfo: '',
currentLocationId: '',
parentLocationId: '',
grandParentLocationId: '',

async changeContent(locId) {

console.log('Loading Location Id:', locId)

let Story = ``

const locObj = load.Data.locations.find(entry => parseInt(entry.id) === parseInt(locId));
const locName = locObj.name
this.currentLocationId = locId

if(locObj.image && locObj.image !== ""){

this.parentLocationId = locId
this.grandParentLocationId = locObj.parentId

Map.fetchAndProcessImage(locObj.image)

}

//Change Location Label Contents
ref.locationLabel.value = locName;
helper.adjustFontSize();
ref.locationLabel.disabled = true;
ref.locationLabel.style.color = locObj.color;

//Set new Return Location
Storyteller.returnLocation = locId;

if (locObj) {
Events.eventDialogue = [];
Events.eventActions = [];
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
helper.addEventsToStoryteller();

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
    {name: "fighterHR", src: 'gifs/blankHead.png'},
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

};




export default Storyteller;

