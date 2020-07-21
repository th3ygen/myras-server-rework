const express = require('express');
const router = express.Router();

router.post('/callback', (req, res, next) => {
    const { body } = req;
    
    console.log(body);
    
    
});

module.exports = router;