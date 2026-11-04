"use client"

import { useEffect, useState } from "react"
import { Variants } from "framer-motion"
import { motion } from "framer-motion"
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Settings, RefreshCw, Copy, Check } from "lucide-react"
import { Roompicked, UsercurrentId, Toklue } from "@/components/store"
import { set } from "@/socketserver/clientsidesocket"

export default function RoomDetailsDrawer() {
  const room = Roompicked((s) => s.room)
  const currentUserId = UsercurrentId((s) => s.name)
  const toklue = Toklue((s) => s.name)

  const [open, setOpen] = useState(false)
  const [nameInput, setNameInput] = useState<string>("")
  const [descriptionInput, setDescriptionInput] = useState<string>("")
  const [copied, setCopied] = useState(false)

  const me = room?.members?.find((m: any) => m.userId === currentUserId)
  const canEdit = me?.role === "admin" || room?.createdBy === currentUserId
  const topbarchilvariants:Variants={initial:{x:-40,y:0,opacity:0},appear:{y:0,x:0,opacity:1,transition:{type:"spring",damping:20,stiffness:100,duration:0.8}}}
  useEffect(() => {
    if (open) {
      setNameInput(room?.name ?? "")
      setDescriptionInput(room?.description ?? "")
    }
  }, [open, room?.name, room?.description])

  function handleSaveName() {
    const trimmed = nameInput
    if (!trimmed || trimmed === room?.name) return
    set("request:roomdetails:colab", {
      roomId: room.id,
      mode: 1,
      value: trimmed,
      token: toklue,
    })
  }

  function handleSaveDescription() {
    const trimmed = descriptionInput
    if (trimmed === room?.description) return
    set("request:roomdetails:colab", {
      roomId: room.id,
      mode: 2,
      value: trimmed,
      token: toklue,
    })
  }

  function handleRegenerateCode() {
    set("request:changecode:colab", {
      roomId: room.id,
      token: toklue,
    })
  }

  function handleCopyCode() {
    if (!room?.code) return
    navigator.clipboard.writeText(room.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <motion.div variants={topbarchilvariants}>
          <Button
          size="sm"
          variant="outline"
          className="h-9 w-9 gap-1.5 border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10 hover:text-white"
        >
          <Settings size={12} />
        </Button>
        </motion.div>
      </DrawerTrigger>
      <DrawerContent className="bg-[#0A0B0E] border-white/10 text-zinc-100">
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle className="text-sm font-bold text-zinc-100">
              Room settings
            </DrawerTitle>
          </DrawerHeader>

          <div className="flex flex-col gap-5 px-4 pb-4">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-zinc-500">
                Room name
              </label>
              <div className="flex gap-2">
                <Input
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  disabled={!canEdit}
                  placeholder="Room name"
                  className="bg-white/5 border-white/10 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-[#4C82FB]"
                />
                {canEdit && nameInput.trim() !== room?.name && (
                  <Button
                    size="sm"
                    className="bg-[#4C82FB] hover:bg-[#3E71E8] text-white shrink-0"
                    onClick={handleSaveName}
                  >
                    Save
                  </Button>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-zinc-500">
                Description
              </label>
              <Textarea
                value={descriptionInput}
                onChange={(e) => setDescriptionInput(e.target.value)}
                disabled={!canEdit}
                placeholder="What's this room about?"
                rows={3}
                className="bg-white/5 border-white/10 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-[#4C82FB] resize-none"
              />
              {canEdit && descriptionInput!== room?.description && (
                <Button
                  size="sm"
                  variant="outline"
                  className="self-end border-white/10 text-zinc-300 hover:bg-white/10"
                  onClick={handleSaveDescription}
                >
                  Save description
                </Button>
              )}
            </div>

            <Separator className="bg-white/5" />

            {/* Join code */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-zinc-500">
                Join code
              </label>
              <div className="flex items-center justify-between rounded-md border border-white/10 bg-white/5 px-3 py-2">
                <Badge className="bg-[#F2A93B]/10 text-[#F2A93B] border border-[#F2A93B]/20 text-xs font-mono font-bold tracking-widest px-2 py-1">
                  {room?.code}
                </Badge>
                <div className="flex items-center gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-zinc-400 hover:text-white hover:bg-white/10"
                    onClick={handleCopyCode}
                  >
                    {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  </Button>
                  {canEdit && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-zinc-400 hover:text-white hover:bg-white/10"
                      onClick={handleRegenerateCode}
                    >
                      <RefreshCw size={13} />
                    </Button>
                  )}
                </div>
              </div>
              {canEdit && (
                <p className="text-[10.5px] text-zinc-600">
                  Regenerating invalidates the old code — anyone with it will no longer be able to join.
                </p>
              )}
            </div>
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline" className="border-white/10 text-zinc-300 hover:bg-white/10">
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

/**
 * Notes:
 * - mode 1 = name, mode 2 = description, matching handleroomdetails on the
 *   server exactly (Editroomdetails checks mode===1/mode===2).
 * - Join code is server-generated (generateCode() in handlechangecode) —
 *   there's no input for it, only a regenerate action.
 * - canEdit mirrors the server's own gate (admin role or room creator);
 *   this is just UX — the server re-validates independently regardless.
 * - Inputs are read-only (disabled) for non-admins so they can still see
 *   current values without a false impression they can edit them.
 */
