const Weather = {

    async loadWeatherArray() {
        try {
            const response = await fetch('weather.json'); // Adjust the path if needed
            const data = await response.json();
            return data.weather;
        } catch (error) {
            console.error('Error loading weather array:', error);
            return [];
        }
    },

    async initializeWeatherDropdowns() {
        const weatherArray = await this.loadWeatherArray();
        const uniqueSeasons = [...new Set(weatherArray.map(item => item.season))];
        const uniqueTimesOfDay = [...new Set(weatherArray.map(item => item.time_of_day))];
        this.populateDropdown(document.getElementById("seasonDropdown"), uniqueSeasons);
        this.populateDropdown(document.getElementById("timeOfDayDropdown"), uniqueTimesOfDay);
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

    async loadRandomWeatherEntry(selectedSeason, selectedTimeOfDay) {
        const weatherArray = await this.loadWeatherArray();
      
        // Filter weatherArray based on selected values
        const filteredWeatherArray = weatherArray.filter(entry =>
            entry.season === selectedSeason && entry.time_of_day === selectedTimeOfDay
        );
      
        const randomEntry = filteredWeatherArray[Math.floor(Math.random() * filteredWeatherArray.length)];
        console.log(randomEntry)    
        return randomEntry;
      },


};

export default Weather;

