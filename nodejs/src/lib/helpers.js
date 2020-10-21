const bcrypt = require('bcryptjs');
const passport = require('passport');
const helpers = {};


//Cifrar contraseña
helpers.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

//Comparar contraseña
helpers.matchPassword = async (password, savedPasword) => {
    try {
        return await bcrypt.compare(password, savedPasword);
    } catch (error) {
        console.log(error);
    }
};


module.exports = helpers;