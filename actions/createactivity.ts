"use server"
import { activity } from '@/types/collab'
import Activityodel from '@/models/activity'
import connectDB from '@/database/db_configure'
export default async function Createactivity(activity:activity){
    await connectDB()
    await Activityodel.create({...activity,activityAt:new Date()})
    return "Success"
}
