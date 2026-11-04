import mongoose from 'mongoose'
import {models} from 'mongoose'
const DocumentVersion=new mongoose.Schema({
    id:{type:String,required:true},
    documentId:{type:String,required:true},
    content:{type:String,required:true},
    editedBy:{type:String,required:true},
    createdAt:{type:Date,default:Date.now}
})
export default models.documentversion||mongoose.model("documentversion",DocumentVersion)