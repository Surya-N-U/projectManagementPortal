const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors=require('cors');
const bodyParser = require('body-parser');
// const reviewSub = require('./database.js/reviewSub'); 

const { login, register,addIdea, addUpdate,Review2} = require('./database.js');

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

app.get('/faculty', (req, res) => {
        res.sendFile('faculty.html', {root: path.join(__dirname, '../public')});
});

app.listen(port, () => {
    console.log(`Started listening on port ${port}`);
});
app.get('/student',function(req,res){
    res.sendFile('student.html', {root: path.join(__dirname, '../public')});
});
app.post('/student',async(req,res)=>{
    await addIdea(req);
    res.send('idea submitted');
   });
   
app.get('/student/report',function(req,res){
    res.sendFile('reports.html', {root: path.join(__dirname, '../public')});
});
app.post('/student/report',async(req,res)=>{
    await addUpdate(req);
    res.send("You're update has been submitted");
   });



// Route to handle viewing the review data for a student
app.get('/viewreview/:studentId', async (req, res) => {
    const studentId = req.params.studentId;

    try {
        const review = await Review2.findOne({ studentId })
        // .sort({ createdAt: -1 }) // Sort by createdAt field in descending order (most recent first)
        // .select({ review: 1, _id: 0 });
        // Query MongoDB to find the review for the given studentId
        // const review = await Review2.findOne({ studentId }, { review: 1, _id: 0 });
        .sort({ _id: -1 }) // Sort by _id field in descending order (most recent first)
            .select({ review: 1, _id: 0 });
        if (!review) {
            return res.status(404).json({ error: 'Review not found' });
        }

        // Send the review data back to the client
        res.send(review.review);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.get('/facultyreview', (req, res) => {
    res.sendFile('facultyReview.html', {root: path.join(__dirname, '../public')});
});

app.post('/facultyreview', async (req, res) => {
    try {
        
        // Extract review data from the request body
        const { studentId, review } = req.body;
   

        // Create a new Review document
      
        const newReview = new Review2({
            studentId,
            review
        });
        // Save the review data to the database
        await newReview.save();

        res.status(201).send('Review submitted successfully!');
    } catch (error) {
        console.error('Error submitting review:', error);
        res.status(500).send('Internal server error');
    }
});
   