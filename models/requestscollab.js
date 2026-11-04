import mongoose from 'mongoose'
import {models} from 'mongoose'
const Request=new mongoose.Schema({
    id:{type:String,required:true},
    roomId:{type:String,required:true},
    type:{type:String,enum:["ptorm","rmtop"],required:true},
    sendBy:{type:String},
    sendTo:{type:String},
    status:{type:String,enum:["accepted","rejected","pending"],required:true},
    sendAt:{type:Date,default:Date.now},
})
export default models.requests||mongoose.model("requests",Request)