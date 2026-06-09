import mongoose from "mongoose";

const connectDB=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("connected to DB");

    } catch (error) {
        console.log("error to connect with  DB",error);
    }
}

export default connectDB