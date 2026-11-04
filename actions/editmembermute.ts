"use server"
import Roommemberodel from '@/models/roomMember'
import Roomodel from '@/models/room'
import connectDB from '@/database/db_configure'
export default async function Editmembermute(roomId:string,memberId:string,id:string,muted:boolean){
   await connectDB()
 const member=await Roommemberodel.findOne({roomId:roomId,userId:memberId})
 const handler=await Roommemberodel.findOne({roomId:roomId,userId:id})
 const room=await Roomodel.findOne({id:roomId})
 if(member&&handler&&room){
    if(handler.role==="admin"){
       if(memberId===room.createdBy){
          return "Success"
       }
       else if(room.createdBy===id&&memberId!==id){
          member.isMuted=muted
          await member.save()
          return "Success"
       }
       else if(member.role==="admin"&&memberId!==room.createdBy){
         return "Success"
       }
       else{
        member.isMuted=muted
        await member.save()
        return "Success"
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