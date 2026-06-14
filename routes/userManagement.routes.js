import express from 'express';
import { 
    createStudent, 
    getAllStudents,
    updateStudent, 
    deleteStudent,
    createTeacher,
    getAllTeachers,
    updateTeacher, 
    deleteTeacher
} from '../controllers/userManagement.controller.js';
import { protect } from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/role.middleware.js";

const router = express.Router();

//STUDENT ROUTES

router.post("/student", protect, authorizeRoles("admin"), createStudent);
router.get("/students", protect, authorizeRoles("admin"), getAllStudents);
router.put("/student/:id", protect, authorizeRoles("admin"), updateStudent);
router.delete("/student/:id", protect, authorizeRoles("admin"), deleteStudent);

//TEACHER ROUTES

router.post("/teacher", protect, authorizeRoles("admin"), createTeacher);
router.get("/teachers", protect, authorizeRoles("admin"), getAllTeachers);
router.put("/teacher/:id", protect, authorizeRoles("admin"), updateTeacher);
router.delete("/teacher/:id", protect, authorizeRoles("admin"), deleteTeacher);

