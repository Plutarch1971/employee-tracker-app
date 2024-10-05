const router = require('express').Router();
const { pool } = require('../db/connection');

// CRUD

router.get('/', async (req, res) => {
    console.log('[GET] /api/business');
    // get the entities from db
    const query = "SELECT * FROM public.business;";
    const result = await pool.query(query);

    //return to client
    res.json(result.rows);
});

router.post('/', async (req, res) => {
    console.log('[POST] /api/business');
    // get the entities from db

    // TODO: change the table col from integer to varchar/text
    const query = "INSERT INTO business(name) VALUES($1,$2);";
    const result = await pool.query(query, [req.body.name, req.body.type]);

    //return to client
    res.json(result.rows);
});


module.exports = router;