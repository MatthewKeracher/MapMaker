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
      
          const openBraceIndex = text.lastIndexOf('*', cursorPosition);
          if (openBraceIndex !== -1) {
            const searchText = text.substring(openBraceIndex + 1, cursorPosition);
            
            const filteredMonsters = Object.keys(monsters).filter(monsterName =>
              monsterName.toLowerCase().includes(searchText.toLowerCase())
            );

            //Show ExtraContent      
            Ref.itemList.style.display = 'block';
            Ref.itemList.innerHTML = ''; // Clear existing content
            const imageContainer = document.querySelector('.image-container');
            const radiantDisplay = document.getElementById('radiantDisplay');
            imageContainer.style.width = "45vw";
            radiantDisplay.style.width = "45vw";
      
            filteredMonsters.forEach(monsterName => {
              const option = document.createElement('div');
              option.textContent = monsterName;
              option.addEventListener('click', () => {
                const replacement = `*${monsterName}*`;
                const newText = text.substring(0, openBraceIndex) + replacement + text.substring(cursorPosition);
                event.target.value = newText;
                Ref.itemList.style.display = 'none'; // Hide Ref.optionsList
              });
              Ref.itemList.appendChild(option);
            });
          } else {
            Ref.itemList.style.display = 'none';
            Ref.itemList.innerHTML = '';
            imageContainer.style.width = "70vw";
            radiantDisplay.style.width = "70vw";
          }
        });
      },

      async getMonsters(locationText) {
        const asteriskBrackets = /\*([^*]+)\*/g;
        const monsters = await Monsters.loadMonstersArray();
    
        return locationText.replace(asteriskBrackets, (match, monsterName) => {
            const monster = monsters.monsters[monsterName];
    
            if (monster) {
                return `<span class="expandable monster" data-content-type="monster" divId="${monsterName}">${monsterName.toUpperCase()}</span>`;
            } else {
                console.log(`Monster not found: ${monsterName}`);
                return match;
            }
        });
    },

    async extraMonsters(contentId) {
      const asteriskBrackets = /\*([^*]+)\*/g;
      const monsters = await Monsters.loadMonstersArray();
  
      return contentId.replace(asteriskBrackets, (match, monsterName) => {
          const monster = monsters.monsters[monsterName];
          
          if (monster) {
              return this.addMonsterInfo(monsterName);
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
       
      `<h2><span class="hotpink">${contentId.toUpperCase()}</span></h2><br>`,
      `${monster.Type}<br><br>`,
      
      `<span class="hotpink"># App:</span> ${monster.Appearing};<br>`,
      `<span class="hotpink">Morale:</span> ${monster.Morale};<br>`,
      `<span class="hotpink">Movement:</span> ${monster.Mvmt};<br>`,
      `<span class="hotpink">Armour Class:</span> ${monster.AC};<br>`,
      `<span class="hotpink">Hit Dice:</span> ${monster.HD};<br>`,
      `<span class="hotpink">Hit Dice Range:</span> ${monster.HDSort};<br>`,
      `<span class="hotpink">No. Attacks:</span> ${monster.Attacks};<br>`,
      `<span class="hotpink">Damage:</span> ${monster.Damage};<br>`,          
      `<span class="hotpink">Special:</span> ${monster.Special || "None"};<br>`,
      `<span class="hotpink">Save As:</span> ${monster["Save As "]};<br>`,
      `<span class="hotpink">Treasure:</span> ${monster.Treasure || "None"};<br>`,
      `<span class="hotpink">Experience Points:</span> ${monster.XP};<br><br> `,
      `<span class="hotpink">Description:</span> <br><br> ${monster.Description.replace(/\./g, '.<br><br>')}`,
      
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

