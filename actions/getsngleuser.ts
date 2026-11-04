"use server"
import Userodel from '@/models/userodel'
import { sngleuser } from "@/types/user"
import connectDB from '@/database/db_configure'
export default async function Getsngleuser(id:string):Promise<sngleuser>{
  await connectDB()
  const userr=await Userodel.findOne({_id:id})
  if(userr){
    return {name:userr.name,email:userr.email}
  }
  else{
    return {name:"",email:""}
  }
}