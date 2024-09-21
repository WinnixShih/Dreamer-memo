const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;

const pool = require('../connection');

const registerDreamer = async (req, res, next) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const results = await pool.query(`
            INSERT INTO dreamer (name, password)
            VALUES ($1, $2) RETURNING *`, [username, hashedPassword]);
        res.status(201).render('successResponse', { message: 'New dreamer created!'});
    } catch(err) {
        if (err.code === '23505') {
            res.status(400).render('errorResponse', { message: 'User name already exist, please name a new one'});
        }
        next(err);
    }
}

const loginDreamer = async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const results = await pool.query(`
            SELECT * FROM dreamer
            WHERE name = $1`, [username]);
        const user = results.rows[0];
        if (user && await bcrypt.compare(password, user.password)) {
            // ? create jwt token using user id, secret_dkey and 
            // ? set the expire time (after 1 hour need login again)
            const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
            res.cookie('token', token, { httpOnly: true }); 
            res.redirect('/');
        } else {
            res.status(404).render('notFound', { message: 'Wrong username or password' });
        }
    } catch(err) {
        next(err);
    }
}

// ? show the dreamer name if login
const authenticateLogin = async (req, res, next) => {
    const token = req.cookies.token;
    res.locals.areLogin = false;
    // ? if no login yet, skip
    if (!token) {
        return next();
    }
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const results = await pool.query(`
            SELECT name FROM dreamer
            WHERE id = $1`, [decoded.userId]);
        const user = results.rows[0];
        if (user) {
            res.locals.areLogin = true;
            res.locals.userName = user.name;
        }
        next();
    } catch(err) {
        next(err);
    }
}


// ? Check the if the dreamer login before CRUD operation
const authenticateOperationToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(403).render('errorResponse', { message: 'Need login first'});
    }
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.userId = decoded.userId;
        next();
    } catch(err) {
        next(err);
    }
}


const logoutDreamer = (req, res, next) => {
    res.clearCookie('token');
    res.redirect('/');
}


module.exports = {
    registerDreamer,
    loginDreamer,
    authenticateOperationToken,
    authenticateLogin,
    logoutDreamer
}