const Array = {

locationArray : [],    

getLocation(location) {
const rect   = location.getBoundingClientRect();
const left   = parseFloat(location.style.left);
const top    = parseFloat(location.style.top);
const width  = parseFloat(location.style.width);
const height = parseFloat(location.style.height);
const divId  = location.id;

return {
        left,
        top,
        width,
        height,
        divId
       };
},

};

// Usage example
const exLocation1 = createPositionDiv(100, 100, 200, 150, 'divId1');
document.body.appendChild(exLocation1);
locationArray.push(Map.getLocation(exLocation1));

const exLocation2 = createPositionDiv(300, 300, 150, 100, 'divId2');
document.body.appendChild(exLocation2);
locationArray.push(Map.getLocation(exLocation2));

// Convert the array to JSON string
const jsonString = JSON.stringify(locationArray);
console.log(jsonString);

export default Array;
