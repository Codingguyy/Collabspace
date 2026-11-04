"use server"
import { message } from "@/types/collab"
import Messageodel from '@/models/message'
import connectDB from "@/database/db_configure"
export default async function Createmessagereply(data:message){
  await connectDB()
  const messagee=await Messageodel.findOne({id:data?.replyTo?.id})
  if(messagee&&messagee.status!=="deleted"){
  await Messageodel.create(data)
  return data.id
  }
  else{
    return "Error"
  }
}