const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./routes/queries')

const PORT = 3000;
const app = express();

const { engine } = require('express-handlebars');
app.engine('hbs', engine({
    extname: 'hbs',  // Set extension to .hbs
    layoutsDir: __dirname + '/views/layouts',  // Path to layouts
    partialsDir: __dirname + '/views/partials' // Path to partials
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// * available the file in the public folder, will show the index.html 
// * if the file in the public
app.use(express.static('public'));

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
app.get('/search', db.getDreamByPeople);
app.get('/search/all', db.getAllDream);

// * adding endpoint
app.post('/add', db.addDream);

// * editing endpoint
app.get('/edit', db.editDream)

// * deleting endpoint
app.delete('/delete', db.deleteDream);



// ? Route not found error
// app.use((req, res, next) => {
//     const err = new Error('Page Not found');
//     err.status = 404;
//     next(err);
// })

// ? All error handling
app.use((err, req, res, next) => {
    console.error(`Error: ${err.message}`);
    res.status(err.status || 500).send(err.message ||'Internal Server Error');
})

app.listen(PORT, console.log(`App is now listening on ${PORT}`));