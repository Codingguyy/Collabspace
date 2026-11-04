"use server"
import Documentversionodel from '@/models/documentVersion'
import { CanvasContent } from "@/types/collab"
import connectDB from '@/database/db_configure'
export default async function Createdocumentversion(DocversionId:string,documentId:string,content:CanvasContent|string,editedBy:string){
    await connectDB()
    if(DocversionId&&documentId&&content&&editedBy){
        await Documentversionodel.create({id:DocversionId,documentId:documentId,content:content,editedBy:editedBy})
        return "Success"
    }
    else{
        return "Error"
    }
}