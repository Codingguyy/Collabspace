"use server"
import Messageodel from '@/models/message'
import connectDB from '@/database/db_configure'
export default async function Getviewmessageid(messageId:string){
    await connectDB()
    const message=await Messageodel.findOne({id:messageId})
    return message._id
}