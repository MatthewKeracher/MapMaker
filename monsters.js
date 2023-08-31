import Ref from "./ref.js";

const Monsters = {

       async loadMonstersArray() {

        try {
            const response = await fetch('monsters.json'); // Adjust the path if needed
            const data = await response.json();
            //console.log('Imported monsters: ' + JSON.stringify(data))
            return data //.monsters;
                       
            
        } catch (error) {
            console.error('Error loading monster array:', error);
            return [];
        }
        
    },   

   
    
    async addPredictiveMonsters() {
        const monstersData = await Monsters.loadMonstersArray();
        const monsters = monstersData.monsters; // Access monsters from the monstersData object
       
        Ref.textLocation.addEventListener('input', (event) => {
          const text = event.target.value;
          const cursorPosition = event.target.selectionStart;
      
          const openBraceIndex = text.lastIndexOf('{', cursorPosition);
          if (openBraceIndex !== -1) {
            const searchText = text.substring(openBraceIndex + 1, cursorPosition);
      
            const filteredMonsters = Object.keys(monsters).filter(monsterName =>
              monsterName.toLowerCase().includes(searchText.toLowerCase())
            );
      
            Ref.optionsListMonster.style.display = 'block';
            Ref.optionsListMonster.innerHTML = ''; // Clear existing content
      
            filteredMonsters.forEach(monsterName => {
              const option = document.createElement('div');
              option.textContent = monsterName;
              option.addEventListener('click', () => {
                const replacement = `{${monsterName}}`;
                const newText = text.substring(0, openBraceIndex) + replacement + text.substring(cursorPosition);
                event.target.value = newText;
                Ref.optionsListMonster.style.display = 'none'; // Hide Ref.optionsList
              });
              Ref.optionsListMonster.appendChild(option);
            });
          } else {
            Ref.optionsListMonster.style.display = 'none';
            Ref.optionsListMonster.innerHTML = '';
          }
        });
      },

      async getMonsters(locationText) {
        const curlyBrackets = /\{([^}]+)\}/g;
        const monsters = await Monsters.loadMonstersArray();
      
        return locationText.replace(curlyBrackets, (match, monsterName) => {
            const monster = monsters.monsters[monsterName];
      
            if (monster) {
                return `<span class="expandable monster" data-content-type="monster" divId="${monsterName}">${monsterName.toUpperCase()}</span>`;
            } else {
                console.log(`Monster not found: ${monsterName}`);
                return match; 
            }
        });
      },
           
      
      async addMonsterInfo(contentId) {
      
      const extraContent = document.getElementById('extraContent');
      
      //Search for Mnster in the Array
      const monsterArray = await Monsters.loadMonstersArray();    
      const monster = monsterArray.monsters[contentId]; // Access monsters object first
      
      if (monster) {
      
      const monsterStats = [
       
      `<h2><span class="hotpink">${contentId.toUpperCase()}</span></h2>\n`,
      `${monster.Type}\n\n`,
      
      `<span class="hotpink"># App:</span> ${monster.Appearing};\n`,
      `<span class="hotpink">Morale:</span> ${monster.Morale};\n`,
      `<span class="hotpink">Movement:</span> ${monster.Mvmt};\n`,
      `<span class="hotpink">Armour Class:</span> ${monster.AC};\n`,
      `<span class="hotpink">Hit Dice:</span> ${monster.HD};\n`,
      `<span class="hotpink">Hit Dice Range:</span> ${monster.HDSort};\n`,
      `<span class="hotpink">No. Attacks:</span> ${monster.Attacks};\n`,
      `<span class="hotpink">Damage:</span> ${monster.Damage};\n`,          
      `<span class="hotpink">Special:</span> ${monster.Special || "None"};\n`,
      `<span class="hotpink">Save As:</span> ${monster["Save As "]};\n`,
      `<span class="hotpink">Treasure:</span> ${monster.Treasure || "None"};\n`,
      `<span class="hotpink">Experience Points:</span> ${monster.XP};\n\n `,
      `<span class="hotpink">Description:</span> \n\n ${monster.Description.replace(/\./g, '.\n\n')}`,
      
      ];
      
      const formattedMonster = monsterStats
      .filter(attribute => attribute.split(": ")[1] !== '""' && attribute.split(": ")[1] !== '0' && attribute.split(": ")[1] !== 'Nil')
      .join(" ");
      
      
      // Set the formatted content in the extraContent element
      extraContent.innerHTML = formattedMonster;
      } else {
      console.log(`Monster not found: ${contentId}`);
      
      }
      
      }
     
  
};

export default Monsters;

