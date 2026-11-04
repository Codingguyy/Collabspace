"use server"
import Userodel from '@/models/userodel'
import Dbconnect from '@/database/db_configure'
export default async function Checkusername(value:string){
    await Dbconnect()
    if(value){
       const userr=await Userodel.findOne({name:value}).lean()
       if(userr){
        return false
       }
       else{
        return true
       }
    }
}