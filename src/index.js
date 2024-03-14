const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { login, register, findGroup, getStudentsByFacultyID, Project} = require('./database.js');

//Initializations for express
const app = express();
const port = 3000

//Initializations for Mongoose
const main = async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/projectManagement');
}
main().catch(err => console.log(err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.set("views", path.join(__dirname, "../views"));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.sendFile('index.html', {root: path.join(__dirname, '../public')});
});

app.post('/', async (req,res) => {
    const result = await login(req);
    if(result.status == 200){
        if(result.type == "Faculty"){
            res.redirect('/faculty');
        }
        else if(result.type == "Student") {
            res.redirect('/student');
        }
    }
    else {
        res.send(status.msg);
    }
});

app.get('/register', (req, res) => {
    res.sendFile('register.html', {root: path.join(__dirname, '../public')});
});

app.post('/register', async (req, res) => {
    await register(req);
    res.send('entry registered');
});

app.get('/faculty', async (req, res) => {
    const facultyID = "113";
    const groups = await getStudentsByFacultyID(facultyID);
    console.log(groups);
    res.render("faculty", {data : groups});
});

app.get('/projects/:facultyID', async (req, res) => {
  try {
    const facultyID = req.params.facultyID;
    const projects = await Project.find({ facultyID: facultyID });
    console.log(projects);
    res.render('projects', { projects: projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).send("Internal Server Error");
  }
});


app.listen(port, () => {
    console.log(`Started listening on port ${port}`);
});


