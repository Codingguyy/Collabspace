"use server"
import Documentodel from '@/models/document'
import Roommemberodel from '@/models/roomMember'
import Roomodel from '@/models/room'
export default async function Adminflipstatusdocument(documentId:string,roomId:string,id:string){
 const room=await Roomodel.findOne({id:roomId})
 const roomMember=await Roommemberodel.findOne({userId:id})
 const document=await Documentodel.findOne({id:documentId})
 if(room&&roomMember&&document){
   if(roomMember.role==="admin"){
    if(document.visibility==="room"){
        document.visibility="private"
        await document.save()
        return "Success"
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