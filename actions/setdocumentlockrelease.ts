"use server"
import Documentodel from '@/models/document'
import Roomodel from '@/models/room'
import connectDB from '@/database/db_configure'
export default async function Setdocumentlockrelease(roomId:string,documentId:string,id:string){
    await connectDB()
const room=await Roomodel.findOne({id:roomId})
   if(room){
    const document=await Documentodel.findOne({id:documentId})
    if(document){
        if(document.lockedBy===id){
            document.lockedBy=""
            await document.save()
        }
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