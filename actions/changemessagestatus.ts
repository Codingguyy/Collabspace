"use server"
import { grpconversations } from "@/types/groupconversations"
import Messageodel from '@/models/message'
import connectDB from "@/database/db_configure"
export default async function Chnagemessagestatus(roomId:string,messageId:string,status:grpconversations,id:string){
   await connectDB()
   const message=await Messageodel.findOne({id:messageId})
   if(message){
     if(message.senderId===id){
        message.status=status
        await message.save()
        return "Success"
     }
     else{
        return "Success"
     }
   }
   else{
    return "Error"
   }
}