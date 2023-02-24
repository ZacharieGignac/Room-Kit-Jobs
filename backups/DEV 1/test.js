import xapi from 'xapi';

function listXapiPropertiesAndFunctions(xapi) {
    for (let property in xapi) {
        if (typeof xapi[property] === "function") {
            console.log(`Function: ${property}`);
        } else {
            console.log(`Property: ${property}`);
        }
    }
}

listXapiPropertiesAndFunctions();