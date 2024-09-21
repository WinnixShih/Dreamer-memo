const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./routes/queries');
const auth = require('./routes/auth');
const cookieParser = require('cookie-parser');

// ? Use Render's provided port and base URL
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
const app = express();

const { engine } = require('express-handlebars');
app.engine('hbs', engine({
    extname: 'hbs',  // Set extension to .hbs
    layoutsDir: __dirname + '/views/layouts',  // Path to layouts
    partialsDir: __dirname + '/views/partials', // Path to partials
    // ? helper function use in the handlebars, since you can't 
    // ? compare in the handlebars 
    helpers: {
        ifEquals: (a, b, options) => {
            return (a == b) ? options.fn(this) : options.inverse(this);
        }
    }
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// * available the file in the public folder, will show the index.html 
// * if the file in the public
app.use(express.static('public'));
app.use(cookieParser());

// ? Pass BASE_URL to all templates
app.use((req, res, next) => {
    res.locals.baseUrl = BASE_URL;
    next();
});
// ? show login info
app.use(auth.authenticateLogin);

// * render endpoints
app.get('/', (req ,res) => {
    res.render('home');
})

app.get('/login', (req, res) => {
    res.render('login');
})

app.get('/register', (req, res) => {
    res.render('register');
})

app.get('/add', (req, res) => {
    res.render('add');
})

app.get('/search', (req, res) => {
    res.render('search');
})

app.get('/edit', (req, res) => {
    res.render('edit');
})

app.get('/delete', (req, res) => {
    res.render('delete');
})

// * endpoint action

// * register endpoint
app.post('/register', auth.registerDreamer);

// * login/logout endpoint
app.post('/login', auth.loginDreamer);
app.post('/logout', auth.logoutDreamer);

app.get('/logout', auth.logoutDreamer);

// * searching endpoint
// ? provided endpoint need to name as the action target in html(hbs)
app.get('/search/result', auth.authenticateOperationToken, db.getDreamByPeople);
app.get('/search/all/result', auth.authenticateOperationToken, db.getAllDream);

// * adding endpoint
app.post('/add', auth.authenticateOperationToken, db.addDream);

// * editing endpoint
app.get('/edit/result', auth.authenticateOperationToken, db.editDream)
app.post('/edit/result', auth.authenticateOperationToken, db.editDream)

// * deleting endpoint
app.delete('/delete', auth.authenticateOperationToken, db.deleteDream);


// ? Route not found error
app.get('/*', (req, res, next) => {
    const err = new Error('Page Not found');
    err.status = 404;
    next(err);
})

// ? All error handling
app.use((err, req, res, next) => {
    console.error(`Error: ${err.message}`);
    res.status(err.status || 500).send(err.message ||'Internal Server Error');
})

app.listen(PORT, console.log(`App is now listening on ${PORT}`));