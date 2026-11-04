"use client"
import { Variants } from "framer-motion"
import { motion } from "framer-motion"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Radio, MessageSquareDot } from "lucide-react"
import { Roompicked, UsercurrentId } from "@/components/store"
import { RoomMemberEntry } from "@/types/collab"
function StatusDot({ typing }: { typing?: boolean }) {
  const color = typing ? "bg-amber-400" : "bg-emerald-400"
  return (
    <span className="relative flex h-2 w-2 shrink-0">
      <span
        className={`absolute inline-flex h-full w-full rounded-full ${color} opacity-75 animate-ping`}
      />
      <span className={`relative inline-flex h-2 w-2 rounded-full ${color}`} />
    </span>
  )
}

function RoleTag({ role }: { role?: "admin" | "editor" | "viewer" }) {
  const styles = {
    admin: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    editor: "text-violet-400 bg-violet-500/10 border-violet-500/20",
    viewer: "text-zinc-400 bg-white/5 border-white/10",
  } as const
  const resolved = role ?? "viewer"
  return (
    <Badge
      variant="outline"
      className={`text-[9px] font-bold tracking-wide px-1.5 py-0 h-4 ${styles[resolved]}`}
    >
      {resolved.toUpperCase()}
    </Badge>
  )
}

export default function RoomOnlineMembersPopover() {
  
  const room = Roompicked((s) => s.room)
  const currentUserId = UsercurrentId((s) => s.name)

  const onlineMembers = room?.members?.filter((m: any) => m.online) ?? []
  const onlineCount = onlineMembers.length
const topbarchilvariants:Variants={initial:{x:-40,y:0,opacity:0},appear:{y:0,x:0,opacity:1,transition:{type:"spring",damping:20,stiffness:100,duration:0.8}}}
  return (
    <Popover>
      <PopoverTrigger asChild>
        <motion.div variants={topbarchilvariants}>
          <Badge className="relative bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold gap-1.5 pl-2 pr-2.5 py-1 cursor-pointer hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          {onlineCount} online
        </Badge>
        </motion.div>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-72 bg-[#101217] border-white/10 text-zinc-100 p-0"
      >
        <div className="px-4 py-3">
          <p className="text-sm font-bold text-zinc-100 flex items-center gap-1.5">
            <Radio size={13} className="text-emerald-400" /> Online now
          </p>
          <p className="text-xs text-zinc-500">
            {onlineCount} of {room?.members?.length ?? 0} members active
          </p>
        </div>
        <Separator className="bg-white/5" />
        <div className="max-h-72 overflow-y-auto py-2">
          {onlineCount === 0 ? (
            <p className="px-4 py-6 text-center text-xs text-zinc-600">
              Nobody&apos;s online right now
            </p>
          ) : (
            onlineMembers.map((member: RoomMemberEntry) => {
              const isSelf = member.userId === currentUserId
              return (
                <div
                  key={member.userId}
                  className="px-4 py-2 flex items-center justify-between gap-2 hover:bg-white/5"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <StatusDot typing={member.typing} />
                    <span className="text-sm text-zinc-200 truncate">
                      {member.name}
                      {isSelf ? " (you)" : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {member.typing && (
                      <span className="flex items-center gap-1 text-[10px] text-amber-400">
                        <MessageSquareDot size={10} /> typing
                      </span>
                    )}
                    <RoleTag role={member.role} />
                  </div>
                </div>
              )
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

/**
 * Notes:
 * - "Online" derives straight from RoomMemberEntry.online, no extra state.
 * - StatusDot doubles as the typing indicator: emerald when idle-online,
 *   amber + a small "typing" label when member.typing is true — same visual
 *   language (soft ping ring) as the badge itself, so the whole thing reads
 *   as one live system rather than two separate widgets.
 * - Kept role tags read-only here (no Select) since this popover is a status
 *   view, not a management panel — that's what RoomMembersPopover is for.
 * - Sorted by whatever order room.members already has; if you want "typing"
 *   members surfaced first, sort onlineMembers by `!!b.typing - !!a.typing`
 *   before mapping.
 */
