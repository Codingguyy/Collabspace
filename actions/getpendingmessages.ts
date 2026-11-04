"use server"
import Onetooneconversation from "@/models/Onetooneconversation"
import { getkey } from "@/socketserver/server"
import connectDB from "@/database/db_configure"
export default async function Getpendingmessages(senderId:string,recieverId:string):Promise<number>{
    await connectDB()
    const conversations=await Onetooneconversation.find({chatId:getkey(senderId,recieverId),senderId:senderId,status:"pending"}).lean()
    return conversations.length?conversations.length:0
}