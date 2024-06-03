const express = require('express');
const router = express.Router();

module.exports = (db) => {
    router.get('/', (req, res) => {
        const query = `
            SELECT 
                rs.stat_id AS id,
                rs.stat_name AS name,
                rs.mo_count AS mobility_count,
                li.lat,
                li.lon,
                li.address
            FROM 
                rental_station rs
            LEFT JOIN 
                location_info li ON rs.location_id = li.location_id;
        `;

        db.query(query, (error, results) => {
            if (error) {
                res.status(500).send(error);
            } else {
                res.json(results);
            }
        });
    });

    return router;
};
