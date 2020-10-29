const express = require('express');
const router = express.Router();
const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

router.get('/add', isLoggedIn, (req,res) =>{
    res.render('ingredientes/add');
});

router.post('/add', isLoggedIn, async(req, res) =>{
    const {name} =req.body;
    const newIngrediente = {
        name,
        user_id: req.user.id,
        estado : 1
    };
    await pool.query('INSERT INTO ingredientes set ?',[newIngrediente]);
    req.flash('success', 'Ingrediente Guardado Correctamente');
    res.redirect('/ingredientes');
});

router.get('/', isLoggedIn, async(req, res) =>{
    const ingredientes = await pool.query('SELECT * FROM ingredientes WHERE estado = 1 && user_id = ? ORDER BY name', [req.user.id]);
    res.render('ingredientes/list', {ingredientes});
});

router.get('/all', async(req, res) =>{
    const ingredientes = await pool.query('SELECT * FROM ingredientes WHERE estado = 1 ORDER BY name');
    res.render('ingredientes/all', {ingredientes});
});

router.get('/delete/:id', isLoggedIn, async(req,res) =>{
    const {id} = req.params;
    await pool.query('UPDATE ingredientes SET estado = 0 WHERE id = ?',[id]);
    req.flash('success', 'Ingrediente Eliminado Correctamente');
    res.redirect('/ingredientes');
});

router.get('/edit/:id', isLoggedIn, async(req, res) =>{
    const {id} = req.params;
    const ingredientes = await pool.query('SELECT * FROM ingredientes WHERE id = ?', [id]);
    res.render('ingredientes/edit', {ingrediente: ingredientes[0]});
});

router.post('/edit/:id', isLoggedIn, async(req, res) =>{
    const {id} = req.params;
    const {name} = req.body;
    const newIngrediente ={
        name,
        estado:1
    };
    console.log(newIngrediente);
    await pool.query('UPDATE ingredientes set ? WHERE id = ?', [newIngrediente, id]);
    req.flash('success', 'Ingrediente Actualizado Correctamente');
    res.redirect('/ingredientes');
});

module.exports = router;
