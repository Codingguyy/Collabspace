import mongoose from 'mongoose'
import { models } from 'mongoose'
const Userodel=new mongoose.Schema({
    name:{type:String,required:true},
    password:{type:String,required:true},
    email:{type:String,required:true},
    createdAt:{type:Date,default:Date.now},
    LoginAt:{type:Date,default:Date.now}
})
export default models.userodel||mongoose.model("userodel",Userodel)
