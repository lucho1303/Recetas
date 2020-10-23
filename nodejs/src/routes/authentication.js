const { Router } = require('express');
const express = require('express');
const router = express.Router();
const passport = require('passport');
const { route } = require('.');
const pool = require('../database');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');


router.get('/signup', isNotLoggedIn, (req, res) => {
    res.render('auth/signup');
});

router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup', {
    successRedirect: '/profile',
    faillureRedirect: '/signup',
    faillureFlash: true
}));

router.get('/signin',isNotLoggedIn, (req,res) => {
    res.render('auth/signin');
});

router.post('/signin', isNotLoggedIn, (req, res, next) =>{
    passport.authenticate('local.signin',{
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res, next);
});

router.get('/profile', isLoggedIn, async(req, res) => {
    var recetas = await pool.query('SELECT COUNT(id) FROM recetas WHERE estado = 1 && user_id = ?', req.user.id);
    recetas = Object.values(recetas[0]);
    console.log(recetas);
    var ingredientes = await pool.query('SELECT COUNT(id) FROM ingredientes WHERE  estado = 1 && user_id = ?', req.user.id);
    ingredientes = Object.values(ingredientes[0]);
    console.log(ingredientes);
    res.render('profile',{recetas, ingredientes});
});


router.get('/logout', isLoggedIn, (req, res) => {
    req.logOut();
    res.redirect('/signin');
});


module.exports = router;