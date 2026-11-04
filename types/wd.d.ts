import "ws"
import WebSocket from "ws"
declare module "ws" {
  interface WebSocket {
    name:string,
    email:string,
    _id:string,
    isAuthed:boolean
  }
}
export interface MySocket extends WebSocket{
  name:string,
  email:string,
  description?:string,
  _id:string,
  isAuthed:boolean
}
