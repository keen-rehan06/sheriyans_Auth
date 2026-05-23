import mongoose from "mongoose";

export const connectDb = async() => {
    try {
        await mongoose.connect(`mongodb://127.0.0.1:27017/auth`);
        console.log("MongoDb connected Successfully!✅")
    } catch (error) {
        console.log("MongoDb Connection Failed:❌",error)
    }
}