const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors=require('cors');
const bodyParser = require('body-parser');
// const reviewSub = require('./database.js/reviewSub'); 

const { login, register,addIdea, addUpdate,findReview} = require('./database.js');

//Initializations for express
const app = express();
const port = 3000
app.use(cors())
app.use(express.json())
//Initializations for Mongoose
const main = async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/projectManagement');
}
main().catch(err => console.log(err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

app.get('/', (req, res) => {
    res.sendFile('index.html', {root: path.join(__dirname, '../public')});
});

app.post('/', async (req,res) => {
    const result = await login(req);
    if(result.status == 200){
        if(result.type == "Faculty"){
            res.redirect(`/faculty/${result.ID}`);
        }
        else if(result.type == "Student") {
            res.redirect(`/student/${result.ID}`);
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


app.get('/student/:studentID',function(req,res){
    res.sendFile('student.html', {root: path.join(__dirname, '../public')});
});
app.post('/student',async(req,res)=>{
    await addIdea(req);
    res.send('idea submitted');
   });
   
app.post('/student/report',async(req,res)=>{
    await addUpdate(req);
    res.send("You're update has been submitted");
   });

app.get('/viewreview/:studentId', async (req, res) => {
    const studentId = req.params.studentId;

    try {
        const review = await findReview(studentId);
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        console.log(review[0].Review);
        // Send the review data back to the client
        res.json(review[0].Review);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Started listening on port ${port}`);
});
   
