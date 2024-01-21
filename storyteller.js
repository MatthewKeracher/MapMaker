import Array from "./array.js";
import Events from "./events.js";
import Monsters from "./monsters.js";
import NPCs from "./npcs.js";
import Items from "./items.js";
import Spells from "./spells.js";
import Edit from "./edit.js";
import Ref from "./ref.js";

const Storyteller = {

miscArray: [],
monsterArray:[],

async changeContent(locationDiv) {

let Story = ``

const locationName = locationDiv.id;
const locationObject = Array.locationArray.find(entry => entry.divId === locationName);

Ref.locationLabel.textContent = locationName;
Ref.editLocationName.value   = locationName;

//console.log('Tags : ' + locationObject.tags)

if (locationObject) {
//name the returned locationObject data 
Events.getEvent(locationName, locationObject.tags);

const locationItems = this.addLocationItems(locationObject);

let previousTag = '';
let previousType = '';

  const locationItemsTagged = locationItems.map(item => {

  const tagToDisplay = item.Tag !== previousTag ? `<br><span class = "hotpink">Items for ${item.Tag}</span><br>` : '';
  previousTag = item.Tag;

  const typetoDisplay = item.Type !== previousType ? `<br><span class = "underline">${item.Type}</span><br>` : '';
  previousType = item.Type;

  return `${tagToDisplay}${typetoDisplay}#${item.Name}#`;
  });

const locationItemsFormatted = `[${locationName} Items List]{<hr>${locationItemsTagged.join('<br>')}}`;

const locationText = '<br>' + Events.eventDesc + '<br><br>' + locationItemsFormatted + '<br><br>' + locationObject.description;

this.miscArray = [];
this.monsterArray = [];
const squareCurly = this.getMisc(locationText, this.miscArray);


const formattedMonsters = await Monsters.getMonsters(squareCurly);
const formattedSpells = await Spells.getSpells(formattedMonsters);
const formattedLocation = await Items.getItems(formattedSpells);
//console.log(presentMonsters)



const location = Ref.locationLabel.textContent;
const presentNPCs = NPCs.getNPCs(location, Events.phase);



Story += `
<span class="withbreak">${formattedLocation}</span>
`;

if (presentNPCs.length === 0) {
Story += `<br> There is nobody around.`;
} else {
for (const npcWithStory of presentNPCs) {
const npcStory = npcWithStory.story;
Story += `<span class="withbreak">${npcStory}</span>`;
}
}

//Apply formattedStory to Storyteller
Ref.Storyteller.innerHTML = Story;

//Update Editor Content
Ref.textLocation.value = locationObject.description;
//console.log(locationObject.tags)
Ref.editLocationTags.value = locationObject.tags;

if(Edit.editPage === 2){
  Events.loadEventsList(Events.eventsArray);
}else if (Edit.editPage === 3){
  NPCs.loadNPC(NPCs.npcArray)
}

this.showExpandable(Ref.Storyteller, Ref.extraContent);


};
}, 

getQuotes(locationText) {
  const quotationMarks = /"([^"]+)"/g;

  return locationText.replace(quotationMarks, (match, targetText) => {
      return `<span class="hotpink">"${targetText}"</span>`;
  });
},

addRulesInfo(contentId, target) {
 
  const rulesItem = this.rulesArray.find(rule => rule.name === contentId);
    
    if (rulesItem) { 
      const showRule = [ 
        
      `<h3><span class="misc">${rulesItem.name}</span></h3>
      <span class="withbreak">${rulesItem.body}</span>`]
  
      target.innerHTML = showRule;

    } else {
      console.log(`Rule with name "${contentId}" not found in the rulesArray.`);
    }
  },

addMiscInfo(contentId, target) {
const extraContent = document.getElementById('extraContent');  
const MiscItem = this.miscArray.find(item => item.square === contentId);
  
  if (MiscItem) {
    const withMonsters = Monsters.getMonsters(MiscItem.curly);
    const withItems = Items.getItems(withMonsters);
    const withSpells = Spells.getSpells(withItems); 
    const miscInfo = [ 
      
    `<br><h3><span class="misc">${MiscItem.square}</span></h3>
    <span class="withbreak">${withSpells}</span>`]

    target.innerHTML = miscInfo;
  } else {
    console.log(`Square curly combo with square "${contentId}" not found in the comboArray.`);
  }
},

