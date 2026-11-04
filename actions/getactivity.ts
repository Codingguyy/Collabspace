"use server"
import Activityodel from '@/models/activity'
import Roommemberodel from '@/models/roomMember'
import connectDB from '@/database/db_configure'
export default async function Getactivity(id:string){
  await connectDB()
  const rooms=await Roommemberodel.find({userId:id})
  const roomIds=rooms.map(data=>data.roomId)
  const activity=[]
  for (const roomIdss of roomIds){
      const activties=await Activityodel.find({roomId:roomIdss})
      activity.push(...activties)
  }
  return activity
}