"use server"
import Roomodel from '@/models/room'
import Roommemberodel from '@/models/roomMember'
import connectDB from '@/database/db_configure'
export default async function Editkickmember(roomId:string,memberId:string,id:string){
    await connectDB()
  const room=await Roomodel.findOne({id:roomId})
  const handler=await Roommemberodel.findOne({roomId:roomId,userId:id})
  const member=await Roommemberodel.findOne({roomId:roomId,userId:memberId})
  if(room&&handler&&member){
    if(room.createdBy===id){
        if(id===memberId){
            return "Success"
        }
        else{
            await member.deleteOne()
            return "Success"
        }
    }
    else if(handler.role==="admin"){
        if(member.role==="admin"){
            return "Success"
        }
        else{
            await member.deleteOne()
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