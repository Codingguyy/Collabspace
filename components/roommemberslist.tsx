"use client"

import { useState } from "react"
import { Variants } from "framer-motion"
import { motion } from "framer-motion"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Users, Lock, LockOpen, UserX, Volume2, VolumeX } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Roompicked, UsercurrentId, Toklue } from "@/components/store"
import { set } from "@/socketserver/clientsidesocket"

function RoleBadge({ role }: { role?: "admin" | "editor" | "viewer" }) {
  const styles = {
    admin: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    editor: "text-violet-400 bg-violet-500/10 border-violet-500/20",
    viewer: "text-zinc-400 bg-white/5 border-white/10",
  } as const
  const resolved = role ?? "viewer"
  return (
    <Badge
      variant="outline"
      className={`text-[10px] font-bold tracking-wide ${styles[resolved]}`}
    >
      {resolved.toUpperCase()}
    </Badge>
  )
}

export default function RoomMembersPopover() {
  
  const room = Roompicked((s) => s.room)
  const documentList = Roompicked((s) => s.documentList)
  const currentUserId = UsercurrentId((s) => s.name)
  const toklue = Toklue((s) => s.name)

  // memberId currently being offered a document picker to assign a lock to
  const [assigningFor, setAssigningFor] = useState<string | null>(null)
  // memberId currently showing a "confirm kick?" step, to avoid one-click kicks
  const [kickPending, setKickPending] = useState<string | null>(null)

  const me = room?.members?.find((m: any) => m.userId === currentUserId)
  const isAdmin = me?.role === "admin"
  const topbarchilvariants:Variants={initial:{x:-40,y:0,opacity:0},appear:{y:0,x:0,opacity:1,transition:{type:"spring",damping:20,stiffness:100,duration:0.8}}}
  // derive "which document is this member holding the lock on" purely from
  // documentList + member id, per the requested logic — no extra state.
  function lockedDocFor(memberId: string) {
    return documentList?.find((d: any) => d.lockedBy === memberId)
  }

  function handleAssign(memberId: string, documentId: string) {
    set("request:assignlock:colab", {
      documentId,
      roomId: room.id,
      memberId,
      token: toklue,
    })
    setAssigningFor(null)
  }

  function handleRevoke(documentId: string) {
    set("request:forcereleaselock:colab", {
      documentId,
      roomId: room.id,
      token: toklue,
    })
  }

  function handleChangeStatus(memberId: string, status: "admin" | "editor" | "viewer") {
    set("request:memberstatus:colab", {
      roomId: room.id,
      memberId,
      status,
      token: toklue,
    })
  }

  function handleKick(memberId: string) {
    set("request:kickmember:colab", {
      roomId: room.id,
      memberId,
      token: toklue,
    })
    setKickPending(null)
  }

  function handleMute(memberId: string, muted: boolean) {
    set("request:membermute:colab", {
      roomId: room.id,
      memberId,
      muted,
      token: toklue,
    })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <motion.div variants={topbarchilvariants}> 
        <Badge className="bg-[#4C82FB] text-white text-[11px] font-bold gap-1 cursor-pointer hover:bg-[#3E71E8] transition-colors">
          <Users size={11} /> {room?.members?.length ?? 0} members
        </Badge>
        </motion.div>
       </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-80 bg-[#101217] border-white/10 text-zinc-100 p-0"
      >
        <div className="px-4 py-3">
          <p className="text-sm font-bold text-zinc-100">Room members</p>
          <p className="text-xs text-zinc-500">
            {room?.members?.length ?? 0} people in this room
          </p>
        </div>
        <Separator className="bg-white/5" />
        <div className="max-h-80 overflow-y-auto py-2">
          {room?.members?.map((member: any) => {
            const lockedDoc = lockedDocFor(member.userId)
            const isSelf = member.userId === currentUserId
            const isChoosing = assigningFor === member.userId

            return (
              <div
                key={member.userId}
                className="px-4 py-2 flex flex-col gap-1.5 hover:bg-white/5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm text-zinc-200 truncate">
                      {member.name}
                      {isSelf ? " (you)" : ""}
                    </span>
                    {member.isMuted && (
                      <VolumeX size={11} className="text-amber-400 shrink-0" />
                    )}
                    {isAdmin && !isSelf && member.userId !== room?.createdBy ? (
                      <Select
                        value={member.role}
                        onValueChange={(value) =>
                          handleChangeStatus(member.userId, value as "admin" | "editor" | "viewer")
                        }
                      >
                        <SelectTrigger className="h-5 w-[84px] text-[10px] px-2 bg-white/5 border-white/10 text-zinc-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#101217] border-white/10 text-zinc-100">
                          <SelectItem value="admin" className="text-[11px]">Admin</SelectItem>
                          <SelectItem value="editor" className="text-[11px]">Editor</SelectItem>
                          <SelectItem value="viewer" className="text-[11px]">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <RoleBadge role={member.role} />
                    )}
                  </div>

                  {isAdmin && !isSelf && (
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 px-2 text-[10px] text-zinc-300 border-white/10 hover:bg-white/10"
                        onClick={() =>
                          setAssigningFor(isChoosing ? null : member.userId)
                        }
                      >
                        Assign lock
                      </Button>
                      <button
                        onClick={() => handleMute(member.userId, !member.isMuted)}
                        className={`flex h-6 w-6 items-center justify-center rounded transition-colors ${
                          member.isMuted
                            ? "text-amber-400 hover:bg-amber-500/10"
                            : "text-zinc-500 hover:text-zinc-200 hover:bg-white/10"
                        }`}
                        title={member.isMuted ? "Unmute member" : "Mute member"}
                      >
                        {member.isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
                      </button>
                      {member.userId !== room?.createdBy && (
                        <button
                          onClick={() =>
                            setKickPending(
                              kickPending === member.userId ? null : member.userId
                            )
                          }
                          className="flex h-6 w-6 items-center justify-center rounded text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Kick member"
                        >
                          <UserX size={12} />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {kickPending === member.userId && (
                  <div className="flex items-center justify-between gap-2 rounded-md border border-red-500/20 bg-red-500/5 px-2 py-1.5">
                    <span className="text-[11px] text-red-300">
                      Remove {member.name} from the room?
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => setKickPending(null)}
                        className="text-[10px] text-zinc-400 hover:text-zinc-200 px-1.5 py-0.5"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleKick(member.userId)}
                        className="text-[10px] font-semibold text-red-400 hover:text-red-300 px-1.5 py-0.5"
                      >
                        Kick
                      </button>
                    </div>
                  </div>
                )}

                {lockedDoc ? (
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 text-[11px] text-emerald-400 min-w-0">
                      <Lock size={10} className="shrink-0" />
                      <span className="truncate">Locked: {lockedDoc.title}</span>
                    </div>
                    {isAdmin && (
                      <button
                        onClick={() => handleRevoke(lockedDoc.id)}
                        className="text-[10px] text-red-400 hover:text-red-300 shrink-0"
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-[11px] text-zinc-600">
                    <LockOpen size={10} /> No document locked
                  </div>
                )}

                {isChoosing && (
                  <div className="mt-1 flex flex-col gap-1 rounded-md border border-white/10 bg-white/5 p-2">
                    <p className="text-[10px] text-zinc-500 mb-0.5">
                      Pick a document to assign:
                    </p>
                    {documentList?.length ? (
                      documentList.map((doc: any) => (
                        <button
                          key={doc.id}
                          onClick={() => handleAssign(member.userId, doc.id)}
                          className="text-left text-[11px] text-zinc-300 hover:text-white hover:bg-white/10 rounded px-2 py-1 truncate"
                        >
                          {doc.title}
                          {doc.lockedBy && doc.lockedBy !== member.userId && (
                            <span className="text-zinc-600"> (currently locked)</span>
                          )}
                        </button>
                      ))
                    ) : (
                      <p className="text-[11px] text-zinc-600 px-2 py-1">
                        No documents in this room
                      </p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </PopoverContent>
    </Popover>
  )
}

/**
 * Notes:
 * - Lock ownership per member is derived, not stored separately: it's just
 *   documentList.find(d => d.lockedBy === member.userId). Only one document
 *   can show up per member since a member can hold at most one lock at a
 *   time (enforced server-side in handleassignlock).
 * - Assigning a lock to a member who doesn't currently hold one implicitly
 *   revokes it from whoever does — that's already handled by the server's
 *   handleassignlock/Editlockassign, so there's no separate "revoke" button
 *   here; picking a new target for a document is the revoke.
 * - Denials (e.g. non-creator admin trying to assign to another admin) are
 *   already surfaced via the existing toast.error(message) in
 *   clientsidesocket.ts's "request:response:assignlock:colab" handler, so
 *   no duplicate validation is done here — the server is the source of truth.
 * - Mute/unmute sends request:membermute:colab with the target's *next*
 *   muted state (!member.isMuted), matching handlemutemember's boolean
 *   'muted' param exactly. A small VolumeX indicator shows next to a muted
 *   member's name for everyone, not just admins, so status is visible at a
 *   glance without needing to hover the toggle.
 * - Kick is a two-step action (click UserX icon → confirm/cancel row) to
 *   avoid a one-click destructive action. The room creator is never shown
 *   the kick control at all, matching the server's own protection in
 *   Editkickmember/handlekickmember (kicking the creator is always denied).
 */
