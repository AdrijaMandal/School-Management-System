import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import crypto from "crypto";


//LOGIN USER

export const loginUser=async(req,res)=>{
    try{
        const{email,password}=req.body;
        console.log(email,password);
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"All Fields are required"
            });
        }

        //FIND USER
        const user=await User.findOne({email}).select("+password");
       
        if(!user){
             return res.status(401).json({
                success:false,
                message:"Invalid email or password"
            });
        }

        //COMPARE PASSWORD
        const isMatch=await bcrypt.compare(password,user.password)
        
        if(!isMatch){
             return res.status(401).json({
                success:false,
                message:"Invalid email or password"
            });
        }

        //GENERATE TOKENS
        const token=generateToken(user._id)

        //COOKIE OPTIONS
        const cookieOptions={
            httpOnly:true,
            secure:false,
            sameSite:"strict",
            maxAge:7*24*60*60*1000
        }

        //SEND COOKIE

        res.cookie("token", token, cookieOptions);
        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            }
        });
        

    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}


//LOGOUT USER

export const logoutUser=async(req,res)=>{
    try{
        res.cookie("token", "", {
            httpOnly: true,
            expires: new Date(0)
        });

        res.status(200).json({
            success: true,
            message: "Logout successful",
        });

    }
    catch (error){
        console.log("error",error);
        
        res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

//FORGET PASSWORD
export const forgetPassword=async(req,res)=>{
    try{
        const{email}=req.body;
        if(!email){
            return res.status(400).json({
                success:false,
                message:"Email is required",
            });
        }
        const user=await User.findOne({email});
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found",
            });
        }

        const resetToken=crypto.randomBytes(20).toString("hex");
        //HASH TOKEN
        const hashedToken=await crypto.createHash("sha256").update(resetToken).digest("hex");

        user.resetPasswordToken=hashedToken;
        user.resetPasswordExpire=Date.now()+15*60*1000;
        await user.save();

        //RESET URL
        const resetUrl=`${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        //HTML
        const html=`
        <div style="font-family: Arial, sans-sarif; padding: 20px;">
         <h2 style="color: #333;">Password Reset Request</h2>
         <p>
            You requested a password reset. 
        </p>
        <p>
            Click the link below to reset your password:
        <p>
        <a href="${resetUrl}" 
        style="display: inline-block; 
        padding: 12px 20px; 
        background-color: #4f46e5; 
        color: #fff; 
        text-decoration: none; 
        border-radius: 5px;
        margin-top: 10px;
        ">
        Reset Password
        </a>
        
        <p style="margin-top:20px;">
            This link will expire in 15 minutes.
        </p>
        
        <p>
            If you did not request this, please ignore this email.
        </p>

        </div>
        `
        await sendEmail({
            email: user.email,
            subject:"Password Reset Request",
            html,
        })
        res.status(200).json({
                success:false,
                message:"Password reset link sent to email",
            });
    }
    catch(error){
        res.status(500).json({
            sucess:false,
            message:error.message,
        });

    }
}

export const resetPassword=async(req,res)=>{
    try{
        const token=req.params;
        const{password}=req.body;
        //HASH TOKEN
        const hashedToken=crypto.createHash("sha256").update(token).digest("hex")

        const user=await User.findOne({
            resetPasswordToken:hashedToken,
            resetPasswordExpire:{
                $gt:Date.now(),
            }
        })

        if(!user){
            return res.status(400).json({
                success:false,
                message:"Invalid or expired token",
            });
        }

        const hashedPassword=await bcrypt.hash(password,10);

        user.password=hashedPassword;
        user.resetPasswordToken=""
        user.resetPasswordExpire=undefined
        await user.save();
        res.status(200).json({
                success:false,
                message:"Password reset sucessful",
            });
    }catch(error){
        res.status(500).json({
                success:false,
                message:error.message,
            });
    }
}

