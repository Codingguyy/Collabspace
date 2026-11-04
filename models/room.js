import mongoose from 'mongoose'
import {models} from 'mongoose'
const Room=new mongoose.Schema({
    id:{type:String,required:true},
    name:{type:String,required:true},
    description:{type:String,required:true},
    code:{type:String,required:true},
    createdAt:{type:Date,default:Date.now},
    createdBy:{type:String,required:true},
    updatedAt:{type:Date}
})
export default models.room||mongoose.model("room",Room)