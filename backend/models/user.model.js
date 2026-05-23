import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
     name:{
        type:String,
        required:true
     },
     email:{
        type:String,
        required:true,
     },
     password:{
        type:String,
        required:true
     },
     token:{
      type:String,
      default:null
     },
     isLoggedIn:{
        type:Boolean,
        default:false
     },
     isVerfied:{
        type:Boolean,
        default:false
     },
     otp:{
        type:String
     },
     otpExpiry:{
      type:String
     },
     refreshToken:{
      type:String,
      default:null,
     }
},{timestamps:true})

const userModel = new mongoose.model("user",userSchema);
export default userModel;