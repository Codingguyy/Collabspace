import { grpconversations } from "./groupconversations"

export type collabrole="admin"|"viewer"|"editor"
export type doctype="canvas"|"text"
export type roomtype="private"|"room"
export type messagetype="text"|"system"
export type requesttype="ptorm"|"rmtop"
export type colabrequeststatus="accepted"|"pending"|"rejected"
export type docstatus="trashed"|"deleted"|"none"
export interface roomMember{
    id:string,
    roomId:string,
    userId:string,
    role:collabrole,
    joinedAt:Date
}
export interface RoomMemberEntry {
  userId: string
  role: "admin" | "editor" | "viewer"
  isMuted: boolean
  joinedAt: Date,
  online?:boolean,
  typing?:boolean,
  lastseenmessageId:string,
  name:string
}

export interface Room {
  id: string
  name: string,
  description:string,
  documents:number,
  code:string,
  members: RoomMemberEntry[]
  createdAt: Date
  createdBy: string,
  updatedAt?:Date
}
export interface Stroke {
  id: string
  points: number[]
  color: string
  strokeWidth: number
  userId: string
  createdAt: number
}

export interface CanvasContent {
  strokes: Record<string,CanvasShape>
}

export interface BaseDocument {
  id: string
  roomId: string
  title: string
  ownerId: string
  visibility: "room" | "private"
  lockedAt: Date | null
  lockedBy: string | null
  clonedFrom: string | null
  createdAt: Date
  updatedAt?: Date
  status:docstatus
}
type ActivityType =
  | "document:edit-started"
  | "document:edit-finished"
  | "document:locked"
  | "document:unlocked"
  | "document:lock-timeout"
  | "document:created"
  | "document:cloned"
  | "document:deleted"
  | "member:joined"
  | "member:join-requested"
  | "member:left"
  | "room:renamed"
  | "document:edited"
  | "room:details"

export interface activity {
  id: string
  type: ActivityType
  roomId: string
  roomName: string          // denormalized, so the feed renders without a join
  actorId: string
  actorName: string         // denormalized too
  documentId?: string       // only present for document-scoped events
  documentName?: string
  metadata?: Record<string, any>  // e.g. { clonedFromId }, { previousName }
  activityAt: Date
}
export interface TextDocument extends BaseDocument {
  type: "text"
  content: string
}

export interface CanvasDocument extends BaseDocument {
  type: "canvas"
  content: CanvasContent
}
export interface Colabrequest{
  id:string,
  type:requesttype,
  sendBy?:string,
  sendTo?:string,
  roomId:string,
  status:colabrequeststatus,
  sendAt:Date
}
export type IDocument = TextDocument | CanvasDocument
export type SearchRoom={
  id:string,
  name:string,
  documents:number,
  description:string,
  code:string,
  members:number,
}
export interface Searchscoreroom extends Room{
  score:number
}
export interface Searchuser{
  name:string,
  email:string,
  id:string,
}
export interface Searchscoreuser extends Searchuser{
  score:number
}
export interface message{
  id:string,
  roomId:string,
  senderId:string,
  content:string,
  type:messagetype,
  status:grpconversations,
  replyTo?:{id:string,content:string}
  createdAt:Date
}
export interface onlinelist{
  id:string,
  roomId:string,
  name:string,
  roomname:string
}
export type ShapeType = "line" | "rect" | "circle" | "text" | "image"

export interface BaseShape {
  id: string
  type: ShapeType
  x: number
  y: number
  rotation?: number
  fill?: string
  stroke?: string
  strokeWidth?: number
  updatedAt: Date,
  updatedBy: string
}

export interface LineShape extends BaseShape {
  type: "line"
  points: number[]      // flat [x1,y1,x2,y2,...] — Konva's native format
}

export interface RectShape extends BaseShape {
  type: "rect"
  width: number
  height: number
}

export interface CircleShape extends BaseShape {
  type: "circle"
  radius: number
}

export interface TextShape extends BaseShape {
  type: "text"
  text: string
  fontSize: number
  fontFamily?: string
  width?: number         // for text wrapping, optional
}

export interface ImageShape extends BaseShape {
  type: "image"
  src: string             // uploaded URL, never raw bytes
  width: number
  height: number
}

export type CanvasShape = LineShape | RectShape | CircleShape | TextShape | ImageShape
export type Command = {
  execute: () => void;
  undo: () => void;
  redo: () => void;
};