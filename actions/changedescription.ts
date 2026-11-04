"use server"
import Userodel from '@/models/userodel'
import connectDB from '@/database/db_configure'
export default async function Changedescription(id:string,description:string){
  await connectDB()
  const userr=await Userodel.findOne({_id:id})
  if(userr){
    userr.description=description
    await userr.save()
    return "Description changed successfully"
  }
  else{
    return "User doesnt exist"
  }
}