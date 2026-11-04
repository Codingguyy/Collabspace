"use server"
import Onetooneconversation from "@/models/Onetooneconversation"
import connectDB from "@/database/db_configure"
export default async function Getspecificonetooneconversation(messageId:string){
  await connectDB()
  const conversation=await Onetooneconversation.findOne({global_id:messageId})
  console.log("conversations",conversation)
  if(conversation){
    return conversation._id
  }
  else{
    return ""
  }
}