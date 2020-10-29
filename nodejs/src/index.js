const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MYSQLStore = require('express-mysql-session');
const passport = require('passport');
const multer = require('multer');
const uuid = require('uuid');
const cloudinary = require('cloudinary');


const {database} = require('./keys');
const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/uploads'),
    filename: (req, file, cb) => {
        cb(null, uuid.v4() + path.extname(file.originalname).toLocaleLowerCase());

    }
});

// INICIALIZATIONS
const app = express();
require('./lib/passport');
cloudinary.config({
  cloud_name: 'ideasparacocinar',
  api_key: '453471664738468',
  api_secret: 'PYiOVHS-JaqRfd9IrhNKQjlBoQo'
});

// SETTINGS
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout:'main',
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

// MIDDLEWARES
app.use(session({
    secret: 'mysqlsession',
    resave: false,
    saveUninitialized: false,
    store: new MYSQLStore(database)
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(multer({
    storage,
    dest: path.join(__dirname, 'public/uploads'),
    limits: {fileSize: 5000000},
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname));
        if(mimetype && extname){
            return cb(null, true);
        }
        cb("Error el archivo debe ser una imagen valida");
    }
}).single('image'));


// GLOBAL VARIABLES
app.use((req,res,next)=>{
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});

// ROUTES
app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/recetas', require('./routes/links'));
app.use('/ingredientes', require('./routes/ingredientes'));

// PUBLIC
app.use(express.static(path.join(__dirname, 'public')));

// STARTING SERVER
app.listen(app.get('port'), () =>{
    console.log('Server on port ', app.get('port'));
});
