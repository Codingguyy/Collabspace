"use server"
import Roomodel from '@/models/room'
import Documentodel from '@/models/document'
import Roommemberodel from '@/models/roomMember'
import connectDB from '@/database/db_configure'
export default async function Editforcereleaselock(roomId:string,documentId:string,memberId:string,id:string){
    await connectDB()
    const room=await Roomodel.findOne({id:roomId})
    const document=await Documentodel.findOne({id:documentId})
    const handler=await Roommemberodel.findOne({roomId:roomId,userId:id})
    const member=await Roommemberodel.findOne({roomId:roomId,userId:memberId})
    if(room&&document&&handler&&member){
        if(handler.role==="admin"||room.createdBy===id){
            if(room.createdBy===id){
                if(id===memberId){
                    return "Success"
                }
                else{
                    document.lockedBy=""
                    await document.save()
                }
            }
            else if(handler.role==="admin"){
                if(memberId===room.createdBy){
                    return "Success"
                }
                else if(member.role==="admin"){
                    return "Success"
                }
                else{
                    document.lockedBy=""
                    await document.save()
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