import StudentProfile from "../models/studentProfile.model.js";
import TeacherProfile from "../models/teacherProfile.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

//CREATE STUDENT
export const createStudent = async (req, res) => {
  try {
    const { 
        name, 
        email, 
        password, 
        classId,
        sectionId,
        rollNumber,
        fatherName,
        motherName,
        phone,
        gender,
        dob,
        address,
        admissionDate,
 } = req.body;
 //CHECK EXISTING USER
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: "User already exists" 
    });
    }
    //HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);
    //CREATE USER
    const newUser = await new User.create({
      name,
      email,
      password: hashedPassword,
        role: "student",
    });
    //CREATE PROFILE
    const studentProfile = await StudentProfile.create({
      user: User._id,
      class: classId,
      section: sectionId,
      rollNumber,
      fatherName,
      motherName,
      phone,
      gender,
      dob,
      address,
      admissionDate
    });
    res.status(201).json({ 
      success: true,
      message: "Student created successfully",
      user,
      studentProfile,
    });
  } catch (error) {
    
    res.status(500).json({ 
        success: false,
        message: error.message,
     });
  }
}

//GET ALL STUDENTS
export const getAllStudents = async (req, res) => {
  try {
    const students = await StudentProfile.find()
    .populate("user")
    .populate("class")
    .populate("section")
    res.status(200).json({
        success: true,
        count: students.length,
        students,
    });
  }catch (error) {
    res.status(500).json({
        success: false,
        message: error.message,
    });
  }
}

//UPDATE STUDENT
export const updateStudent = async (req, res) => {
  try {
    const student=await StudentProfile.findById(req.params.id);
    if(!student){
        return res.status(404).json({
            success: false,
            message: "Student not found",
        });
    }

    //UPDATE USER
    await User.findByIdAndUpdate(
        student.user, 
        {
            name: req.body.name,
            email: req.body.email,
        },
        { new: true }
    );

    //UPDATE PROFILE
    const updatedStudent = await StudentProfile.findByIdAndUpdate(
        req.params.id,
        req.body,
        { 
            new: true
        },
    )
    .populate("user")
    .populate("class")
    .populate("section");
    res.status(200).json({
        success: true,
        message: "Student updated successfully",
        updatedStudent,
    });
           
}catch (error) {     
    res.status(500).json({
        success: false,
        message: error.message,
    });
  }
}

//DELETE STUDENT
export const deleteStudent = async (req, res) => {
  try {  
    const student = await StudentProfile.findById(req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }  
    //DELETE USER
    await User.findByIdAndDelete(student.user);
    //DELETE PROFILE
    await StudentProfile.deleteOne();
    res.status(200).json({
        success: true,
        message: "Student deleted successfully",
    });
}
catch (error) {
    res.status(500).json({ 
        success: false,
        message: error.message,
     });
  }
};



//CREATE TEACHER
export const createTeacher = async (req, res) => {
  try {
    const {
        name, 
        email, 
        password, 
        subject,
        experience,
        qualification,
        salary,
        subjectSpecialization,
        phone,
        gender,
        address
 } = req.body;
 //CHECK EXISTING USER
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: "User already exists" 
    });
    }
    //HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);
    //CREATE USER
    const User = await User.create({
      name,
      email,
      password: hashedPassword,
        role: "teacher",
    });

    //CREATE PROFILE
    const teacherProfile = await TeacherProfile.create({
      user: User._id,
      subject,
      experience,
      salary,
      qualification,
      subjectSpecialization,
      phone,
      gender,
      address
    });
    res.status(201).json({ 
      success: true,
      message: "Teacher created successfully",
      user,
      teacherProfile,
    });
  } catch (error) {
    
    res.status(500).json({ 
        success: false,
        message: error.message,
     });
  }
}

//Get ALL TEACHERS
export const getAllTeachers = async (req, res) => {
  try {     
    const teachers = await TeacherProfile.find()
    .populate("user")
    
    res.status(200).json({
        success: true,
        count: teachers.length,
        teachers,
    });
  }catch (error) {
    res.status(500).json({
        success: false,
        message: error.message,
    });
  }
};

//UPDATE TEACHER
export const updateTeacher = async (req, res) => {
  try {
    const teacher=await TeacherProfile.findById(req.params.id); 
    if(!teacher){
        return res.status(404).json({
            success: false,
            message: "Teacher not found",
        });
    }

    //UPDATE USER
    await User.findByIdAndUpdate(
        teacher.user, 
        {
            name: req.body.name,
            email: req.body.email,
        },
    );

    //UPDATE PROFILE
    const updatedTeacher = await TeacherProfile.findByIdAndUpdate(
        req.params.id,
        req.body,
        { 
            new: true
        },
    )
    .populate("user");
    res.status(200).json({
        success: true,
        message: "Teacher updated successfully",
        updatedTeacher,
    });
           
}catch (error) {        
    res.status(500).json({
        success: false,
        message: error.message,
    });
  }
}

//DELETE TEACHER
export const deleteTeacher = async (req, res) => {
  try {  
    const teacher = await TeacherProfile.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }  
    //DELETE USER
    await User.findByIdAndDelete(teacher.user);

    //DELETE PROFILE
    await teacher.deleteOne();
    res.status(200).json({
        success: true,
        message: "Teacher deleted successfully",
    });
}
catch (error) {
    res.status(500).json({ 
        success: false,
        message: error.message,
     });
  }
};



