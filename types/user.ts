export type requesttype="send"|"recieved"|"none"
export type chatype="group"|"onetoone"
export interface user{
    _id?:string
    name:string,
    email:string,
    password:string
    createdAt:Date,
    LoginAt?:Date
}
export type userr={
    userdetails:user
}
export interface usertyped{
    name?:string,
    email:string,
    password:string
}
export interface authenticate{
    name:string,
    email:string,
    _id:string
}
export interface usersocket{
    name:string,
    email:string,
    description:string,
    _id:string,
    socket:WebSocket
}
export interface userst{
    name:string,
    email:string,
    description:string,
    score:number,
    _id:string
}
export interface usrlist{
    name:string,
    email:string,
    description:string,
    _id:string
}
export interface usrlistt extends usrlist{
    unred_messages:number,
    seen:boolean
}
export interface userlistt{
    name:string,
    email:string,
    description:string,
    _id:string,
    conversation_exist:boolean,
    request_send:requesttype,
}
export interface typingonetooneconversation{
    _id:string,
    typing:boolean,
}
export interface onetooneconversationtyping{
    user_1:typingonetooneconversation,
    user_2:typingonetooneconversation,
    chatId:string
}
export interface sngleuser{
    name:string,
    email:string
}
export type chatypepicked="dm"|"group"

