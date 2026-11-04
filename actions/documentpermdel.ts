"use server"
import Roomodel from '@/models/room'
import Roomemberodel from '@/models/roomMember'
import Documentodel from '@/models/document'
export default async function Documentpermdel(documentId:string,roomId:string,id:string){
const room=await Roomodel.findOne({id:roomId})
const document=await Documentodel.findOne({id:documentId})
const roomMember=await Roomemberodel.findOne({userId:id})
if(room&&roomMember&&document){
    if(document.ownerId===id){
        if(document.status==="trashed"||document.status==="none"){
            document.status="deleted"
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
    return "Success"
}
}