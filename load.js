const load = {

Data : [],

loadDefault(){
const url = 'data.json';

fetch(url)
.then(response => response.json())
.then(data => {
// Here, 'data' will be your JSON array
this.Data = data
console.log(this.Data);
})
.catch(error => {
console.error('Error fetching data:', error);
});

},






}

export default load;