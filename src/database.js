const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    Type : String,
    ID : String,
    name : String,
    password : String,
    email : String
});

const Student = mongoose.model('Student', registrationSchema);
const Faculty = mongoose.model('Faculty', registrationSchema);

const register = (req) => {
    if(req.body.type == "Student") {
        const student = new Student ({
            type : req.body.type,
            ID : req.body.ID,
            name : req.body.name,
            password : req.body.password,
            email : req.body.email
        });
        student.save();
    }
    else if(req.body.type == "Faculty") {
        const faculty = new Faculty ({
            type : req.body.type,
            ID : req.body.ID,
            name : req.body.name,
            password : req.body.password,
            email : req.body.email
        });
        faculty.save();
    }
};

const login = async (req) => {
    let login = "";
    if(req.body.type == "Student"){
        login = await Student.findOne({"ID" : req.body.ID});
    }
    else if(req.body.type == "Faculty"){
        login = await Faculty.findOne({"ID" : req.body.ID});
    }
    if(login){
        if(login["password"] == req.body.password){
            return {status:200, msg:"LoggedIn", type : req.body.type};
        }
        else {
            return {status:400, msg:"Password didn't match"};
        }
    }
    else {
        return {status:404, msg:'No match found'};
    }
}


//ideaSubmission->schema
const ideaSchema=new mongoose.Schema({
    idea:String,
    descr:String
});
//ideaSub->collection
const ideaSub=mongoose.model('ideaSub',ideaSchema)
const addIdea=async(req,res)=>{
    let newIdea=new ideaSub({
    idea:req.body.idea,
    descr:req.body.descr
});

newIdea.save();
}

 


//updateSubmission->schema
const updateSubmissionSchema=new mongoose.Schema({
    updates:String
});
//updateSub->collection
const updateSub=mongoose.model('updateSub',updateSubmissionSchema)
const addUpdate=async(req,res)=>{
    let newUpdate=new updateSub({
    updates:req.body.updates,
   
});

newUpdate.save();

}
const reviewSchema = new mongoose.Schema({
    studentId: String,
    review: String
});

const Review2 = mongoose.model('Review2', reviewSchema);

// newReview.save();


module.exports = { login, register,addIdea,addUpdate,Review2};