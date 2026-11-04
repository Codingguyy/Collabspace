"use server"
import Conversationsodel from '@/models/conversation'
import connectDB from '@/database/db_configure'
export default async function Getconversationsafteronetooneconversations(id:string,cursor:string){
   if(id&&cursor){
      await connectDB()
    const conversations=await Conversationsodel.find({chatId:id,_id:{$lt:cursor}}).sort({_id:-1,createdAt:-1}).limit(20)
    return conversations
   }
}