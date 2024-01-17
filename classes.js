// classes.js

const equipmentPacks = {
    Cleric: {
      equipment: ["Mace", "Chain Mail", "Holy Symbol"],
    },
    Thief: {
      equipment: ["Dagger", "Leather Armor", "Thieves' Tools"],
    },
    Fighter: {
      equipment: ["Longsword", "Plate Mail", "Shield"],
    },
    MagicUser: {
      equipment: ["Staff", "Robe", "Spellbook"],
    },
    Peasant: {
      equipment: ["Pitchfork", "Simple Clothes"],
    },
  };

class NPC {
    constructor(data) {
      // NPC class definition
      // Copy basic properties
    this.name = data.name;
    this.occupation = data.occupation;

    this.level = data.level;
    this.class = data.class;

    this.str = data.str;
    this.dex = data.dex;
    this.int = data.int;
    this.wis = data.wis;
    this.con = data.con;
    this.cha = data.cha;

    this.Backstory = data.Backstory;

    // Additional processing based on level and class
    this.processLevelAndClass();

    }
  }
  
  export default NPC;
  
  // Define other classes if needed
  