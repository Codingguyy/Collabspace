"use client"

import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "./ui/sheet"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs"
import { Bell, UserPlus, DoorOpen, Check, X, Ban, Clock } from "lucide-react"
import { UsercurrentId, Colabexistroomlist, Toklue, Colabrequests } from "./store"
import { Colabrequest, requesttype } from "@/types/collab"
import { set } from "@/socketserver/clientsidesocket"
import { Variants } from "framer-motion"

function timeAgo(date: Date | string) {
  const diffMs = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return "now"
  if (mins < 60) return `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  return `${Math.floor(hrs / 24)}d`
}

function StatusBadge({ status }: { status: Colabrequest["status"] }) {
  const styles: Record<string, string> = {
    pending: "bg-[#F2A93B]/10 text-[#F2A93B] border-[#F2A93B]/20",
    accepted: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
    rejected: "bg-red-400/10 text-red-400 border-red-400/20",
  }
  return (
    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize ${styles[status]}`}>
      {status}
    </span>
  )
}

function ActionButton({
  variant,
  onClick,
  icon,
  children,
}: {
  variant: "accept" | "reject" | "cancel"
  onClick: () => void
  icon: React.ReactNode
  children: React.ReactNode
}) {
  const styles = {
    accept: "bg-[#4C82FB] text-white hover:bg-[#3E71E8]",
    reject: "border border-white/10 text-zinc-400 hover:border-red-400/30 hover:text-red-400",
    cancel: "border border-white/10 text-zinc-500 hover:border-white/20 hover:text-zinc-300",
  }
  return (
    <button
      onClick={onClick}
      className={`inline-flex h-7 items-center gap-1 rounded-md px-2.5 text-[11.5px] font-medium transition-colors duration-100 ${styles[variant]}`}
    >
      {icon}
      {children}
    </button>
  )
}

