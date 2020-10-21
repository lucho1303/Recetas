const express = require('express');
const router = express.Router();
const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');


router.get('/add', isLoggedIn, async (req, res) => {
    const ingredientes = await pool.query('SELECT * FROM ingredientes WHERE estado = 1');
    res.render('links/add', { ingredientes });
});

router.post('/add', isLoggedIn, async (req, res) => {
    const { title, description, ing, cant, med } = req.body;

    var sizeCant = Object.keys(cant).length;

    var j = 0;
    var ingrediente = '';
    for (let i = 0; i < sizeCant; i++) {

        if (cant[i] != '') {
            var aux = getMedida(med[i]);
            if (aux != 'undefined') {
                ingrediente += cant[i] + ' ' + aux + ' de ' + ing[j] + '\r\n';
                j++;
            }
        }
    }
    const newReceta = {
        title,
        description,
        ingredientes: ingrediente,
        user_id: req.user.id,
        estado: 1
    };
    await pool.query('INSERT INTO recetas set ?', [newReceta]);

    req.flash('success', 'Receta Guardada Correctamente');
    res.redirect('/recetas');
});

router.get('/', isLoggedIn, async (req, res) => {
    const recetas = await pool.query('SELECT * FROM recetas WHERE estado = 1 && user_id = ?',[req.user.id]);
    res.render('links/list', { recetas });
});

router.get('/all', async(req, res) =>{
    const recetas = await pool.query('SELECT * FROM recetas WHERE estado = 1');
    const autores = await pool.query('SELECT id, username FROM  usuarios');
    recetas.forEach(receta =>{
        autores.forEach(autor =>{
            if(receta.user_id == autor.id){
                receta.user_id = autor.username;
            }
        });      
    });
    res.render('links/all', { recetas });
});

router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await pool.query('UPDATE recetas SET estado = 0 WHERE id = ?', [id]);
    req.flash('success', 'Receta Eliminada Correctamente');
    res.redirect('/recetas');
});

router.get('/:id', async(req, res) =>{
    const {id} = req.params;
    const recetas = await pool.query('SELECT * FROM recetas WHERE id = ?',[id]);
    const autores = await pool.query('SELECT id, username FROM  usuarios');
    recetas.forEach(receta =>{
        autores.forEach(autor =>{
            if(receta.user_id == autor.id){
                receta.user_id = autor.username;
                receta.ingredientes = receta.ingredientes.trim();
            }
        });      
    });
    const receta = recetas[0];
    console.log(receta.ingredientes);
    res.render('links/read', {receta} );
    
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const recetas = await pool.query('SELECT * FROM recetas WHERE id = ?', [id]);
    const ingredientes = await pool.query('SELECT * FROM ingredientes WHERE estado = 1');
    res.render('links/edit', { receta: recetas[0], ingredientes});
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { title, description, ing, cant, med } = req.body;
    console.log('ingredientes del form: ',ing);
    var sizeCant = Object.keys(cant).length;

    var j = 0;
    var ingrediente = '';
    for (let i = 0; i < sizeCant; i++) {
        if (cant[i] != '') {
            var aux = getMedida(med[i]);
            if (aux != 'undefined') {
                var aux1 = '';
                if(ing[j].length <= 1){
                    aux1 = ing;
                }
                else{
                    aux1 = ing[j];
                }
                ingrediente += cant[i] + ' ' + aux + ' de ' + aux1 + '\r\n';
                j++;
            }
        }
    }
    console.log(ingrediente);
    const newReceta = {
        title,
        description,
        ingredientes: ingrediente
    };
    await pool.query('UPDATE recetas set ? WHERE id = ?', [newReceta, id]);
    req.flash('success', 'Receta Actualizada Correctamente');
    res.redirect('/recetas');
});



function getMedida(med) {
    let m = 'no asignado';
    switch (med) {
        case '1':
            m = 'u';
            break;
        case '2':
            m = 'gr';
            break;
        case '3':
            m = 'ml';
            break;
        case '4':
            m = 'Cda';
            break;
        case '5':
            m = 'taza';
            break;
        case '6':
            m = 'lb';
            break;
            case '7':
                m = 'l';
                break;
        default:
            m = 'undefined';
    };
    return m;
}

module.exports = router;