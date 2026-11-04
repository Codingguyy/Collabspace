"use client"
import {useState} from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Variants } from 'framer-motion'
import Roommemberlistcomponent from '@/components/roommemberslist'
import Groupmessagearea from '@/components/groupmessagesarea'
import Roomdetailsdrawer from '@/components/roomdetailsdrawer'
import Roommemberonlinelist from '@/components/roommemberonlinelist'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Popover } from './ui/popover'
import { PopoverTrigger } from './ui/popover'
import { PopoverContent } from './ui/popover'
import { ArrowLeft, Search, MessageCircle, Users, Send, X } from "lucide-react"
import { Usrlst } from '@/components/store'
import { Documentsearch } from '@/components/store'
import { message } from "@/types/collab"
import { UsercurrentId,Roompicked, Toklue, Grouppagination as Roompagination, Replytomessage as Roomreplymessage, Editmessage } from "./store"
import { set } from '@/socketserver/clientsidesocket'
import toast from 'react-hot-toast'
function getRoomName(name?: string) {
  if (!name) return "Untitled room"
  return name.length > 20 ? `${name.slice(0, 20)}…` : name
}

function RoleBadge({ role }: { role?: "admin" | "editor" | "viewer" }) {
  const styles = {
    admin: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    editor: "text-violet-400 bg-violet-500/10 border-violet-500/20",
    viewer: "text-zinc-400 bg-white/5 border-white/10",
  } as const
  const resolved = role ?? "viewer"
  return (
    <Badge variant="outline" className={`text-[11px] font-bold tracking-wide ${styles[resolved]}`}>
      {resolved.toUpperCase()}
    </Badge>
  )
}
export default function TopbarSpecRoom({ onBack }: { onBack?: () => void }) {
  const currentUserId = UsercurrentId((s) => s.name)          // sender identity
const messages     = Roompicked((s) => s.message)   // message[] from store

// ── local state ─────────────────────────────────────────────────
const [input,   setInput]   = useState("")
const [replyTo, setReplyTo] = useState<{ id: string; content: string } | null>(null)
const documentsearchref=useRef<ReturnType<typeof setTimeout> | null>(null)
const bottomRef = useRef<HTMLDivElement>(null)
const  room=Roompicked(s=>s.room)
const toklue=Toklue(s=>s.name)
const router=useRouter()
const users=Usrlst(s=>s.users)
const name=Documentsearch(s=>s.name)
const email=Documentsearch(s=>s.email)
const setsearch=Documentsearch(s=>s.setname)
const setsearchId=Documentsearch(s=>s.setemail)
const documents=Roompicked(s=>s.documentList)
const editmessagecontent=Editmessage(s=>s.message)
const seteditmessagecontent=Editmessage(s=>s.setmessage)
const editmessageglobalId=Editmessage(s=>s.global_id)
const seteditmessageglobalId=Editmessage(s=>s.setglobal_id)
const replymessageoriginal=Roomreplymessage(s=>s.original_message)
const setreplymessageoriginal=Roomreplymessage(s=>s.setoriginal_message)
const replymessageglobalId=Roomreplymessage(s=>s.global_id)
const setreplymessageglobalId=Roomreplymessage(s=>s.setglobal_id)
const topbarvariants:Variants={initial:{y:-500,x:0,opacity:0},appear:{y:0,x:0,opacity:1,transition:{type:"spring",stiffness:50,damping:10,duration:1,staggerChildren:0.3,delayChildren:0.3}}}
const topbarchilvariants:Variants={initial:{x:-40,y:0,opacity:0},appear:{y:0,x:0,opacity:1,transition:{type:"spring",damping:20,stiffness:100,duration:0.8}}}
// auto-scroll to bottom when new messages arrive
useEffect(() => {
  bottomRef.current?.scrollIntoView({ behavior: "smooth" })
}, [messages])

// ── send ────────────────────────────────────────────────────────
function handleSend() {
  const content = input.trim()
  if (!content) return
  if(editmessagecontent&&editmessageglobalId){
     set("request:messageedit:colab",{roomId:room.id,token:toklue,content:input,documentId:editmessageglobalId})
  }
  else if(replymessageoriginal&&replymessageglobalId){
    set("request:messagereply:colab",{roomId:room.id,content:replymessageoriginal,maincontent:input,messageId:replymessageglobalId,token:toklue})
  }
  else
  set("request:sendmessage:colab",{roomId:room.id,token:toklue,message:input})
  setInput("")
  seteditmessagecontent("")
  seteditmessageglobalId("")
  setreplymessageoriginal("")
  setreplymessageglobalId("")
  setReplyTo(null)
}

// send on Enter (Shift+Enter = newline)
function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}

