const Monsters = {

       async loadMonstersArray() {

        console.log('monsters');

        try {
            const response = await fetch('monsters.json'); // Adjust the path if needed
            const data = await response.json();
            
            return data.monsters;
            
            
        } catch (error) {
            console.error('Error loading monster array:', error);
            return [];
        }
        
    }, 

    

   
  
};

export default Monsters;

