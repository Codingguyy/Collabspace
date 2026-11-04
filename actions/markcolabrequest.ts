"use server"
import Colabrequestodel from '@/models/requestscollab'
import { requesttype } from '@/types/collab'
import { colabrequeststatus } from '@/types/collab'
import connectDB from '@/database/db_configure'
export default async function Markcolabrequest(type:requesttype,sendBy:string,sendTo:string,status:colabrequeststatus,requestId:string){
    await connectDB()
    const request=await Colabrequestodel.findOne({id:requestId})
    if(request){
        request.status=status
        await request.save()
        return "Success"
    }
    else{
        return "Error"
    }
}