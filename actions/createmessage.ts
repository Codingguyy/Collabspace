"use server"
import Messageodel from '@/models/message'
import Roommemberodel from '@/models/roomMember'
import { CanvasContent } from "@/types/collab"
import { messagetype } from "@/types/collab"
import { grpconversations } from '@/types/groupconversations'
import connectDB from '@/database/db_configure'
export default async function Createmessage(messageId:string,roomId:string,senderId:string,content:string,type:messagetype,status:grpconversations){
    await connectDB()
    if(messageId&&roomId&&senderId&&content&&type){
        const roommember=await Roommemberodel.findOne({roomId:roomId,userId:senderId})
        console.log("details in createmember server action",roomId,messageId,senderId,content,type,status)
        console.log("roommember",roommember)
        if(roommember){
        if(!roommember.isMuted){
        await Messageodel.create({id:messageId,roomId:roomId,senderId:senderId,content:content,type:type,status:status})
        return {id:messageId,message:"Success"}
        }
        else{
            return {message:"Success",id:""}
        }
        }
        else{
            return {message:"Error",id:""}
        }
    }
    else{
        return {id:"",message:"Error"}
    }
}