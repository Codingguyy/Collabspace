"use server"
import Roomodel from '@/models/room'
import connectDB from '@/database/db_configure'
export default async function Createroom(roomId:string,name:string,description:string,id:string,code:string){
  if(roomId&&name&&id){
    await connectDB()
    await Roomodel.create({id:roomId,name:name,description:description,createdBy:id,code:code})
    return "Success"
  }
  else{
    return "Error"
  }
}