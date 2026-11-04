"use server"
import Roommemberodel from '@/models/roomMember'
import { collabrole } from '@/types/collab'
import connectDB from '@/database/db_configure'
export default async function Createroommember(roomMemberId:string,userId:string,roomId:string,role:collabrole){
    await connectDB()
 if(roomMemberId&&userId&&roomId&&role){
    await Roommemberodel.create({id:roomMemberId,roomId:roomId,userId:userId,role:role,lastseenmessageId:""})
    return "Success"
 }
 else{
    return "Error"
 }
}