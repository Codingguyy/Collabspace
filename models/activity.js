import mongoose from 'mongoose'
import {models} from 'mongoose'
const activity=new mongoose.Schema({
    id:{type:String,required:true},
    type:{type:String,enum:["document:edit-started",
   "document:edit-finished",
   "document:locked",
   "document:unlocked",
   "document:lock-timeout",
   "document:created",
   "document:cloned",
   "document:deleted",
   "member:joined",
   "member:join-requested",
   "member:left",
   "room:renamed"],required:true},
    roomId:{type:String,required:true},
    actorName:{type:String,required:true},
    actorId:{type:String,required:true},
    roomName:{type:String,required:true},
    documentId:{type:String},
    documentName:{type:String},
    metadata:{type:mongoose.Schema.Types.Mixed},
    activityAt:{type:Date,required:true},
})
export default models.activity||mongoose.model("activity",activity)
