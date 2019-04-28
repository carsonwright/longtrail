const redis = require("redis");
const {promisify} = require('util');

const sub = redis.createClient();
const pub = redis.createClient();
const client = redis.createClient();
client.getAsync = promisify(client.get).bind(client);

module.exports = {
    client,
    pub,
    sub
}