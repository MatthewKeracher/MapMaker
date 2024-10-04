//Helper should not take outside references, except load.Data[...]
import load from "./load.js";
import editor from "./editor.js"; 
import form from "./form.js";
import NPCs from "./npcs.js";
import ref from "./ref.js";
import Events from "./events.js";
import expandable from "./expandable.js";
import party from "./party.js";

const helper = {

sortData(data){

for (const key in data) {
let obj = data[key];

if (key === 'locations' || key === 'subLocations') {
obj = obj.map(entry => {

//

return entry

})
}

data[key] = obj;
console.log(obj)
}
},

followInstructions(instruction, obj) {

//console.log(instruction)

let quantity = instruction.quantity? instruction.quantity : 1;
let madeItems = obj.tags.filter(tag => tag.instruction === instruction.id);
let options = []

if(madeItems.length === quantity){return};

const quantityRemaining = parseInt(quantity) - parseInt(madeItems.length);

if(instruction.group){
options = load.Data[instruction.key].filter(item => item[instruction.type] === instruction.name && item.group === instruction.group)
} else{ 
options = load.Data[instruction.key].filter(item => item[instruction.type] === instruction.name)
}


if(instruction.type === 'subGroup'){

for (let i = quantityRemaining; i > 0; i--) {

const randomIndex = Math.floor(Math.random() * options.length);
const randomObj = options[randomIndex];

const newItemTag = {key: randomObj.key, id: randomObj.id, instruction: instruction.id, quantity: "1", chance: instruction.chance}

const newItem = helper.getObjfromTag(newItemTag)

// obj.tags.push(newItemTag)
// newItem.tags.push({key: obj.key, id: obj.id, quantity: "1", chance: instruction.chance})

madeItems.push({item: newItem, tag: newItemTag})

options.splice(randomIndex, 1)


}

}else if(instruction.type === 'group'){
    
const options = load.Data[instruction.key].filter(item => item[instruction.type] === instruction.name)

for (let i = quantityRemaining; i > 0; i--) {

const randomIndex = Math.floor(Math.random() * options.length);
const randomObj = options[randomIndex];

const newTag = {key: randomObj.key, id: randomObj.id, instruction: instruction.id, chance: instruction.chance}
madeItems.push(newTag)


}
}

return madeItems

},

getSize(jsonObject) {
   // Convert the JSON object to a string
   const jsonString = JSON.stringify(jsonObject);
    
   // Calculate the size in bytes
   const sizeInBytes = new TextEncoder().encode(jsonString).length;

   // Convert bytes to megabytes
   const sizeInMB = sizeInBytes / (1024 * 1024);

   return sizeInMB.toFixed(2) + ' megaBytes'; // Return the size in MB
},

getCurrentAC(npc){

    if(npc.key === 'monsters'){return npc.armourClass};
    
    //Check for Highest AC Value.
    const itemTags = npc.tags.filter(tag => tag.key === 'items')
    
    //Add tags from Tags of same key, so an item or spell gained through a Tag.
    let keyTags = npc.tags.filter(entry => entry.key === "tags");
    keyTags.forEach(tag => {
    
    const tagObj = helper.getObjfromTag(tag);
    let associatedTags = tagObj.tags.filter(tag => tag.key === 'items' || tag.key === 'spells');
    
    associatedTags.forEach(tag => {
    
    //Add into NPC's tags
    itemTags.push(tag);
    
    }) })
    
    
    let npcArmourClass = npc.armourClass; //Default Value
    let npcArmourBonus = 0;
    
    itemTags.forEach(option => {
    
    const optionObj = helper.getObjfromTag(option);
    const optionAC = optionObj.armourClass;
    const shieldCheck = optionAC? optionAC.toString().charAt(0) : '';
    const isShield = shieldCheck === '+'
    
    
    if(isShield){
    let shieldAC = optionAC.slice(1);
    npcArmourBonus =  npcArmourBonus + shieldAC;
    return
    }
    
    if(npc.armourClass < optionObj.armourClass){
    npcArmourClass = optionObj.armourClass
    }
    })
    
    let finalAC = parseInt(npcArmourClass) + parseInt(npcArmourBonus);
    
    return finalAC;
},

genPotions(){

  const potions = [
      {
          name: "Clairaudience",
          description: "Enables the drinker to hear sounds in another area through the ears of a living creature up to 60' away, functioning as the spell clairvoyance.",
          duration: "1d6+6 turns"
      },
      {
          name: "Clairvoyance",
          description: "Grants the effect of the clairvoyance spell.",
          duration: "1d6+6 turns"
      },
      {
          name: "Cold Resistance",
          description: "Grants the power of the spell resist cold.",
          duration: "1d6+6 turns"
      },
      {
          name: "Control Animal",
          description: "Functions like control human but affects only normal, non-magical animals.",
          duration: "1d6+6 turns"
      },
      {
          name: "Control Dragon",
          description: "Functions like control human but affects only dragons.",
          duration: "1d6+6 turns"
      },
      {
          name: "Control Giant",
          description: "Functions like control human but affects only giants.",
          duration: "1d6+6 turns"
      },
      {
          name: "Control Human",
          description: "Allows the drinker to charm a human, demi-human, or humanoid by gazing at them, functioning as the charm person spell.",
          duration: "1d6+6 turns"
      },
      {
          name: "Control Plant",
          description: "Grants control over plants or plant creatures within a 10' square area up to 50' away, making normal plants animated and plant creatures behave as if under charm monster.",
          duration: "1d6+6 turns"
      },
      {
          name: "Control Undead",
          description: "Grants command of 3d6 hit dice of undead monsters, with a save vs. Spells allowed to resist the effect.",
          duration: "1d6+6 turns"
      },
      {
          name: "Delusion",
          description: "A cursed potion that appears as another potion when tested; the drinker briefly believes they have received the benefits of the 'other' potion, but the illusion is exposed quickly.",
          duration: "Varies"
      },
      {
          name: "Diminution",
          description: "Reduces the drinker and their items to one-twelfth of their original height and weight; the drinker becomes tiny and can move about undetected.",
          duration: "1d6+6 turns"
      },
      {
          name: "ESP",
          description: "Grants the power of the ESP spell.",
          duration: "1d6+6 turns"
      },
      {
          name: "Fire Resistance",
          description: "Grants the power of the spell resist fire.",
          duration: "1d6+6 turns"
      },
      {
          name: "Flying",
          description: "Grants the power of the spell fly.",
          duration: "1d6+6 turns"
      },
      {
          name: "Gaseous Form",
          description: "Transforms the drinker and their gear into an insubstantial, misty form with AC 22 vs. magical weapons; the drinker cannot attack or cast spells, and moves at 10' per turn.",
          duration: "1d4+1 turns (per third of potion)"
      },
      {
          name: "Giant Strength",
          description: "Grants the Strength of a giant, with +5 on attack and damage rolls and the ability to throw large stones.",
          duration: "1d6+6 turns"
      },
      {
          name: "Growth",
          description: "Doubles the drinker’s height and increases their weight eightfold, granting Strength of a Stone Giant but without rock-throwing ability.",
          duration: "1d6+6 turns"
      },
      {
          name: "Healing",
          description: "Provides 1d6+1 hit points of healing as the spell cure light wounds.",
          duration: "Immediate"
      },
      {
          name: "Heroism",
          description: "Improves the fighting ability of the drinker, with varying effects based on the drinker's level, including temporary hit dice and attack bonuses.",
          duration: "1d6+6 turns"
      },
      {
          name: "Invisibility",
          description: "Makes the drinker invisible as the spell; can be quaffed in thirds, with each drink lasting 1d4+1 turns.",
          duration: "1d4+1 turns (per third of potion)"
      },
      {
          name: "Invulnerability",
          description: "Grants a +2 bonus to Armor Class.",
          duration: "1d6+6 turns"
      },
      {
          name: "Levitation",
          description: "Grants the power of the spell levitate.",
          duration: "1d6+6 turns"
      },
      {
          name: "Longevity",
          description: "Makes the drinker younger by 1d10 years.",
          duration: "Permanent"
      },
      {
          name: "Poison",
          description: "A trap potion; the drinker must save vs. Poison or die, even if only a sip is imbibed.",
          duration: "Immediate"
      },
      {
          name: "Polymorph Self",
          description: "Grants the power of the spell polymorph self.",
          duration: "1d6+6 turns"
      },
      {
          name: "Speed",
          description: "Gives the drinker the benefits of the spell haste.",
          duration: "1d6+6 turns"
      },
      {
          name: "Treasure Finding",
          description: "Reveals the direction and approximate distance to the largest treasure hoard within a 300' spherical radius, detecting only metal coins.",
          duration: "1d6+6 turns"
      }
  ];

potions.forEach(potion => {

  const newId = load.generateUniqueId(load.Data.items, 'entry');

  const newGem = {
  description: potion.description,
  id: newId,
  type: "group",
  subType: "subGroup",
  name: "Potion of "  + potion.name,
  group: "Magic Items",
  subGroup: "Potions",
  order: "",
  color: "#800080",
  weight: "0.5",
  size: "S",
  cost: "500",
  damage: "",
  range: potion.duration,
  armourClass: "",
  key: "items",
  tags: []
  }
  
  load.Data.items.push(newGem)

})


},

genJewelry(data){

const gemsArray = data.items.filter(item => item.group === "Gem")
const jewelryArray = 

[
{"item": "Anklet", "weight": 0.1, "description": "A delicate metal ornament worn around the ankle."},
{"item": "Earring", "weight": 0.01, "description": "A small, decorative piece of metal jewelry worn on the ear."},
{"item": "Belt", "weight": 0.5, "description": "A sturdy metal belt, often used as a functional and decorative accessory."},
{"item": "Flagon", "weight": 1.5, "description": "A large metal vessel used for drinking or serving beverages."},
{"item": "Bowl", "weight": 1, "description": "A round metal container used for holding food or liquids."},
{"item": "Goblet", "weight": 0.5, "description": "A decorative metal cup used for drinking."},
{"item": "Bracelet", "weight": 0.1, "description": "A simple metal band worn around the wrist."},
{"item": "Brooch", "weight": 0.05, "description": "A decorative metal pin used to fasten garments."},
{"item": "Buckle", "weight": 0.2, "description": "A metal clasp used to fasten a belt or strap."},
{"item": "Chain", "weight": 0.2, "description": "A series of interconnected metal links used as decoration or to hold objects."},
{"item": "Choker", "weight": 0.1, "description": "A close-fitting metal necklace worn around the neck."},
{"item": "Circlet", "weight": 0.25, "description": "A thin metal band worn around the head, often as a decorative crown."},
{"item": "Clasp", "weight": 0.05, "description": "A small metal fastener used to secure jewelry or clothing."},
{"item": "Comb", "weight": 0.1, "description": "A metal grooming tool used to style hair."},
{"item": "Crown", "weight": 0.75, "description": "An ornate metal headpiece worn by royalty."},
{"item": "Cup", "weight": 0.5, "description": "A simple metal vessel used for drinking."},
{"item": "Knife", "weight": 0.3, "description": "A small metal blade used for cutting or as a tool."},
{"item": "Letter Opener", "weight": 0.2, "description": "A slender metal tool used to open envelopes."},
{"item": "Locket", "weight": 0.05, "description": "A small metal pendant that opens to reveal a picture or keepsake."},
{"item": "Medal", "weight": 0.1, "description": "A metal disk awarded as a mark of achievement or honor."},
{"item": "Necklace", "weight": 0.3, "description": "A decorative metal chain or string worn around the neck."},
{"item": "Plate", "weight": 2, "description": "A flat metal dish used for serving food."},
{"item": "Pin", "weight": 0.02, "description": "A small metal fastener used to secure clothing or as a decoration."},
{"item": "Sceptre", "weight": 2.5, "description": "A ceremonial metal staff held by a ruler or dignitary."},
{"item": "Statuette", "weight": 5, "description": "A small metal sculpture, often used as a decorative piece."},
{"item": "Tiara", "weight": 0.6, "description": "An ornate metal headpiece worn by women, similar to a small crown."}
]


const materialArray = [
{name: 'Copper',
color: '#B87333',
value:0.5},
{name: 'Silver',
color: '#C0C0C0',
value: 5},
{name: 'Gold',
color: '#FFD700',
value:50},
{name: 'Platinum',
color: '#E5E4E2',
value:500},
{name: 'Electrum',
color: '#E7C697',
value:25}]

jewelryArray.forEach(piece => {

materialArray.forEach(material => {

const newId = load.generateUniqueId(load.Data.items, 'entry');

const newPiece = {
description: "An unknown entity.",
id: newId,
type: "group",
subType: "subGroup",
name: material.name + ' ' + piece.item,
group: "Jewelry",
subGroup: material.name + ' Jewelry',
order: "",
color: material.color,
weight: piece.weight,
size: "XS",
cost: piece.weight * material.value,
damage: "",
range: "",
armourClass: "",
key: "items",
description: piece.description,
tags: []
}

//console.log(load.Data.items.filter(entry => entry.name === newPiece.name))
load.Data.items = load.Data.items.filter(entry => entry.name !== newPiece.name)
load.Data.items.push(newPiece)

})

load.Data.items = load.Data.items.filter(entry => entry.name !== piece.item)

})



},

genGems(data){

const gemsArray = data.items.filter(item => item.subGroup === "Gem")
console.log(gemsArray)

const gemQualities = [
{name: "Ornamental",
value: 10,
numberFound: "1d10"},
{name: "Semiprecious",
value: 50,
numberFound: "1d10"},
{name: "Fancy",
value: 100,
numberFound: "1d10"},
{name: "Precious",
value: 500,
numberFound: "1d10"},
{name: "Gem",
value: 1000,
numberFound: "1d10"},
{name: "Jewel",
value: 5000,
numberFound: "1"},
]

const valueAdjustment = [
{result: 2,
adjustment: "Lower Value Row"},
{result: 3,
adjustment: 0.5},
{result: 4,
adjustment: 0.75},
{result: 5,
adjustment: 1},
{result: 6,
adjustment: 1},
{result: 7,
adjustment: 1},
{result: 8,
adjustment: 1},
{result: 9,
adjustment: 1},
{result: 10,
adjustment: 1.5},
{result: 11,
adjustment: 2},
{result: 12,
adjustment: "Next Value Row"},
]

gemsArray.forEach(gemEntry => {

const valueAdjustmentRoll = helper.rollMultipleDice('2d6')
const valueAdjustmentResult = valueAdjustment.find(entry => entry.result === valueAdjustmentRoll)

console.log('Result', valueAdjustmentResult)

gemQualities.forEach(qualEntry => {

const newId = load.generateUniqueId(load.Data.items, 'entry');

const newGem = {
description: "An unknown entity.",
id: newId,
type: "group",
subType: "subGroup",
name: gemEntry.name + " (" + qualEntry.name + ")",
group: "Gems",
subGroup: qualEntry.name,
order: "",
color: gemEntry.color,
weight: "*",
size: "XS",
cost: qualEntry.value,
damage: "",
range: "",
armourClass: "",
key: "items",
tags: []
}

load.Data.items.push(newGem)


})

load.Data.items = load.Data.items.filter(entry => entry !== gemEntry)

})

},

makeHitPointBoxes(npc){

let numberBoxes = npc.hitPoints;
let checkboxesHTML = '';


checkboxesHTML += `<input 
id="${npc.id}CurrentHP" 
type="number" 
class="item-quant-cell item-quant-column"
value="${npc.hitPoints}">`


// Return the generated HTML string
return checkboxesHTML;

},

coinLogic(item,itemQuant){

if(item.special){return}
    
let itemValue = item.cost.toString()
let costValue = itemValue
let color = ''

if(!itemQuant){itemQuant = 1}

const coinValues = [
{coin: 'cp', value: 0.01},
{coin: 'sp', value: 0.1},
{coin: 'ep', value: 0.5},
{coin: 'gp', value: 1},
{coin: 'pp', value: 100},
]

let matchedCoin = coinValues.find(coinObj => itemValue.includes(coinObj.coin));

if (matchedCoin) {
//As Gold Decimal
costValue = parseFloat(itemValue.replace(matchedCoin.coin, '')) * matchedCoin.value;

//of type 0.00gp now
}

itemValue = (costValue * itemQuant).toFixed(2);

const decimalPlaces = this.getDecimalPlaces(parseFloat(itemValue))

// if(itemQuant === 1){

if(decimalPlaces === 2){
itemValue = (itemValue * 100).toFixed(0) + ' Copper Coins'
color = '#B87333'
}else if(decimalPlaces === 1){
itemValue = (itemValue * 10).toFixed(0) + ' Silver Coins'
color = '#C0C0C0'
} else if(decimalPlaces === 0){
itemValue = (itemValue * 1).toFixed(0) + ' Gold Coins'
color = '#FFD700'
}

// }else{

// itemValue = itemValue * itemQuant

// if(decimalPlaces === 2){
// itemValue = itemValue * 100 + ' Copper Coins'
// color = '#B87333'
// }else if(decimalPlaces === 1){
// itemValue = itemValue * 10 + ' Silver Coins'
// color = '#C0C0C0'
// } else if(decimalPlaces === 0){
// itemValue = itemValue * 1 + ' Gold Coins'
// color = '#FFD700'
// }

// }



// (parseFloat(item.cost) * parseFloat(itemQuant)).toFixed(2).replace(/\.?0+$/, '') + 'gp (' + item.cost + ' gp each)': 
// item.cost + ' gp'
let returnObj = {value: itemValue, color: color}
return returnObj

},

updateAttackContent(){

    const divs = document.querySelectorAll(".partyAttack")
    
    divs.forEach(div => {
    
    const npcId = div.getAttribute("npcId")
        
    const options = party.attacks.filter(entry => parseInt(entry.member) === parseInt(npcId));
      
    if(options === undefined || options.length < 2){return}
    
    const currentOption = options.findIndex(option => option.entry === div.textContent)
    
    let newOption = "Uh Oh!"
    
    if(currentOption === options.length - 1){
    newOption = options[0].entry
    }else{
    const randomIndex = Math.floor(Math.random() * options.length);
    newOption = options[randomIndex].entry
    }

    console.log(newOption, newOption.length)
     
    div.textContent = ''
    
    for (let i = 0; i < newOption.length; i++) {
      setTimeout(() => {
        div.textContent += newOption.charAt(i);
      }, i * 50); // delay increases with each iteration
    }
    
    })
    
        //expandable.goToEdit();
    },

updateEventContent(){

const npcDialogue = document.querySelectorAll(".npcDialogue")
const npcActions = document.querySelectorAll(".npcAction")

npcDialogue.forEach(div => {

const eventID = div.getAttribute("eventID")
const npcId = div.getAttribute("npcId")

const options = Events.eventDialogue.filter(event => parseInt(event.npcId) == parseInt(npcId));

//prepare fixedText
let fixedOptions = options.filter(option => option.type === 'fixed');
let fixedText = fixedOptions.map(option => option.description).join(' ');


if(options === undefined || options.length < 2){return}

const currentOption = options.findIndex(option => option.description === div.textContent)

let newOption = "I got nothing to say to you."

if(currentOption === options.length - 1){
newOption = options[0]
}else{
let nextOptions = options.filter(option => option.eventID !== eventID && option.type === 'random'); //options[currentOption + 1]
const randomIndex = Math.floor(Math.random() * nextOptions.length);
newOption = nextOptions[randomIndex]
}

//const color = newOption.color? newOption.color: "lime";
//div.setAttribute("style", `color:${color}`);

div.setAttribute("id", newOption.id)
div.setAttribute("key", "events")
div.textContent = ''

const newEventDesc = fixedText + ' ' + newOption.description;


for (let i = 0; i < newEventDesc.length; i++) {
  setTimeout(() => {
    div.textContent += newEventDesc.charAt(i);
  }, i * 50); // delay increases with each iteration
}

})

npcActions.forEach(div => {

    const eventID = div.getAttribute("eventID")
    const npcId = div.getAttribute("npcId")
    
    const options = Events.eventActions.filter(event => parseInt(event.npcId) == parseInt(npcId));

        //prepare fixedText
    let fixedOptions = options.filter(option => option.type === 'fixed');
    let fixedText = fixedOptions
    .map(option => `<span id=${option.id} key="events" class='npcActionSpan'>${option.description}</span>`)
    .join(' ');
    
    if(options === undefined){return}
    
    const currentOption = options.findIndex(option => option.description === div.textContent)
    
    let newOption = "They are standing around giving NPC Energy."
    
    if(currentOption === options.length - 1){
    newOption = options[0]
    }else{
    let nextOptions = options.filter(option => option.eventID !== eventID && option.type === 'random'); //options[currentOption + 1]
    const randomIndex = Math.floor(Math.random() * nextOptions.length);
    newOption = nextOptions[randomIndex]
    }
    
    //const color = newOption.color? newOption.color: "lime";
    //div.setAttribute("style", `color:${color}`);

    try{
    //div.setAttribute("eventID", newOption.id)
    div.textContent = ''
    
    const newEventDesc = `${fixedText} <span id=${newOption.id} key="events" class='npcActionSpan'>${newOption.description}</span>`;
    
    div.innerHTML = `${newEventDesc}`

    }catch{}
      
    })

    expandable.goToEdit();
},

getDecimalPlaces(value) {


if (!isFinite(value) || Math.floor(value) === value) {
// Return 0 if the value is not finite or if it's an integer
return 0;
}

// Convert the value to a string and split it at the decimal point
let valueString = value.toString();
let decimalPart = valueString.split('.')[1];

// Return the length of the decimal part
return decimalPart.length;
},

makeIteminfo(item, tag){
let itemQuant = tag.quantity && tag.quantity > 1? tag.quantity : tag.quantity && tag.quantity.includes('d')? helper.rollMultipleDice(tag.quantity) : '';
let itemBonus = tag.bonus && tag.bonus !== '-'? ' (' + tag.bonus + ')' : '';
let itemName = itemQuant + ' ' + item.name;
let typeInfo = item.special? 'Instruction' : item.damage? 'Weapon' : item.armourClass? 'Armour' : item.key === 'spells'? 'Spell' : 'misc';
let itemInfo = '';
let color = item.color;

if(typeInfo === 'Instruction'){
console.error(item, tag)
}

if(typeInfo === 'Weapon'){
itemInfo += item.damage + itemBonus + ' Damage' }

if(typeInfo === 'Armour'){
itemInfo += ' Armour Class: ' + item.armourClass + itemBonus}

if(typeInfo === 'Spell'){
itemInfo += item.class + ' ' + item.level}

if(typeInfo === 'misc'){
const returnedObj = helper.coinLogic(item,itemQuant)
const itemValue = returnedObj.value
color = returnedObj.color
itemInfo += itemValue;

}

let shortHTML = `
<div id="${item.name}Row" 
class = "story-item-row"
tagid = ${tag.id} 
tagkey = ${tag.key}>

<label key= ${item.key} id="${item.id}" class="member-cell" style="color:${item.color}">
${itemName}
</label>

</div>`


let itemHTML = `
<div id="${item.name}Row" 
class = "story-item-row"
tagid = ${tag.id} 
tagkey = ${tag.key}>

<label key= ${item.key} id="${item.id}" class="expandable story-name-cell story-name-column" style="color:${item.color}">
${itemName}
</label>

<label 
id="${typeInfo}" 
type="text" 
class="story-data-cell story-data-column" style="color:${typeInfo === 'misc'? color: item.color}">
${itemInfo}</label>

</div>`

let itemObj = {color: item.color, id: item.id, key: item.key, description: itemHTML, short: shortHTML}

return itemObj

},

hexToRGBA(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
},

cssColorToHex(cssColorName) {
const tempElement = document.createElement("div");
tempElement.style.color = cssColorName;
document.body.appendChild(tempElement);
const computedColor = window.getComputedStyle(tempElement).color;
document.body.removeChild(tempElement);
const match = computedColor.match(/\d+/g);
if (!match) return null;
const hex = match.map(x => {
const hexValue = parseInt(x).toString(16);
return hexValue.length === 1 ? "0" + hexValue : hexValue;
});
return `#${hex.join("")}`;
},

showPrompt(prompt, type, option1, option2) {
const promptBox = this.createPromptBox(prompt, type, option1, option2); // Assuming you're using "this" to refer to the object containing these functions
document.body.appendChild(promptBox);
},

createPromptBox(prompt, type, option1, option2) {
const promptBox = document.getElementById('promptBox');
promptBox.classList.add('prompt');
promptBox.innerHTML = '';

const promptContent = document.createElement('div');
promptContent.classList.add('prompt-content');

const promptText = document.createElement('p');
promptText.textContent = prompt;
promptContent.appendChild(promptText);

if(type === 'custom'){

const buttonContainer = document.createElement('div');
buttonContainer.classList.add('prompt-button-container');

const option1Button = document.createElement('button');
option1Button.textContent = option1;
option1Button.classList.add('prompt-button');
option1Button.onclick = () => { 
this.handleConfirm(true, promptBox); 
};

const option2Button = document.createElement('button');
option2Button.textContent = option2;
option2Button.classList.add('prompt-button');
option2Button.onclick = () => { 
this.handleConfirm(false, promptBox); 
};

buttonContainer.appendChild(option1Button);
buttonContainer.appendChild(option2Button);


promptContent.appendChild(buttonContainer);
}


if(type === 'yesNo'){

const buttonContainer = document.createElement('div');
buttonContainer.classList.add('prompt-button-container');

const yesButton = document.createElement('button');
yesButton.textContent = 'Yes';
yesButton.classList.add('prompt-button');
yesButton.onclick = () => { 
this.handleConfirm(true, promptBox); 
};

const noButton = document.createElement('button');
noButton.textContent = 'No';
noButton.classList.add('prompt-button');
noButton.onclick = () => { 
this.handleConfirm(false, promptBox); 
};

buttonContainer.appendChild(yesButton);
buttonContainer.appendChild(noButton);


promptContent.appendChild(buttonContainer);
}

if(type === 'input'){
const userInput = document.createElement('input');
userInput.placeholder = 'Type here...';
userInput.classList.add('userInput');

const buttonContainer = document.createElement('div');
buttonContainer.classList.add('prompt-button-container');

const confirmButton = document.createElement('button');
confirmButton.textContent = 'Confirm';
confirmButton.classList.add('prompt-button');
confirmButton.onclick = () => { 
this.handleConfirm(userInput.value, promptBox); 
};

const cancelButton = document.createElement('button');
cancelButton.textContent = 'Cancel';
cancelButton.classList.add('prompt-button');
cancelButton.onclick = () => { 
this.handleConfirm(null, promptBox); 
};

buttonContainer.appendChild(confirmButton);
buttonContainer.appendChild(cancelButton);

promptContent.appendChild(userInput);
promptContent.appendChild(buttonContainer);
}

promptBox.appendChild(promptContent);
promptBox.style.display = 'block';

return promptBox;
},

handleConfirm(response, promptBox) {
promptBox.style.display = 'none';

if (response !== null) {
// Do something with the response
console.log('User response:', response);
} else {
// User cancelled
console.log('User cancelled');
}
},

adjustFontSize() {
// Default font size
let fontSize = 3.8; // Set your default font size here

// Set initial font size
ref.locationLabel.style.fontSize = fontSize + 'vh';

// Check if the text overflows
while (ref.locationLabel.scrollWidth > ref.locationLabel.offsetWidth) {
// Reduce font size
fontSize -= 0.1;
ref.locationLabel.style.fontSize = fontSize + 'vh';
}
},

proper(string){
try{
return string.split(/(?=[A-Z])/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}catch{
return string;
}
},

convertKeys(keys) {
//console.log(keys)
const properWords = [];
for (const key in keys) {
const words = key.split(/(?=[A-Z])/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
properWords.push(words);
}
return properWords;
},

getIndex(key, id){

try{
const index = load.Data[key].findIndex(obj => parseInt(obj.id) === parseInt(id))
return index
}catch{ console.error(key, id)}


},

standardizeCost(cost) {
// Use regex to find the figure followed by a space and optional '+'
const match = cost.match(/(\d+)(\s*\+*)/);

if (match) {
// Extract the figure and optional '+'
const figure = match[1];
const plusSign = match[2];

// Divide the figure by 100 and add back the optional '+'
const inGold = figure / 100 + plusSign;

return inGold;
}

return cost; // Return the original cost if no match is found
},

filterRandomOptions(obj, npc){

let returnDesc

 // Initialize arrays to store statements beginning with ?? and --
 const randomOptions = [];
 const stickOptions = [];

 // Split the description into lines
 const lines = obj.description.split('\n');

 // Filter lines based on their starting characters
 lines.forEach(line => {
     const trimmedLine = line.trim();

     if (trimmedLine.startsWith('??')) {
         // Add to randomOptions array, removing the '??' prefix
         randomOptions.push(trimmedLine.substring(2).trim());
     } else if (trimmedLine.startsWith('**')) {
         // Add to dashOptions array, removing the '**' prefix
         stickOptions.push(trimmedLine.substring(2).trim());
     }
 });

// Choose a random option from the randomOptions array if available
if (randomOptions.length > 0) {
    const randomIndex = Math.floor(Math.random() * randomOptions.length);
    const selectedOption = randomOptions[randomIndex];
    const npcEvent = npc ? 'npcEvent' : 'notNPC';

    // console.log(stickOptions)
    // if (stickOptions.length > 0) {
    // let stickDesc = stickOptions.join('<br>');
    // returnDesc = `<span>${stickDesc}</span>`;
    // }

    let key
    let id

    if(npcEvent === 'npcEvent'){
    key = npc.key
    id = npc.id
    }else{
    key = obj.key
    id = obj.id
    }

    returnDesc = `<span id=${id} key=${key} class="${npcEvent}" eventID="${obj.id}">${selectedOption}</span>`;

} else {

returnDesc = `${obj.description}`;

}

return returnDesc;

},

getSurname(fullName) {
// Split the full name into components
let nameComponents = fullName.split(' ');
// Extract the last component as the surname
let surname = nameComponents[nameComponents.length - 1];
return surname;
},

addTagtoItem(clickArray, currentArray){

const currentObjAddress = {key: currentArray.key, id: currentArray.id};
const currentObj = load.Data[currentArray.key][currentArray.index];
const currentObjTags = currentObj.tags;

const clickObjAddress = {key: clickArray.key, id: clickArray.id};
const clickObj = load.Data[clickArray.key][clickArray.index];
const clickObjTags = clickObj.tags;

//Check for duplicates.
const checkCurrent = currentObjTags.find(obj => clickArray.key === obj.key && clickArray.id === obj.id)? true: false;
const checkClick = clickObjTags.find(obj => currentArray.key === obj.key && currentArray.id === obj.id)? true: false;
const addtoSelfCheck = clickObj === currentObj? true:false;

if(checkCurrent === false && addtoSelfCheck === false){
currentObjTags.push(clickObjAddress)
}

if(checkClick === false && addtoSelfCheck === false){
clickObjTags.push(currentObjAddress);  
}

//Replace current tags with appended tags.
load.Data[currentArray.key][currentArray.index].tags = currentObjTags;
load.Data[clickArray.key][clickArray.index].tags = clickObjTags;

console.log(clickObj.name + ' added to ' + currentObj.name)

},

shiftClickItem(item){

//Choice whether to bulk add or random add!
helper.showPrompt('Add all items, or add random item?', 'custom', 'All', 'Random');
ref.promptBox.focus();
helper.handleConfirm = function(confirmation) {
const promptBox = document.querySelector('.prompt');
if (confirmation) { //'Add All Items'

helper.bulkAdd(item);   
promptBox.style.display = 'none';
} else{ //'Add Random Item'

}}



},

//Instead of linking to an Obj, link to an instruction to link to an Obj.
addInstruction(entryName, key, type, sectionName){

const currentId = document.getElementById('currentId').value;
const currentKey = document.getElementById('key').getAttribute('pair');
const currentIndex = load.Data[currentKey].findIndex(item => parseInt(item.id) === parseInt(currentId));

//Make a special 'instruction' tag.
let tag = {special: "instruction", id: "i" + Math.floor(Math.random() * 1000), key: key, type: type, name: entryName, group: sectionName}

load.Data[currentKey][currentIndex].tags.push(tag)
console.log(load.Data[currentKey][currentIndex])
//Finally, Repackage to reflect change.
NPCs.buildNPC();
form.createForm(load.Data[currentKey][currentIndex]);


},

bulkAdd(item){

//Bulk-Add    
//console.log(item)
//Key-ID pairs and Indexes for both Objs -- clicked and current.
const clickId = item.getAttribute('id')
const clickKey = item.getAttribute('key')
const clickIndex = load.Data[clickKey].findIndex(item => parseInt(item.id) === parseInt(clickId));
const clickArray = {id: clickId, key: clickKey, index: clickIndex}

const currentId = document.getElementById('currentId').value;
const currentKey = document.getElementById('key').getAttribute('pair');
const currentIndex = load.Data[currentKey].findIndex(item => parseInt(item.id) === parseInt(currentId));
const currentArray = {id: currentId, key: currentKey, index: currentIndex}

//Not sure if need this.
editor.addItem = false;

//...add the Tag to the Obj, and vice versa.
helper.addTagtoItem(clickArray, currentArray);

//Finally, Repackage to reflect change.
NPCs.buildNPC();
form.createForm(load.Data[currentKey][currentIndex]);


},

getAllTags(locObj){

let allTags = helper.getTagsfromObj(locObj);
let returnTags = [];
allTags = allTags.filter(obj => obj.key === 'tags');

let childTags = [];
allTags.forEach(objTag => {
let tagEvents = helper.getTagsfromObj(objTag);
let hasChildren = tagEvents.filter(obj => obj.key === 'tags' && parseInt(obj.order) > parseInt(objTag.order));

if(hasChildren.length > 0){
hasChildren.forEach(tag => {
childTags.push(tag);
})};
});

allTags = [...allTags, ...childTags];

allTags.forEach(tag => {

//Factor in Chance of Item appearing in the Container
const chance = parseInt(tag.chance)
const roll = helper.rollDice(100)
//console.log(chance, roll)
if(roll > chance && !tag.special ){return}
returnTags.push(tag)
})
    
return returnTags
    
    },

    
filterKeyTag(allTags, key){

    let keyTags = [];
    
    allTags.forEach(objTag => {
    
    let newTag = {key: objTag.key, id: objTag.id};
    let tagEvents = helper.getTagsfromObj(objTag);
    let hasKey = tagEvents.filter(obj => obj.key === key);
    
    if(hasKey.length > 0){
    keyTags.push(newTag)
    }
    });
    
    keyTags = keyTags.concat();
    return keyTags
    
    },

getObjfromTag(tag){

//Instruction Tags
if(tag.special === 'instruction'){

//console.log('Recieved Instructions', tag)

const obj = {
id:tag.id,
special: "instruction",
//color:
key: tag.key,
type: tag.type,
name: tag.name,
group: tag.group
}

return obj

//Normal Tags
}else{
let index = load.Data[tag.key].findIndex(obj => parseInt(obj.id) === parseInt(tag.id));
let obj = load.Data[tag.key][index];

if(obj === undefined){console.error("Object does not exist at " + tag.key + ':' + tag.id) 
return}

if(obj.key === 'npcs' && obj.access){obj.access = tag.access}

return obj
}

},

changeIconVis(change){

const existingIcons = [...document.querySelectorAll('.icon'), ...document.querySelectorAll('.icon-label')];
existingIcons.forEach(icon => icon.style.display = change //remove()); // Remove each existing icon element
)

},

checkLabelVis(){

const locationDivs = document.querySelectorAll('.selection')

if(battleMap.gridShowing === true){
    locationDivs.forEach(div => {div.style.display = 'none'})
    }else{
    locationDivs.forEach(div => {div.style.display = 'block'})
    }
    
},

getChildren(tagObj){

//Take a tag and return all child tags.
if(tagObj.key === 'tags'){

tagObj.tags.filter(tag => tag.key === 'tags');
console.log(tagObj.name, tagObj.tags.filter(tag => tag.key === 'tags'));

}

},

getTagsfromObj(obj){

let array = [];
let tags = obj.tags;

if(tags){   

let tidyTags = helper.tidyTags(tags);

tidyTags.forEach(tag => {

let tagObj = helper.getObjfromTag(tag);
//this.getChildren(tagObj);

array.push(tagObj);

})
}

//console.log(array)
return array;

},

tidyTags(tags) {
// Remove dead tags
tags = tags.filter(tag => {
// Get the tag object
let tagObj = this.getObjfromTag(tag);
// Keep the tag if the tag object is not undefined
return tagObj !== undefined;
});

//return tags;

// Use reduce to create a new array with unique tags
return tags.reduce((uniqueTags, tag) => {
// Check if the tag already exists in uniqueTags based on key and id
let isDuplicate = uniqueTags.some(existingTag =>
existingTag.key === tag.key && parseInt(existingTag.id) === parseInt(tag.id)
);
// If the tag is not a duplicate, add it to uniqueTags
if (!isDuplicate) {
uniqueTags.push(tag);
}
return uniqueTags;
}, []);

},

rollMultipleDice(input) {
// Split the input string into the number of dice and the number of sides
let [number, sides] = input.split('d').map(Number);

// If the input is invalid (like "d8" or "1d"), return an error message or handle accordingly
if (isNaN(number) || isNaN(sides)) {
return 'Invalid input format';
}

let results = 0;

// Roll the dice the specified number of times
for (let i = 0; i < number; i++) {
results = results + this.rollDice(sides);
}

return results;
},

rollDice(sides) {

return Math.floor(Math.random() * sides) + 1;
},

updateDomIconPosition(iconElement, icon) {
    const canvasRect = ref.battleMap.getBoundingClientRect(); // Get the canvas position and size

    // Calculate the correct position of the icon relative to the canvas and the viewport
    iconElement.style.left = `${canvasRect.left + icon.x}px`;  // Adjust by canvas offset
    iconElement.style.top = `${canvasRect.top + icon.y}px`;    // Adjust by canvas offset
}

}

export default helper;
