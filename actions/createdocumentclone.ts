"use server"
import Documentodel from '@/models/document'
import connectDB from '@/database/db_configure'
export default async function Createdocumentclone(roomId:string,documentId:string,id:string,unique_Id:string){
   await connectDB()
   const document=await Documentodel.findOne({id:documentId})
   if(document){
      await Documentodel.create({id:unique_Id,roomId:roomId,type:document.type,title:`${document.title}${Math.floor(Math.random()*9000)+1000}`,content:document.content,ownerId:id,visibility:"private",clonedFrom:document.id,createdAt:new Date()})
      return {Success:true,id:unique_Id}
   }
   else{
    return {Success:false,id:""}
   }
}
    