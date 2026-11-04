"use server"
import Roomodel from '@/models/room'
import Roommemberodel from '@/models/roomMember'
import connectDB from '@/database/db_configure'
export default async function Editchangecode(roomId:string,code:string,id:string){
    await connectDB()
 const room=await Roomodel.findOne({id:roomId})
 const handler=await Roommemberodel.findOne({roomId:roomId,userId:id})
 if(room&&handler){
    if(handler.role==="admin"||room.createdBy===id){
        room.code=code
        room.updatedAt=new Date()
        await room.save()
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