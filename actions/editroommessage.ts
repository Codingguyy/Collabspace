"use server"
import Messageodel from '@/models/message'
import connectDB from '@/database/db_configure'
export default async function Editroommessages(roomId:string,messageId:string,content:string,id:string){
    await connectDB()
 const message=await Messageodel.findOne({id:messageId})
 if(message){
    if(message.senderId===id){
        message.content=content
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