const express = require('express');
const router = express.Router();
const db = require('../db');


router.get('/apiadmin/status', (req, res) => {
    res.json({ status: 'admin ok', message: 'Server is running' });
});
router.get('/allusers', (req, res) => {
    db.query("SELECT * FROM users", (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.send(result);
        }
    });
});
router.get('/allprojects', (req, res) => {
    db.query("SELECT * FROM projects WHERE project_phase != 'ร่างคำขออนุมัติ'", (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.send(result);
        }
    });
});
router.get('/allprojectshavenumber/', (req, res) => {
    db.query("SELECT * FROM projects WHERE project_phase != 'ร่างคำขออนุมัติ' AND project_phase != 'ดำเนินการขออนุมัติ' AND project_phase != 'โครงการอนุมัติ' ", (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.send(result);
        }
    });
});

router.get('/yearlyprojectshavenumber/:yearly', (req, res) => {
    const yearly = req.params.yearly;
    db.query("SELECT * FROM projects WHERE project_phase != 'ร่างคำขออนุมัติ' AND project_phase != 'ดำเนินการขออนุมัติ' AND project_phase != 'โครงการอนุมัติ' AND yearly = ?", yearly, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.send(result);
        }
    });
});

router.get('/getsomeprojectshavenumber/:AgnecyGroupName/:yearly', (req, res) => {
    const AgnecyGroupName = req.params.AgnecyGroupName;
    const yearly = req.params.yearly;
    db.query("SELECT * FROM projects WHERE project_phase != 'ร่างคำขออนุมัติ' AND project_phase != 'ดำเนินการขออนุมัติ' AND project_phase != 'โครงการอนุมัติ' AND AgnecyGroupName = ? AND yearly = ?", [AgnecyGroupName, yearly], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.send(result);
        }
    });
});

router.get('/studentusers', (req, res) => {
    db.query("SELECT * FROM users WHERE position IN ('S', 'SH', 'Ad')", (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.send(result);
        }
    });
});

router.get('/stuactusers', (req, res) => {
    db.query("SELECT * FROM users WHERE position = 'Stuact'", (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.send(result);
        }
    });
});

router.delete('/user/deleteUser/:id', (req, res) => { // Added a leading slash
    const id = req.params.id;
    db.query("DELETE FROM users WHERE id = ?", id, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send(err); // Handle the error and send an appropriate response
        } else {
            res.send(result);
        }
    });
});


router.post('/user/createUser', (req, res) => {
    const { id_student,
        name_student,
        Phone,
        AgencyAdvisor,
        department,
        position,
        clubName,
        WorkGroup,
        ClubGroup,
        campus,
        email,
        account_type,
        STU_STATUS_DESC,
        LEVEL_DESC,
        yearly,
        codedivision,
        codeagency,
        codeworkgroup,
        codebooksome,
        codebooksomeoutyear,
        agencyGroupName
    } = req.body;
    console.log(req.body)

    db.query(
        "INSERT INTO users (id_student, name_student,Phone,AgencyAdvisor, department, position, clubName,WorkGroup,ClubGroup, campus,email,account_type,STU_STATUS_DESC,LEVEL_DESC, yearly, codedivision, codeagency, codeworkgroup, codebooksome,codebooksomeoutyear,agencyGroupName) VALUES (?,?,?,?,?,?,?,?,?,?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [id_student,
            name_student,
            Phone,
            AgencyAdvisor,
            department,
            position,
            clubName,
            WorkGroup,
            ClubGroup,
            campus,
            email,
            account_type,
            STU_STATUS_DESC,
            LEVEL_DESC,
            yearly,
            codedivision,
            codeagency,
            codeworkgroup,
            codebooksome,
            codebooksomeoutyear,
            agencyGroupName
        ],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send(err); // Handle the error and send an appropriate response
            } else {
                res.send("Values Inserted");
            }
        }
    );
});

router.post('/createNetProject', (req, res) => {
    const {
        project_name,
        AgnecyGroupName,
        responsible_agency,
        campus,
        net_budget,
        yearly,

    } = req.body;
    console.log(req.body)
    const createdAt = new Date();
    db.query(
        "INSERT INTO netprojectbudget (project_name,AgnecyGroupName, responsible_agency, yearly, campus, net_budget,createdAt) VALUES (?,?,?,?,?,?,?)",
        [project_name,
            AgnecyGroupName,
            responsible_agency,
            yearly,
            campus,
            net_budget,
            createdAt
        ],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send(err); // Handle the error and send an appropriate response
            } else {
                res.send("Values Inserted");
            }
        }
    );
});


router.get('/getallNetProject', (req, res) => {
    db.query("SELECT * FROM netprojectbudget", (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.send(result);
        }
    });
});
router.get('/getyearlyNetProject/:yearly', (req, res) => {
    const yearly = req.params.yearly;
    db.query("SELECT * FROM netprojectbudget WHERE yearly = ?", yearly, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.send(result);
        }
    });
});

router.get('/getSelectGroupNetProject/:AgnecyGroupName/:yearly', (req, res) => {
    const AgnecyGroupName = req.params.AgnecyGroupName;
    const yearly = req.params.yearly;
    db.query("SELECT * FROM netprojectbudget  WHERE AgnecyGroupName = ? AND yearly = ?", [AgnecyGroupName, yearly], (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.send(result);
        }
    });
});


router.put("/updateusebudget/:project_name", (req, res) => {

    const project_name = req.params.project_name;
    const { allow_budget } = req.body;
    db.query(
        "UPDATE netprojectbudget SET allow_budget= ? WHERE project_name = ?",
        [allow_budget, project_name],
        (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).send("Error updating project data"); // Handle the error and send an appropriate response
            } else {
                console.log("Project data updated successfully");
            }
        }
    );
});

router.delete('/deleteNetProject/:id', (req, res) => { // Added a leading slash
    const id = req.params.id;
    db.query("DELETE FROM netprojectbudget WHERE id = ?", id, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send(err); // Handle the error and send an appropriate response
        } else {
            res.send(result);
        }
    });
});

module.exports = router;    