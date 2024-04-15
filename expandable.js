// Import the necessary module
import load from "./load.js";

const expandable = {

getMonsters(locationText) {
const asteriskBrackets = /\*([^*]+)\*/g;
return locationText.replace(asteriskBrackets, (match, targetText) => {
const monster = load.Data.monsters.find(monster => monster.name.toLowerCase() === targetText.toLowerCase());
if (monster) {
return `<span class="expandable monster" data-content-type="monsters" divId="${targetText}">${targetText}</span>`;
} else {
console.log(`Monster not found: ${targetText}`);
return match;
}
});
},

getItems(locationText) {
    const hashBrackets = /#([^#]+)#/g;
    
    return locationText.replace(hashBrackets, (match, targetText) => {
    const item = Object.values(load.Data.items).find(item => item.name.toLowerCase() === targetText.toLowerCase());
    if (item) {
    return `<span class="expandable item" data-content-type="items" divId="${item.name}">${item.name}</span>`;
    } else {
    console.log(`Item not found: ${targetText}`);
    return match;
    }
    });
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
    
    addIteminfo(contentId, target) {
    
    //Search for Item in the Array   
    const item = Object.values(load.Data.items).find(item => item.name.toLowerCase() === contentId.toLowerCase());
    const newCost = this.standardizeCost(item.cost) + 'Gold Pieces';
    
    
    if (item) {
    
    //`<span class="expandable" data-content-type="rule" divId="Money"">${foundNPC.class} Skills:</span><br>`
    
    const itemStats = [
    `<h2><span class="misc">${contentId}</span></h2>`,
    `<h3><span class="expandable" data-content-type="rule" divId="Money">${item.cost ? `(${newCost})` : ''}</span><hr>`,
    `<span class="cyan">${item.type}</span>.<br>`,
    
    `${item.size ? `<span class="lime">Size:</span> ${item.size}<br>` : ''}`,
    `${item.weight ? `<span class="lime">Weight:</span> ${item.weight} lbs<br>` : ''}`,
    `${item.damage ? `<span class="lime">Damage:</span> ${item.damage}<br>` : ''}`,
    `${item.range ? `<span class="lime">Range:</span> ${item.range}<br>` : ''}`,
    `${item.ac ? `<span class="lime">Armour Class:</span> ${item.ac}<br><br>` : ''}`,
    `${item.tags ? `<span class="hotpink">Assigned to:</span> ${item.tags}<br>` : ''}<hr></h3>`,
    `${item.description ? ` ${item.description} ` : ''}`,
    ];
    
    
    const formattedItem = itemStats
    .filter(attribute => attribute.split(": ")[1] !== '""' && attribute.split(": ")[1] !== '0' && attribute.split(": ")[1] !== 'Nil')
    .join(" ");
    
    target.innerHTML = formattedItem;
    
    
    return formattedItem;
    
    } else {
    console.log(`Monster not found: ${contentId}`);
    
    }
    
    },

    getSpells(locationText) {
        const tildeBrackets = /~([^~]+)~/g;
        
        return locationText.replace(tildeBrackets, (match, targetText) => {
        const spell = Object.values(load.Data.spells).find(spell => spell.name.toLowerCase() === targetText.toLowerCase());
        if (spell) {
        return `<span class="expandable spell" data-content-type="spells" divId="${spell.name}">${spell.name}</span>`;
        } else {
        console.log(`Spell not found: ${targetText}`);
        return match;
        }
        });
        },







};

export default expandable;

