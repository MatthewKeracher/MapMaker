const Ambience = {

    phase: 0,
    hour: 0,
    current: '',

    async loadAmbienceArray() {
        try {
            const response = await fetch('ambience.json'); // Adjust the path if needed
            const data = await response.json();
            return data.ambience;
            
        } catch (error) {
            console.error('Error loading ambience array:', error);
            return [];
        }
    },

    async initializeAmbienceDropdowns() {
        const ambienceArray = await this.loadAmbienceArray();
        const uniqueMain = [...new Set(ambienceArray.map(item => item.main))];
        const uniqueSecond = [...new Set(ambienceArray.map(item => item.second))];
        this.populateDropdown(document.getElementById("mainAmbienceDropdown"), uniqueMain);
        this.populateDropdown(document.getElementById("secondAmbienceDropdown"), uniqueSecond);
    },

    populateDropdown(dropdown, options) {
        dropdown.innerHTML = ''; // Clear existing options

        options.forEach(option => {
            const optionElement = document.createElement("option");
            optionElement.value = option;
            optionElement.text = option;
            dropdown.appendChild(optionElement);
        });
    },

    async clock(){

        if(this.hour < 3){
            this.hour = this.hour + 1;                
        }else{
        if(this.hour === 3){
            console.log('New Phase')   
            this.hour = 0;
        if(this.phase === 2){
            console.log('New Day')
            this.phase = 0;    
            }else{
            this.phase = this.phase + 1;
            }
        }
    }
},

    async loadAmbienceEntry(main, second) {
        
        const ambienceArray = await this.loadAmbienceArray();
      
        // Filter ambienceArray based on selected values
        const filterArray = ambienceArray.filter(entry =>
            entry.main === main && entry.second === second
        );

        
        console.log('Time in Ambience -- Hour: ' + this.hour + '; Phase: ' + this.phase);
      
        if(this.hour > 0){

           return this.current;       
        
        }else{

            if(this.hour === 0){
            
            const randomEntry = filterArray[Math.floor(Math.random() * filterArray.length)];
            console.log('New Description: ' + randomEntry.title);
            return randomEntry;
        }}

        
      },


};

export default Ambience;

