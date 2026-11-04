"use server"
import Roomodel from '@/models/room'
import Roommemberodel from '@/models/roomMember'
import connectDB from '@/database/db_configure'
export default async function Editroomdetails(roomId:string,mode:number,value:string,id:string){
    await connectDB()
   const room=await Roomodel.findOne({id:roomId})
   const roommember=await Roommemberodel.findOne({roomId:roomId,userId:id})
   if(room&&roommember){
    if(room.createdBy===id||roommember.role==="admin"){
        if(mode===1){
            room.name=value
            room.updatedAt=new Date()
            await room.save()
            return "Success"
        }
        else if(mode===2){
            room.description=value
            room.updatedAt=new Date()
            await room.save()
            return "Success"
        }
        else{
            return "Error"
        }
    }
    else{
        return "Success"
    }
    }
    else{
        return "Error"
    }
}