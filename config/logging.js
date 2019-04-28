let validKeys = ['*'];
let invalidKeys = [];
if(typeof process.env.VALID_KEYS === 'string'){
    validKeys = process.env.VALID_KEYS.split(' ')
}
if(typeof process.env.INVALID_KEYS === 'string'){
    invalidKeys = process.env.INVALID_KEYS.split(' ')
}

module.exports = {
    validKeys,
    invalidKeys
}