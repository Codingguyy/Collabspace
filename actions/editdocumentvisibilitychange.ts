"use server"
import Roomodel from '@/models/room'
import Documentodel from '@/models/document'
import Roommemberodel from '@/models/roomMember'
import { roomtype } from '@/types/collab'
import connectDB from '@/database/db_configure'
export default async function Editdocumentvisibilitychange(roomId:string,documentId:string,visibility:roomtype,id:string){
    await connectDB()
   const room=await Roomodel.findOne({id:roomId})
   const document=await Documentodel.findOne({id:documentId})
   const handler=await Roommemberodel.findOne({roomId:roomId,userId:id})
   if(room&&document&&handler){
    if(document.ownerId===id&&roomId===handler.roomId){
        document.visibility=visibility
        await document.save()
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