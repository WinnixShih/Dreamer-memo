const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./routes/queries');

// ? Use Render's provided port
const PORT = process.env.PORT || 3000; 
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

// * render endpoints
app.get('/', (req ,res) => {
    res.render('home');
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


// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// })

// * searching endpoint
// ? provided endpoint need to name as the action target in html(hbs)
app.get('/search/result', db.getDreamByPeople);
app.get('/search/all/result', db.getAllDream);

// * adding endpoint
app.post('/add', db.addDream);

// * editing endpoint
app.get('/edit/result', db.editDream)
app.post('/edit/result', db.editDream)

// * deleting endpoint
app.delete('/delete', db.deleteDream);



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