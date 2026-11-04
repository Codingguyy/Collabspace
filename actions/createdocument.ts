"use server"
import Documentodel from '@/models/document'
import { doctype } from '@/types/collab'
import { CanvasContent } from '@/types/collab'
import { roomtype } from '@/types/collab'
import connectDB from '@/database/db_configure'
export default async function Createdocumenttext(documentId:string,Doctype:doctype,roomId:string,title:string,content:string|CanvasContent,ownerId:string,visibility:roomtype){
    await connectDB()
    if(Doctype==="canvas"){
        await Documentodel.create({id:documentId,roomId:roomId,type:Doctype,title:title,content:content,ownerId:ownerId,visibility:visibility,status:"none"})
        return "Success"
    }
    else if(Doctype==="text"){
        await Documentodel.create({id:documentId,roomId:roomId,type:Doctype,title:title,content:content,ownerId:ownerId,visibility:visibility,status:"none"})
        return "Success"
    }
    else{
        return "Error"
    }
}
