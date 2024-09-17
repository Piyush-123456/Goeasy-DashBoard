const express = require('express');
const geoFenceCollection = require('../models/geofence');
const router = express.Router();

router.post('/addName', async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({
                message: "Data isn't present",
                success: false
            });
        }
        const data = await geoFenceCollection(req.body);
        await data.save();
        res.status(200).json({
            data, success: true
        })

    }
    catch (err) {
        next(err);
    }
})

module.exports = router;