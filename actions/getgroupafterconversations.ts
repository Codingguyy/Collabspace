"use server" 
import { message } from "@/types/collab" 
import Messageodel from '@/models/message' 
import connectDB from "@/database/db_configure"
export default async function Getgroupafterconversations(roomId:string,messageId:string):Promise<message[]>{
    await connectDB() 
    const messages=await Messageodel.find({roomId:roomId,_id:{$lt:messageId}}).sort({_id:-1}).limit(20) 
return messages.length?messages:[] }