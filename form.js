import ref from "./ref.js";
import load from "./load.js";
import NPCs from "./npcs.js";
import helper from "./helper.js";
import editor from "./editor.js"; 


const form = {

makeNew: false,
fullScreen: false,


createForm: function (obj){
//console.log(obj.name)
let color
let fullScreen = false

//Initialise Form.
if(obj){
//0.1. Set Colour of Form
if(obj.color){
color = obj.color;
}else{
color = 'cyan';
};

//0.2. Clear Form of old HTML divs.
['editForm', 'typeArea', 'nameArea', 'subTypeArea', 'breaker', 'newArea'].forEach(id => {
const element = document.getElementById(id);
if (element) {
element.remove();
}
});

//0.3. Reset displays to Default for new Form.
const fullScreenDivs = document.querySelectorAll('.fullScreen');


if (fullScreenDivs.length === 0) {
ref.Left.style.display = 'block';
} else{
fullScreen = true;
}

ref.Centre.innerHTML = '';
ref.Centre.style.display = 'block';
ref.Left.innerHTML = '';


const form = document.createElement('form');
form.id = 'editForm';
form.classList.add('form');
}

//If needed, make copy Obj for basis of new data entry.
if (editor.makeNew === true) {

// Create a deep copy of the original object
const newObj = JSON.parse(JSON.stringify(obj));

// Generate a unique ID for the new object
newObj.id = load.generateUniqueId(load.Data[obj.key], 'entry');
//newObj.active = 1;
//newObj.order = 1;
newObj.color = obj.color
const properKey = helper.proper(obj.key.slice(0, -1));
newObj.name = 'New ' + properKey + ' ' + newObj.id;
newObj.description = 'An unknown entity.'

obj = newObj


}

//Use Obj to fill Form.
if (obj) {

//Define key groups for different areas of the form.
const excludedKeys = ['id','name', 'description', 'key', 'tags', 'color']; 
const invisibleKeys = ['type', 'subType'];
const universalKeys = ['order','subGroup', 'group', 'image'];
const monsterKeys = [
    'encounter',
    'wild',
    'lair',
    'walk',
    'turn',
    'swim',
    'fly',
    'experience',
    'treasure',
    'lairTreasure'];

//Make ID Manually
if(obj.id){
const existingId = document.getElementById('currentId');
if (existingId) {
existingId.remove(); // Remove the existing form
}

const idArea = document.createElement('div');
idArea.id = 'currentIdArea';

let idContent =  
`<label class="entry-label" 
style="display: none"
divId="id">
</label>
<input
class="entry-input currentId" 
style="display:none"
divId="id"
id="currentId"
value="${obj.id || 'N/A'} ">`;

idArea.innerHTML = idContent;
ref.Left.appendChild(idArea);
}

//Make Invisible Elements
if(obj){

for (const key in obj) {
if (obj.hasOwnProperty(key) && invisibleKeys.includes(key)) { // Check if key is not excluded

const elementContainer = document.createElement('div');

let elementContent =  
`<h3 style="display:none">
<label class="expandable entry-label" 
style="font-family:'SoutaneBlack'; color:${color}"
key="rule" 
divId="${[key]}">
${helper.proper(key)}
</label>
<input class="leftTextshort white entry-input" 
id="edit${[key]}">
</input>
</h3>`;

elementContainer.innerHTML = elementContent;
ref.Left.appendChild(elementContainer);

const elementText = document.getElementById('edit' + key);
elementText.value = obj[key] || '';

}
}


};

//Make Description Manually
if(obj){

const description = document.createElement('div');
const centreText = fullScreen === true? 'fullScreenText' : 'centreText'

let centreContent =  
`<label class="entry-label"
style="font-family:'SoutaneBlack'; color: ${color}; width: auto;"
divId="description">
</label>

<textarea
id="descriptionText"
class="entry-input ${centreText}" 
></textarea>

<button id="fullScreenButton" class="singButton">
[...]</button>`;

description.innerHTML = centreContent;
ref.Centre.appendChild(description);
ref.Centre.style.display = 'block';

const button = document.getElementById('fullScreenButton');
const textBox = document.getElementById('descriptionText');
button.addEventListener('click', () => {
if(editor.fullScreen === true){
//Make normal.
ref.Left.style.display = "block";
editor.fullScreen = false;
ref.Centre.classList.remove("fullScreen");
ref.Centre.classList.add("Centre");
textBox.classList.remove("fullScreenText");
textBox.classList.add("centreText");
//Set Height
const descriptionText = document.getElementById('descriptionText');
descriptionText.textContent = obj.description || 'Insert information about ' + obj.name + ' here.';

// Set the initial height based on the scroll height of the content
descriptionText.style.height = 'auto';
descriptionText.style.height = descriptionText.scrollHeight + 'px';
}else if (editor.fullScreen === false){
//Make fullScreen.
ref.Left.style.display = "none";
ref.Centre.classList.remove("Centre");
ref.Centre.classList.add("fullScreen");
textBox.classList.remove("centreText");
textBox.classList.add("fullScreenText");
editor.fullScreen = true;
//Set Height
const descriptionText = document.getElementById('descriptionText');
descriptionText.textContent = obj.description || 'Insert information about ' + obj.name + ' here.';

// Set the initial height based on the scroll height of the content
descriptionText.style.height = 'auto';
descriptionText.style.height = descriptionText.scrollHeight + 'px';
};
});

const descriptionText = document.getElementById('descriptionText');
descriptionText.textContent = obj.description || 'Insert information about ' + obj.name + ' here.';

// Set the initial height based on the scroll height of the content
descriptionText.style.height = 'auto';
descriptionText.style.height = descriptionText.scrollHeight + 'px';

//Ref.Centre.style.height = descriptionText.scrollHeight + 'px';

descriptionText.addEventListener('input', function() {
// Set the height based on the scroll height of the content
this.style.height = 'auto';
this.style.height = this.scrollHeight + 'px';
//Ref.Centre.style.height = this.scrollHeight + 'px';
});
}

//Make Top Area -- Name, Type, subType.
if(obj){
const topArea = document.createElement('div');
topArea.style.display = 'block'; 

//2. Make Top Area Manually -- Key, duplicate subType
const topAreaTop = document.createElement('div');
topAreaTop.style.display = 'flex'; // Set the display property to flex

if(obj.key){
topArea.id = 'topArea';
const properKey = helper.proper(obj.key)
const key = obj.key

let keyContent =  
`<label 
style="display: none"
divId="key">
</label>
<input
pair="${key}" 
class="centreType" 
style="font-family:'SoutaneBlack'; color:${color}"
id="key"
value="${properKey || 'None'} ">`;

topAreaTop.innerHTML = keyContent;
ref.Left.appendChild(topAreaTop);
ref.Left.appendChild(topArea);
}

//3. Make Directory Manually
if(obj.subType){
const subType = obj.subType

const subTypeArea = document.createElement('div');
subTypeArea.id = 'subTypeArea';

let subTypeContent =  
`<label
style="display: none"
divId="subType">
</label>
<input
pair="${subType}" 
class="centreSubType" 
style="display: none; font-family:'SoutaneBlack'; color:white"
id="subTypeEntry"
value="${obj.group || 'none'} => ${obj.subGroup || 'none'} ">`;

topAreaTop.innerHTML += subTypeContent;
}

//4. Make Name Manually
if(obj.name){
const nameArea = document.createElement('div');
nameArea.id = 'nameArea';

let nameContent =  
`<h2><label class="entry-label" 
style="display: none"
divId="name">
</label>
<input 
class="entry-input centreName" 
style="font-family:'SoutaneBlack'; color:${color}"
type="text" 
divId="name"
value="${obj.name || 'insert name here'} "></h2>`;

nameArea.innerHTML = nameContent;
topArea.appendChild(nameArea);

// setTimeout(function() {
// nameArea.style.height = nameArea.scrollHeight + 'px';
// }, 0);
}

//Add Image
if(obj.image){
    const imageArea = document.createElement('div');
    imageArea.id = 'imageArea';
    
    let nameContent =  
    `<image 
    class="formImage"
    src="${obj.image}" 
    >`;
    
    imageArea.innerHTML = nameContent;
    topArea.appendChild(imageArea);

}

// //5. Add Breaker
// const breaker = document.createElement('hr')
// breaker.id = 'breaker';
// topArea.appendChild(breaker);


}

//Make Form Section with Universal Keys
if(obj){

const container = document.getElementById(this.buildSection('General Settings', obj));

for (const key in obj) {
if (obj.hasOwnProperty(key) && universalKeys.includes(key)) { // Check if key is not excluded

const elementContainer = document.createElement('div');

let elementContent =  
`<div class="field-table">

<div id="${key}Container" class="field-row">

<label divId="${[key]}" class="field-cell fieldName-column entry-label" style="color:${obj.color}">
${helper.proper(key)}
</label>

<input 
id="edit${[key]}" 
type="text" 
class="field-cell field-column leftTextshort entry-input">

</div>

</div>
`;

elementContainer.innerHTML = elementContent;
container.appendChild(elementContainer);

const elementText = document.getElementById('edit' + key);
const lineHeight = parseFloat(window.getComputedStyle(elementText).lineHeight);

elementText.value = obj[key] || '';

elementText.addEventListener('input', function() {
// Set the height based on the scroll height of the content
this.style.height = 'auto';
this.style.height = this.scrollHeight + 'px';
elementContainer.style.height = this.scrollHeight + lineHeight + 'px';
});

elementContainer.addEventListener('click', function() {
elementContainer.querySelector('.leftTextshort').focus();
elementContainer.querySelector('.leftTextshort').select();
});

}
}

// Add Color Selector Manually to Universal
const colorContainer = document.createElement('colorContainer');

let colorContent = 
`<div class="field-table">

<div id="colorContainer" class="field-row">

<label divId="color" class="field-cell fieldName-column entry-label" style="color:${obj.color}">
Colour
</label>

<input 
id="editcolor" 
type="color" 
class="field-cell fieldValue-column entry-input"
style="background-color: ${obj.color}"
value=${obj.color}
</input>
</div>

</div>
`;

colorContainer.innerHTML = colorContent;
container.appendChild(colorContainer);

const colorWheel = document.getElementById('editcolor');

function handleColorChange(event) {
    const color = event.target.value;
    //console.log(color)
    colorContainer.value = color;
    colorWheel.style.backgroundColor = color;

    
}

// Event listener for color input change
colorWheel.addEventListener('input', handleColorChange);

};

//Add NPC Form Elements
if(obj.key === 'npcs'){

//Add Class, Level, and Species
if(obj){

const container = document.getElementById(this.buildSection('Build', obj));
const keys = [
    {name: "class", options: ["Fighter", "Thief", "Magic User", "Cleric", "Assassin","Ranger"]},
    {name: "level"},
    {name: "alignment", options: [
    "Lawful Good",
    "Neutral Good",
    "Chaotic Good",
    "Lawful Neutral",
    "True Neutral",
    "Chaotic Neutral",
    "Lawful Evil",
    "Neutral Evil",
    "Chaotic Evil"]},
    {name: "species"}]

keys.forEach(key => {

// Inside the loop that creates memberDiv elements
const div = document.createElement('div');
    
let HTML = `
<div class="field-table">

    <div id="${key.name}Row" class="field-row">

    <label divId="${key.name}" class="field-cell fieldName-column entry-label" style="color:${obj.color}">${helper.proper(key.name)}
    </label>

    ${
        key.options ? 
        `<select 
        id="${key.name}Select" 
        class="field-cell field-column leftTextshort entry-input">
            ${key.options.map(option => `<option value="${option}" ${option === obj[key.name] ? 'selected' : ''}>${option}</option>`).join('')}
        </select>` :
        `<input id="${key.name}Entry" 
        type="text" 
        class="field-cell field-column leftTextshort entry-input" 
        value="${obj[key.name]}">`
    }

    </div>

    </div>
    `;

div.innerHTML = HTML;
container.appendChild(div);

})
    
}

//Add Scores
if(obj){

const container = document.getElementById(this.buildSection('Stats', obj));

const stats = ["Strength", "Dexterity", "Intelligence", "Wisdom", "Constitution", "Charisma"];

stats.forEach(stat =>{ 

    //console.log(obj['mod' + stat])
    // Inside the loop that creates memberDiv elements
    const statDiv = document.createElement('div');
    
    let statHTML = `
    <div class="scores-table">

    <div id="${stat}Row" class="score-row">

    <label divId="${stat}" class="score-cell scoreName-column entry-label" style="color:${obj.color}">${stat}
    </label>

    <input 
    id="${stat}Entry" 
    type="text" 
    class="score-cell score-column centreNumber entry-input"
    value=${obj[stat]}>

    <div class="score-cell modifier-column">( ${obj['mod' + stat]} )</div>

    </div>

    </div>
    `;
    
    statDiv.innerHTML = statHTML;
    container.appendChild(statDiv);

    const thisRow = document.getElementById(stat + 'Row')
    const thisEntry = document.getElementById(stat + 'Entry')

    thisRow.addEventListener('click', function() {
        thisEntry.focus();
        thisEntry.select();
    });

})
}

//Add Combat Information
if(obj.hitPoints){
    const container = document.getElementById(this.buildSection('Combat', obj));
    const dataKeys = [obj.hitPoints, obj.attackBonus, obj.armourClass, obj.damage, obj.attacks, obj.movement, obj.morale,obj.experience];
    const keys = ["Max Hit Points", "Attack Bonus", "Armour Class", "Damage", "# Attacks", "Movement", "Morale","Experience"];
    
    keys.forEach((key, index) => {
    
    // Inside the loop that creates memberDiv elements
    const div = document.createElement('div');
        
    let HTML = `
    <div class="field-table">
    
        <div id="${dataKeys[index]}Row" class="field-row">
        <label divId="${dataKeys[index]}" class="field-cell fieldName-column" style="color:${obj.color}">
        ${key}
        </label>
    
        <label 
        id="${dataKeys[index]}Entry" 
        type="text" 
        class="field-cell field-column leftTextshort">
        ${dataKeys[index]}
        </div>
    
        </div>
        `;
    
    div.innerHTML = HTML;
    container.appendChild(div);
    
    })
};

//Add Saving Throws
if(obj.savingThrows){
    const container = document.getElementById(this.buildSection('Saving Throws', obj));
    const dataKeys = Object.keys(obj.savingThrows);
    const keys = helper.convertKeys(obj.savingThrows);
    
    keys.forEach((key, index) => {
    
    // Inside the loop that creates memberDiv elements
    const div = document.createElement('div');
        
    let HTML = `
    <div class="field-table">
    
        <div id="${dataKeys[index]}Row" class="field-row">
    
        <label divId="${dataKeys[index]}" class="field-cell fieldName-column" style="color:${obj.color}">
        ${key}
        </label>
    
        <label 
        id="${dataKeys[index]}Entry" 
        type="text" 
        class="field-cell field-column leftTextshort">
        ${obj.savingThrows[dataKeys[index]]}
    
        </div>
    
        </div>
        `;
    
    div.innerHTML = HTML;
    container.appendChild(div);
    
    })
};

//Add Class-specific Skills
if(obj.Skills){
    const container = document.getElementById(this.buildSection(obj.class + ' Skills', obj));
    const dataKeys = Object.keys(obj.Skills);
    const keys = helper.convertKeys(obj.Skills);
    
    keys.forEach((key, index) => {
    
    // Inside the loop that creates memberDiv elements
    const div = document.createElement('div');
        
    let HTML = `
    <div class="field-table">
    
        <div id="${dataKeys[index]}Row" class="field-row">
    
        <label divId="${dataKeys[index]}" class="field-cell fieldName-column" style="color:${obj.color}">
        ${key}
        </label>
    
        <label 
        id="${dataKeys[index]}Entry" 
        type="text" 
        class="field-cell field-column leftTextshort">
        ${obj.Skills[dataKeys[index]]}
    
        </div>
    
        </div>
        `;
    
    div.innerHTML = HTML;
    container.appendChild(div);

})};


}

//Make Form Section with ${key} specific Keys.
if(obj.key !== 'npcs'){

const properKey = helper.proper(obj.key);
const container = document.getElementById(this.buildSection(properKey + ' Settings', obj));

for (const key in obj) {
    if (
        obj.hasOwnProperty(key) && 
        !excludedKeys.includes(key) && 
        !universalKeys.includes(key) && 
        !invisibleKeys.includes(key) &&
        !monsterKeys.includes(key)
    ) {  // Check if key is not excluded

const elementContainer = document.createElement('div');

let elementContent =  `
<div class="field-table">

    <div id="${[key]}Row" class="field-row">

    <label divId="${[key]}" class="field-cell fieldName-column entry-label" style="color:${obj.color}">
    ${helper.proper(key)}
    </label>

    <input 
    id="edit${[key]}" 
    type="text" 
    class="field-cell field-column leftTextshort entry-input">

    </div>

    </div>
    `;

elementContainer.innerHTML = elementContent;
container.appendChild(elementContainer);

const elementText = document.getElementById('edit' + key);
const lineHeight = parseFloat(window.getComputedStyle(elementText).lineHeight);
const numLines = Math.floor(elementText.scrollHeight / lineHeight);

elementText.value = obj[key] || '';

// if(numLines === 2){
// elementText.style.height = Math.max(elementText.scrollHeight - lineHeight, lineHeight) + 'px';
// } else {
// elementText.style.height = elementText.scrollHeight + 'px';
// }

elementText.addEventListener('input', function() {
// Set the height based on the scroll height of the content
this.style.height = 'auto';
this.style.height = this.scrollHeight + 'px';
elementContainer.style.height = this.scrollHeight + lineHeight + 'px';
});

elementContainer.addEventListener('click', function() {
elementContainer.querySelector('.leftTextshort').focus();
elementContainer.querySelector('.leftTextshort').select();
});

}
}
}

//Add Monster Form Elements
if(obj.key === 'monsters'){
    
    const sections = [
        {name: "Appearing", keys: ["encounter", "wild", "lair"]},
        {name: "Movement", keys: ["walk", "turn", "swim", "fly"]},
        {name: "Rewards", keys: ["treasure", "lairTreasure", "experience"]}
        ]
    
        sections.forEach(section => {

            const container = document.getElementById(this.buildSection(section.name, obj));
            const keys = section.keys;

            keys.forEach(key => {

            // Inside the loop that creates memberDiv elements
            const div = document.createElement('div');
                
            let HTML = `
            <div class="field-table">
            
                <div id="${key}Row" class="field-row">
            
                <label divId="${key}" class="field-cell fieldName-column entry-label" style="color:${obj.color}">${helper.proper(key)}
                </label> 
                
                <input id="${key}Entry" 
                type="text" 
                class="field-cell field-column leftTextshort entry-input" 
                value="${obj[key]}">

                </div>
            
                </div>
                `;
            
            div.innerHTML = HTML;
            container.appendChild(div);
            
            })
        });
    
}};

//Make Tags section.
form.addTagstoForm(obj);

},

addTagstoForm(obj){
//console.log(obj.tags);
if(obj){

let keys = ['tags', 'ambience', 'locations', 'subLocations', 'events', 'npcs', 'items', 'spells', 'monsters'];
let visibleKeys = [];
let display = '';

//For each kind of form, what kinds of tags are available?
if(obj.key === 'tags'){visibleKeys = ['tags', 'ambience', 'locations', 'subLocations', 'events', 'npcs', 'items', 'spells', 'monsters']};
if(obj.key === 'npcs'){visibleKeys = ['tags', 'npcs', 'items', 'spells']};
if(obj.key === 'ambience'){visibleKeys = ['tags']};
if(obj.key === 'locations'){visibleKeys = ['npcs', 'tags', 'subLocations']};
if(obj.key === 'subLocations'){visibleKeys = ['npcs', 'tags', 'locations']};
if(obj.key === 'items'){visibleKeys = ['tags', 'npcs', 'spells']};
if(obj.key === 'spells'){visibleKeys = ['tags', 'npcs', 'items']};
if(obj.key === 'monsters'){visibleKeys = ['tags', 'npcs']};
if(obj.key === 'events'){visibleKeys = ['tags']};

keys.forEach(key => {

    if(!visibleKeys.includes(key)){
        display = 'none'
        }else{
        display = 'block'
        };

const properKey = helper.proper(key)
const singleKey = properKey.endsWith('s')? properKey.slice(0, -1): properKey;
const container = document.getElementById(this.buildSection(properKey, obj, null, display));

//Make New Entry. 
if(obj && key !=='locations'){
const newTagArea = document.createElement('div');
let newTagContent = `<h3 style='display:${display}'><span class = 'editVisible leftText'>[Create New ${singleKey}]</span></h3>`;

newTagArea.innerHTML = newTagContent;
container.appendChild(newTagArea);

newTagArea.style.color = 'lightgray'

newTagArea.addEventListener('mouseenter', function(){
this.style.color = 'lime';
})

newTagArea.addEventListener('mouseleave', function(){
this.style.color = 'lightgray';
})

newTagArea.addEventListener('click', function(){

form.makeNewObj(obj, key);

})

};

//Delete All Entries.

let tagNumber = obj.tags.filter(tag => tag.key === key).length;

if(obj && tagNumber > 5){
const delTagsArea = document.createElement('div');
let deltagsContent = `<h3 style='display:${display}'><span class = 'editVisible leftText'>[Remove All ${singleKey}s]</span></h3>`;

delTagsArea.innerHTML = deltagsContent;
container.appendChild(delTagsArea);

delTagsArea.style.color = 'lightgray'

delTagsArea.addEventListener('mouseenter', function(){
this.style.color = 'darkred';
})

delTagsArea.addEventListener('mouseleave', function(){
this.style.color = 'lightgray';
})

delTagsArea.addEventListener('click', function() {
    // Filter out the tags that match the given key
    let tagsToDel = obj.tags.filter(tag => tag.key === key);

    // Loop over each tag to delete
    tagsToDel.forEach(tag => {
        // Get the object associated with the tag
        let taggedObj = helper.getObjfromTag(tag);

        // Find the corresponding mirror tag on the tagged object
        let mirrorTag = taggedObj.tags.filter(t => parseInt(t.id) === parseInt(obj.id) && t.key === obj.key);;

        // Log the mirror and home tags for debugging purposes
        //console.log(mirrorTag, homeTag);

        // Remove the mirror tag from the tagged object
        mirrorTag.forEach(t => {
            let index = taggedObj.tags.indexOf(t);
            if (index > -1) {
                taggedObj.tags.splice(index, 1);
            }
        });

    });

//Delete home objects.
obj.tags = obj.tags.filter(tag => tag.key !== key);
form.createForm(obj);

});

};

//Add Entries.
if(obj.tags){
let tagsToAdd = obj.tags.filter(entry => entry.key === key);

tagsToAdd.forEach(tag => {

    //Set indicator to save these items.
    tag.save = "true"

})

//Add tags from Tags of same key, so an item or spell gained through a Tag.
let keyTags = obj.tags.filter(entry => entry.key === "tags");

if (keyTags.length > 0){

keyTags.forEach(tag => {

    const tagObj = helper.getObjfromTag(tag);
    //console.log(tag)
    let associatedTags = tagObj.tags.filter(entry => entry.key === key);
 
    
    associatedTags.forEach(tag => {

        //Add into NPC's tags
        tag.save = "false"

        const allowedKeys = ['items', 'spells']

        if(allowedKeys.includes(tag.key)){
        tagsToAdd.push(tag);
        }

    })


})}

// //Follow Instructions
// if(obj.key !== 'tags'){
// const instructions = tagsToAdd.filter(tag => tag.special === 'instruction')

// instructions.forEach(instruction => {

//         let iKey = instruction.key
//         let iName = instruction.name
//         let iType = instruction.type
//         console.log(iKey, iName, iType)
//         let items = load.Data[iKey].filter(item => item[iType] === iName)

//         if(iType === 'subGroup'){

//         const randomIndex = Math.floor(Math.random() * items.length);
//         const randomObj = items[randomIndex];

//         const newTag = {key: randomObj.key, id: randomObj.id}
//         tagsToAdd.push(newTag)

//         }else if(iType === 'group'){

//         const randomIndex = Math.floor(Math.random() * items.length);
//         const randomObj = items[randomIndex];

//         const newTag = {key: randomObj.key, id: randomObj.id, tagSave: "true"}
//         tagsToAdd.push(newTag)


//         }
        
// })
// };

//console.log(tagsToAdd)
//Add ITEMS
if(key === 'items' && visibleKeys.includes('items')){

const itemsTable = document.createElement('div');

let itemsTableHTML =  `
<div class="item-table">
</div>`


itemsTable.innerHTML = itemsTableHTML;
container.appendChild(itemsTable);

tagsToAdd.forEach(tag => {

if(tag.special === 'instruction' && obj.key !== 'tags'){return}

const itemsRow = document.createElement('div');

let tagObj = helper.getObjfromTag(tag);

let tagName = tagObj.name

let rowHTML = `

<div id="${tagObj.name}Container" 
class = "tag item-row"
instName = "${tagObj.special? tagObj.name: ''}" 
instType = "${tagObj.special? tagObj.type: ''}" 
tagid = ${tag.id} 
tagkey = ${tag.key}
tagsave = ${tag.save}
tagbonus = ${(tag.bonus === "" || tag.bonus === undefined) ? "-" : tag.bonus}
tagquant = ${(tag.quantity === "" || tag.quantity === undefined) ? 1 : tag.quantity}
>

<label id="Item${tag.id}" class="item-name-cell item-column" style="color:${tagObj.color}">
${tagName}
</label>

<input 
id="${tagObj.name}Quantity" 
type="text" 
class="item-quant-cell item-quant-column"
value="${(tag.quantity === "" || tag.quantity === undefined) ? 1 : tag.quantity}">


<input 
id="${tagObj.name}Bonus" 
type="text" 
class="item-quant-cell item-bonus-column"
value="${(tag.bonus === "" || tag.bonus === undefined) ? "-" : tag.bonus}">

</div>`

itemsRow.innerHTML = rowHTML;
itemsTable.appendChild(itemsRow);

//console.log(itemsRow)

//Events for change of Quant or Bonus; update attributes in Row for Save
//Duplicate itemRow names!
const itemRow = document.getElementById(tagObj.name + "Container")
const quantInput = document.getElementById(tagObj.name + "Quantity");
const bonusInput = document.getElementById(tagObj.name + "Bonus");

quantInput.addEventListener('input', function(){
itemRow.setAttribute('tagquant', quantInput.value);
//console.log(itemRow);
});

bonusInput.addEventListener('input', function(){
itemRow.setAttribute('tagbonus', bonusInput.value);
});

quantInput.addEventListener('click', function(){
quantInput.focus();
quantInput.select();
});

bonusInput.addEventListener('click', function(){
bonusInput.focus();
bonusInput.select();
});


let tagEventDiv = document.getElementById('Item' + tag.id);

tagEventDiv.addEventListener('click', function(event){

if(event.shiftKey){ //shift-click
//Remove tag from item.
event.preventDefault();
console.log(tag, tagObj)
obj.tags = obj.tags.filter(item => item.id !== tag.id);

//Remove item from other item's tags.
if(!tagObj.special){

let delTags = tagObj.tags
//console.log(delTags, obj.id)
delTags = delTags.filter(item => parseInt(item.id) !== obj.id);
//console.log(delTags)
tagObj.tags = delTags;
}

//Repackage.
NPCs.buildNPC();
form.createForm(obj);
//Storyteller.refreshLocation();  
}

else if(event.button === 0 && !tagObj.special){ //left-click
//find tagObj based on Name!
form.createForm(tagObj);   
}
});
});


} else{
//If tag is not an item.
tagsToAdd.forEach(tag => {

let tagObj = helper.getObjfromTag(tag);

if(tag.special === 'instruction' && obj.key !== 'tags'){return}

let tagName = tagObj.name

const taggedArea = document.createElement('div');

let tagHTML = 
`<h3>
<span 
class = "tag"
tagid = ${tag.id} 
tagkey = ${tag.key}
instName = "${tagObj.special? tagObj.name: ''}" 
instType = "${tagObj.special? tagObj.type: ''}" 
tagbonus = ${(tag.bonus === "" || tag.bonus === undefined) ? null : tag.bonus}
tagquant = ${(tag.quantity === "" || tag.quantity === undefined) ? null : tag.quantity}
>
${tagName}
</span> 
</h3>`;

taggedArea.innerHTML = tagHTML;
container.appendChild(taggedArea);

taggedArea.style.color = tagObj.color;

taggedArea.addEventListener('click', function(event){

if(event.shiftKey){ //shift-click
//Remove tag from item.
event.preventDefault();
obj.tags = obj.tags.filter(item => item.id !== tag.id);

//Remove item from other item's tags.
if(!tagObj.special){

let delTags = tagObj.tags
//console.log(delTags, obj.id)
delTags = delTags.filter(item => parseInt(item.id) !== obj.id);
//console.log(delTags)
tagObj.tags = delTags;

}

//Repackage.
NPCs.buildNPC();
form.createForm(obj);
//Storyteller.refreshLocation();  
}

else if(event.button === 0 && !tagObj.special){ //left-click
//find tagObj based on Name!
form.createForm(tagObj);   
}

});

});

}

}

});
    
}

},

buildSection: function (headerValue, obj, parent, display){

const sectionHeadDiv = document.createElement('div');
let headerHTML = ``;

if(display === undefined){display = 'block'};
if(display === 'block'){headerHTML += `<hr>`;};

headerHTML += 
`<h3>
<span style="font-family:'SoutaneBlack'; color:lightgray; display: ${display}" id="${headerValue}Header">
${headerValue} [...]
</span></h3>`;

sectionHeadDiv.innerHTML = headerHTML;

if(parent){
parent.appendChild(sectionHeadDiv);
}else{
ref.Left.appendChild(sectionHeadDiv);
}

let headerDiv = headerValue + 'Header'
let headerContent = document.getElementById(headerDiv);
let index = editor.sectionShow.findIndex(entry => entry.section === headerDiv);

let currentShow
if(index === -1){
currentShow = 'none';
} else {
currentShow = editor.sectionShow[index].visible === 1? 'block' : 'none';
}


// Add Show/Hide on Header for Section
sectionHeadDiv.addEventListener('click', function() {

// 1 --- Show
if(container.style.display === "none") {

container.style.display = "block";
headerContent.textContent = headerValue + ':';

let sectionData = {section: headerDiv, visible: 1};

//Update sectionShow data.
if(index === -1){
editor.sectionShow.push(sectionData);
}else{
editor.sectionShow[index] = sectionData; 
}
} 

//2 --- Hide
else if(container.style.display === "block") {

container.style.display = "none";
headerContent.textContent = headerValue + ' [...]';

let sectionData = {section: headerDiv, visible: 0};

//Update sectionShow data.
if(index === -1){
editor.sectionShow.push(sectionData);
}else{
editor.sectionShow[index] = sectionData; 
}

}
});

//Add Container -- Settings
const newContainer = document.createElement('div');
let containerName = headerValue + 'Container'
newContainer.setAttribute('id', containerName);
newContainer.classList.add('no-hover');
newContainer.classList.add('collapse');
ref.Left.appendChild(newContainer);
const container = document.getElementById(containerName);
container.style.display = currentShow;

return containerName

},

makeMultipleObjs(num, obj, key){

    for (let i = 0; i < num; i++) {
        form.makeNewObj(obj, key, i);
    }

},

makeNewObj(obj, key, copy){

//Dynamically create proper and single key names for obj and copy.
const properKey = helper.proper(key)
const singleKey = properKey.endsWith('s')? properKey.slice(0, -1): properKey;
const properObjKey = helper.proper(obj.key)
const singleObjKey = properObjKey.endsWith('s')? properObjKey.slice(0, -1): properObjKey;

//Make a copy of an object in the same key.
let newEntry 

//Generate new unique ID.
const newId = load.generateUniqueId(load.Data[key], 'entry');

if(copy === undefined){
    //Making a blankish new Obj.
    newEntry = JSON.parse(JSON.stringify(load.Data[key][0]));

    // Empty the value of each property
    for (let prop in newEntry) {
    if (newEntry.hasOwnProperty(prop)) {
    newEntry[prop] = ''; 
    }
    }
    //Define what values for copy "newEntry".
    newEntry.type = 'group',
    newEntry.subType = 'subGroup',
    newEntry.key = key,
    newEntry.id = newId,
    newEntry.color = obj.color,
    newEntry.name = singleKey + ' ' + newId,
    newEntry.tags = [{key: obj.key, id: obj.id}],
    newEntry.group = helper.proper(obj.key),
    newEntry.subGroup = obj.name,
    newEntry.description = 'This '+ singleKey + ' has been generated and attached to ' + singleObjKey + ' ' + obj.name + '. Click here to edit it. ',

    //Optional
    newEntry.active = 1;
    newEntry.order = 1;

    if(key === 'tags'){newEntry.chance = 100}

    //Add new Tag to curent Object
    let index = load.Data[obj.key].findIndex(entry => parseInt(entry.id) === parseInt(obj.id));
    let objEntry = {key: key, id: newId};
    load.Data[obj.key][index].tags.push(objEntry);

}else if (copy !== undefined){
    //Making n exact copies.
    newEntry = JSON.parse(JSON.stringify(obj));

    //Define what values for copies.
    newEntry.id = newId,
    newEntry.name = obj.name + ' ' + (copy + 2)
    newEntry.order = parseInt(copy) + parseInt(obj.order);

    //Add new obj to all original tags.
    let tags = obj.tags
    tags.forEach(tag => {

    let tagObj = helper.getObjfromTag(tag);
    tagObj.tags.push({key: obj.key, id: newId});

    })

    //console.log(obj.tags, newEntry.tags)

}

//Add newEntry to Data
load.Data[key].push(newEntry);
//console.log(newEntry)
//Load new Tag!
form.createForm(newEntry); 
saveButton.click(); 

},


};

export default form;