function RequestRow({
  request,
  roomName,
  perspective,
  onAccept,
  onReject,
  onCancel,
}: {
  request: Colabrequest
  roomName: string
  perspective: "incoming" | "sent"
  onAccept: () => void
  onReject: () => void
  onCancel: () => void
}) {
  const isInvite = request.type === "rmtop"
  const Icon = isInvite ? DoorOpen : UserPlus

  const label =
    perspective === "incoming"
      ? isInvite
        ? "invited you to join"
        : "wants to join"
      : isInvite
      ? "you invited"
      : "you requested to join"

  return (
    <div className="relative flex items-start gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
      <div className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-[#4C82FB]/10 text-[#4C82FB]">
        <Icon size={13} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[12.5px] leading-snug text-zinc-400">
          {label} <span className="font-medium text-zinc-200">{roomName}</span>
        </p>
        <div className="mt-1.5 flex items-center gap-2">
          <StatusBadge status={request.status} />
          <span className="flex items-center gap-1 font-mono text-[10px] text-zinc-600">
            <Clock size={10} />
            {timeAgo(request.sendAt)}
          </span>
        </div>

        {request.status === "pending" && (
          <div className="mt-2.5 flex gap-1.5">
            {perspective === "incoming" ? (
              <>
                <ActionButton variant="accept" icon={<Check size={12} />} onClick={onAccept}>
                  Accept
                </ActionButton>
                <ActionButton variant="reject" icon={<X size={12} />} onClick={onReject}>
                  Reject
                </ActionButton>
              </>
            ) : (
              <ActionButton variant="cancel" icon={<Ban size={12} />} onClick={onCancel}>
                Cancel
              </ActionButton>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function RequestsSheet() {
  const currentUserId = UsercurrentId((s) => s.name)
  const rooms = Colabexistroomlist((s) => s.rooms) ?? []
  const toklue = Toklue((s) => s.name)
  const requests: Colabrequest[] = Colabrequests((s) => s.requests) ?? []
  const setrequeststatus = Colabrequests((s) => s.setrequeststatus)
  const [open, setOpen] = useState(false)

  const roomNameOf = (roomId: string) => rooms.find((r) => r.id === roomId)?.name ?? "Unknown room"
  const inputreqcroomchilvariants:Variants={
  initial:{x:-40,opacity:0},
  appear:{x:0,opacity:1,transition:{type:"tween",ease:"easeOut",duration:0.3}}
}
  const incoming = useMemo(
    () =>
      requests.filter((r) => {
        if (r.type === "rmtop") return r.sendTo === currentUserId
        const room = rooms.find((x) => x.id === r.roomId)
        return room?.createdBy === currentUserId
      }),
    [requests, rooms, currentUserId]
  )

  const sent = useMemo(() => requests.filter((r) => r.sendBy === currentUserId), [requests, currentUserId])

  const pendingIncomingCount = incoming.filter((r) => r.status === "pending").length

  const respond = (id: string, action: "accept" | "reject" | "cancel",roomId:string,sendBy:string,type:requesttype) => {
    const status = action === "accept" ? "accepted" : "rejected"
    if(action==="accept"){
    console.log("client side function triggered")
    if(type==="ptorm")
    set(`request:useraccept:colab`,{token:toklue,requestId:id,roomId:roomId,sendBy:sendBy})
  else if(type==="rmtop")
    set("request:roomaccept:colab",{token:toklue,requestId:id,roomId:roomId,sendBy:sendBy})
    }
  }
console.log("request type",requests)
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <motion.button variants={inputreqcroomchilvariants} className="relative inline-flex h-9 w-9 mr-0 items-center justify-center rounded-md border border-white/10 text-zinc-300 transition-colors hover:border-white/20 hover:bg-white/[0.04]">
          <Bell size={15} />
          {pendingIncomingCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#4C82FB] px-1 text-[9px] font-semibold text-white ring-2 ring-[#0A0B0E]">
              {pendingIncomingCount}
            </span>
          )}
        </motion.button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full border-white/10 bg-[#0A0B0E] text-zinc-100 sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-[15px] text-zinc-100">Requests</SheetTitle>
          <SheetDescription className="text-[13px] text-zinc-500">
            Room join requests and invites
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="incoming" className="mt-4 px-4">
          <TabsList className="grid w-full grid-cols-2 border border-white/10 bg-white/[0.02]">
            <TabsTrigger value="incoming" className="text-[12.5px] data-[state=active]:bg-[#4C82FB]/15 data-[state=active]:text-[#4C82FB]">
              Incoming {pendingIncomingCount > 0 && `(${pendingIncomingCount})`}
            </TabsTrigger>
            <TabsTrigger value="sent" className="text-[12.5px] data-[state=active]:bg-[#4C82FB]/15 data-[state=active]:text-[#4C82FB]">
              Sent
            </TabsTrigger>
          </TabsList>

          <TabsContent value="incoming" className="mt-3 flex flex-col gap-2">
            {incoming.length === 0 ? (
              <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-white/10 px-6 py-10 text-center">
                <Bell size={16} className="text-zinc-700" />
                <p className="text-[12.5px] text-zinc-500">No incoming requests</p>
              </div>
            ) : (
              incoming.map((r) => (
                <RequestRow
                  key={r.id}
                  request={r}
                  roomName={roomNameOf(r.roomId)}
                  perspective="incoming"
                  onAccept={() => respond(r.id, "accept",r.roomId,r.sendBy||"",r.type)}
                  onReject={() => respond(r.id, "reject",r.roomId,r.sendBy||"",r.type)}
                  onCancel={() => respond(r.id, "cancel",r.roomId,r.sendBy||"",r.type)}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="sent" className="mt-3 flex flex-col gap-2">
            {sent.length === 0 ? (
              <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-white/10 px-6 py-10 text-center">
                <UserPlus size={16} className="text-zinc-700" />
                <p className="text-[12.5px] text-zinc-500">No sent requests</p>
              </div>
            ) : (
              sent.map((r) => (
                <RequestRow
                  key={r.id}
                  request={r}
                  roomName={roomNameOf(r.roomId)}
                  perspective="sent"
                  onAccept={() => respond(r.id, "accept",r.roomId,r.sendBy||"",r.type)}
                  onReject={() => respond(r.id, "reject",r.roomId,r.sendBy||"",r.type)}
                  onCancel={() => respond(r.id, "cancel",r.roomId,r.sendBy||"",r.type)}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
