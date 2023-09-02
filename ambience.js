import Edit from "./edit.js";
import Ref from "./ref.js";

const Ambience = {

    phase: 0,
    hour: 0,
    current: '',
    genDesc: "",
    senseDesc:"",

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

async getAmbience(){

  Ambience.clock();
  const Spring = Ref.mainAmbienceDropdown.value;
  const Morning= Ref.secondAmbienceDropdown[Ambience.phase].value;
  
  //Within Random Selection, filter through.
  const senses = ["sight", "smell", "touch", "feel"];
  const chosenSense = senses[Ambience.hour];
  const ambienceEntry = await this.loadAmbienceEntry(Spring, Morning);
  
  //Retain returned entry until next phase. Do not delete!
  this.current = ambienceEntry; 

  this.genDesc = "";
  this.senseDesc = "";

  this.genDesc = ambienceEntry.description
  this.senseDesc = ambienceEntry[chosenSense]

},     

    async initializeAmbienceDropdowns() {
        const ambienceArray = await this.loadAmbienceArray();
        const uniqueContext = [...new Set(ambienceArray.map(item => item.context))];
        this.populateDropdown(document.getElementById("contextDropdown"), uniqueContext);
      
        const mainDropdown = document.getElementById("mainAmbienceDropdown");
        const secondDropdown = document.getElementById("secondAmbienceDropdown");
        const contextDropdown = document.getElementById("contextDropdown");
        const radianceDropdown = document.getElementById("radianceDropdown");
      
        // Set default context, main, and second values
        const defaultContext = uniqueContext[0];
        const filteredByDefaultContext = ambienceArray.filter(item => item.context === defaultContext);
        const defaultMain = filteredByDefaultContext.length > 0 ? filteredByDefaultContext[0].main : "";
        const filteredByDefaultMain = ambienceArray.filter(item => item.main === defaultMain);
        const defaultSecond = filteredByDefaultMain.length > 0 ? filteredByDefaultMain[0].second : "";
      
        // Set default values for dropdowns
        contextDropdown.value = defaultContext;
        this.populateDropdown(mainDropdown, [...new Set(filteredByDefaultContext.map(item => item.main))]);
        mainDropdown.value = defaultMain;
        this.populateDropdown(secondDropdown, [...new Set(filteredByDefaultMain.map(item => item.second))]);
        secondDropdown.value = defaultSecond;

        radianceDropdown.addEventListener("change", () => {
            console.log('radiate');
            this.radiateDisplay();
        });
      
        contextDropdown.addEventListener("change", () => {
          const selectedContext = contextDropdown.value;
          const filteredByContext = ambienceArray.filter(item => item.context === selectedContext);
          
          if (filteredByContext.length > 0) {
            const uniqueMain = [...new Set(filteredByContext.map(item => item.main))];
            this.populateDropdown(mainDropdown, uniqueMain);
            
            this.simMainDrop();

          } else {
            mainDropdown.innerHTML = '<option value="">No Data</option>';
            secondDropdown.innerHTML = '<option value="">No Data</option>';
          }
        });
      
        mainDropdown.addEventListener("change", () => {
          const selectedMain = mainDropdown.value;
          const filteredByMain = ambienceArray.filter(item => item.main === selectedMain);
          const uniqueFilteredSecond = [...new Set(filteredByMain.map(item => item.second))];
          this.populateDropdown(secondDropdown, uniqueFilteredSecond);
        });
      
        secondDropdown.addEventListener("change", () => {
          // Handle second dropdown change
        });
      },
      
      populateDropdown(dropdown, values) {
        dropdown.innerHTML = '<option value="">Select</option>';
        values.forEach(value => {
          const option = document.createElement("option");
          option.value = value;
          option.textContent = value;
          dropdown.appendChild(option);
        });
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

    simConDrop(){

        //Simulate Click on Second Dropdown
        const contextDropdown = document.getElementById("contextDropdown");
        const event = new Event("change", { bubbles: true, cancelable: true });

        contextDropdown.dispatchEvent(event);

        },

        simMainDrop(){

        //Simulate Click on Second Dropdown
        const mainDropdown = document.getElementById("mainAmbienceDropdown");
        const event = new Event("change", { bubbles: true, cancelable: true });

        mainDropdown.dispatchEvent(event);

        },


async loadAmbienceEntry(main, second) {

const ambienceArray = await this.loadAmbienceArray();

// Filter ambienceArray based on selected values
const filterArray = ambienceArray.filter(entry =>
entry.main === main && entry.second === second
);

//console.log('current: ' + this.current);

if(this.current === ''){
const randomEntry = filterArray[Math.floor(Math.random() * filterArray.length)];
return randomEntry;     
};

//console.log('Time in Ambience -- Hour: ' + this.hour + '; Phase: ' + this.phase);

if(this.hour > 0){

return this.current;       

}else{

if(this.hour === 0){

const randomEntry = filterArray[Math.floor(Math.random() * filterArray.length)];
//console.log('New Description: ' + randomEntry.title);
return randomEntry;
}}


},

async clock(){

    if(!Edit.editMode){
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

this.radiateDisplay();

}},

radiateDisplay(){

    const overlay = document.getElementById('radiantDisplay');
    const radianceDropdown = document.getElementById('radianceDropdown').value;
    
    if(radianceDropdown === 'exterior'){
        switch (this.phase) {
        case 0: // Morning
        switch (this.hour) {
            case 0: 
            
            overlay.style.backgroundColor = "midnightblue"; /* Set your desired background color */
            overlay.style.opacity = "0.2";
    
            break;
    
            case 1: 
            
            overlay.style.backgroundColor = "gold"; /* Set your desired background color */
            overlay.style.opacity = "0.1";
    
            break;
    
            case 2: 
            
            overlay.style.backgroundColor = "gold"; /* Set your desired background color */
            overlay.style.opacity = "0.2";
    
        
            break;
    
            case 3: 
    
            overlay.style.backgroundColor = "gold"; /* Set your desired background color */
            overlay.style.opacity = "0.3";
    
            break;
    
                default:
                break;
            }
        break;
    
        case 1: // Afternoon
            switch (this.hour) {
                case 0: 
            
                overlay.style.backgroundColor = "gold"; /* Set your desired background color */
                overlay.style.opacity = "0.2";
            
                break;
            
                case 1: 
                
                overlay.style.backgroundColor = "skyblue"; /* Set your desired background color */
                overlay.style.opacity = "0.1";
            
                break;
            
                case 2: 
                
                overlay.style.backgroundColor = "skyblue"; /* Set your desired background color */
                overlay.style.opacity = "0.2";
            
            
                break;
            
                case 3: 
            
                overlay.style.backgroundColor = "skyblue"; /* Set your desired background color */
                overlay.style.opacity = "0.3";
            
                break;
    
            default:
            break;
            }
        break;
    
        case 2: // Night
            switch (this.hour) {
                case 0: 
            
                overlay.style.backgroundColor = "midnightblue"; /* Set your desired background color */
                overlay.style.opacity = "0.4";
            
                break;
            
                case 1: 
                
                overlay.style.backgroundColor = "midnightblue"; /* Set your desired background color */
                overlay.style.opacity = "0.5";
            
                break;
            
                case 2: 
            
                overlay.style.backgroundColor = "midnightblue"; /* Set your desired background color */
                overlay.style.opacity = "0.6";
            
            
                break;
            
                case 3: 
            
                overlay.style.backgroundColor = "midnightblue"; /* Set your desired background color */
                overlay.style.opacity = "0.7";
            
                break;
    
            default:
            break;
            }
        break;
    
        default:
        break;
        }
    }else{
    
        overlay.style.backgroundColor = "midnightblue"; /* Set your desired background color */
        overlay.style.opacity = "0.5";
    
    }
    
    
},


};

export default Ambience;

