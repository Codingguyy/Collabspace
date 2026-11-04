"use server"
import Documentodel from '@/models/document'
import Roommemberodel from '@/models/roomMember'
import Roomodel from '@/models/room'
import connectDB from '@/database/db_configure'

export default async function Deletedocument(documentId:string,roomId:string,id:string){
    await connectDB()
    const room=await Roomodel.findOne({id:roomId})
    const document=await Documentodel.findOne({id:documentId})
    if(room&&document){
        const roommember=await Roommemberodel.findOne({roomId:roomId,userId:id})
        if(roommember){
            if(document.ownerId===id||roommember.role==="admin"||room.createdBy===id){
                await Documentodel.deleteOne({id:documentId})
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
