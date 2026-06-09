import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

const seedAdmin=async () => {
    try{
        const adminExists=await User.findOne({
            email:process.env.ADMIN_EMAIL,
        });
        if(adminExists){
            console.log("Admin already exists")
            return;
        }

        //HASH PASSWORD
        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

        //CREATE ADMIN
        await User.create({
            name: "Admin",
            email: process.env.ADMIN_EMAIL,
            password: hashedPassword,
            role: "admin"
        });
        console.log("Admin Created");
    }catch(error){
        console.log(error.meesage);
    }
}

export default seedAdmin;