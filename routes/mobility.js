const express = require('express');
const router = express.Router();

module.exports = (db) => {
    router.get('/', (req, res) => {
        const query = `
            SELECT 
                sm.mo_id AS id,
                sm.mo_type AS type,
                li.lat,
                li.lon,
                li.address,
                DATE_FORMAT(li.reg_date, '%Y-%m-%d') AS reg_date,
                rs.stat_name AS station_name,
                sm.batt AS battery,
                CASE
                    WHEN sm.broken_yn = 'n' THEN '정상'
                    ELSE '고장'
                END AS status,
                DATE_FORMAT(ml.main_date, '%Y-%m-%d') AS main_date,
                ml.main_cost AS main_cost,
                ml.main_content AS main_content
            FROM 
                shared_mo sm
            LEFT JOIN 
                location_info li ON sm.location_id = li.location_id
            LEFT JOIN 
                rental_station rs ON sm.stat_id = rs.stat_id
            LEFT JOIN 
                (SELECT mo_id, model, main_date, main_cost, main_content 
                 FROM main_log 
                 GROUP BY mo_id, model, main_date, main_cost, main_content) ml 
            ON sm.mo_id = ml.mo_id AND sm.model = ml.model;
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
