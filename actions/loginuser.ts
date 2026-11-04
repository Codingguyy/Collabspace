"use server"
import {userr} from '@/types/user'
import { usertyped } from '@/types/user'
import Userodel from '@/models/userodel'
import Dbconnect from '@/database/db_configure'
import bcrypt from 'bcrypt'
export default async function Loginuser(userdetails:usertyped){
  if(userdetails){
    await Dbconnect()
    const {email,password,name}=userdetails
    const userrr=await Userodel.findOne({email:email}).lean()
    if(!userrr){
      return "Dont have an Account"
    }
    const passwordcompare=await bcrypt.compare(password,userrr?.password)
    if(passwordcompare){
       return {_id:userrr._id.toString(),name:userrr.name,email:userrr.email}
    }
    else{
        return "Error happened during verifying"
    }
  }
}