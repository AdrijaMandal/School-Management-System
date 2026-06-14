import express from "express";
import { createSection, deleteSection, getSectionByClass, updateSection } from "../controllers/section.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import authorizeRoles from "../middleware/role.middleware.js";

const router=express.Router();

//CREATE SECTION
router.post("/create",protect,authorizeRoles("admin"),createSection);

//GET SECTIONS BY CLASS
router.get("/:classId",protect,authorizeRoles("admin"),getSectionsByClass);

//UPDATE section
router.put("/:id",protect,authorizeRoles("admin"),updateSection)

// DELETE SECTION
router.delete("/:id",protect,authorizeRoles("admin"),deleteSection)


export default router;