addLocationItems(locationObject){

  let locationItems = '';

    // Filter itemsArray based on location Name and Tags
    const filteredItems = Items.itemsArray.filter(item => {
      const itemTags = item.Tags ? item.Tags.split(',').map(tag => tag.trim()) : [];
  
      // Check if the item matches the criteria
      return (
        (itemTags.includes(locationObject.divId)) ||
        (locationObject.tags && locationObject.tags.split(',').map(tag => tag.trim()).some(tag => itemTags.includes(tag)))
      );
    });

    // Format each item and add to this.inventory
    locationItems = filteredItems.map(item => ({
     Name: item.Name,
     Type: item.Type,
     Tag: item.Tags ? item.Tags.split(',').map(tag => tag.trim()).find(tag => 
        tag === locationObject.divId || 
        (locationObject.tags && locationObject.tags.split(',').map(tag => tag.trim()).some(locTag => locTag === tag))
        ) : ''
    }));

    // Sort the inventory alphabetically by item.Tag and then by item.Name
    locationItems.sort((a, b) => {
    // Compare item.Tag first
    if (a.Tag > b.Tag) return 1;
    if (a.Tag < b.Tag) return -1;

    // If item.Tags are the same, compare item.Type
    if (a.Type > b.Type) return 1;
    if (a.Type < b.Type) return -1;

    // If item.Type are the same, compare item.Name
    if (a.Name > b.Name) return 1;
    if (a.Name < b.Name) return -1;

    return 0; // Both item.Tag and item.Name are equal

});

    // Log the names of the items
    //console.log(locationItems)
    //console.log(locationItems.length !== 0 ? "Location Items:" + JSON.stringify(locationItems) : 'No location Items found.');
  
    return locationItems;
},

getMisc(locationText, comboArray) {
  const squareBrackets = /\[([^\]]+)\]\{([^}]+)\}/g;

  const matches = [...locationText.matchAll(squareBrackets)];
  let updatedText = locationText;

  for (const match of matches) {
    const square = match[1];
    const curly = match[2];

    const replacement = `<span class="expandable misc" data-content-type="misc" divId="${square}">${this.getQuotes(square)}</span>`;

    updatedText = updatedText.replace(match[0], replacement);

    // Store the square curly combo in the provided array
    comboArray.push({ square, curly });
  }

  return updatedText;
},

showExpandable(source, target) {

const expandableElements = source.querySelectorAll('.expandable');

expandableElements.forEach(element => {

element.addEventListener('mouseenter', (event) => {

const contentType = event.target.getAttribute('data-content-type');
const contentId = event.target.getAttribute('divId');

switch (contentType) {
    case 'npc':
    NPCs.addNPCInfo(contentId, target); // Handle NPCs
    break;
    case 'monster':
    Monsters.addMonsterInfo(contentId, target); // Handle monsters
    break;
    case 'item':
    Items.addIteminfo(contentId, target); // Handle items
    break;
    case 'spell':
    Spells.addSpellInfo(contentId, target); // Handle spells
    break;
    case 'misc':
    this.addMiscInfo(contentId, target);
    break;
    case 'rules':
    this.addRulesInfo(contentId, this.rulesArray);
    break;
    default:
    console.log('Unknown content type');
}          

Ref.extraInfo.classList.add('showExtraInfo');
this.showExtraExpandable(Ref.extraInfo2); 

});

Ref.extraInfo.addEventListener('mouseenter', () => {
Ref.extraInfo2.classList.remove('showExtraInfo');

});
});
},

showExtraExpandable(target) {
 
  const expandableElements = Ref.extraInfo.querySelectorAll('.expandable');
  
  expandableElements.forEach(element => {
    
    element.addEventListener('mouseenter', (event) => {
      
      const contentType = event.target.getAttribute('data-content-type');
      const contentId = event.target.getAttribute('divId');
     
      switch (contentType) {
        case 'npc':
        NPCs.addNPCInfo(contentId, target); // Handle NPCs
        break;
        case 'monster':
        Monsters.addMonsterInfo(contentId, target); // Handle Monsters
        break;
        case 'item':
        Items.addIteminfo(contentId, target); // Handle Items
        break;
        case 'spell':
        Spells.addSpellInfo(contentId, target); // Handle Spells
        break;
        case 'misc':
        this.addMiscInfo(contentId, target); //Handle Misc
        break;
        case 'rule':
        this.addRulesInfo(contentId, target); //Handle Rule
        break;
        default:
        console.log('Unknown content type');
      }        

      target.classList.add('showExtraInfo');
      this.showFloatingExpandable();
      
    });   

  });

},

showFloatingExpandable() {
  const expandableElements = Ref.extraInfo2.querySelectorAll('.expandable');
  
  expandableElements.forEach(element => {
    
    element.addEventListener('mouseenter', (event) => {
      
      const contentType = event.target.getAttribute('data-content-type');
      const contentId = event.target.getAttribute('divId');

      // Create a floating box div
      const floatingBox = document.createElement('div');
      floatingBox.classList.add('floating-box');
      floatingBox.divId = "floatingBox"
      
      // Position the floating box next to the target element
      const rect = event.target.getBoundingClientRect();
      floatingBox.style.position = 'absolute';
      floatingBox.style.zIndex = 100;
      floatingBox.style.top = rect.bottom + 'px'; // Adjust the top position as needed
      floatingBox.style.left = rect.left + 'px';

      // Append the floating box to the document body
      document.body.appendChild(floatingBox);

      // Remove the floating box when leaving the element
      element.addEventListener('mouseleave', () => {
        document.body.removeChild(floatingBox);
      });
     
      switch (contentType) {
        case 'npc':
        NPCs.addNPCInfo(contentId, floatingBox); // Handle NPCs
        break;
        case 'monster':
        Monsters.addMonsterInfo(contentId, floatingBox); // Handle Monsters
        break;
        case 'item':
        Items.addIteminfo(contentId, floatingBox); // Handle Items
        break;
        case 'spell':
        Spells.addSpellInfo(contentId, floatingBox); // Handle Spells
        break;
        case 'misc':
        this.addMiscInfo(contentId, floatingBox); //Handle Misc
        break;
        case 'rule':
        this.addRulesInfo(contentId, floatingBox); //Handle Rule
        break;
        default:
        console.log('Unknown content type');
      }  

      //floatingBox.innerHTML = content; // Set the content of the box

    });
  });
},



