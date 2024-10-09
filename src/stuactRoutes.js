const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/stuactallprojects/:AgnecyGroupName', (req, res) => {
    const AgnecyGroupName = req.params.AgnecyGroupName;
    db.query(
        "SELECT * FROM projects WHERE AgnecyGroupName = ? AND project_phase != 'ร่างคำขออนุมัติ'",
        [AgnecyGroupName],
        (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).send("Error retrieving project");
          } else {
            res.send(result);
          }
        }
      );
});



module.exports = router;    