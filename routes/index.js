const express  = require('express');
const router = express.Router();

// * 根路由
router.get("/", (req, res) => {
    // ? find the home.engine --> home.handlebars, and put into main.handlebars body
    res.render("home");
});

router.get('/add', (req, res) => {
    res.render('add');
})

router.get('/search', (req, res) => {
    res.render('search');
})

router.get('/edit', (req, res) => {
    res.render('edit');
})

router.get('/delete', (req, res) => {
    res.render('delete');
})

module.exports = router;
