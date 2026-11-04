"use server"
import Documentodel from '@/models/document'
import Roomodel from '@/models/room'
import Roommemberodel from '@/models/roomMember'
import connectDB from '@/database/db_configure'
export default async function Setdocumentlockedby(roomId:string,documentId:string,lockedBy:string){
    await connectDB()
   const room=await Roomodel.findOne({id:roomId})
   if(room){
    const document=await Documentodel.findOne({id:documentId})
    if(document){
        const roommember=await Roommemberodel.findOne({roomId:roomId,userId:lockedBy})
        if(roommember){
        if(!document.lockedBy){
           if(document.ownerId===lockedBy){
            document.lockedBy=lockedBy
           }  
           else if(roommember.role==="editor"){
            document.lockedBy=lockedBy
           }
           else if(roommember.role==="admin"){
            document.lockedBy=lockedBy
           }
           await document.save()
           return "Success"
        }
        else if(roommember.role==="admin"){
            document.lockedBy=lockedBy
            await document.save()
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
    else{
        return "Error"
    }
   }
   else{
    return "Error"
   }
}