const {format} = require('timeago.js');

const helpers = {};


helpers.timeago = (timestap) => {
    return format(timestap);
};

module.exports = helpers;