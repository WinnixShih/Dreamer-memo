const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./routes/queries')

const PORT = 3000;
const app = express();

// const { engine } = require('express-handlebars');
// app.engine('handlebars', engine());
// app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

app.get('/search', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'search.html'));
})

app.post('/', db.addDream);

// ? Route not found error
app.use((req, res, next) => {
    const err = new Error('Not found');
    err.status = 404;
    next(err);
})

// ? All error handling
app.use((err, req, res, next) => {
    console.error(`Error: ${err.message}`);
    res.status(err.status || 500).send(err.message ||'Internal Server Error');
})

app.listen(PORT, console.log(`App is now listening on ${PORT}`));