"use server"
import Messageodel from '@/models/message'
import { message } from '@/types/collab'
import connectDB from '@/database/db_configure'
export default async function Getroommessages(messageId:string,roomId:string,id:string):Promise<message[]>{
  await connectDB()
  const conversations=await Messageodel.find({roomId:roomId,_id:{$lt:messageId}}).sort({_id:-1}).limit(20).lean()
  return conversations
}