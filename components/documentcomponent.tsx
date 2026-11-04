"use client"

import { useEffect, useRef, useState } from "react"
import { useDocumentStore } from "@/components/store"
import { UsercurrentId } from "@/components/store"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Lock, Pencil } from "lucide-react"
import { Roompicked } from "@/components/store"
import { Toklue } from "@/components/store"
import { Usrlst } from "@/components/store"
import { set } from "@/socketserver/clientsidesocket"
import room from "@/models/room"
import { motion } from "framer-motion"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import EditorToolbar from "./editor-toolbar"
export default function Documentcomponent() {
  const activeId = useDocumentStore((s) => s.activeDocumentId)
  const documents =Roompicked(s=>s.documentList)
  const lockedBy = useDocumentStore((s) => s.lockedBy)
  const setLock = useDocumentStore((s) => s.setLock)
  const currentUserId = UsercurrentId((s) => s.name)
  const roompicked=Roompicked(s=>s.room)
  const toklue=Toklue(s=>s.name)
  const doc = documents.find((d) => d.id === activeId)
  const [value, setValue] = useState("")
  const [editing,isediting]=useState<boolean>(false)
  const [edit,setedit]=useState<boolean>(false)
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [saving,setsaving]=useState<boolean>(false)
  const users=Usrlst(s=>s.users)
  useEffect(() => {
    if (doc && doc.type === "text") setValue(doc.content)
  }, [doc?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!doc || doc.type !== "text") {
    return (
      <div className="flex-1 h-full flex items-center justify-center text-sm text-zinc-600">
        Select or create a text document to get started.
      </div>
    )
  }

  const lock = lockedBy[doc.id]
  const isEditable = doc.lockedBy === currentUserId
  const isLockedByOther = (doc.lockedBy !== currentUserId)&&doc.lockedBy
  const canType = isEditable && edit && !editing

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: editing ? "Start writing..." : "Nothing here yet.",
      }),
    ],
    content: value,
    editable: canType,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "doc-editor flex-1 w-full h-full overflow-y-auto px-6 py-5 text-[14px] leading-relaxed text-zinc-200 outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      handleChange(editor.getHTML())
    },
  })
  useEffect(() => {
    if (editor) editor.setEditable(canType)
  }, [editor, canType])
  useEffect(() => {
    if (!editor) return
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false })
    }
  }, [editor, value])

  function requestEdit() {
      set("request:lockedby:colab",{roomId:roompicked.id,documentId:doc?.id,token:toklue})
  }

  function releaseEdit() {
    set("request:lockrelease:colab",{roomId:roompicked.id,documentId:doc?.id,token:toklue})
  }

  function handleChange(newValue: string) {
    setValue(newValue)
    setsaving(true)
    if (saveTimeout.current) clearTimeout(saveTimeout.current)
    saveTimeout.current = setTimeout(() => {
      set("request:documentcontent:colab",{roomId:roompicked.id,documentId:doc?.id,content:newValue,token:toklue,type:doc?.type})
      setsaving(false)
    }, 300)
  }
 function handleediting(){
  isediting(false)
 }
 useEffect(()=>{
  if(doc.content){
    setValue(doc.content)
  }
 },[doc.content])
 console.log("docc",doc)
 console.log(roompicked,"roompicked")
 console.log("users",users)
 console.log(doc)
  return (
    <div className="flex-1 h-full flex flex-col min-w-0 bg-[#0A0B0E]">
      <div className="h-11 shrink-0 flex items-center justify-between px-5 border-b border-white/[0.06]">
        <span className="text-[13px] font-semibold text-zinc-300 truncate">
          <span className="text-[12.5px] text-zinc-700">Document Name :</span>
          <span className="ml-3">{doc.title}</span>
        </span>
        <span className={`px-6 ${doc.ownerId===currentUserId?"":"mr-auto"}`}><Badge variant={"default"}>{doc.visibility}</Badge></span>
        {doc.ownerId===currentUserId?<Badge className="text-red-500 bg-red-700/20 border-red-500/30 mr-auto">Document Owner</Badge>:<></>}
        {doc.visibility==="private"?<>{editing?<motion.span className="inline-block" whileTap={{ scale: 0.95 }}><Button
            size="sm"
            onClick={(e)=>{handleediting()}}
            className="h-7 text-[11px] gap-1.5 bg-[#4C82FB] text-white hover:bg-[#3E71E8]"
          >
            <Pencil size={12} /> Stop Editing
          </Button></motion.span>:<motion.span className="inline-block" whileTap={{ scale: 0.95 }}><Button
            size="sm"
            onClick={(e)=>{e.stopPropagation();console.log("triggering");isediting(true)}}
            className="h-7 text-[11px] gap-1.5 bg-[#4C82FB] text-white mr-3 hover:bg-[#3E71E8]"
          >
            <Pencil size={12} /> Edit
          </Button></motion.span>}
          </>:isLockedByOther ? (
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-400">
            <Lock size={12} /> Locked by {roompicked.members.find(data=>data.userId===doc.ownerId)?.name}
          </span>
        ) : isEditable ? (
          <motion.span className="inline-block" whileTap={{ scale: 0.95 }}>
            <Button
              size="sm"
              variant="outline"
              onClick={releaseEdit}
              className="h-7 text-[11px] gap-1.5 border-white/10 bg-white/20 text-zinc-300 hover:bg-white/5 hover:text-black"
            >
              Release lock
            </Button>
          </motion.span>
        ) : (
          <motion.span className="inline-block" whileTap={{ scale: 0.95 }}>
            <Button
              size="sm"
              onClick={requestEdit}
              className="h-7 text-[11px] gap-1.5 bg-[#4C82FB] text-white hover:bg-[#3E71E8]"
            >
              <Pencil size={12} /> Equip Lock
            </Button>
          </motion.span>
        )}
        {isEditable?<Badge variant={"outline"} className={`${edit?"bg-green-600":"bg-red-600"} text-white text-xs mx-6`} onClick={(e)=>{e.stopPropagation();setedit(!edit)}}>{!edit?"Edit":"Stop editing"}</Badge>:<></>} 
        {isEditable||doc.visibility==="private"?saving?<span className="text-xs text-white">saving...</span>:<span className="text-xs text-zinc-300">saved</span>:<></>}
      </div>
       
      <EditorToolbar editor={editor} disabled={!canType} />
      <div className="flex-1 min-h-0 flex flex-col">
        <EditorContent editor={editor} className="flex-1 min-h-0 flex flex-col" />
      </div>
    </div>
  )
}

/**
 * Lock flow: opening a document does NOT grab the lock automatically —
 * it opens read-only. Clicking "Edit" requests the lock; clicking
 * "Release lock" gives it back. This matches the model you described:
 * only the lock holder can type, everyone else sees it live but frozen.
 *
 * updateDocumentContent is debounced (300ms) so you're not broadcasting
 * on every keystroke — swap the setTimeout for however your socket
 * layer wants diffs batched.
 */
