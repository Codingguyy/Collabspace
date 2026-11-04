"use server"
import Userodel from '@/models/userodel'
import { usrlist } from '@/types/user'
import Dbconnect from '@/database/db_configure'
export default async function Getusrs():Promise<usrlist[]>{
    await Dbconnect()
   const users=await Userodel.find()
   const formattedusers:usrlist[]=[...users].map(data=>({name:data.name,email:data.email,description:"",_id:data._id}))
   return formattedusers
}