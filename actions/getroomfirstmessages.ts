"use server"
import Messageodel from '@/models/message'
import connectDB from '@/database/db_configure'
export default async function Getroomfirstmessages(roomId:string){
    await connectDB()
    const messages=await Messageodel.find({roomId:roomId}).sort({_id:-1}).limit(20).lean()
    return messages
}