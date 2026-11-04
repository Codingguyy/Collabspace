"use server"
import Roomodel from '@/models/room'
import Roommemberodel from '@/models/roomMember'
import Documentodel from '@/models/document'
import Messageodel from '@/models/message'
import connectDB from '@/database/db_configure'
export default async function Editroomleave(roomId:string,userId:string,deleteRoom:boolean,promoteUserId?:string,newCreatorId?:string){
    await connectDB()
   try{
      await Roommemberodel.deleteOne({roomId:roomId,userId:userId})
      if(deleteRoom){
        await Roomodel.deleteOne({id:roomId})
        await Documentodel.deleteMany({roomId:roomId})
        await Messageodel.deleteMany({roomId:roomId})
        await Roommemberodel.deleteMany({roomId:roomId})
      }
      else{
        if(promoteUserId){
            const promoted=await Roommemberodel.findOne({roomId:roomId,userId:promoteUserId})
            if(promoted){
                promoted.role="admin"
                await promoted.save()
            }
        }
        if(newCreatorId){
            const room=await Roomodel.findOne({id:roomId})
            if(room){
                room.createdBy=newCreatorId
                await room.save()
            }
        }
      }
      return "Success"
   }
   catch{
      return "Error"
   }
}
