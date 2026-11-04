"use server"

import { CanvasContent } from "@/types/collab";
import Roommember from '@/models/roomMember'
import Documentodel from '@/models/document'
import Roomodel from '@/models/room'
import connectDB from "@/database/db_configure";
export default async function Makrdocumentcontent(documentId:string,content:string|CanvasContent,id:string,roomId:string){
    await connectDB()
    const room=await Roomodel.findOne({id:roomId})
    if(room){
       const roommember=await Roommember.findOne({roomId:roomId,userId:id})
       if(roommember){
            const document=await Documentodel.findOne({id:documentId})
            if(document){
                if(document.lockedBy===id){
                    document.content=content
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