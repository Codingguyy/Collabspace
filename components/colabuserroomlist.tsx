"use client"
import { useState } from "react"
import { Colabloading } from "./store"
import { Searchvalue } from "./store"
import { Switchvalue } from "./store"
import { Colabsearchroomlist } from "./store"
import { Colabsearchuserlist } from "./store"
import {Toklue} from './store'
import { Colabexistroomlist } from "./store"
import { Spinner } from "./ui/spinner"
import { Skeleton } from "./ui/skeleton"
import { set } from "@/socketserver/clientsidesocket"
import { ChevronDown, Users } from "lucide-react"
import { UserPlus } from "lucide-react"
import { LogIn } from "lucide-react"
import toast from "react-hot-toast"
export default function Colabuserroomlist(){
    const [open, setOpen] = useState<string | null>(null)
    const [selectedRooms, setSelectedRooms] = useState<string|null>(null)
    const switchvalue=Switchvalue(s=>s.value)
    const colabloading=Colabloading(s=>s.value)
    const searchvalue=Searchvalue(s=>s.value)
    const setsearchvalue=Searchvalue(s=>s.setvlue)
    const searchroomlist=Colabsearchroomlist(s=>s.rooms)
    const searchuserlist=Colabsearchuserlist(s=>s.users)
    const token=Toklue(s=>s.name)
    const existroomlist=Colabexistroomlist(s=>s.rooms)
    function handleroomrequest(value:string){
      set("request:roomrequest:colab",{roomId:value,token:token})
    }
    function handlecolabuserrequest(value:string){
      if(selectedRooms){
      set("request:userrequest:colab",{roomId:selectedRooms,userId:value,token:token})
    setsearchvalue(false)
      }
    else{
      toast.error("First select a room")
    }
    }
    return(
    <div className={`min-w-[387px] min-h-[324px] flex items-center ${colabloading?"justify-center":"overflow-y-scroll flex-col no-scrollbar justify-start space-y-2"} rounded-b-lg mt-[6px]`}>
      {!colabloading?<>{switchvalue?<>{searchroomlist?.map(data=><div className="h-11 w-[349px] rounded-md border border-white/[0.08] bg-white/[0.03] m-2 px-3 flex items-center justify-between group transition-colors hover:border-white/[0.14] hover:bg-white/[0.05]">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-[11px] font-mono text-[#F2A93B] shrink-0 bg-[#F2A93B]/10 px-1.5 py-0.5 rounded">
                {data.code}
              </span>
              <span className="text-sm font-medium text-zinc-200 truncate">{data.name}</span>
              <span className="text-xs text-zinc-500 truncate hidden group-hover:block">{data.description}</span>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="flex items-center gap-1 text-zinc-500">
                <Users size={12} />
                <span className="text-[11px]">{data.members}</span>
              </div>
              <button
                onClick={(e)=>{e.stopPropagation();handleroomrequest(data.id)}}
                className="flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium bg-[#4C82FB] text-white hover:bg-[#3E71E8] transition-colors"
              >
                <LogIn size={11} />
                Join
              </button>
            </div>
          </div>)}</>:<>{searchuserlist?.map((data) => (
  <div key={data.id} className="h-11 w-[349px] rounded-md border border-white/[0.08] bg-white/[0.03] m-2 px-3 flex items-center justify-between transition-colors hover:border-white/[0.14] hover:bg-white/[0.05]">
    <div className="flex items-center gap-2 min-w-0">
      <div className="size-6 rounded-full bg-[#4C82FB]/15 flex items-center justify-center text-[10px] font-semibold text-[#8FB2FD] shrink-0">
        {data.name[0].toUpperCase()}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-xs font-medium text-zinc-200 truncate leading-tight">{data.name}</span>
        <span className="text-[10px] text-zinc-500 truncate leading-tight">{data.email}</span>
      </div>
    </div>

    <div className="flex items-center gap-1.5 shrink-0">
      <div className="relative">
        <button
          onClick={() => setOpen(open === data.id ? null : data.id)}
          className="flex items-center gap-1 px-2 py-1 rounded border border-white/10 text-[11px] text-zinc-400 hover:border-white/20 hover:text-zinc-200 transition-colors"
        >
          <span className="font-mono text-[#F2A93B]">{selectedRooms? existroomlist.find(data=>data.id===selectedRooms)?.code : "Room"}</span>
          <ChevronDown size={10} />
        </button>
        {open === data.id && (
          <div className="absolute right-0 top-full mt-1 w-36 rounded-md shadow-lg bg-[#101217] border border-white/10 z-10 py-1">
            {existroomlist.length?existroomlist.map((r) => (
              <button
                key={r.id}
                onClick={() => { setSelectedRooms(r.id); setOpen(null); }}
                className="w-full text-left px-3 py-1.5 text-[11px] hover:bg-white/[0.06] flex items-center gap-2"
              >
                <span className="font-mono text-[#F2A93B]">{r.code}</span>
                <span className="text-zinc-300 truncate">{r.name}</span>
              </button>
            )):<div className="h-[57px] w-[137px] text-black flex items-center justify-center border border-3 border border-white rounded-md bg-black">No rooms yet</div>}
          </div>
        )}
      </div>

      <button
        onClick={(e) =>{e.stopPropagation();handlecolabuserrequest(data.id)}}
        className="flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium bg-[#4C82FB] text-white hover:bg-[#3E71E8] transition-colors"
      >
        <UserPlus size={11} />
        Invite
      </button>
    </div>
  </div>))}</>}</>:<div className="h-full w-full flex flex-col items-center justify-start space-y-2">
      <Skeleton className="h-11 w-[349px] m-2 mr-3 bg-white/[0.04]"/>
      <Skeleton className="h-11 w-[349px] m-2 ml-0 bg-white/[0.04]"/>
      <Skeleton className="h-11 w-[349px] m-2 ml-0 bg-white/[0.04]"/>
      <Skeleton className="h-11 w-[349px] m-2 ml-0 bg-white/[0.04]"/>
      <Skeleton className="h-11 w-[349px] m-2 ml-0 bg-white/[0.04]"/>
      </div>}
    </div>
    )
}