import xapi from 'xapi';

function logObjectProperties(obj) {
  // Log the object itself
  console.log(obj);

  // Loop through all properties of the object
  for (const key in obj) {
    // Log the property name and value
    console.log(key + ": " + obj[key]);

    // If the value of the property is itself an object, call the function recursively to log its properties
    if (typeof obj[key] === "object") {
      logObjectProperties(obj[key]);
    }
  }
}



logObjectProperties(xapi);