// ── reply ────────────────────────────────────────────────────────
function handleReply(msg: message) {
  setReplyTo({ id: msg.id, content: msg.content })
}

function cancelReply() {
  setReplyTo(null)
}

// ── helpers ──────────────────────────────────────────────────────
function isMe(senderId: string) {
  return senderId === currentUserId
}

function formatTime(date: Date) {
  return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}
function onBackk(){
  router.push("/colab")
}
function handlesearchdocument(){
  if(documentsearchref.current){
    clearTimeout(documentsearchref.current)
  }
  let flag=0
  if(documents.find(data=>data.title.toLowerCase()===name.toLowerCase())){
    setsearchId(documents.find(data=>data.title===name)?.id||"")
    flag=1
  }
  else if(documents.find(data=>data.id.toLowerCase()===name.toLowerCase())){
    setsearchId(documents.find(data=>data.id===name)?.id||"")
    flag=1
  }
  else{
    toast.error("no document found")
  }
  if(flag)
  toast.success("Document found")

  documentsearchref.current=setTimeout(()=>{setsearchId("")},5000)
}
function getonline(){
  let count=0
  room.members.forEach((value)=>{
    if(value.online){
      count++
    }
  })
  return count
}
useEffect(()=>{
  if(editmessagecontent&&editmessageglobalId){
    setInput(editmessagecontent)
  }
},[editmessagecontent])
const me = room?.members?.find((m: any) => m.userId === currentUserId)
return (
    <motion.div
      variants={topbarvariants}
      initial="initial"
      animate="appear"
      className="w-full h-[64px] shrink-0 flex items-center gap-4 bg-[#0A0B0E] px-4 sm:px-6 border-b border-white/[0.06]"
    >
      {onBack && (
        <button
          onClick={onBackk}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-300 transition-colors"
        >
          <ArrowLeft size={16} />
        </button>
      )}

      <motion.div variants={topbarvariants} className="flex items-center gap-3 min-w-0">
        <motion.span variants={topbarchilvariants} className="text-xs text-zinc-500 font-medium hidden sm:block cursor-pointer hover:text-zinc-300 transition-colors" onClick={(e)=>{e.stopPropagation()}}>{(room.members.length===1&&room.createdBy===currentUserId)?"Personal Room":"Workroom"}</motion.span>
        <motion.span variants={topbarchilvariants} className="font-semibold text-[15px] text-zinc-100 truncate max-w-[200px] tracking-tight">
          {getRoomName(room?.name)}
        </motion.span>
        <motion.div variants={topbarchilvariants}>{room.members.length===1&&room.createdBy===currentUserId?<Badge className="text-[#F2A93B] bg-[#F2A93B]/10 border-[#F2A93B]/20">Owner</Badge>:
        <RoleBadge role={me?.role}/>
        }</motion.div>
      </motion.div>

      <motion.div variants={topbarchilvariants} className="flex-1 flex justify-center max-w-md mx-auto">
        <InputGroup className="w-full bg-white/[0.03] border-white/10">
          <InputGroupInput
          value={name}
          disabled={documents.length>0?false:true}
          onChange={(e)=>{e.stopPropagation();setsearch(e.target.value)}}
            placeholder={`${documents.length>0?"Search documents...":"No documents..."}`}
            className="text-zinc-200 placeholder:text-zinc-600"
          />
          <InputGroupAddon align="inline-start">
            <Search size={14} className="text-zinc-500" />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              variant="outline"
              disabled={documents.length>0?false:true}
              className="text-zinc-300 border-white/10 bg-[#4C82FB] text-white hover:bg-[#3E71E8] hover:text-white" onClick={(e)=>{e.stopPropagation();handlesearchdocument()}}
            >
              Search
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </motion.div>

      <motion.div variants={topbarvariants} className="flex items-center gap-2 shrink-0">
        {room.members.length===1&&room.createdBy===currentUserId?<></>:<Roommemberlistcomponent/>}
        <Roommemberonlinelist/>
        <Separator orientation="vertical" className="h-6 bg-white/10" />

        <motion.div variants={topbarchilvariants} className="h-8 px-3 flex items-center justify-center rounded-md border border-[#F2A93B]/20 bg-[#F2A93B]/10 text-xs font-mono font-semibold text-[#F2A93B] tracking-wide">
          {room?.code ?? "——-——"}
        </motion.div>

        {room.members.length===1&&room.createdBy===currentUserId?<></>:<Sheet>
          <SheetTrigger asChild>
            <motion.div variants={topbarchilvariants}>
              <Button
              variant="outline"
              className="text-zinc-300 border-white/10 bg-white/[0.03] hover:bg-white/[0.08] gap-1.5"
            >
              <MessageCircle size={16} />
              Chat
            </Button>
            </motion.div>
          </SheetTrigger>
          <SheetContent className="bg-[#101217] border-white/10 text-zinc-100">
            <SheetHeader className="p-6">
              <SheetTitle className="font-bold text-xl text-zinc-100">Room chat</SheetTitle>
              <SheetDescription className="text-zinc-500">
                Chat here with room members
              </SheetDescription>
            </SheetHeader>
            <Separator className="bg-white/5" />
            {/* messages list */}
<div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
   <Groupmessagearea/>
  <div ref={bottomRef} />
</div>

{/* reply bar */}
{replymessageglobalId && replymessageoriginal && (
  <div className="mx-4 mb-1 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
    <div className="w-0.5 h-7 bg-[#4C82FB] rounded-full flex-shrink-0" />
    <p className="text-xs text-zinc-400 truncate flex-1">{replymessageoriginal}</p>
    <button onClick={cancelReply} className="text-zinc-600 hover:text-zinc-400 flex-shrink-0">
      <X size={13} />
    </button>
  </div>
)}

{/* input bar */}
<div className="px-4 pb-4 pt-2 flex gap-2">
  <input
    value={input}
    onChange={(e) => setInput(e.target.value)}
    onKeyDown={handleKeyDown}
    placeholder={`${room.members.find(data=>data.userId===currentUserId)?.isMuted?"You are Muted":"Message the room..."}`}
    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-[#4C82FB]/40 transition-colors"
  />
  <motion.button
    whileTap={{ scale: 0.9 }}
    onClick={handleSend}
    disabled={!input||room.members.find(data=>data.userId===currentUserId)?.isMuted}
    className="w-9 h-9 rounded-xl bg-[#4C82FB] hover:bg-[#3E71E8] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors flex-shrink-0"
  >
    <Send size={14} className="text-white" />
  </motion.button>
</div>
          </SheetContent>
        </Sheet>}
      

        <Roomdetailsdrawer/>
      </motion.div>
    </motion.div>
  )
}

/**
 * Fixed from the original:
 * - removed the duplicate hardcoded "ADMIN" Badge that sat next to the
 *   unused getBadge() function — now RoleBadge() is the single source
 * - fixed the "Projectttttttttt..." placeholder typo
 * - removed the stray console.log("Project".length)
 * - converted every light-theme class (bg-white, text-black, border-gray-300...)
 *   to the dark violet/zinc palette used in Dashboard.tsx
 * - replaced fixed pixel widths (w-[168px], ml-34, etc.) with flex/gap so
 *   it doesn't break on narrower room names or member counts
 */
