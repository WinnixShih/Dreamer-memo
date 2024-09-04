const pool = require('../connection');

// * get Dream data
const getDream = (req, res) => {
    pool.query(
        `SELECT * FROM dream
        ORDER BY date DESC`,
        (err, result) => {
            if (err) throw err;
            else if (result.rows.length === 0) {
                res.status(200).send('No recorded dream.');
            } else {
                res.status(200).json(result.rows);
            }
        }
    )
}

const getDreamByPeople = (req, res) => {
    const people = req.query.people;
    `SELECT * FROM dream
    WHERE people = $1`, [people],
    (err, result) => {
        if (err) throw err;
        res.status(200).json(result.rows);
    }
}

// * Add to database
const addDream = (req, res, next) => {
    const { people, thing, place, description } = req.body;
    pool.query(
        `INSERT INTO dream (people, thing, place, description)
        VALUES ($1, $2, $3, $4) RETURNING *`, [people, thing, place, description],
        (err, result) => {
            if (err) return next(err)
            res.redirect('/')
        }
    )
};




module.exports = {
    addDream,
    getDream,
    getDreamByPeople
};