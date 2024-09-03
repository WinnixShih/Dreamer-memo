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

// app.post('/add', db.addDream());

// app.post('/', query.addDream);

app.listen(PORT, console.log(`App is now listening on ${PORT}`));