"use server"
import Roomodel from '@/models/room'
import Roommemberodel from '@/models/roomMember'
import Userodel from '@/models/userodel'
import Documentodel from '@/models/document'
import Messageodel from '@/models/message'
import connectDB from '@/database/db_configure'
import { Room, RoomMemberEntry, IDocument, message } from '@/types/collab'

export interface BootstrapResult{
    rooms:Room[]
    documentsByRoom:Record<string,IDocument[]>
    messagesByRoom:Record<string,message[]>
}

export default async function Bootstrapservermemory():Promise<BootstrapResult>{
    await connectDB()

    const [rooms,allMembers,allDocuments]=await Promise.all([
        Roomodel.find({}).lean(),
        Roommemberodel.find({}).lean(),
        Documentodel.find({}).lean(),
    ])

    const userIds=[...new Set(allMembers.map((m:any)=>m.userId))]
    const users=userIds.length?await Userodel.find({_id:{$in:userIds}}).lean():[]
    const nameById=new Map(users.map((u:any)=>[String(u._id),u.name as string]))

    const documentsByRoom:Record<string,IDocument[]>={}
    allDocuments.forEach((doc:any)=>{
        if(!documentsByRoom[doc.roomId]) documentsByRoom[doc.roomId]=[]
        documentsByRoom[doc.roomId].push(doc as IDocument)
    })

    // only the most recent 20 messages per room are preloaded, mirroring
    // Getroomfirstmessages — loading a room's entire message history into
    // memory on every server start would grow unbounded for long-lived rooms
    const roomIds=rooms.map((r:any)=>r.id)
    const messagesByRoom:Record<string,message[]>={}
    await Promise.all(roomIds.map(async(roomId:string)=>{
        const messages=await Messageodel.find({roomId:roomId}).sort({_id:-1}).limit(20).lean()
        messagesByRoom[roomId]=messages as unknown as message[]
    }))

    const assembledRooms:Room[]=rooms.map((room:any)=>{
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
            documents:(documentsByRoom[room.id]||[]).length,
            members:members,
        } as Room
    })

    return {rooms:assembledRooms,documentsByRoom,messagesByRoom}
}
