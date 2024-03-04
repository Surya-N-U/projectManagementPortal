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

module.exports = { login, register };
