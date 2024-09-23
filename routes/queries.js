const pool = require('../connection');

// * get data
const getAllDream = async (req, res, next) => {
    try {
        const results = await pool.query(`
            SELECT TO_CHAR(date, 'YYYY-MM-DD') AS date, people, place, description
            FROM dream
            WHERE dreamer_id = $1
            ORDER BY date DESC`, [req.userId]);
        if (results.rows.length < 1) {
            return res.status(404).render('notFound', { message: 'No dream recorded yet' });
        }
        res.status(200).render('searchResults', { dreams: results.rows });
    } catch (err) {
        next(err);
    }
}

const getDreamByPeople = async (req, res, next) => {
    const { people } = req.query;
    try {
        // ? in order to change the date format, we need to 
        // ? specific call all the variable and use target date form 
        const results = await pool.query(`
            SELECT TO_CHAR(date, 'YYYY-MM-DD') AS date, people, place, description
            FROM dream
            WHERE (dreamer_id = $1 AND people = $2) `, [req.userId, people]);
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
    const { people, place, description } = req.body;
    const date = new Date();
    // * convert into YYYY-MM-DD format
    const currentDate = date.toISOString().split('T')[0];
    try {
        const results = await pool.query(`
            INSERT INTO dream (date, people, place, description, dreamer_id)
            VALUES ($1, $2, $3, $4, $5) RETURNING *`, [currentDate, people, place, description, req.userId]);
        res.status(201).render('operation_response', {
            method: "新增", 
            date: currentDate, 
            people: people,
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
                SELECT id, TO_CHAR(date, 'YYYY-MM-DD') AS date, people, place, description
                FROM dream
                WHERE (dreamer_id = $1 AND date = $2)
                ORDER BY id DESC`, [req.userId, date]);
            if (results.rows.length < 1) {
                return res.status(404).render('notFound', { message: `No dream recorded on ${date}` });
            }
            res.status(200).render('editResults', { dreams: results.rows });
        } catch (err) {
            next(err);
        }
    } else if (req.method === 'POST') {
        const { dream_id, dream_date, people, place, description } = req.body;
        try {
            const results = await pool.query(`
                UPDATE dream
                SET people = $1, place = $2, description = $3
                WHERE (id = $4)
                RETURNING *`, [people, place, description, dream_id]);
            if (results.rows.length < 1) {
                return res.status(404).render('notFound', { message: `No dream recorded on ${dream_date}` });
            }
            res.status(200).render('operation_response', {
                method: "編輯", 
                date: dream_date, 
                people: people,
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
    // * 2 ways to delete a dream, people or date
    const { people, date } = req.query;
    try {
        if (people) {
            const results = await pool.query(`
                DELETE FROM dream
                WHERE (dreamer_id = $1 AND people = $2)
                RETURNING *`, [req.userId, people]);
            if (results.rows.length === 0) {
                return res.status(404).render('notFound', { message: `No dream recorded with people ${people}` });
            }
            res.status(200).render('operation_response', {method: "刪除", message: `Dream with id: ${people} was deleted`});
        } else if (date) {
            const results = await pool.query(`
                DELETE FROM dream
                WHERE (dreamer_id = $1 AND date = $2)
                RETURNING *`, [req.userId, date]);
                if (results.rows.length === 0) {
                return res.status(404).render('notFound', { message: `No dream recorded on date ${date}` });
            }
            res.status(200).render('operation_response', {method: "刪除", message: `Dream on date: ${date} was deleted`});
        } else {
                return res.status(400).render('notFound', { message: 'No people or date provided' });
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