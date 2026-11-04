"use client"

import { useMemo, useState } from "react"
import { useRef } from "react"
import { motion } from "framer-motion"
import DashboardRoomCard from "./dashboardroomcard"
import Colaballactivity from '@/components/colaballactivity'
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "./ui/dialog"
import { InputGroup } from "./ui/input-group"
import { InputGroupInput } from "./ui/input-group"
import { InputGroupAddon } from "./ui/input-group"
import { InputGroupButton } from "./ui/input-group"
import { Textarea } from "./ui/textarea"
import { Spinner } from "./ui/spinner"
import {
  Boxes,
  Search,
  Plus,
  KeyRound,
  LayoutGrid,
  ArrowUpRight,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import {
  Lock,
  LockOpen,
  Clock,
  FilePlus,
  Copy,
  Trash2,
  UserPlus,
  UserMinus,
  UserCog,
  Pencil,
  Settings,
} from "lucide-react"
import { UsercurrentId, Colabexistroomlist, Roomsearch } from "./store"
import { Onlinelist } from "./store"
import { Dashboarddetails } from "./store"
import { Userdetails } from "./store"
import { Toklue } from "./store"
import { Activitylist } from "./store"
import { Roompicked } from "./store"
import { Parmkey } from "./store"
import { activity, Room } from "@/types/collab"
import Chatdashboard from "./chat"
import Colabrequestcomponent from './colabrequestcomponent'
import { set } from "@/socketserver/clientsidesocket"
import toast from "react-hot-toast"
import room from "@/models/room"
import { Variants } from "framer-motion"
import { AnimatePresence } from "framer-motion"

/* ── Color tokens for this page ──
   bg      #0A0B0E   near-black, cool slate rather than blue-black
   surface white/[0.03]-[0.06] borders — flat, no glass/blur
   accent  #4C82FB   azure blue — primary actions, headings glow
   warm    #F2A93B   amber — room codes only, the one secondary color
   online  emerald-400 — kept universal (green = live) for recognition
*/

type ButtonVariant = "primary" | "secondary" | "ghost"

function Button({
  variant = "secondary",
  icon,
  children,
  onClick,
  className = "",
}: {
  variant?: ButtonVariant
  icon?: React.ReactNode
  children: React.ReactNode
  onClick?: () => void
  className?: string
}) {
  const variants: Record<ButtonVariant, string> = {
    primary: "bg-[#4C82FB] text-white hover:bg-[#3E71E8]",
    secondary: "border border-white/10 text-zinc-300 hover:border-white/20 hover:bg-white/[0.04]",
    ghost: "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04]",
  }
  return (
    <button
      onClick={onClick}
      className={`inline-flex h-9 items-center justify-center gap-1.5 rounded-md px-3.5 text-[13px] font-medium transition-colors duration-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#4C82FB] ${variants[variant]} ${className}`}
    >
      {icon}
      {children}
    </button>
  )
}

function PresenceDot({ online }: { online?: boolean }) {
  return <span className={`h-1.5 w-1.5 rounded-full ${online ? "bg-emerald-400" : "bg-zinc-700"}`} />
}

const activityFeed = [
  { id: 1, avatar: "RS", color: "#4C82FB", text: "started editing", bold: "API Design Doc", room: "Project Alpha", time: "2m", online: true },
  { id: 2, avatar: "KM", color: "#8B7CF6", text: "added a canvas", bold: "User Flow Wireframe", room: "Project Alpha", time: "34m", online: true },
  { id: 3, avatar: "SI", color: "#F2A93B", text: "cloned", bold: "Sprint Planning Notes", room: "Hackathon Team", time: "1h", online: false },
  { id: 4, avatar: "NT", color: "#5B7FA6", text: "requested to join", bold: "Hackathon Team", room: "", time: "2h", online: false },
  { id: 5, avatar: "AV", color: "#E8896B", text: "force-unlocked", bold: "API Design Doc", room: "Project Alpha", time: "1d", online: false },
]

function CreateRoomDialog({
  onCreateRoom,
  trigger,
}: {
  onCreateRoom?: (name?: string) => void
  trigger: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const toklue = Toklue((s) => s.name)
  const submit = () => {
    console.log("function triggered for creating rooms")
    const id = crypto.randomUUID()
    onCreateRoom?.(name.trim() || undefined)
    set("request:createroom:colab", { token: toklue, name: name, description: description, unique_Id: id })
    setName("")
    setDescription("")
    setOpen(false)
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="border-white/10 bg-[#101217] text-zinc-100">
        <DialogHeader>
          <DialogTitle className="text-[15px] text-zinc-100">Create a room</DialogTitle>
          <DialogDescription className="text-[13px] text-zinc-500">
            Name your workspace. You can invite people once it's created.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-1.5 py-1">
          <Label htmlFor="room-name" className="text-[12px] text-zinc-500">Room name</Label>
          <Input
            id="room-name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Project Alpha"
            className="max-w-[100%] border-white/10 bg-white/[0.03] text-[13.5px] text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-[#4C82FB]/50"
          />
        </div>
        <div className="space-y-1.5 py-1">
          <Label htmlFor="room-description" className="text-[12px] text-zinc-500">Description</Label>
          <Textarea
            id="room-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="This room is a collaborative workspace where..."
            className="max-h-[237px] max-w-[400px] border-white/10 bg-white/[0.03] text-[13.5px] text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-[#4C82FB]/50"
            maxLength={200}
            cols={5}
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="primary" icon={<Plus size={14} />} onClick={submit}>Create room</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function JoinRoomDialog({
  onJoinRoom,
  trigger,
}: {
  onJoinRoom?: (code?: string) => void
  trigger: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [code, setCode] = useState("")
  const toklue=Toklue(s=>s.name)
  const submit = () => {
    onJoinRoom?.(code.trim() || undefined)
    set("request:joincode:colab",{code:code,token:toklue})
    setCode("")
    setOpen(false)
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="border-white/10 bg-[#101217] text-zinc-100">
        <DialogHeader>
          <DialogTitle className="text-[15px] text-zinc-100">Join with code</DialogTitle>
          <DialogDescription className="text-[13px] text-zinc-500">
            Enter the code your teammate shared with you.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-1.5 py-1">
          <Label htmlFor="room-code" className="text-[12px] text-zinc-500">Room code</Label>
          <Input
            id="room-code"
            autoFocus
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="XJ4K-9Q2P"
            className="border-white/10 bg-white/[0.03] font-mono text-[13.5px] tracking-widest text-[#F2A93B] placeholder:text-zinc-600 focus-visible:ring-[#4C82FB]/50"
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="primary" icon={<KeyRound size={14} />} onClick={submit}>Join room</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function Dashboard({
  onCreateRoom,
  onJoinRoom,
}: {
  onCreateRoom?: (name?: string) => void
  onJoinRoom?: (code?: string) => void
}) {
  const usercurrentId = UsercurrentId((s) => s.name)
  const rooms: Room[] = Colabexistroomlist((s) => s.rooms) ?? []
  const [query, setQuery] = useState("")

  // personal = solo rooms (just you), team = rooms with 2+ members
  const personalRooms = rooms.filter((r) => r.members.length === 1)
  const teamRooms = rooms.filter((r) => r.members.length > 1)

  Onlinelist((s) => s.list)
  const dashboarddocuments = Dashboarddetails(s=>s.documents)
  
  const filteredRooms = useMemo(() => {
    if (!query.trim()) return teamRooms
    const q = query.toLowerCase()
    return teamRooms.filter((r) => r.name.toLowerCase().includes(q) || r.code.toLowerCase().includes(q))
  }, [teamRooms, query])

  const totalDocs = dashboarddocuments
  const onlineNow = new Set(
    rooms.flatMap((r) => r.members.filter((m) => m.online).map((m) => m.userId))
  ).size
  const mostRecent = rooms
    .map((r) => new Date(r.updatedAt ?? r.createdAt).getTime())
    .sort((a, b) => b - a)[0]
  const lastActivity = mostRecent ? Math.floor((Date.now() - mostRecent) / 60000) : null
  const name = Userdetails((s) => s.name)
  const email = Userdetails((s) => s.email)
  const searchroom=Roomsearch(s=>s.name)
  const setsearchroom=Roomsearch(s=>s.setname)
  const roomsearchref=useRef<boolean>(false)
  const activitylist=Activitylist(s=>s.activity)
  const roompicked=Roompicked(s=>s.room)
  const paramkey=Parmkey(s=>s.name)
  const colors=[
  "#FF5733", // Bright Orange-Red
  "#FFC300", // Vivid Yellow
  "#DAF7A6", // Fresh Lime Green
  "#33FF57", // Neon Green
  "#33FFF6", // Aqua Cyan
  "#335BFF", // Electric Blue
  "#9D33FF", // Vivid Purple
  "#FF33A8", // Hot Pink
  "#FF6F61", // Coral
  "#FFB347"  // Tangerine
];
  const detailvariants: Variants = {
  initial: { opacity: 0, x: -500, y: 0 },
  appear: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 50,
      duration: 0.1,
      delayChildren: 0.1,   // ⏱ wait before children start
      staggerChildren: 0.1, // ⏱ children animate one after another
    },
  },
};

const detailchilvariants: Variants = {
  initial: { y: 0, x: -60, opacity: 0, scale: 1.05 },
  appear: {
    y: 0,
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 50,
      duration:0.3
    },
  },
};
 const headervariants: Variants = {
  initial: { x: -500, opacity: 0 },
  appear: {
    x: 0,
    opacity: 1,
    transition: {
      type: "tween",
      ease: "easeOut",
      duration: 0.4,
      staggerChildren: 0.08,
      delayChildren: 0.5,
    }
  }
}

const headerchilvariants: Variants = {
  initial: { x: -40, opacity: 0 },   // smaller offset for children — feels more natural
  appear: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
    }
  }
}
const inputreqcroomvariants:Variants={
  initial:{x:-40,opacity:0},
  appear:{x:0,opacity:1,transition:{type:"tween",ease:"easeOut",duration:0.3,staggerChildren:0.3,delayChildren:0.5}}
}
const inputreqcroomchilvariants:Variants={
  initial:{x:-40,opacity:0},
  appear:{x:0,opacity:1,transition:{type:"tween",ease:"easeOut",duration:0.3}}
}
const topbarvariants:Variants={initial:{y:-500,x:0,opacity:0},appear:{y:0,x:0,opacity:1,transition:{type:"spring",stiffness:50,damping:10,duration:1,staggerChildren:0.3,delayChildren:0.3}}}
const topbarchilvariants:Variants={initial:{x:-40,y:0,opacity:0},appear:{y:0,x:0,opacity:1,transition:{type:"spring",damping:20,stiffness:100,duration:0.8}}}
  function handlesearchroom(){
    if(!query)
      toast.error("Input some value")
    else{
      roomsearchref.current=true
      setTimeout(()=>{let room:Room={id:"",name:"",description:"",documents:0,code:"",members:[],createdAt:new Date(),createdBy:""}
      let flag=false
      rooms.forEach((value)=>{
        if(value.code.toLocaleLowerCase===query.toLocaleLowerCase){
          room=value
          flag=true
        }
        else if(value.name.toLocaleLowerCase===query.toLocaleLowerCase){
          room=value
          flag=true
        }
        else if(value.id.toLocaleLowerCase===query.toLocaleLowerCase){
          room=value
          flag=true
        }
        else if(value.description.toLocaleLowerCase===query.toLocaleLowerCase){
          room=value
          flag=true
        }
      })
      if(flag){
         setsearchroom(room.id)
         toast.success("Room found")
      }
      else{
        toast.error("No rooms found")
      }
      roomsearchref.current=false
    },2000)
    setTimeout(()=>{setsearchroom("")},6000)
    setQuery("")
     }
  }
  function getActivityMeta(item: activity) {
    switch (item.type) {
      case "document:edit-started":
        return { icon: Lock, color: "text-emerald-400 bg-emerald-500/10", text: `locked "${item.documentName ?? "a document"}"` }
      case "document:edit-finished":
        return { icon: LockOpen, color: "text-zinc-400 bg-white/5", text: `released the lock on "${item.documentName ?? "a document"}"` }
      case "document:locked":
        return { icon: Lock, color: "text-emerald-400 bg-emerald-500/10", text: `locked "${item.documentName ?? "a document"}"` }
      case "document:unlocked":
        return { icon: LockOpen, color: "text-zinc-400 bg-white/5", text: `unlocked "${item.documentName ?? "a document"}"` }
      case "document:lock-timeout":
        return { icon: Clock, color: "text-amber-400 bg-amber-500/10", text: `lock on "${item.documentName ?? "a document"}" timed out` }
      case "document:created":
        return { icon: FilePlus, color: "text-violet-400 bg-violet-500/10", text: `created "${item.documentName ?? "a document"}"` }
      case "document:cloned":
        return { icon: Copy, color: "text-violet-400 bg-violet-500/10", text: `cloned "${item.documentName ?? "a document"}"` }
      case "document:deleted":
        return { icon: Trash2, color: "text-red-400 bg-red-500/10", text: `deleted "${item.documentName ?? "a document"}"` }
      case "document:edited":
        return { icon: Pencil, color: "text-violet-400 bg-violet-500/10", text: `edited "${item.documentName ?? "a document"}"` }
      case "member:joined":
        return { icon: UserPlus, color: "text-emerald-400 bg-emerald-500/10", text: "joined the room" }
      case "member:join-requested":
        return { icon: UserCog, color: "text-amber-400 bg-amber-500/10", text: "requested to join the room" }
      case "member:left":
        return { icon: UserMinus, color: "text-zinc-400 bg-white/5", text: "left the room" }
      case "room:renamed":
        return { icon: Pencil, color: "text-violet-400 bg-violet-500/10", text: "renamed the room" }
      case "room:details":
        return { icon: Settings, color: "text-violet-400 bg-violet-500/10", text: "updated room details" }
      default:
        return { icon: Clock, color: "text-zinc-400 bg-white/5", text: "did something" }
    }
  }
  console.log(roompicked)
  console.log("param key",paramkey)
  return (
    <div className="relative min-h-screen w-full bg-[#0A0B0E] text-zinc-100">
      <Chatdashboard />
      <div className="z-[100] mx-auto w-full max-w-[1800px] px-6 py-8 sm:px-8 lg:px-12 xl:px-16">

        <div className="mb-8 flex flex-col gap-4 border-b border-white/[0.06] pb-6 sm:flex-row sm:items-center sm:justify-between">
          <motion.div variants={headervariants} initial="initial" animate={"appear"}>
            <motion.h1 variants={headerchilvariants} className="text-[22px] font-semibold leading-none tracking-tight text-zinc-100">
              {usercurrentId ? `Good morning, ${name || ""}` : "Good morning"}
            </motion.h1>
            <motion.p variants={headerchilvariants} className="mt-1.5 text-[13px] text-zinc-500">
              {rooms.filter(data=>data.members.length>=0)?.length} rooms · {totalDocs} documents ·{" "}
              <span className="inline-flex items-center gap-1.5">
                <PresenceDot online={onlineNow > 0} />
                {onlineNow} online
              </span>
            </motion.p>
          </motion.div>

          <motion.div variants={inputreqcroomvariants} initial="initial" animate="appear" className="flex items-center gap-2">
            <motion.div variants={inputreqcroomchilvariants} className="relative">
              <InputGroup>
                <InputGroupInput
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search rooms..."
                  className="h-9 w-full border-white/10 pl-8 text-[13px] text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-[#4C82FB]/50 sm:w-56 hover:pointer"
                />
                <InputGroupAddon align={"inline-end"}>
                  {roomsearchref.current?<Spinner height={10} width={10}/>:<InputGroupButton variant={"default"} className="text-white" onClick={(e)=>{e.stopPropagation();handlesearchroom()}}>Search</InputGroupButton>}
                </InputGroupAddon>
                <InputGroupAddon align={"inline-start"}><Search size={17} color="gray" /></InputGroupAddon>
              </InputGroup></motion.div>
              <CreateRoomDialog
              onCreateRoom={onCreateRoom}
              trigger={<motion.div variants={inputreqcroomchilvariants}><Button variant="primary" icon={<Plus size={14} />}>New room</Button></motion.div>}
            />
            <Colabrequestcomponent/>
          </motion.div>
        </div>

        <motion.div variants={detailvariants} initial="initial" animate={"appear"}className="mb-8 grid grid-cols-3 divide-x divide-white/[0.06] rounded-lg border border-white/[0.06]">
          <motion.div variants={detailchilvariants} className="flex items-center gap-3 px-5 py-3.5">
            <LayoutGrid size={15} className="text-[#4C82FB]" />
            <div>
              <p className="font-mono text-[15px] font-semibold leading-none text-zinc-100">{teamRooms.length}</p>
              <p className="mt-1 text-[11px] text-zinc-500">rooms</p>
            </div>
          </motion.div>
          <motion.div variants={detailchilvariants} className="flex items-center gap-3 px-5 py-3.5">
            <Boxes size={15} className="text-[#4C82FB]" />
            <div>
              <p className="font-mono text-[15px] font-semibold leading-none text-zinc-100">{totalDocs}</p>
              <p className="mt-1 text-[11px] text-zinc-500">documents</p>
            </div>
          </motion.div>
          <motion.div variants={detailchilvariants} className="flex items-center gap-3 px-5 py-3.5">
            <Clock size={15} className="text-[#4C82FB]" />
            <div>
              <p className="font-mono text-[15px] font-semibold leading-none text-zinc-100">
                {lastActivity !== null ? `${lastActivity}m` : "—"}
              </p>
              <p className="mt-1 text-[11px] text-zinc-500">last activity</p>
            </div>
          </motion.div>
        </motion.div>

        {personalRooms.length > 0 && (
          <motion.div variants={inputreqcroomvariants} initial="initial" animate="appear" className="mb-8">
            <motion.p variants={inputreqcroomchilvariants} className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-600">
              Personal workspace
            </motion.p>
            <motion.div variants={inputreqcroomvariants} className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              
                {personalRooms.map((room) => (
                <AnimatePresence>
                  <motion.div key={room.id} variants={inputreqcroomchilvariants}>
                    <DashboardRoomCard key={room.id} room={room} />
                  </motion.div>
                </AnimatePresence>
                ))}
              </motion.div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
          <motion.div variants={inputreqcroomvariants} initial="initial" animate={"appear"}>
            <motion.p variants={inputreqcroomchilvariants} className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-600">Rooms</motion.p>

            {rooms.length === 0 ? (
              <motion.div variants={inputreqcroomvariants} className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-white/10 px-6 py-10">
                <motion.p variants={inputreqcroomchilvariants} className="text-[13.5px] font-medium text-zinc-300">No rooms yet</motion.p>
                <motion.p variants={inputreqcroomchilvariants} className="text-[12.5px] text-zinc-500">
                  Create a room to start writing, drawing, and chatting with your team.
                </motion.p>
                <motion.div variants={inputreqcroomchilvariants} className="mt-1 flex gap-2">
                  <CreateRoomDialog
                    onCreateRoom={onCreateRoom}
                    trigger={<Button variant="primary" icon={<Plus size={14} />}>Create a room</Button>}
                  />
                  <JoinRoomDialog
                    onJoinRoom={onJoinRoom}
                    trigger={<Button variant="secondary" icon={<KeyRound size={14} />}>Join with code</Button>}
                  />
                </motion.div>
              </motion.div>
            ) : teamRooms.length === 0 ? (
              <motion.div variants={inputreqcroomvariants} initial="initial" animate="appear" className="flex flex-col items-start gap-2 rounded-lg border border-white/[0.06] px-6 py-10">
                <motion.p variants={inputreqcroomchilvariants} className="text-[13.5px] font-medium text-zinc-400">No team rooms yet</motion.p>
                <motion.p variants={inputreqcroomchilvariants} className="text-[12.5px] text-zinc-500">Join or create a room with others to see it here.</motion.p>
              </motion.div>
            ) : filteredRooms.length === 0 ? (
              <div className="flex flex-col items-start gap-2 rounded-lg border border-white/[0.06] px-6 py-10">
                <p className="text-[13.5px] font-medium text-zinc-400">No rooms match &ldquo;{query}&rdquo;</p>
                <Button variant="ghost" onClick={() => setQuery("")}>Clear search</Button>
              </div>
            ) : (
              <motion.div variants={inputreqcroomvariants} initial="initial" animate={"appear"}className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
               {filteredRooms.map((room) => ( 
                <AnimatePresence>
                  <motion.div key={room.id} variants={inputreqcroomchilvariants}>
                    <DashboardRoomCard key={room.id} room={room} />
                  </motion.div>
                </AnimatePresence>
                ))}
              </motion.div>
            )}
          </motion.div>

          <motion.div variants={topbarvariants} initial="initial" animate="appear">
            <motion.p variants={topbarchilvariants} className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-600">Activity</motion.p>
            <motion.div variants={topbarvariants} className="flex flex-col">
              <Colaballactivity activitylist={activitylist}/>
            </motion.div>
            </motion.div>
        </div>
      </div>
    </div>
  )
}

