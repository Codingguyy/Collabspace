import { usrlist } from "./user"
export type status="pending"|"accepted"|"deleted"
export type messagestatus="view"|"pending"|"deleted"|"deleteforme"
export type message={
    senderId:string,
    message:string
}
export type messagetype={
    senderId:string,
    message:string,
    createdAt:Date,
    status:messagestatus
}
export type messagetypee={
    senderId:string,
    message:string,
    global_id:string,
    createdAt:Date,
    status:messagestatus,
    replyto?:{
        global_id:string,
        message:string,
    }
}
export interface oneto1conversation{
    participants:string[],
    createdAt:Date,
    chatId:string,
    _id?:string,
    deletedAt?:Date,
    status:status
}
export interface conversations{
    chatId:string,
    _id?:string,
    global_id:string,
    senderId:string,
    message:string,
    status:messagestatus,
    createdAt:Date,
    replyto?:{
        global_id:string,
        message:string
    }
}
export type requesttype="reject"|"accepted"
export interface onetooneconversationdetails{
    senderId:usrlist,
    recieverId:usrlist,
    conversations:messagetypee[],
    chatId:string,
    createdAt:Date,
    status:status
}