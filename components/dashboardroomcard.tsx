"use client"
import { motion } from 'framer-motion'
import { AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import {Roomsearch} from './store'
import { Toklue } from './store'
import { FileText, Users, ArrowUpRight, Lock } from "lucide-react"
import { Room } from "@/types/collab"
import { set } from '@/socketserver/clientsidesocket'
import { Variants } from 'framer-motion'
/* Card reads as a lit panel on the dark canvas:
   base   #101217 → #0D0E12 gradient, faint azure border
   glow   radial #4C82FB bloom in the corner, ~12% opacity, blurred
   code   amber #F2A93B, monospace, the one warm accent
   hover  border brightens, glow intensifies, lifts 2px
*/

function timeAgo(dateStr?: string) {
  if (!dateStr) return "—"
  const diffMs = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return "now"
  if (mins < 60) return `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  return `${Math.floor(hrs / 24)}d`
}

export default function DashboardRoomCard({
  room,
  onOpen,
}: {
  room: Room
  onOpen?: (roomId: string) => void
}) {
  const members = room.members ?? []
  const onlineCount = members.filter((m) => m.online).length
  const visibleMembers = members.slice(0, 4)
  const overflow = members.length - visibleMembers.length
  const roomsearch=Roomsearch(s=>s.name)
  const setroomsearch=Roomsearch(s=>s.setname)
  const toklue=Toklue(s=>s.name)
  const variants: Variants = {
  open: {
    x: -500,
    y: 0,
    opacity: 0,
  },
  appear: {
  x: 0,
  y: 0,
  opacity: 1,
  transition: {
    type: "spring",
    stiffness: 120,   // stronger spring, more energy
      // lower damping = more oscillation
    bounce: 0.4,      // adds elastic overshoot
  },
},

  delete: {
    x: 600,
    y: 0,
    opacity: 0,
    transition: {
      type: "tween",
      ease: "easeOut",
      duration: 0.5, // 500ms
    },
  },
};
const inputreqcroomvariants:Variants={
  initial:{x:-40,opacity:0},
  appear:{x:0,opacity:1,transition:{type:"tween",ease:"easeOut",duration:0.3,staggerChildren:0.3,delayChildren:0.5}}
}
const inputreqcroomchilvariants:Variants={
  initial:{x:-40,opacity:0},
  appear:{x:0,opacity:1,transition:{type:"tween",ease:"easeOut",duration:0.3}}
}
  useEffect(()=>{
    if(roomsearch){
       document.getElementById(roomsearch)?.scrollIntoView({behavior:"smooth",inline:"center"})
    }
  },[roomsearch])
  function handleroom(roomId:string){
    set("request:room:colab",{roomId:roomId,token:toklue})
  }
  return (
    <AnimatePresence>
      <button id={room.id}
      onClick={(e) =>{e.stopPropagation();handleroom(room.id)}}
      className={`group relative w-full overflow-hidden rounded-xl border border-[#4C82FB]/[0.14] bg-gradient-to-b from-[#12141A] to-[#0D0E12] px-5 py-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[#4C82FB]/40 hover:shadow-[0_8px_30px_-8px_rgba(76,130,251,0.35)] ${roomsearch?`border border-blue-600`:""}`}
    >
      {/* corner glow */}
      <div
        className="pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full opacity-[0.14] blur-2xl transition-opacity duration-200 group-hover:opacity-25"
        style={{ background: "radial-gradient(circle, #4C82FB 0%, transparent 70%)" }}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-[14.5px] font-semibold tracking-tight text-zinc-100">
              {room.name}
            </h3>
            {members.length === 1 && (
              <Lock size={11} className="flex-shrink-0 text-zinc-600" />
            )}
          </div>
          <p className="mt-1 font-mono text-[11px] tracking-widest text-[#F2A93B]/90">
            {room.code}
          </p>
        </div>

        <ArrowUpRight
          size={16}
          className="flex-shrink-0 text-zinc-700 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#4C82FB]"
        />
      </div>

      <div className="relative mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
  {visibleMembers.length > 1 ? (
    <div className="flex -space-x-2">
      {visibleMembers.map((m, i) => {
        const initials = (m.name ?? "?")
          .trim()
          .split(/\s+/)
          .map((part: string) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
        const avatarColors = [
          "bg-violet-500/20 text-violet-300",
          "bg-emerald-500/20 text-emerald-300",
          "bg-amber-500/20 text-amber-300",
          "bg-sky-500/20 text-sky-300",
          "bg-rose-500/20 text-rose-300",
        ]
        const colorClass = avatarColors[i % avatarColors.length]

        return (
          <div
            key={m.userId ?? i}
            title={m.name}
            className={`relative flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#101217] text-[9px] font-semibold transition-transform hover:z-10 hover:scale-110 ${colorClass}`}
          >
            {initials}
            {m.online && (
              <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-[#101217]" />
            )}
          </div>
        )
      })}
      {overflow > 0 && (
        <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#101217] bg-white/5 text-[9px] font-semibold text-zinc-400">
          +{overflow}
        </div>
      )}
    </div>
  ) : (
    <span className="flex items-center gap-1 text-[11px] text-zinc-600">
      <Users size={11} /> just you
    </span>
  )}
</div>

        <div className="flex items-center gap-3 text-[11px] text-zinc-600">
          <span className="flex items-center gap-1">
            <FileText size={11} />
            {room.documents||0}
          </span>
          <span className="font-mono text-[10.5px]">
            {timeAgo(
  (room.createdAt || room.updatedAt)?.toString()
)}
</span>
        </div>
      </div>

      {onlineCount > 0 && (
        <div className="relative mt-3 flex items-center gap-1.5 border-t border-white/[0.05] pt-2.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.7)]" />
          <span className="text-[10.5px] text-zinc-500">
            {onlineCount} online now
          </span>
        </div>
      )}
    </button>
  </AnimatePresence>
  )
}
