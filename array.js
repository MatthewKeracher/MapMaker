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

export default Array;
