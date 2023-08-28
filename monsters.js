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
        const editGMText = document.getElementById('editGMText');
        const optionsList = document.getElementById('optionsList');

        //console.log(JSON.stringify(monsters).length + ' Monsters')
      
        editGMText.addEventListener('input', (event) => {
          const text = event.target.value;
          const cursorPosition = event.target.selectionStart;
      
          const openBraceIndex = text.lastIndexOf('{', cursorPosition);
          if (openBraceIndex !== -1) {
            const searchText = text.substring(openBraceIndex + 1, cursorPosition);

            //console.log('Searching for ' + searchText)
      
            const filteredMonsters = Object.keys(monsters).filter(monsterName =>
              monsterName.toLowerCase().includes(searchText.toLowerCase())
            );

            
            //console.log('Returning ' + filteredMonsters)
      
            optionsList.style.display = 'block';
            optionsList.innerHTML = ''; // Clear existing content
      
            filteredMonsters.forEach(monsterName => {
              const option = document.createElement('div');
              option.textContent = monsterName;
              option.addEventListener('click', () => {
                const replacement = `{${monsterName}}`;
                const newText = text.substring(0, openBraceIndex) + replacement + text.substring(cursorPosition);
                event.target.value = newText;
                optionsList.style.display = 'none'; // Hide optionsList
              });
              optionsList.appendChild(option);
            });
          } else {
            optionsList.style.display = 'none';
            optionsList.innerHTML = '';
          }
        });
      }
     
  
};

export default Monsters;

