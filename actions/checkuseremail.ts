"use server"
import Userodel from '@/models/userodel'
import Dbconnect from '@/database/db_configure'
export default async function Checkuseremail(email:string){
    await Dbconnect()
    const userr=await Userodel.findOne({email:email}).lean()
    if(userr){
        return false
    }
    else{
        return true
    }
}