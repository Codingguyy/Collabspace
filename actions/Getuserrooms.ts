"use server"
import Roomodel from '@/models/room'
import Roommemberodel from '@/models/roomMember'
import Userodel from '@/models/userodel'
import Documentodel from '@/models/document'
import connectDB from '@/database/db_configure'
import { Room, RoomMemberEntry } from '@/types/collab'

export default async function Getuserrooms(userId:string):Promise<Room[]>{
    await connectDB()

    const memberships=await Roommemberodel.find({userId:userId}).lean()
    if(!memberships.length) return []

    const roomIds=memberships.map((m:any)=>m.roomId)

    const [rooms,allMembers,documents]=await Promise.all([
        Roomodel.find({id:{$in:roomIds}}).lean(),
        Roommemberodel.find({roomId:{$in:roomIds}}).lean(),
        Documentodel.find({roomId:{$in:roomIds}}).select("roomId").lean(),
    ])

    const memberUserIds=[...new Set(allMembers.map((m:any)=>m.userId))]
    const users=await Userodel.find({_id:{$in:memberUserIds}}).lean()
    const nameById=new Map(users.map((u:any)=>[String(u._id),u.name as string]))

    const documentCountByRoom=new Map<string,number>()
    documents.forEach((d:any)=>{
        documentCountByRoom.set(d.roomId,(documentCountByRoom.get(d.roomId)||0)+1)
    })

    return rooms.map((room:any)=>{
        const members:RoomMemberEntry[]=allMembers
            .filter((m:any)=>m.roomId===room.id)
            .map((m:any)=>({
                userId:m.userId,
                role:m.role,
                isMuted:m.isMuted||false,
                joinedAt:m.joinedAt,
                online:false,
                typing:false,
                lastseenmessageId:m.lastseenmessageId||"",
                name:nameById.get(String(m.userId))||"Unknown",
            }))

        return {
            id:room.id,
            name:room.name,
            description:room.description,
            code:room.code,
            createdAt:room.createdAt,
            createdBy:room.createdBy,
            updatedAt:room.updatedAt,
            documents:documentCountByRoom.get(room.id)||0,
            members:members,
        } as Room
    })
}
