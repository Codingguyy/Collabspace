"use server"
import Documentodel from '@/models/document'
import Roomememberodel from '@/models/roomMember'
import Roomodel from '@/models/room'
export default async function Documenttrashed(documentId:string,roomId:string,id:string){
  const room=await Roomodel.findOne({id:roomId})
  const roommember=await Roomememberodel.findOne({userId:id})
  const document=await Documentodel.findOne({id:documentId})
  console.log("room",room,document,roommember)
  if(room&&document&&roommember){
    if(document.ownerId===id){
        if(document.status!=="trashed"){
            document.status="trashed"
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