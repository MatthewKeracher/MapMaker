import Edit from "./edit.js";
import Ref from "./ref.js";
import NPCs from "./npcs.js";



const Ambience = {

phase: 0,
hour: 0,
current: '',
genDesc: "",
senseDesc:"",
ambienceArray: [],

async getAmbience(){

Ambience.clock();
const Spring = Ref.mainAmbienceDropdown.value;
const Morning= Ref.secondAmbienceDropdown[Ambience.phase].value;

//Within Random Selection, filter through.
const senses = ["sight", "smell", "touch", "feel"];
const chosenSense = senses[Ambience.hour];
const ambienceEntry = await this.loadAmbienceEntry(Spring, Morning);

//Retain returned entry until next phase. Do not delete!
this.current = ambienceEntry; 

this.genDesc = "";
this.senseDesc = "";

this.genDesc = ambienceEntry.description
this.senseDesc = ambienceEntry[chosenSense]

}, 

async loadAmbienceArray() {

try {
const response = await fetch('ambience.json'); // Adjust the path if needed
const data = await response.json();
this.ambienceArray = data;
return data.ambience;

} catch (error) {
console.error('Error loading ambience array:', error);
return [];
}

},    

async initializeAmbienceDropdowns() {

const ambienceArray = await this.loadAmbienceArray();
const uniqueContext = [...new Set(ambienceArray.map(item => item.context))];
this.populateDropdown(document.getElementById("contextDropdown"), uniqueContext);

// Set default context, main, and second values
const defaultContext = uniqueContext[0];
const filteredByDefaultContext = ambienceArray.filter(item => item.context === defaultContext);
const defaultMain = filteredByDefaultContext.length > 0 ? filteredByDefaultContext[0].main : "";
const filteredByDefaultMain = ambienceArray.filter(item => item.main === defaultMain);
const defaultSecond = filteredByDefaultMain.length > 0 ? filteredByDefaultMain[0].second : "";

// Set default values for dropdowns
Ref.contextDropdown.value = defaultContext;
this.populateDropdown(Ref.mainAmbienceDropdown, [...new Set(filteredByDefaultContext.map(item => item.main))]);
Ref.mainAmbienceDropdown.value = defaultMain;
this.populateDropdown(Ref.secondAmbienceDropdown, [...new Set(filteredByDefaultMain.map(item => item.second))]);
Ref.secondAmbienceDropdown.value = defaultSecond;

Ref.radianceDropdown.addEventListener("change", () => {
console.log('radiate');
this.radiateDisplay();
});

Ref.contextDropdown.addEventListener("change", () => {
const selectedContext = Ref.contextDropdown.value;
const filteredByContext = ambienceArray.filter(item => item.context === selectedContext);

if (filteredByContext.length > 0) {
const uniqueMain = [...new Set(filteredByContext.map(item => item.main))];
this.populateDropdown(Ref.mainAmbienceDropdown, uniqueMain);

this.simMainDrop();

} else {
Ref.mainAmbienceDropdown.innerHTML = '<option value="">No Data</option>';
Ref.secondAmbienceDropdown.innerHTML = '<option value="">No Data</option>';
}
});

Ref.mainAmbienceDropdown.addEventListener("change", () => {
const selectedMain = Ref.mainAmbienceDropdown.value;
const filteredByMain = ambienceArray.filter(item => item.main === selectedMain);
const uniqueFilteredSecond = [...new Set(filteredByMain.map(item => item.second))];
this.populateDropdown(Ref.secondAmbienceDropdown, uniqueFilteredSecond);
});

Ref.secondAmbienceDropdown.addEventListener("change", () => {
// Handle second dropdown change
});
},

populateDropdown(dropdown, options) {
dropdown.innerHTML = ''; // Clear existing options

options.forEach(option => {
const optionElement = document.createElement("option");
optionElement.value = option;
optionElement.text = option;
dropdown.appendChild(optionElement);
});
},

simConDrop(){

//Simulate Click on Second Dropdown
const event = new Event("change", { bubbles: true, cancelable: true });

Ref.contextDropdown.dispatchEvent(event);

},

simMainDrop(){

//Simulate Click on Second Dropdown
const event = new Event("change", { bubbles: true, cancelable: true });

Ref.mainAmbienceDropdown.dispatchEvent(event);

},

async loadAmbienceEntry(main, second) {

const ambienceArray = await this.loadAmbienceArray();

// Filter ambienceArray based on selected values
const filterArray = ambienceArray.filter(entry =>
entry.main === main && entry.second === second
);

//console.log('current: ' + this.current);

if(this.current === ''){
const randomEntry = filterArray[Math.floor(Math.random() * filterArray.length)];
return randomEntry;     
};

//console.log('Time in Ambience -- Hour: ' + this.hour + '; Phase: ' + this.phase);

if(this.hour > 0){

return this.current;       

}else{

if(this.hour === 0){

const randomEntry = filterArray[Math.floor(Math.random() * filterArray.length)];
//console.log('New Description: ' + randomEntry.title);
return randomEntry;
}}


},

async clock(){

if(!Edit.editMode){
if(this.hour < 3){
this.hour = this.hour + 1;                
}else{
if(this.hour === 3){
console.log('New Phase')   
this.hour = 0;
if(this.phase === 2){
console.log('New Day')
this.phase = 0;    
}else{
this.phase = this.phase + 1;
}
}
}

this.radiateDisplay();

}},

radiateDisplay(){

const overlay = document.getElementById('radiantDisplay');
const radianceDropdown = document.getElementById('radianceDropdown').value;

if(radianceDropdown === 'exterior'){
switch (this.phase) {
case 0: // Morning
switch (this.hour) {
case 0: 

overlay.style.backgroundColor = "midnightblue"; /* Set your desired background color */
overlay.style.opacity = "0.2";

break;

case 1: 

overlay.style.backgroundColor = "gold"; /* Set your desired background color */
overlay.style.opacity = "0.1";

break;

case 2: 

overlay.style.backgroundColor = "gold"; /* Set your desired background color */
overlay.style.opacity = "0.2";


break;

case 3: 

overlay.style.backgroundColor = "gold"; /* Set your desired background color */
overlay.style.opacity = "0.3";

break;

default:
break;
}
break;

case 1: // Afternoon
switch (this.hour) {
case 0: 

overlay.style.backgroundColor = "gold"; /* Set your desired background color */
overlay.style.opacity = "0.2";

break;

case 1: 

overlay.style.backgroundColor = "skyblue"; /* Set your desired background color */
overlay.style.opacity = "0.1";

break;

case 2: 

overlay.style.backgroundColor = "skyblue"; /* Set your desired background color */
overlay.style.opacity = "0.2";


break;

case 3: 

overlay.style.backgroundColor = "skyblue"; /* Set your desired background color */
overlay.style.opacity = "0.3";

break;

default:
break;
}
break;

case 2: // Night
switch (this.hour) {
case 0: 

overlay.style.backgroundColor = "midnightblue"; /* Set your desired background color */
overlay.style.opacity = "0.4";

break;

case 1: 

overlay.style.backgroundColor = "midnightblue"; /* Set your desired background color */
overlay.style.opacity = "0.5";

break;

case 2: 

overlay.style.backgroundColor = "midnightblue"; /* Set your desired background color */
overlay.style.opacity = "0.6";


break;

case 3: 

overlay.style.backgroundColor = "midnightblue"; /* Set your desired background color */
overlay.style.opacity = "0.7";

break;

default:
break;
}
break;

default:
break;
}
}else{

overlay.style.backgroundColor = "midnightblue"; /* Set your desired background color */
overlay.style.opacity = "0.5";

}


},


loadAmbienceList: function(data) {

const itemList = document.getElementById('itemList'); // Do not delete!!

// Clear the existing content
itemList.innerHTML = '';

// Get an array of item names and sort them alphabetically
const ambienceNames = Object.keys(data).sort();

// Iterate through the sorted monster names
for (const ambienceName of ambienceNames) {
const ambience = data[ambienceName];
const ambienceNameDiv = document.createElement('div');
ambienceNameDiv.innerHTML = `[${ambience.main}] <span class="cyan">${ambience.title}</span>`;
itemList.appendChild(ambienceNameDiv);
//this.fillItemsForm(ambience, ambienceNameDiv);
}

itemList.style.display = 'block'; // Display the NPC names container

NPCs.fixDisplay();
}, 


};

export default Ambience;

