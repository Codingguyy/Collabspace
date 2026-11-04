import { usrlist } from "./user";
import { messagestatus } from "./1to1conversations";
import { status } from "./1to1conversations";
export type grpstatustype="deleted"|"active"|"archived"
export type RequestType =
  | "dm_request"
  | "group_join_request"
  | "group_invite"
  | "friend_request"
  export type promote="member"|"admin"
  export type grpconversations="deleted"|"deleteforme"|"none"
export interface groupconversation{
    groupId:string
    name:string,
    description:string,
    code:string,
    members:groupmember[]
    admins:string[],
    createdAt:Date,
    createdBy:string,
    updatedAt?:Date,
    settings:{
        onlyAdminCanMessage:boolean,
        onlyAdminCanEditInfo:boolean,
    },
    status:grpstatustype,
}
export interface groupconversations{
    _id?:string,
    groupId:string,
    globalId:string,
    sendBy:String,
    message:string,
    createdAt:Date,
    name:string,
    status:grpconversations,
    editedAt?:Date,
    replyTo?:{
        globalId:string,
        message:string
    }    
}
export interface groupcode{
    code:string,
    groupId:string
}
export interface grouprequest{
    sendBy:{id:string,name:string},
    groupId:string,
    sendAt:Date,
    status:status,
    type:RequestType
}
export interface groupmember{
    name:string,
    id:string,
    lastseenmessageId:string
}
export interface groupsexistlist{
    name:string,
    description:string,
    code:string,
    member_no:number,
    status:grpstatustype,
    createdAt:Date,
    admins_info:groupmember[],
    groupId:string,
    createdBy:string
}
export interface grouptyping{
    id:string,
    name:string,
    typing:boolean
}
export interface grouponlinetyping{
    id:string,
    name:string,
    status:"admin"|"member",
    online:boolean,
    typing:boolean
}
export type groupsettings="OnlyAdminCanEditMessage"|"OnlyAdminCanEditInfo"