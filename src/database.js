const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    ID : String,
    name : String,
    password : String,
    email : String,
    groupID : String,
});

const facultySchema = new mongoose.Schema({
    ID : String,
    name : String,
    password : String,
    email : String,
    groupIDs : [],
});

const groupSchema = new mongoose.Schema({
    groupID : {type : String, required:true, unique:true},
    projectID : String,
    facultyID : String,
    studentIDs : [],
});

const projectSchema = new mongoose.Schema({
    projectID : {type : String, required:true},
    facultyID : String,
    groupID : String,
    projectIdea : String,
    projectStatus : String,
    weeklyReportsID : String,
    latestFacultyReview : String,
    latestWeeklyReport : String
});

const weeklyReportSchema = new mongoose.Schema({
    projectID : String, 
    facultyID : String,
    groupID : String,
    weekNumber : Number,
    Report : String,
    Review : String,
    date : Date,
});

const Student = mongoose.model('Student', studentSchema);
const Faculty = mongoose.model('Faculty', facultySchema);
const Group = mongoose.model('Group', groupSchema);
const Project = mongoose.model('Project', projectSchema);
const WeeklyReport = mongoose.model('WeeklyReport', projectSchema);

const register = (req) => {
    if(req.body.type == "Student") {
        const student = new Student ({
            ID : req.body.ID,
            name : req.body.name,
            password : req.body.password,
            email : req.body.email
        });
        student.save();
    }
    else if(req.body.type == "Faculty") {
        const faculty = new Faculty ({
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
            return {status:200, msg:"LoggedIn", type : req.body.type, ID : login.ID};
        }
        else {
            return {status:400, msg:"Password didn't match"};
        }
    }
    else {
        return {status:404, msg:'No match found'};
    }
};

const findGroup = async (facultyID) => {

};

async function getStudentsByFacultyID(facultyID) {
  try {
    // Find all groups assigned to the given facultyID
    const groups = await Group.find({ facultyID: facultyID });

    // Array to hold the formatted output
    let formattedOutput = {
      facultyID: facultyID,
      groups: []
    };

    // Iterate through each group
    for (const group of groups) {
      // Find students belonging to the current group and populate their names
      const groupStudents = await Student.find({ groupID: group.groupID }).populate('name');

      // Format students for the current group
      let formattedStudents = {};
      for (let i = 0; i < groupStudents.length; i++) {
        formattedStudents[`student${i + 1}`] = groupStudents[i].name;
      }

      // Add the group with formatted students to the output
      formattedOutput.groups.push({
        groupID: group.groupID,
        students: formattedStudents
      });
    }

    return formattedOutput;
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error;
  }
}


module.exports = { login, register, findGroup, getStudentsByFacultyID, Project, WeeklyReport };
