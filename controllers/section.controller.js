import Section from "../models/section.model.js";
import Class from "../models/class.model.js";

//CREATE SECTION

export const createSection=async(req,res)=>{
    try{
        const{sectionName, classId}=req.body;
        if(!sectionName || !classId){
            return res.status(400).json({
                success:false,
                message: "All fiels are required",
            });
        }

        const academicClass=await Class.findById(classId);
        if(!academicclass){
            return res.status(404).json({
                success:false,
                message: "Class not found",
            });
        }

        //CHECK DUPLICATE SECTION
        const existingSection=await Section.findOne({
            sectionName,
            classId
        });
        if(!existingSection){
            return res.status(400).json({
                success:false,
                message: "Section already exists in the class",
            });
        }

        //CREATE SECTION
        const section=await Section.create({
            sectionName,
            class: classId
        });
        res.status(201).json({
                success:true,
                message: "Section created successfully",
                section,
            });

    }catch(error){
        res.status(500).json({
                success:false,
                message: error.message,
            });
    }
};

//GET SECTIONS BY CLASS
export const getsectionByClass=async(req,res)=>{
    try{
        const sections=await Section.find({
            class:req.params.classId,
        }).populate("class");
        
        res.status(200).json({
                success:true,
                count:sections.length,
                sections,
            });
    
    }catch(error){
        res.status(500).json({
                success:false,
                message: error.message,
            });
    }
};

//Update Section
export const updateSection=async(req,res)=>{
    try{

        const asection=await Class.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
        });

        if(!section){
            return res.status(404).json({
                success:false,
                message:"Section not found",
            })
        }
        res.status(200).json({
            success: true,
            message: "Section updated successfully",
            section,
        });

    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

//DELETE SECTION

export const deleteSection=async(req,res)=>{
    try{
        const section=await Section.findById(req.params.id);
        if(!section){
            return res.status(404).json({
            success: false,
            message: "Section not found",
        });
        }
        await section.deleteOne();

        res.status(200).json({
            success: true,
            message: "Section deleted successfully",
        });
        
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};