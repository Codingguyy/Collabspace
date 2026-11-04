"use server"
import Requestcollab from '@/models/requestscollab'
import connectDB from '@/database/db_configure'
import { requesttype } from '@/types/collab'
export default async function Createrequestcollab(type:requesttype,roomId:string,sendBy:string,sendTo:string,id:string){
    await connectDB()
    if(type&&roomId&&(sendBy||sendTo)&&id){
        console.log("dm function triggered")
        if(type==="ptorm"){
            await Requestcollab.create({id:id,type:type,sendBy:sendBy,roomId:roomId,status:"pending"})
            return {message:"Success",id:id}
        }
        else if(type==="rmtop"){
            await Requestcollab.create({id:id,type:type,sendBy:sendBy,roomId:roomId,sendTo:sendTo,status:"pending"})
            return {message:"Success",id:id}
        }
    }
    else{
        return {message:"Error",id:""}
    }
}