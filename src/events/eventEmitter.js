const EventEmitter = require('events');

// Create a central Event Emitter instance
class GlobalEmitter extends EventEmitter {}

const eventEmitter = new GlobalEmitter();

module.exports = eventEmitter;
