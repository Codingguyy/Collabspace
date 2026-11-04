"use server"
import Userodel from '@/models/userodel'
import connectDB from '@/database/db_configure'
export default async function Changename(id:string,name:string){
  await connectDB()
  if(id&&name){
    const check=await Userodel.findOne({name:name})
    if(check){
        return "Name already taken"
    }
    const userr=await Userodel.findOne({_id:id})
    if(userr){
        userr.name=name
        await userr.save()
        return "Name changed successfully"
    }
    else{
        return "User doesnt exist"
    }
  }
  return "Some error occurred"
}