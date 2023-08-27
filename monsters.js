const Monsters = {

       async loadMonstersArray() {

        try {
            const response = await fetch('monsters.json'); // Adjust the path if needed
            const data = await response.json();
            console.log('Imported monsters: ' + JSON.stringify(data))
            return data //.monsters;
                       
            
        } catch (error) {
            console.error('Error loading monster array:', error);
            return [];
        }
        
    }, 

    

   
  
};

export default Monsters;

