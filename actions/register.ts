"use server"
import { usertyped } from "@/types/user"
import userodel from "@/models/userodel"
import Dbconnect from '@/database/db_configure'
import bcrypt from 'bcrypt'
export default async function Register(userdetails:usertyped){
  if(userdetails){
    await Dbconnect()
    const {name,email,password}=userdetails
    if(name&&email&&password){
        const userr=await userodel.findOne({name:name,email:email}).lean()
        if(userr){
            const compare=await bcrypt.compare(password,userr.password)
            if(compare){
                return "Already login"
            }
        }
        const userss=await userodel.findOne({name:name})
        if(userss){
          return "Username already taken"
        }
        else{
        const usersss=await userodel.findOne({email:email})
        if(usersss){
          return "Email already in use"
        }
        else{
        const passwordd=await bcrypt.hash(password,3)
        await new userodel({name:name,email:email,password:passwordd}).save()
        }
        }
    }
    }
  else{
    return "Error Registering"
  }
}