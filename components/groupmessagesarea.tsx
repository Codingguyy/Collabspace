"use client"
import { useEffect, useRef, useCallback } from "react"
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover"
import { Button } from "./ui/button"
import { ScrollArea } from "./ui/scroll-area"
import { Option, Trash, Trash2, Reply, Edit, Clock, CheckCheck } from "lucide-react"
import { UsercurrentId,Roompicked, Toklue, Grouppagination as Roompagination, Replytomessage as Roomreplymessage, Editmessage } from "./store"
import { set } from "@/socketserver/clientsidesocket"
import {message} from "@/types/collab"
import { grpconversations } from "@/types/groupconversations"

export default function Roommessagearea() {

  const seenObserverRef    = useRef<IntersectionObserver | null>(null)
  const pagiObserverRef    = useRef<IntersectionObserver | null>(null)
  const isLoadingRef       = useRef(false)
  const hasMoreRef         = useRef(false)
  const conversationslengthRef = useRef(0)
  const containerRef       = useRef<HTMLDivElement | null>(null)
  const seenObservedIdsRef = useRef<Set<string>>(new Set())
  const pagiObservedElRef  = useRef<HTMLElement | null>(null)

  const messages      = Roompicked((s) => s.message)
  const currentUserId = UsercurrentId((s) => s.name)
  const room          = Roompicked((s) => s.room)
  const token         = Toklue((s) => s.name)
  const hasMore       = Roompagination((s) => s.hasMore)

  const setreplyglobalid     = Roomreplymessage((s) => s.setglobal_id)
  const setoriginal_message  = Roomreplymessage((s) => s.setoriginal_message)
  const seteditmessage       = Editmessage((s) => s.setmessage)
  const seteditglobalId      = Editmessage((s) => s.setglobal_id)

  // refs so observers always see latest values without re-creating
  const roomRef    = useRef(room)
  const tokenRef   = useRef(token)
  const userIdRef  = useRef(currentUserId)

  useEffect(() => { roomRef.current   = room        }, [room])
  useEffect(() => { tokenRef.current  = token       }, [token])
  useEffect(() => { userIdRef.current = currentUserId }, [currentUserId])
  useEffect(() => { hasMoreRef.current = hasMore    }, [hasMore])
  useEffect(() => { conversationslengthRef.current = messages.length }, [messages])

 
  function geticon(status: grpconversations) {
    if (status === "deleted")  return <Trash2 size={11} color="red" />
    if (status === "none")     return <Clock size={11} className="text-zinc-500" />
    if (status === "deleteforme")     return <CheckCheck size={11} className="text-violet-400" />
    return null
  }

  
  useEffect(() => {
    seenObserverRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const el       = entry.target as HTMLElement
        const id       = el.getAttribute("data-id")
        const senderId = el.getAttribute("sender-id")

        if (userIdRef.current !== senderId) {
          set("request:viewmessage:room", {
            roomId:   roomRef.current?.id,
            sendBy:   senderId,
            globalId: id,
            token:    tokenRef.current,
          })
        }
        seenObserverRef.current?.unobserve(el)
      })
    }, { threshold: 0.6 })

    return () => {
      seenObserverRef.current?.disconnect()
      seenObserverRef.current = null
    }
  }, [])

  
  useEffect(() => {
    pagiObserverRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        if (isLoadingRef.current || !hasMoreRef.current || conversationslengthRef.current < 50) return

        const el      = entry.target as HTMLElement
        const mongoId = el.getAttribute("mongo-id")
        isLoadingRef.current = true

        set("request:messagepagi:colab", {
          roomId: roomRef.current?.id,
          messageId:     mongoId,
          token:  tokenRef.current,
        })
      })
    }, { threshold: 0.6 })

    return () => {
      pagiObserverRef.current?.disconnect()
      pagiObserverRef.current = null
    }
  }, [])

  // reset loading flag when messages update (pagination responded)
  useEffect(() => {
    isLoadingRef.current = false
  }, [messages])

  // attach observers after every messages update
  useEffect(() => {
    if (!containerRef.current) return
    const elements = containerRef.current.querySelectorAll<HTMLElement>("[data-id]")
    if (!elements.length) return

    // seen only new elements
    elements.forEach((el) => {
      const id = el.getAttribute("data-id")
      if (!id || seenObservedIdsRef.current.has(id)) return
      seenObservedIdsRef.current.add(id)
      seenObserverRef.current?.observe(el)
    })

    // pagination always track first element
    const firstEl = elements[0]
    if (pagiObservedElRef.current && pagiObservedElRef.current !== firstEl) {
      pagiObserverRef.current?.unobserve(pagiObservedElRef.current)
    }
    if (pagiObservedElRef.current !== firstEl) {
      pagiObservedElRef.current = firstEl
      pagiObserverRef.current?.observe(firstEl)
    }
  }, [messages])

  // room switched  full reset
  useEffect(() => {
    seenObservedIdsRef.current = new Set()
    isLoadingRef.current = false
    if (pagiObservedElRef.current) {
      pagiObserverRef.current?.unobserve(pagiObservedElRef.current)
      pagiObservedElRef.current = null
    }
  }, [room?.id])

  
  const handleReply = useCallback((id: string, content: string) => {
    setreplyglobalid(id)
    setoriginal_message(content)
    seteditmessage("")
    seteditglobalId("")
  }, [setreplyglobalid, setoriginal_message, seteditmessage, seteditglobalId])

  function handleDeleteForEveryone(roomId: string, messageId: string) {
    set("request:messagestatus:colab", {
      token,
      messageId,
      roomId,
      status: "deleted",
    })
  }

  function handleDeleteForMe(messageId: string, roomId: string) {
    set("request:messagestatus:colab", {
      token,
      messageId,
      roomId,
      status: "deleteforme",
    })
  }

  function handleEdit(messageId: string, content: string) {
    seteditglobalId(messageId)
    seteditmessage(content)   // pre-fill edit input with current content
    setreplyglobalid("")
    setoriginal_message("")
  }
  
  console.log(messages,"messages")
  return (
    <ScrollArea className="flex-1 w-full">
      <div ref={containerRef} className="flex flex-col gap-1 px-4 py-3">

        {messages.map((msg: message) => {
          const mine    = msg.senderId === currentUserId
          const deleted = msg.status === "deleted"||(msg.senderId===currentUserId&&msg.status==="deleteforme")

          return (
            <div
              key={msg.id}
              id={`message-${msg.id}`}
              data-id={msg.id}
              sender-id={msg.senderId}
              mongo-id={msg.id}
              className={`flex items-end gap-2 ${mine ? "ml-auto flex-row-reverse" : "mr-auto"} max-w-[75%]`}
            >
              {/* sender avatar — only for others */}
              {!mine && (
                <div className="w-6 h-6 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-[9px] font-bold text-violet-400 flex-shrink-0 mb-1">
                  {room.members.find(data=>data.userId===msg.senderId)?.name.slice(0, 1).toUpperCase()}
                </div>
              )}

              <div className={`flex flex-col gap-1 ${mine ? "items-end" : "items-start"}`}>

                {/* reply preview */}
                {msg.replyTo && !deleted && (
                  <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg max-w-[200px]
                    border-l-2 border-violet-400 bg-white/5`}
                  >
                    <p className="text-[10.5px] text-zinc-500 truncate">
                      ↳ {msg.replyTo.content}
                    </p>
                  </div>
                )}

                {/* bubble */}
                <div className={`relative group px-3 py-2 rounded-2xl text-sm leading-relaxed
                  ${mine
                    ? "bg-violet-600 text-white rounded-br-sm"
                    : "bg-white/8 border border-white/5 text-zinc-200 rounded-bl-sm"
                  }
                  ${deleted ? "opacity-50" : ""}
                `}>

                  {/* sender name for others — only in group context */}
                  {!mine && !deleted && (
                    <p className="text-[10px] font-bold text-violet-400 mb-0.5">
                      {room.members.find(data=>data.userId===msg.senderId)?.name}
                    </p>
                  )}

                  {/* content */}
                  {deleted ? (
                    <p className="italic text-zinc-500 text-xs flex items-center gap-1">
                      <Trash2 size={10} /> This message was deleted
                    </p>
                  ) : msg.type === "system" ? (
                    <p className="text-[11px] text-zinc-500 italic">{msg.content}</p>
                  ) : (
                    <p className="break-words">{msg.content}</p>
                  )}

                  {/* time + status */}
                  <div className={`flex items-center gap-1 mt-1 ${mine ? "justify-end" : "justify-start"}`}>
                    <span className={`text-[9.5px] ${mine ? "text-violet-300" : "text-zinc-600"}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    {geticon(msg.status)}
                  </div>

                  {/* options popover — hidden until hover */}
                  {!deleted && (
                    <div className={`absolute top-1 ${mine ? "left-0 -translate-x-full pl-0 pr-1" : "right-0 translate-x-full pl-1"} opacity-0 group-hover:opacity-100 transition-opacity`}>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            className="w-6 h-6 bg-[#0F1117] border border-white/10 hover:bg-white/10"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Option size={11} className="text-zinc-400" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-1.5 w-44 bg-[#0F1117] border-white/10 space-y-0.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-xs text-zinc-300 hover:bg-white/5 hover:text-zinc-100 gap-2"
                            onClick={(e) => { e.stopPropagation(); handleReply(msg.id, msg.content) }}
                          >
                            <Reply size={12} /> Reply
                          </Button>

                          {mine && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start text-xs text-zinc-300 hover:bg-white/5 hover:text-zinc-100 gap-2"
                              onClick={(e) => { e.stopPropagation(); handleEdit(msg.id, msg.content) }}
                            >
                              <Edit size={12} /> Edit
                            </Button>
                          )}

                          {mine && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 gap-2"
                              onClick={(e) => { e.stopPropagation(); handleDeleteForEveryone(msg.roomId, msg.id) }}
                            >
                              <Trash size={12} /> Delete for everyone
                            </Button>
                          )}

                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 gap-2"
                            onClick={(e) => { e.stopPropagation(); handleDeleteForMe(msg.id, msg.roomId) }}
                          >
                            <Trash2 size={12} /> Delete for me
                          </Button>
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}

      </div>
    </ScrollArea>
  )
}