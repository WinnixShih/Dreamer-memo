const pool = require('../connection');

// * get data
const getAllDream = async (req, res, next) => {
    try {
        const results = await pool.query(`
            SELECT * FROM dream
            ORDER BY date DESC
            `);
        if (results.rows.length < 1) {
            return res.status(404).send('No dream recorded yet');
        }
        res.status(200).json(results.rows);
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
            return res.status(404).send(`Can't find the dream related to ${people}`);
        }
        res.status(200).json(results.rows);
    } catch (err) {
        next(err);
    }
}

// * Add to database
const addDream = async (req, res, next) => {
    const { people, thing, place, description } = req.body;
    const date = new Date();
    const formatter = new Intl.DateTimeFormat('zh-TW', { dateStyle: 'short' });
    const currentDate = formatter.format(date);
    console.log(currentDate);
    try {
        const results = await  pool.query(`
            INSERT INTO dream (date, people, thing, place, description)
            VALUES ($1, $2, $3, $4, $5) RETURNING *`, [currentDate, people, thing, place, description]);
        res.status(201).json({ message: "New dream added", dream: results.rows[0] });
    } catch (err) {
        next(err);
    }
}

// * edit data
const editDream = async (req, res, next) => {
    const { date } = req.query;
    try {
        const results = await pool.query(`
            SELECT * FROM dream
            WHERE date = $1`, [date]);
        if (results.rows.length < 1) {
            return res.status(404).send(`No dream recorded on ${date}`);
        }
        res.status(200).json(results.rows);
    } catch (err) {
        next(err);
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
                return res.status(404).send(`No dream with id ${id}`);
            }
            res.status(200).send(`Dream with id: ${id} was deleted`);
        } else if (date) {
            const results = await pool.query(`
                DELETE FROM dream
                WHERE date = $1
                RETURNING *`, [date]);
            if (results.rows.length === 0) {
                return res.status(404).send(`No dream on date ${date}`);
            }
            res.status(200).send(`Dream on date: ${date} was deleted`);
        } else {
            res.status(400).send('No id or date provided');
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