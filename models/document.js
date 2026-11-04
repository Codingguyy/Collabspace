import mongoose from "mongoose"
import {models} from 'mongoose'
const Document = new mongoose.Schema({
    id:{type:String,required:true},
    roomId: { type: String, required: true },
    type: { type: String, enum: ["text", "canvas"], required: true },
    title: { type: String, required: true },
    content: { type: mongoose.Schema.Types.Mixed, default: "" },
    ownerId: { type: String, required: true },
    visibility: { type: String, enum: ["room", "private"], required: true, default: "private" },
    lockedAt: { type: Date, default: null },
    lockedBy: { type: String, default: null },
    clonedFrom: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date },
    status:{type:String,enum:["trashed","deleted","none"],required:true,default:"none"}
})

export default models.document || mongoose.model("document", Document)