import Class from '../models/class.model.js';

//CREATE CLASS

export const createClass = async (req, res) => {
    try {
        const {className} = req.body;
        if(!className){
            return res.status(400).json({
                success: false,
                message: 'Class name is required'
            });
        }
        const existingClass = await Class.findOne({className});
        if(existingClass){
            return res.status(400).json({
                success: false,
                message: 'Class already exists'
            });
        }

//CREATE CLASS
        const newClass = await Class.create({
            className
        })
        res.status(201).json({
            success: true,
            message: 'Class created successfully',
            newClass,
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

//GET ALL CLASSES

export const getAllClasses = async (req, res) => {
    try{
        const classes = await Class.find().toSorted({createdAt:-1});
        res.status(200).json({
            success: true,
            count:classes.length,
            classes,
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


//UPDATE CLASS

export const updateClass=async(req,res)=>{
    try{

        const academicClass=await Class.findByIdAndUpdate(req.params.id,req.body,{new:true});

        res.status(200).json({
            success: true,
            message: "Class updated successfully",
            academicClass,
        });

    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

//Delete class

export const deleteClass=async(req,res)=>{
    try{
        const academicClass=await Class.findById(req.params.id,req.body,{new:true});
        if(!academicClass){
            return res.status(404).json({
            success: false,
            message: "Class not found",
        });
        }
        res.status(200).json({
            success: true,
            message: "Class deleted successfully",
        });
        await academicClass.deleteOne()
    }catch(error){
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

