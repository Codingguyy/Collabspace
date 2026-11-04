"use server"
import Documentodel from '@/models/document'
import { IDocument } from '@/types/collab'
import connectDB from '@/database/db_configure'
export default async function Getroomdocuments(roomId:string):Promise<IDocument[]>{
    await connectDB()
    const Documents=await Documentodel.find({roomId:roomId}).lean()
    return Documents?.length?Documents:[]
}