rulesArray: [
{name: 'Attack Bonus',
 body: `To roll "to hit," the attacker rolls 1d20 and adds their <span class = "lime">attack bonus (AB) </span>, as shown on the Attack Bonus table, as well as <span class = "spell"> Strength </span> bonus (if performing a melee attack) or <span class = "spell"> Dexterity </span> bonus (if performing a missile attack)  and any other adjustments required by the situation. If the total is equal to or greater than the opponent's Armor Class, the attack hits and damage is rolled. A <span class="hotpink">natural "1"</span> on the die roll is always a failure. A <span class="cyan">natural "20"</span> is always a hit, if the opponent can be hit at all (for example, monsters that can only be hit by silver or magic weapons cannot be hit by normal weapons, so a natural "20" with a normal weapon will not hit such a monster).
 
 Attacks made from behind an opponent usually receive a +2 attack bonus. This does not combine with the Sneak Attack ability.`
},
{name: 'Saving Throws',
 body:`Saving throws represent the ability of a character or creature to resist or avoid special attacks, such as spells or poisons. 
 
 Saving throws are made by rolling a d20 against a target number based on the character's class and level; for monsters, a comparable class and level are provided for the purpose of determining the monster's saving throw figures. As with attack rolls, a natural (unadjusted) roll of 20 is always a success, and a natural 1 is always a failure.

 The five categories of saving throw as follows: <span class="hotpink">Death Ray or Poison, Magic Wands, Paralysis or Petrify, Dragon Breath, and Spells</span>. Spells and monster special attacks will indicate which category applies (when a saving throw is allowed), but in some unusual situations the Game Master will need to choose a category. 
 
 One way to make this choice is to interpret the categories metaphorically. For example, a GM might be writing an adventure wherein there is a trap that pours burning oil on the hapless adventurers. Avoiding the oil might be considered similar to avoiding Dragon Breath. Or perhaps a stone idol shoots beams of energy from its glaring eyes when approached. This attack may be considered similar to a Magic Wand, or if especially potent, a Spell. The saving throw vs. Death Ray is often used as a "catch all" save versus many of the "ordinary" dangers encountered in a dungeon environment. 

 In general, saving throw rolls are not adjusted by ability score bonus or penalty figures. There are a few exceptions: 
 
 • Poison saving throws are adjusted by the character's Constitution modifier. 
 
 • Saving throws against illusions (such as phantasmal force) are adjusted by the character's Intelligence modifier. 
 
 • Saving throws against charm spells (and other forms of mind control) are adjusted by the character's Wisdom modifier. The GM may decide on other saving throw adjustments as they see fit. 

 <span class="cyan">Item Saving Throws</span>
 
 Area effects (such as fireball or lightning bolt spells) may damage items carried by a character as well as injuring the character. For simplicity, assume that items carried are unaffected if the character or creature carrying them makes their own saving throw. However, very fragile items (paper vs. fire, glass vs. physical impact, etc.) may still be considered subject to damage even if the bearer makes their save. In any case where one or more items may be subject to damage, use the saving throw roll of the bearer to determine if the item is damaged or not. For example, if a character holding an open spellbook is struck by a fireball spell, they must save vs. Spells, and then save again at the same odds for the spellbook. The GM should feel free to amend this rule as they wish; for instance, a backpack full of fragile items might be given a single saving throw rather than laboriously rolling for each and every item.`
},
{name: 'Spellcasting',
body:`The number of spells of each level which a Magic User may cast per day is shown on the appropriate table in the Characters section starting on page 3. 

Magic-Users cast spells through the exercise of knowledge and will. They prepare spells by study of their <span class="hotpink">spellbooks</span>; each Magic-User has their own <span class="hotpink">spellbook</span> containing the magical formulae for each spell the Magic-User has learned. 

<span class="hotpink">Spellbooks</span> are written in a magical script that can only be read by the one who wrote it, or through the use of the spell read magic. All Magic-Users begin play knowing read magic, and it is so ingrained that it can be prepared without a <span class="hotpink">spellbook</span>. 

 A Magic-User <span class="hotpink"> may only prepare spells after resting </span> (i.e. a good night's sleep) , and needs one turn per each three spell levels to do so (rounding fractions up). Spells prepared but not used on a previous day are not lost. 

For example, a 3rd level Magic-User preparing all three of their available spells (two 1st level and one 2nd level) is preparing a total of 4 levels of spells, and thus needs 2 turns (4 divided by 3 and rounded up). Rules for the acquisition of new spells are found in the Game Master's section on page 186.

Spells prepared but not used persist from day to day; only those actually cast must be replaced. A spellcaster may choose to dismiss a prepared spell (without casting it) in order to prepare a different spell of that level. 

Spellcasters must have at least one hand free, and be able to speak, in order to cast spells; thus, binding and gagging a spellcaster is an effective means of preventing them from casting spells. 

In combat, casting a spell usually takes the same time as making an attack. 

If a spellcaster is attacked (even if not hit) or must make a saving throw (whether successful or not) on the Initiative number on which they are casting a spell, the spell is spoiled and lost. 

As a specific exception, two spell casters releasing their spells at each other on the same Initiative number will both succeed in their casting; one caster may disrupt another with a spell only if they have a better Initiative, and choose to delay casting the spell until right before the other caster. Some spells are reversible; such spells are shown with an asterisk after the name.

 `
},
{name: 'Orsons',
body:`The number of spells of each level which a Cleric may cast per day is shown on the appropriate table in the Characters section starting on page 3. 

Clerics receive their spells through faith and prayer. Each day, generally in the morning, a Cleric must pray for at least three turns in order to prepare spells. Of course, the Cleric may be expected to pray more than this in order to remain in their deity's good graces. Because they gain their spells through prayer, a Cleric may prepare any spell of any level they are able to cast. In some cases the Cleric's deity may limit the availability of certain spells; for instance, a deity devoted to healing may refuse to grant reversed healing spells. 

Spells prepared but not used persist from day to day; only those actually cast must be replaced. A spellcaster may choose to dismiss a prepared spell (without casting it) in order to prepare a different spell of that level. 

Spellcasters must have at least one hand free, and be able to speak, in order to cast spells; thus, binding and gagging a spellcaster is an effective means of preventing them from casting spells. 

In combat, casting a spell usually takes the same time as making an attack. 

If a spellcaster is attacked (even if not hit) or must make a saving throw (whether successful or not) on the Initiative number on which they are casting a spell, the spell is spoiled and lost. 

As a specific exception, two spell casters releasing their spells at each other on the same Initiative number will both succeed in their casting; one caster may disrupt another with a spell only if they have a better Initiative, and choose to delay casting the spell until right before the other caster. Some spells are reversible; such spells are shown with an asterisk after the name.`
},
{name: 'Turn Undead',
body:`Clerics can Turn the undead, that is, drive away undead monsters by means of faith alone. 

The Cleric brandishes their holy symbol and calls upon the power of their divine patron. 

The player rolls 1d20 and tells the GM the result. 

Note that the player should always roll, even if the GM knows the character can't succeed (or can't fail), as telling the player whether or not to roll may reveal too much. 

The GM looks up the Cleric's level on the Clerics vs. Undead table, and cross-references it with the undead type or Hit Dice. (The Hit Dice row is provided for use with undead monsters not found in the Core Rules; only use the Hit Dice row if the specific type of undead monster is not on the table and no guidance is given in the monster's description. Note that the hit dice given are not necessarily the same as the hit dice of the monster given for that column.) If the table indicates "No" for that combination, it is not possible for the Cleric to affect that type of undead monster. If the table gives a number, that is the minimum number needed on 1d20 to Turn that type of undead. If the table says "T" for that combination, that type of undead is automatically affected (no roll needed). If the result shown is a "D," then that type of undead will be Damaged (and possibly destroyed) rather than Turned.

If the roll is a success, 2d6 hit dice of undead monsters are affected; surplus hit dice are lost (so if zombies are being Turned and a roll of 7 is made, at most 3 zombies can be Turned), but a minimum of one creature will always be affected if the first roll succeeds. 

If a mixed group of undead (say, a wight and a pair of zombies) is to be Turned, the player still rolls just once. The result is checked against the weakest sort first (the zombies), and if they are successfully Turned, the same result is checked against the next higher type of undead.

Likewise, the 2d6 hit dice are rolled only once. 

For example, if the group described above is to be Turned by a 2nd level Cleric, they would first need to have rolled a 15 or higher to Turn the zombies. 

If this is a success, 2d6 are rolled; assuming the 2d6 roll is a 7, this would Turn both zombies and leave a remainder of 3 hit dice of effect. Wights are, in fact, 3 hit die monsters, so assuming the original 1d20 roll was a 20, the wight is Turned as well. 

Obviously, were it a group of 3 zombies and a wight, the 2d6 roll would have to be a total of 9 or higher to affect them all. 

If a Cleric succeeds at Turning the undead, but not all undead monsters present are affected, they may try again in the next round to affect those which remain. 

If any roll to Turn the Undead fails, that Cleric may not attempt to Turn Undead again for one full turn. A partial failure (possible against a mixed group) counts as a failure for this purpose. 

Undead monsters which are Turned flee from the Cleric and their party at maximum movement. 

If the party pursue and corner the Turned undead, they may resume attacking the party; but if left alone, the monsters will not return or attempt to attack the Cleric or those near them for at least 2d4 turns. 

Undead monsters subject to a D (Damaged) result suffer 1d8 damage per level of the Cleric (roll once and apply the same damage to all undead monsters affected); those reduced to zero hit points are utterly destroyed, being blasted into little more than dust. Those surviving this damage are still Turned as above.`
},
{name: 'Monster Name',
body: `The first thing given for each monster is its name (or its most common name if the monster is known by more than one). If an asterisk appears after the monster's name, it indicates that the monster is only able to be hit by special weapons (such as silver or magical weapons, or creatures affected only by fire, etc.) which makes the monster harder to defeat.`
},
{name: 'Monster Armour Class',
body: `This line lists the creature’s Armor Class. If the monster customarily wears armor, the first listed AC value is with that armor, and the second, in parentheses, is unarmored. Some monsters are only able to be hit (damaged) by silver or magical weapons; these are indicated with (s); some monsters may only be hit with magical weapons, indicated by (m). `
},
{name: 'Monster Hit Dice',
body: `This is the creature’s number of hit dice, including any bonus hit points. Monsters always roll eight sided dice (d8) for hit points, unless otherwise noted. So for example, a creature with 3+2 hit dice rolls 3d8 and adds 2 points to the total. A few monsters may be marked as having ½ hit dice; this means 1d4 points, and the creature has "less than one hit die" for attack bonus purposes. `
},
{name: 'Monster Movement',
body: ` This is the monster's movement rate, or rates for those monsters able to move in more than one fashion. For example, bugbears have a normal walking movement of 30', and this is all that is listed for them. Mermaids can only move about in the water, and so their movement is given as Swim 40'. Pegasi can both walk and fly, so their movement is listed as 80' Fly 160'. In addition, a distance may appear in parentheses after a movement figure; this is the creature's turning distance (as explained in Maneuverability on page 51). If a turning distance is not listed, assume 5'.`
},
{name: 'Monster Attacks',
body: `This is the number (and sometimes type or types) of attacks the monster can perform. For example, goblins may attack once with a weapon, so they are marked 1 weapon. Ghouls are marked 2 claws, 1 bite as they can attack with both claws and also bite in one round. Some monsters have alternate attacks, such as the triceratops with an attack of 1 gore or 1 trample which means that the creature can do a gore attack or a trample attack, but not both in the same round. `
},
{name: 'Monster Damage',
body: ` The damage figures caused by successful attacks by the monster. Generally, this will be defined in terms of one or more die rolls.`
},
{name: 'Monster Number Appearing',
body: `This is given in terms of one or more die rolls. Monsters that only appear underground and have no lairs will have a single die roll; those that have lairs and/or those that can be found in the wilderness will be noted appropriately. For example, a monster noted as "1d6, Wild 2d6, Lair 3d6" is encountered in groups of 1d6 individuals in a dungeon setting, 2d6 individuals in the wilderness, or 3d6 individuals in a lair. Note that number appearing applies to combatants. Non-combatant monsters (juveniles, and sometimes females) do not count in this number. The text of the monster description should explain this in detail where it matters, but the GM is always the final arbiter.`
},
{name: 'Monster Save As',
body: `This is the character class and level the monster uses for saving throws.
Most monsters save as Fighters of a level equal to their hit dice, but this is not always the case.`
},
{name: 'Monster Morale',
body: `The number that must be rolled equal to or less than on 2d6 for the monster to pass a Morale Check. Monsters having a Morale of 12 never fail morale checks, and fight until destroyed (or until they have no enemies left). 

NPCs and monsters don't always fight to the death; in fact, most will try to avoid death whenever possible. 

Each monster listing includes the monster's Morale score, a figure between 2 and 12. To make a Morale check, roll 2d6; if the roll is equal to or less than the Morale score, the monster or monsters are willing to stand and fight. If the roll is higher, the monster has lost its nerve. Monsters with a Morale score of 12 never fail a Morale check; they always fight to the death.

In general, Morale is checked when monster(s) first encounter opposition, and again when the monster party is reduced to half strength (by numbers if more than one monster, or by hit points if the monster is alone).

For this purpose, monsters incapacitated by sleep, charm, or hold magic are counted as if dead.

The Game Master may apply adjustments to a monster's Morale score at their discretion. Generally, adjustments should not total more than +2 or -2. No adjustment is ever applied to a Morale score of 12.

A monster that fails a Morale check will generally attempt to flee; intelligent monsters or NPCs may try to surrender, if the GM so desires.

Note that special rules apply to retainers, as explained further on page 46. `
},
{name: 'Monster Treasure',
body: `This describes any valuables the monster is likely to have. See the Treasure section on page 162 for more details about interpreting the letter codes which usually appear here. A monster's treasure is normally found in its lair, unless described otherwise; sometimes for monsters who live in towns or other large groups this line will describe both the lair treasure as well as treasure carried by random individuals. `
},
{name: 'Monster XP',
body: `This is the number of experience points awarded for defeating this monster. In some cases, the figure will vary; for instance, Dragons of different age categories will have different XP values. Review the Experience Points awards table in the Adventure section on page 49 to calculate the correct figure in these cases. `
},
{name: 'Monster Special',
body: `Some monsters have a special ability. `
},
{name: 'Hit Points',
body: `When a character is injured, they lose hit points from their current total. Note that this does not change the figure rolled, but rather reduces the current total; healing will restore hit points, up to but not exceeding the rolled figure.

When their hit point total reaches 0, your character may be dead. This may not be the end for the character; don't tear up the character sheet.

First level characters begin play with a single hit die of the given type, plus the Constitution bonus or penalty, with a minimum of 1 hit point. Each time a character gains a level, the player should roll another hit die and add the character's Constitution bonus or penalty, with the result again being a minimum of 1 point. Add this amount to the character's maximum hit points figure.

Note that, after 9th level, characters receive a fixed number of hit points each level, as shown in the advancement table for the class, and no longer add the Constitution bonus or penalty.`
},
{name: 'Strength',
body: `As the name implies, this ability measures the character's raw physical power. 

Strength is the Prime Requisite for Fighters. Apply the ability bonus or penalty for Strength to all attack and damage rolls in melee (hand to hand) combat. 

Note that a penalty here will not reduce damage from a successful attack below one point in any case (see How to Attack on page 53 and Damage on page 55, both in the Combat section, for details).`
},
{name: 'Dexterity',
body: `This ability measures the character's quickness and balance as well as aptitude with tools. 

Dexterity is the Prime Requisite for Thieves. 

The Dexterity bonus or penalty is applied to all attack rolls with missile (ranged) weapons, to the character's Armor Class value, and to the character's Initiative die roll.`
},  
{name: 'Intelligence',
body: `This is the ability to learn and apply knowledge. 

Intelligence is the Prime Requisite for Magic-Users. 

The ability bonus for Intelligence is added to the number of languages the character is able to learn to read and write; if the character has an Intelligence penalty, they cannot read more than a word or two, and will only know their native language.`
},  
{name: 'Wisdom',
body: `A combination of intuition, willpower, and common sense. 

Wisdom is the Prime Requisite for Clerics. 

The Wisdom bonus or penalty may apply to some saving throws vs. magical attacks, particularly those affecting the target's will.`
},  
{name: 'Constitution',
body: `A combination of general health and vitality. 

Apply the Constitution bonus or penalty to each hit die rolled by the character. Note that a penalty here will not reduce any hit die roll to less than 1 point.`
},
{name: 'Charisma',
body: `This is the ability to influence or even lead people; those with high Charisma are well-liked, or at least highly respected. 

Apply the Charisma bonus or penalty to reaction rolls. 

Also, the number of retainers a character may hire, and the loyalty of those retainers, is affected by Charisma.`
},  
{name: 'Money',
body: `Monetary values are usually expressed in gold pieces. In addition to gold coins, there are coins made of platinum, silver, electrum (an alloy of gold and silver), and copper. They are valued as follows:

<span class = "hotpink">1 platinum piece (pp) = 5 gold pieces (gp)
1 gold piece (gp) = 10 silver pieces (sp)
1 electrum piece (ep) = 5 silver pieces (sp)
1 silver piece (sp) = 10 copper pieces (cp) </span>

For game purposes, assume that one gold piece weighs 1/20th of a pound, and that ten coins will "fit" in a cubic inch of storage space (this isn't literally accurate, but works well enough when applied to a box or chest).

First-level characters generally begin the game with 3d6 x 10 gp, though the GM may choose some other amount.`
},
{name: 'Ranger Skills',
body: `Rangers can Move Silently, Hide, and Track when in wilderness areas, at percentages given in the table below. Apply a -20% penalty when attempting these abilities in urban areas. 

Move Silently and Hide may not be used in armor heavier than leather.

<span class = "hotpink"> Move Silently </span> is always rolled by the GM. The Ranger will usually believe they are moving silently regardless of the die roll, but opponents they are trying to avoid will hear the Ranger if the roll is failed.

<span class = "hotpink"> Hide </span> permits the Ranger to hide in any shadowed area large enough to contain their body. The Ranger always believes they are being successful, so the GM makes the roll. A Ranger hiding in shadows must remain still for this ability to work.

<span class = "hotpink"> Tracking </span> permits the Ranger track the trail of someone. When tracking, the Ranger must roll once per hour traveled or lose the trail. `
},
{
name: 'Thief Skills',
body: `The numbers for each skill are percentages; instructions for making these rolls are in Using the Dice on page 2.

Thieves have a number of special abilities, described below. 

One turn (ten minutes) must usually be spent to use any of these abilities, as determined by the GM. The GM may choose to make any of these rolls on behalf of the player to help maintain the proper state of uncertainty. Also note that the GM may apply situational adjustments (plus or minus percentage points) as they see fit; for instance, it's obviously harder to climb a wall slick with slime than one that is dry, so the GM might apply a penalty of 20% for the slimy wall.

<span class = "hotpink"> Open Locks </span> allows the Thief to unlock a lock without a proper key. It may only be tried once per lock. If the attempt fails, the Thief must wait until they have gained another level of experience before trying again.

<span class = "hotpink"> Remove Traps </span> is generally rolled twice: first to detect the trap, and second to disarm it. The GM will make these rolls as the player won't know for sure if the character is successful or not until someone actually tests the trapped (or suspected) area.

<span class = "hotpink"> Pick Pockets </span> allows the Thief to lift the wallet, cut the purse, etc. of a victim without being noticed. If the roll fails, the Thief didn't get what they wanted; but further, the intended victim (or an onlooker, at the GM's option) will notice the attempt if the die roll is more than two times the target number (or if the die roll is 00).

<span class = "hotpink"> Move Silently </span>, like Remove Traps, is always rolled by the GM. The Thief will usually believe they are moving silently regardless of the die roll, but opponents they are trying to avoid will hear the Thief if the roll is failed.

<span class = "hotpink"> Climb Walls </span> permits the Thief to climb sheer surfaces with few or no visible handholds. This ability should normally be rolled by the player. If the roll fails, the Thief falls from about halfway up the wall or other vertical surface. The GM may require multiple rolls if the distance climbed is more than 100 feet. See Falling Damage on page 59 for the consequences of failing this roll.

<span class = "hotpink"> Hide </span> permits the Thief to hide in any shadowed area large enough to contain their body. Like Move Silently, the Thief always believes they are being successful, so the GM makes the roll. A Thief hiding in shadows must remain still for this ability to work.

<span class = "hotpink"> Listen </span> is generally used to listen at a door, or to try to listen for distant sounds in a dungeon. The GM must decide what noises the Thief might hear; a successful roll means only that a noise could have been heard. The GM should always make this roll for the player. Note that the Thief and their party must try to be quiet in order for the Thief to use this ability.`
},
{ 
name: 'Thief', 
body: `Thieves are those who take what they want or need by stealth, disarming traps and picking locks to get to the gold they crave; or "borrowing" money from pockets, beltpouches, etc. right under the nose of the "mark" without the victim ever knowing.

Thieves fight better than Magic-Users but not as well as Fighters. Avoidance of honest work leads Thieves to be less hardy than the other classes, though they do pull ahead of the Magic-Users at higher levels.

The <span class = "hotpink"> Prime Requisite for Thieves is Dexterity </span>; a character must have a Dexterity score of 9 or higher to become a Thief. They may use any weapon, but may not wear metal armor as it interferes with stealthy activities, nor may they use shields of any sort. Leather armor is acceptable, however.

Finally, Thieves can perform a <span class = "hotpink"> Sneak Attack </span> any time they are behind an opponent in melee and it is likely the opponent doesn't know the Thief is there. The GM may require a Move Silently or Hide roll to determine this. The Sneak Attack is made with a +4 attack bonus and does double damage if it is successful. A Thief usually can't make a Sneak Attack on the same opponent twice in any given combat.

The <span class = "hotpink"> Sneak Attack </span> can be performed with any melee (but not missile) weapon, or may be performed bare-handed (in which case subduing damage is done, as explained on page 55). Also, the <span class = "hotpink"> Sneak Attack </span> can be performed with the "flat of the blade;" the bonuses and penalties cancel out, so the attack has a +0 attack bonus and does normal damage; the damage done in this case is subduing damage.`
},
{ 
name: 'Fighter', 
body: `Fighters include soldiers, guardsmen, barbarian warriors, and anyone else for whom fighting is a way of life. They train in combat, and they generally approach problems head-on, weapon in hand.

Not surprisingly, Fighters are the best at fighting of all the classes. They are also the hardiest, able to take more punishment than any other class. Although they are not skilled in the ways of magic, Fighters can nonetheless use many magic items, including but not limited to magical weapons and armor.

The <span class = "hotpink"> Prime Requisite for Fighters is Strength </span>; a character must have a Strength score of 9 or higher to become a Fighter. Members of this class may wear any armor and use any weapon.`
},

{ 
name: 'Magic-User', 
body: `Magic-Users are those who seek and use knowledge of the arcane. They do magic not as the Cleric does, by faith in a greater power, but rather through insight and understanding.

Magic-Users are the worst of all the classes at fighting; hours spent studying massive tomes of magic do not lead a character to become strong or adept with weapons. They are the least hardy, equal to Thieves at lower levels but quickly falling behind.

The Prime Requisite for Magic-Users is Intelligence; a character must have an Intelligence score of 9 or higher to become a Magic-User. The only weapons they become proficient with are the dagger and the walking staff (or cudgel). Magic-Users may not wear armor of any sort nor use a shield as such things interfere with spellcasting.

A first level Magic-User begins play knowing read magic and one other spell of first level. These spells are written in a spellbook provided by their master. The GM may roll for the spell, assign it as they see fit, or allow the player to choose it, at their option. See the Spells section for more details.`
},
{ 
name: 'Cleric', 
body: `Clerics are those who have devoted themselves to the service of a deity, pantheon, or other belief system. 

Most Clerics spend their time in mundane forms of service, such as preaching and ministering in a temple.

However, there are those who are called to go abroad from the temple and serve their deity in a more direct way, smiting undead monsters and aiding in the battle against evil and chaos.

Player character Clerics are assumed to be among the latter group.

Clerics fight about as well as Thieves, but not as well as Fighters.

They are hardier than Thieves, at least at lower levels, as they are accustomed to physical labor that the Thief would deftly avoid.

Clerics can cast spells of divine nature starting at 2nd level, and they have the power to Turn the Undead, that is, to drive away undead monsters by means of faith alone (refer to page 57 in the Encounter section for details).

The Prime Requisite for Clerics is Wisdom; a character must have a Wisdom score of 9 or higher to become a Cleric.

They may wear any armor but may only use blunt weapons, specifically including warhammer, mace, maul, club, quarterstaff, and sling.`
},
{name: 'Ranger',
body: `Rangers are specialized warriors who roam the borderlands, where their mission is to keep the beasts and monsters of the untamed lands at bay. They generally operate alone or in small groups, and rely on stealth and surprise to meet their objectives.

To become a Ranger, a character must have a Strength score of 9 or higher (just as with any Fighter), a Wisdom of 11 or higher, and a Dexterity of 11 or higher. They may use any weapon and may wear any armor, but note that some of the Ranger’s special talents and abilities are unavailable when wearing heavier than leather armor. Humans, Elves, and Halflings may become Rangers. If the Half-Humans supplement is used, Half-Elves and Half-Orcs may also become Rangers.

A Ranger must declare a chosen enemy. Against this chosen enemy, the Ranger gets a bonus of +3 to damage. This enemy might be a certain category of creature such as giants, humanoids, or dragons. With the GM's permission, the list might include rival organizations, nations, or similar agencies. 

Rangers are always expert bowmen. When using any regular bow (shortbow or longbow, but not crossbow), a Ranger adds +2 to his or her Attack Bonus. At 5th level, a Ranger may fire three arrows every two rounds (a 3/2 rate of fire). This means one attack on every odd round, two on every even round, with the second attack coming at the end of the round. At 9th level, the Ranger may fire two arrows every round, with the second attack coming at the end of the round. `},
{name: 'Assassin',
body:`There are those who make their living dealing death from the shadows. These people are called assassins. Most are trained by secret guilds or societies; civilized lands generally forbid and destroy such organizations. 

The <span class = "hotpink"> Prime Requisite for Assassins is Dexterity </span>; a character must have a Dexterity score of 9 or higher to become a Assassin. They may use any weapon, but may not wear metal armor as it interferes with stealthy activities, nor may they use shields of any sort. Leather armor is acceptable, however. Only humans may become Assassins.

Those abilities special to the Assassin class are as follows: 

<span class = "hotpink">Poison:</span>Assassins learn the art of making lethal poisons. Poisons are often quite expensive to make; it is not uncommon for a single application of contact poison to cost 500 gp or more. The GM is advised to take care that poison does not become too much of an easy solution for the Assassin. 

<span class = "hotpink"> Assassinate: </span> This is the Assassin's primary special ability. As with the Thief's Sneak Attack ability, any time an Assassin is behind an opponent in melee and it is reasonably likely the opponent doesn't know they are there, an attempt to assassinate may be made. The attack must be carried out with a one-handed piercing weapon, such as a dagger or sword. The attack is rolled at an attack bonus of +4, and if the attack hits, the victim must roll a saving throw vs. Death Ray or be instantly killed. If this saving throw is a success, the victim still suffers normal weapon damage. At the GM's option, characters two or more levels lower than the Assassin may be denied a saving throw.

<span class = "hotpink"> Waylay: </span> An Assassin can attempt to knock out an opponent in a single strike. This is performed in much the same way as the Assassinate ability, but the Assassin must be using a weapon that does subduing damage normally (i.e. a club or cudgel). The attack is rolled at a +4 attack bonus; if the Assassin hits, the victim must make a saving throw vs. Death Ray or be knocked unconscious. If this roll is made, the victim still suffers normal subduing damage. Creatures knocked unconscious by a Waylay attack will remain that way for 2d8 turns if not awakened. Note that bounty hunters are often Assassins, who use the Waylay ability in the course of their (more or less) lawful activities.`}

],



};




export default Storyteller;

