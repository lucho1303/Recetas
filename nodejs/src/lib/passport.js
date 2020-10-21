const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require('../lib/helpers');


passport.use('local.signin', new LocalStrategy({
     usernameField: 'username',
     passwordField: 'clave',
     passReqToCallback: true
    }, async (req, username, password, done) => {
        //console.log(req.body);
        //console.log(password);
        const rows = await pool.query('SELECT * FROM usuarios WHERE username = ?',[username]);
        if(rows.length > 0){
            const user = rows[0];
            const validPassword = await helpers.matchPassword(password, user.clave);
            if(validPassword){
                done(null, user, req.flash('success','Bienvenido ' + user.username));
            }else{
                done(null, false, req.flash('message', 'Contraseña incorrecta'));
            }
        } else {
            return done(null, false, req.flash('message', 'Nombre de usuario no existe'));
        }
    
    }));


passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'clave',
    passReqToCallback: true,
}, async(req, username, clave, done) => {
    const {nombre, apellido, correo} = req.body;
    const newUser = {
        nombre,
        apellido,
        username,
        correo,
        clave
    };
    newUser.clave = await helpers.encryptPassword(clave); 
    const result = await pool.query('INSERT INTO usuarios SET ?', [newUser]);
    newUser.id = result.insertId;
    return done(null, newUser);
})); 

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser( async(id, done) => {
    const rows = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
    done(null, rows[0]);
});
