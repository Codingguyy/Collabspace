"use server"
import Roomodel from '@/models/room'
import Roommemberodel from '@/models/roomMember'
import Documentodel from '@/models/document'
import connectDB from '@/database/db_configure'
export default async function Editlockassign(memberId:string,roomId:string,documentId:string,id:string){
    await connectDB()
  const room=await Roomodel.findOne({id:roomId})
  const document=await Documentodel.findOne({id:documentId})
  const handler=await Roommemberodel.findOne({roomId:roomId,userId:id})
  const member=await Roommemberodel.findOne({roomId:roomId,userId:memberId})
  if(room&&document&&handler&&member){
    if(handler.role==="admin"||room.createdBy===id){
        if(room.createdBy===id){
            if(memberId===id){
                return "Success"
            }
            else{
                const documnt=await Documentodel.findOne({lockedBy:memberId})
                if(documnt){
                    documnt.lockedBy=""
                    await documnt.save()
                }
                if(member.role==="viewer"){
                    member.role="editor"
                    await member.save()
                }
                document.lockedBy=memberId
                await document.save()
                return "Success"
            }
        }
        else if(handler.role==="admin"){
            if(room.createdBy===memberId){
                return "Success"
            }
            else if(member.role==="admin"){
                return "Success"
            }
            else if(member.role==="viewer"){
                return "Success"
            }
            else if(member.role==="editor"){
                const documnt=await Documentodel.findOne({lockedBy:memberId})
                if(documnt){
                    documnt.lockedBy=""
                    await documnt.save()
                }
                document.lockedBy=memberId
                await document.save()
                return "Success"
            }
        }
        else{
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