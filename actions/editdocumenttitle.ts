"use server"
import Roomodel from '@/models/room'
import Roommemberodel from '@/models/roomMember'
import Documentodel from '@/models/document'
import connectDB from '@/database/db_configure'
export default async function Editdocumenttitle(roomId:string,title:string,documentId:string,id:string){
  await connectDB()
  const room=await Roomodel.findOne({id:roomId})
  const document=await Documentodel.findOne({id:documentId})
  const handler=await Roommemberodel.findOne({roomId:roomId,userId:id})
  if(room&&document&&handler){
    if(document.ownerId===id&&roomId===handler.roomId){
        document.title=title
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