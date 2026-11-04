import { status } from "./1to1conversations"
export interface onetoonerequest{
    senderId:string,
    recieverId:string,
    sendAt:Date,
    status:status
}