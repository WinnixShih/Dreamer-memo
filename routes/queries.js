const pool = require('../connection');

// * get data
const getAllDream = async (req, res, next) => {
    try {
        const results = await pool.query(`
            SELECT * FROM dream
            ORDER BY date DESC
            `);
        if (results.rows.length < 1) {
            return res.status(204).render('notFound', { message: 'No dream recorded yet' });
        }
        res.status(200).render('searchResults', { dreams: results.rows });
    } catch (err) {
        next(err);
    }
}

const getDreamByPeople = async (req, res, next) => {
    const { people } = req.query;
    try {
        const results = await pool.query(`
            SELECT * FROM dream
            WHERE people = $1`, [people]);
        if (results.rows.length < 1) {
            return res.status(404).render('notFound', { message: `Can't find the dream related to ${people}` });
        }
        // ? results.rows is an array, length cannot directly use, check if it is an array
        res.status(200).render('searchResults', { dreams: results.rows });
    } catch (err) {
        next(err);
    }
}

// * Add to database
const addDream = async (req, res, next) => {
    const { people, thing, place, description } = req.body;
    const date = new Date();
    const formatter = new Intl.DateTimeFormat('zh-TW', { dateStyle: 'short' });
    // * convert into YYYY-MM-DD format
    const currentDate = date.toISOString().split('T')[0]; 
    try {
        const results = await  pool.query(`
            INSERT INTO dream (date, people, thing, place, description)
            VALUES ($1, $2, $3, $4, $5) RETURNING *`, [currentDate, people, thing, place, description]);
        res.status(201).render('operation_response', {
            method: "POST", 
            message: `New dream added on date: ${currentDate}`, 
            people: people,
            thing: thing,
            place: place,
            description: description
        });
    } catch (err) {
        next(err);
    }
}

// * edit data
const editDream = async (req, res, next) => {
    if (req.method === 'GET') {
        const { date } = req.query;
        try {
            const results = await pool.query(`
                SELECT * FROM dream
                WHERE date = $1`, [date]);
            if (results.rows.length < 1) {
                return res.status(404).render('notFound', { message: `No dream recorded on ${date}` });
            }
            res.status(200).render('editResults', { dreams: results.rows });
        } catch (err) {
            next(err);
        }
    } else if (req.method === 'POST') {
        const { date, people, thing, place, description } = req.body;
        try {
            const results = await pool.query(`
                UPDATE dream
                SET people = $1, thing = $2, place = $3, description = $4
                WHERE date = $5
                RETURNING *`, [people, thing, place, description, date]);
            if (results.rows.length < 1) {
                return res.status(404).render('notFound', { message: `No dream recorded on ${date}` });
            }
            res.status(200).render('operation_response', {
                method: "POST", 
                message: `Dream on date: ${date} was modified`, 
                people: people,
                thing: thing,
                place: place,
                description: description
            });
        } catch (err) {
            next(err);
        }
    }
}

// * delete dream
const deleteDream = async (req, res, next) => {
    // * 2 ways to delete a dream, id or date
    const { id, date } = req.query;
    try {
        if (id) {
            const results = await pool.query(`
                DELETE FROM dream
                WHERE id = $1
                RETURNING *`, [id]);
            if (results.rows.length === 0) {
                return res.status(404).render('notFound', { message: `No dream with id ${id}` });
            }
            res.status(200).render('operation_response', {method: "DELETE", message: `Dream with id: ${id} was deleted`});
        } else if (date) {
            const results = await pool.query(`
                DELETE FROM dream
                WHERE date = $1
                RETURNING *`, [date]);
                if (results.rows.length === 0) {
                return res.status(404).render('notFound', { message: `No dream on date ${date}` });
            }
            res.status(200).render('operation_response', {method: "DELETE", message: `Dream on date: ${date} was deleted`});
        } else {
                return res.status(400).render('notFound', { message: 'No id or date provided' });
        }
    } catch (err) {
        next(err);
    }
}


module.exports = {
    addDream,
    getAllDream,
    getDreamByPeople,
    editDream,
    deleteDream
}; 