const ServiceManager = require('./service_manager');

// Utility to load balance among available services
// TODO:Random for now, shift to round robin
function getAddress(key='') {
    const addresses = ServiceManager.get(key);
    
    if(addresses.length == 0) {
        console.log(`No available service for ${key}`);
        throw new Error("No available service");
    }
    
    const index = Math.floor(Math.random() * addresses.length);

    return addresses[index];
}

module.exports = {
    getAddress
}