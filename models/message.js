import mongoose from 'mongoose'
import {models} from 'mongoose'
const Message=new mongoose.Schema({
    id:{type:String,required:true},
    roomId:{type:String,required:true},
    senderId:{type:String,required:true},
    content:{type:String,required:true},
    type:{type:String,enum:["text","system"],required:true},
    replyTo:{id:{type:String},content:{type:String}},
    status:{type:String,enum:["deleted","deleteforme","none"],default:"none"},
    createdAt:{type:Date,default:Date.now}
})
export default models.message||mongoose.model("message",Message)