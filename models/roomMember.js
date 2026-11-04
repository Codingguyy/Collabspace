import mongoose from 'mongoose'
import {models} from 'mongoose'
const RoomMember=new mongoose.Schema({
    id:{type:String,required:true},
    roomId:{type:String,required:true},
    userId:{type:String,required:true},
    role:{type:String,enum:["admin","editor","viewer"],required:true},
    lastseenmessageId:{type:String},
    isMuted:{type:Boolean,default:false},
    joinedAt:{type:Date,default:Date.now}
})
export default models.roomMember||mongoose.model("roomMember",RoomMember)