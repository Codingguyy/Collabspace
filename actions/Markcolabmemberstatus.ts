"use server"
import Roommemberodel from '@/models/roomMember'
import Roomodel from '@/models/room'
import { collabrole } from '@/types/collab'
import { RoomMemberEntry } from '@/types/collab'
import connectDB from '@/database/db_configure'
export default async function Markcolabmemberstatus(roomId:string,status:collabrole,memberId:string,id:string){
    await connectDB()
   const room=await Roomodel.findOne({id:roomId})
   if(room){
    const roommember=await Roommemberodel.findOne({roomId:roomId,userId:memberId})
    const roommemberhandler=await Roommemberodel.findOne({roomId:roomId,userId:memberId})
     if(room.createdBy===id){
        if(roommember){
            if(id!==memberId){
                roommember.role=status
                await roommember.save()
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
     else if(room.createdBy!==memberId&&roommemberhandler.role==="admin"){
        if(room.createdBy!==memberId){
            if(roommember){
                roommember.role=status
                await roommember.save()
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
     else if(roommemberhandler.role==="viewer"){
            return "Success"
     }
     else{
        return "Error"
     }
    }
   else{
        return "Error"
   }
}