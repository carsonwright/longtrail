const pipe = require('pipe-functions');

const findBy = require('./findBy');
const firstAndLast = require('./firstAndLast');
const ltree = require('./ltree');

module.exports = (model, context)=>{
    context._Model = model;

    return pipe(
        context, 
        findBy,
        firstAndLast,
        ltree
    )
}