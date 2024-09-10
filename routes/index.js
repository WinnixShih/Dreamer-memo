const express  = require('express');
const router = express.Router();

// * 根路由
router.get("/", function (req, res) {
    // ? find the home.engine --> home.handlebars, and put into main.handlebars body
    res.render("home");
});

module.exports = router;
