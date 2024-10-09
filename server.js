const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const app = express();
const cors = require('cors');
const axios = require('axios');
const routes = require('./routes');
const login = require('./src/login');
const userInfo = require('./src/getUserInfo');
const db = require('./db');

const nodemailer = require('nodemailer');

const adminRoutes = require('./src/adminRoutes');
const studentRoutes = require('./src/studentRoutes');
const stuactRoutes = require('./src/stuactRoutes');
app.use(adminRoutes)
app.use(studentRoutes)
app.use(stuactRoutes)


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);


// app.use(express.static(path.join(__dirname, 'build')));

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });


// if(process.env.NODE_ENV == 'production'){
//   host = 'usersystem'
// }

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});



const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "maddison53@ethereal.email",
    pass: "jn7jnAPss4f63QBp6D",
  },
});

// Route handler for sending email
app.post('/sendEmail', async (req, res) => {
  try {
    const { to, subject, text, html } = req.body; // Extract email details from request body

    // Send email with the provided data
    const info = await transporter.sendMail({
      from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // Sender address
      to: "s6303051613149@email.kmutnb.ac.th", // List of receivers
      subject: subject, // Subject line
      text: text, // Plain text body
      html: html, // HTML body
    });

    console.log("Message sent: %s", info.messageId);
    res.json({ success: true, messageId: info.messageId }); // Send success response back to client
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, error: error.message }); // Send error response back to client
  }
});




app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});
app.post('/api/authen', async (req, res) => {
  console.log("Backend")
  try {
    const { username, password } = req.body;
    // console.log(req.body);
    const response = await login(username, password);
    if (response.status === 'success') {

      console.log(response.message.firstname_en + " " + response.message.lastname_en + " is login success as " + req.body.username);

    } else {
      console.log("(" + response.message + ") Is login failed as " + req.body.username);
    }

    delete response.message.pid;

    res.json({ status: response.status, message: response.message, message2: response.message2 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }

});

app.post('/api/userInfo', async (req, res) => {

  try {
    const { username } = req.body;

    // console.log(req.body);
    const response = await userInfo(username);
    if (response.status === 'success') {
      console.log(response.message)
      console.log(response.message.firstname_en + " " + response.message.lastname_en + " is getuser success as " + req.body.username);

    } else {
      console.log("(" + response.message + ") Is userino failed as " + req.body.username);
    }
    delete response.message.pid;

    res.json({ status: response.status, message: response.message, message2: response.message2 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal userinfoserver error' });
  }

});
app.get("/getState/:id_projects", (req, res) => {
  const id_projects = req.params.id_projects;
  db.query(
    "SELECT * FROM status_project WHERE id_projects = ? ORDER BY id_projects DESC LIMIT 1",
    [id_projects],
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

app.put("/firstupdateState/:id_projects", async (req, res) => {
  const id_projects = req.params.id_projects;
  const { project_name, codeclub, project_phase, CountYear } = req.body;
  const updated_at = new Date();
  console.log(req.body)

  const updatedData = {
    project_name,
    codeclub,
    project_phase,
    updated_at,
  };
  const yearly_count = CountYear;

  const updateProjectData = {
    project_phase,
    yearly_count,
    updated_at,
  }

  // Update the project with the given id_project in the database
  db.query(
    "UPDATE status_project SET ? WHERE id_projects = ?",
    [updatedData, id_projects],
    (err, result) => {
      if (err) {
        console.error(err);
      }
    }
  );
  db.query(
    "UPDATE projects SET ? WHERE id = ?",
    [updateProjectData, id_projects],
    (err, result) => {
      if (err) {
        console.error(err);
      }
    }
  );

});

app.put("/updateState/:id_projects", async (req, res) => {
  const id_projects = req.params.id_projects;
  const { project_name, codeclub, project_phase, editor_name } = req.body;
  const updated_at = new Date();

  const updatedData = {
    project_name,
    codeclub,
    project_phase,
    updated_at,
    editor_name
  };
  const updateProjectData = {
    project_phase,
    updated_at,
  }

  // Update the project with the given id_project in the database
  db.query(
    "UPDATE status_project SET ? WHERE id_projects = ?",
    [updatedData, id_projects],
    (err, result) => {
      if (err) {
        console.error(err);
      }
    }
  );
  db.query(
    "UPDATE projects SET ? WHERE id = ?",
    [updateProjectData, id_projects],
    (err, result) => {
      if (err) {
        console.error(err);
      }
    }
  );

});

app.post("/insertlogState/:id_projects", async (req, res) => {
  const id_projects = req.params.id_projects;
  const { project_name, codeclub, project_phase, editor_name } = req.body;
  const updated_at = new Date();

  const updatedData = {
    id_projects,
    project_name,
    codeclub,
    project_phase,
    updated_at,
    editor_name
  };

  // Update the project with the given id_project in the database
  db.query(
    "INSERT INTO logstatus_project SET ?",
    updatedData,
    (err, result) => {
      if (err) {
        console.error(err);
      }
    }
  );

});

app.post("/studentgetmoney/:id_projects", async (req, res) => {
  const id_projects = req.params.id_projects;
  const { project_name, yearly, namestudent_receive, numberstudent_receive, namestuact_receive, remainingBudget } = req.body;
  const updated_at = new Date();

  const updatedData = {
    id_projects,
    project_name,
    yearly,
    namestudent_receive,
    numberstudent_receive,
    namestuact_receive,
    remainingBudget,
    updated_at,
  };
  // const use_budget = numberstudent_receive+(old in database )
  // Update the project with the given id_project in the database
  db.query(
    "INSERT INTO logstudentgetmoney SET ?",
    updatedData,
    (err, result) => {
      if (err) {
        console.error(err);
      }
    }
  );
});
//test

app.post("/updateprojectusebudget/:id_projects", async (req, res) => {
  const id_projects = req.params.id_projects;
  const { project_name, yearly, namestudent_receive, numberstudent_receive, namestuact_receive, remainingBudget } = req.body;
  const updated_at = new Date();

  
  try {
    // Query logstudentgetmoney table to get the sum of numberstudent_receive
    db.query(
      "SELECT SUM(numberstudent_receive) AS totalReceived FROM logstudentgetmoney WHERE id_projects=?AND project_name = ? AND yearly = ?",
      [id_projects,project_name, yearly],
      async (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error querying logstudentgetmoney table");
        }
        
        const allow_budget = parseInt(result[0].totalReceived) || 0; // Ensure totalReceived is an integer

        console.log(allow_budget)
        // Update allow_budget in the projects table
        db.query(
          "UPDATE projects SET allow_budget = ? WHERE id = ?",
          [allow_budget, id_projects],
          (err, result) => {
            if (err) {
              console.error(err);
            }
          }
        );
        db.query(
          "UPDATE netprojectbudget SET allow_budget = ? WHERE project_name = ? AND yearly=?",
          [allow_budget, project_name,yearly],
          (err, result) => {
            if (err) {
              console.error(err);
            }
          }
        );
      }
    );
  } catch (error) {
    console.error(error);
  }
});




app.get("/gethistorystudentgetmoney/:id_projects", async (req, res) => {
  const id_projects = req.params.id_projects;

  db.query(
    "SELECT * FROM logstudentgetmoney WHERE id_projects = ?",
    [id_projects],
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



const PORT = process.env.PORT || 3001;
// const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
