"use client"
import DocumentUploadDialog from "./documentupload"
import Trashdocuments from '@/components/trashdocuments'
import { useState } from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Variants } from "framer-motion"
import { ScrollArea } from "./ui/scroll-area"
import { Button } from "./ui/button"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { FileText, LayoutGrid, Plus, Lock, X, MoveRight, LogOut, ArrowLeft } from "lucide-react"
import { Ellipsis } from "lucide-react"
import { useDocumentStore } from "@/components/store"
import { Roompicked, UsercurrentId } from "@/components/store"
import { Toklue } from "@/components/store"
import { Documentarearender } from "@/components/store"
import { Documentsearch } from "@/components/store"
import type { CanvasDocument, IDocument, TextDocument } from "@/types/collab"
import { Badge } from "./ui/badge"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Dialog } from "./ui/dialog"
import { DialogTrigger } from "./ui/dialog"
import { DialogHeader } from "./ui/dialog"
import { DialogTitle } from "./ui/dialog"
import { DialogContent } from "./ui/dialog"
import { DialogFooter } from "./ui/dialog"
import { Eye, Edit, Trash } from "lucide-react"
import { Copy } from 'lucide-react'
import { set } from "@/socketserver/clientsidesocket"
import toast from "react-hot-toast"
import { Separator } from "./ui/separator"
import { motion, AnimatePresence } from "framer-motion"

const uid = () => Math.random().toString(36).slice(2, 9)

function DocRow({ doc }: { doc: IDocument }) {
  const activeId = useDocumentStore((s) => s.activeDocumentId)
  const setActive = useDocumentStore((s) => s.setActiveDocument)
  const currentUserId = UsercurrentId((s) => s.name)
  const roompicked = Roompicked((s) => s.room)
  const toklue = Toklue((s) => s.name)
  const setdocumentarearender = Documentarearender((s) => s.setvlue)
  const isActive = doc.id === activeId
  const isLockedByOther = !!doc.lockedBy && doc.lockedBy !== currentUserId
  const isLockedByMe = !!doc.lockedBy && doc.lockedBy === currentUserId
  const documentsearchId = Documentsearch((s) => s.email)
  const [isEditTitleOpen, setIsEditTitleOpen] = useState<boolean>(false)
  const [titleInput, setTitleInput] = useState<string>("")

  const isOwner = doc.ownerId === currentUserId

  function handledocumentvisibility(id: string, visibility: "private" | "room") {
    set("request:documentvisibility:colab", {
      roomId: roompicked.id,
      documentId: id,
      visibility: visibility === "private" ? "room" : "private",
      token: toklue,
    })
  }

  function getdoctitle(value: string) {
    return value.length > 10 ? value.slice(0, 10) + "..." : value
  }

  function handleclonedocument() {
    set("request:documentclone:colab", {
      documentId: doc.id,
      roomId: roompicked.id,
      token: toklue,
    })
  }

  function handlechangedocumenttitle() {
    if (titleInput) {
      set("request:documenttitle:colab", {
        roomId: roompicked.id,
        documentId: doc.id,
        title: titleInput,
        token: toklue,
      })
    } else {
      toast.error("Enter document title")
    }
  }

  function handledeletedocument(documentId: string) {
    set("request:documentdelete:colab", {
      documentId,
      roomId: roompicked.id,
      token: toklue,
    })
  }

  function handletrashdocument(documentId: string) {
    console.log("document trashed function triggering")
    console.log(documentId,"documentId")
    set("request:documenttrashed:colab", {
      documentId:documentId,
      roomId: roompicked.id,
      token: toklue,
    })
  }

  useEffect(() => {
    if (documentsearchId) {
      document.getElementsByName(documentsearchId)[0]?.scrollIntoView({ behavior: "smooth" })
    }
  }, [documentsearchId])
  console.log("documentId",doc.id)
  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      whileTap={{ scale: 0.98 }}
      name={`${documentsearchId ? String(documentsearchId) : ""}`}
      onClick={() => { setActive(doc.id); setdocumentarearender(true) }}
      className={`relative w-full flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left transition-colors border border-transparent ${
        isActive ? "" : "hover:bg-white/5"
      } ${documentsearchId ? "bg-blue-600/20 border-blue-600" : ""}`}
    >
      {isActive && (
        <motion.span
          layoutId="active-doc-highlight"
          className="absolute inset-0 rounded-lg bg-[#4C82FB]/10 border border-[#4C82FB]/20"
          transition={{ type: "spring", stiffness: 500, damping: 40 }}
        />
      )}

      <span className={`relative ${isActive ? "text-[#4C82FB]" : "text-zinc-500"}`}>
        {doc.type === "canvas" ? <LayoutGrid size={14} /> : <FileText size={14} />}
      </span>

      <span className={`relative flex-1 min-w-0 truncate text-[13px] font-medium ${
        isActive ? "text-zinc-100" : "text-zinc-400"
      }`}>
        {getdoctitle(doc.title) || "Untitled"}
      </span>

      <span className="relative">
        <Badge variant="default" className="text-xs">{doc.visibility}</Badge>
      </span>

      <Popover>
        <PopoverTrigger asChild>
          <button className="relative rounded" onClick={(e) => e.stopPropagation()}>
            <Ellipsis size={13} />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-60 p-1.5 space-y-0.5 rounded-lg border border-white/10 bg-[#101217] text-zinc-100 shadow-xl shadow-black/40">

          {/* Change Visibility */}
          <div
            className="flex items-center gap-2.5 p-2 rounded-md hover:bg-white/5 cursor-pointer transition-colors group"
            onClick={(e) => { e.stopPropagation(); handledocumentvisibility(doc.id, doc.visibility) }}
          >
            <Eye className="w-4 h-4 text-zinc-400 group-hover:text-[#4C82FB] transition-colors" />
            <div className="flex flex-1 items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 border-white/10 bg-white/5 text-zinc-400 capitalize">
                  {doc.visibility}
                </Badge>
                <MoveRight size={10} className="text-zinc-600 mx-1" />
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 border-[#4C82FB]/20 bg-[#4C82FB]/10 text-[#4C82FB] capitalize">
                  {doc.visibility === "private" ? "room" : "private"}
                </Badge>
              </span>
            </div>
          </div>

          {/* Edit Title */}
          <Dialog open={isEditTitleOpen} onOpenChange={setIsEditTitleOpen}>
            <DialogTrigger asChild>
              <div className="flex items-center gap-2.5 p-2 rounded-md hover:bg-white/5 cursor-pointer transition-colors group">
                <Edit className="w-4 h-4 text-zinc-400 group-hover:text-[#4C82FB] transition-colors" />
                <span className="text-sm text-zinc-200">Edit title</span>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[360px] bg-[#0A0B0E] border border-white/10 text-zinc-100">
              <DialogHeader>
                <DialogTitle className="text-sm font-bold text-zinc-100">Edit Title</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-2 py-2">
                <p className="text-[11px] text-zinc-500 truncate">
                  Current: <span className="text-zinc-400">{doc?.title}</span>
                </p>
                <Input
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  placeholder="Enter new title"
                  className="bg-white/5 border-white/10 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-[#4C82FB]"
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  className="border-white/10 text-zinc-300 hover:bg-white/10"
                  onClick={() => setIsEditTitleOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-[#4C82FB] hover:bg-[#3E71E8] text-white"
                  onClick={() => { handlechangedocumenttitle(); setIsEditTitleOpen(false) }}
                >
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Clone */}
          <div
            className="flex items-center gap-2.5 p-2 rounded-md hover:bg-white/5 cursor-pointer transition-colors group"
            onClick={(e) => { e.stopPropagation(); handleclonedocument() }}
          >
            <Copy className="w-4 h-4 text-zinc-400 group-hover:text-[#4C82FB] transition-colors" />
            <span className="text-sm text-zinc-200">Clone document</span>
          </div>

          <Separator className="bg-white/5 my-1" />

          {/* Move to trash — owner only */}
          {isOwner && (
            <div
              className="flex items-center gap-2.5 p-2 rounded-md hover:bg-amber-500/10 cursor-pointer transition-colors group"
            >
              <Trash className="w-4 h-4 text-amber-400 group-hover:text-amber-300 transition-colors" />
              <div className="flex flex-col" onClick={(e)=>{e.stopPropagation();set("request:documenttrashed:colab",{documentId:doc.id,roomId:roompicked.id,token:toklue})}}>
                <span className="text-sm text-amber-400 group-hover:text-amber-300 transition-colors">
                  Move to trash
                </span>
                <span className="text-[10px] text-zinc-600">Recoverable from trash bin</span>
              </div>
            </div>
          )}

          {/* Remove from room — admin/creator only (not owner of this doc) */}
          {!isOwner && (
            <div
              className="flex items-center gap-2.5 p-2 rounded-md hover:bg-red-500/10 cursor-pointer transition-colors group"
            >
              <Trash className="w-4 h-4 text-red-400 group-hover:text-red-300 transition-colors" />
              <div className="flex flex-col" onClick={(e)=>{e.stopPropagation();set("request:documentdelete:colab",{documentId:doc.id,roomId:roompicked.id,token:toklue})}}>
                <span className="text-sm text-red-400 group-hover:text-red-300 transition-colors">
                  Remove from room
                </span>
                <span className="text-[10px] text-zinc-600">Permanent, cannot be undone</span>
              </div>
            </div>
          )}

        </PopoverContent>
      </Popover>

      {isLockedByOther && <Lock size={12} className="relative text-amber-400 shrink-0" />}
      {isLockedByMe && <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />}
    </motion.button>
  )
}

export default function SpecroomDocbar() {
  const room = Roompicked((s) => s.room)
  const documents = Roompicked((s) => s.documentList)
  const setActive = useDocumentStore((s) => s.setActiveDocument)
  const currentUserId = UsercurrentId((s) => s.name)
  const [choosing, setChoosing] = useState(false)
  const [open, setopen] = useState<boolean>(false)
  const [title, settitle] = useState<string>("")
  const [canvasopen, setcanvasopen] = useState<boolean>(false)
  const toklue = Toklue((s) => s.name)
  const router = useRouter()

  const topbarvariants: Variants = {
    initial: { y: -500, x: 0, opacity: 0 },
    appear: {
      y: 0, x: 0, opacity: 1,
      transition: { type: "spring", stiffness: 50, damping: 10, duration: 1, staggerChildren: 0.3, delayChildren: 0.8 }
    }
  }
  const topbarchilvariants: Variants = {
    initial: { x: -40, y: 0, opacity: 0 },
    appear: {
      y: 0, x: 0, opacity: 1,
      transition: { type: "spring", damping: 20, stiffness: 100, duration: 0.8 }
    }
  }

  function getdocumentlength() {
    let count = 0
    documents.forEach((value) => {
      if (value.visibility === "room" || value.ownerId === currentUserId) count++
    })
    return count
  }

  function handlecreatedocument() {
    if (title) {
      const document: TextDocument = {
        type: "text",
        content: "",
        id: crypto.randomUUID(),
        roomId: room.id,
        title,
        ownerId: currentUserId,
        visibility: "private",
        lockedAt: null,
        lockedBy: null,
        clonedFrom: "",
        createdAt: new Date(),
        status: "none",
      }
      set("request:documentadd:colab", { document, roomId: room.id, token: toklue })
      setopen(false)
      settitle("")
    } else {
      toast.error("Enter title of document")
    }
  }

  function handlecreatecanvasdocument() {
    if (title) {
      const document: CanvasDocument = {
        type: "canvas",
        content: { strokes: {} },
        id: crypto.randomUUID(),
        roomId: room.id,
        title,
        ownerId: currentUserId,
        visibility: "private",
        lockedAt: null,
        lockedBy: null,
        clonedFrom: "",
        createdAt: new Date(),
        status: "none",
      }
      set("request:documentadd:colab", { document, roomId: room.id, token: toklue })
      setcanvasopen(false)
      settitle("")
    } else {
      toast.error("Enter title of document")
    }
  }

  function headback() {
    router.push("/colab")
  }

  // active docs only — exclude trashed
  const visibleDocs = documents.filter(
    (doc) =>
      doc.status !== "trashed" &&
      doc.status !== "deleted" &&
      (doc.visibility === "room" || doc.ownerId === currentUserId)
  )
 console.log("documents",documents)
  return (
    <div className="flex flex-col h-full w-[260px] shrink-0 bg-[#0A0B0E]">
      <ScrollArea className="flex-1 min-h-0">
        <motion.div
          variants={topbarvariants}
          initial="initial"
          animate="appear"
          className="h-full flex flex-col p-3"
        >
          {/* back nav */}
          <motion.div
            variants={topbarchilvariants}
            className="h-[50px] w-full flex items-center justify-start px-1"
          >
            <span
              className="text-xs text-gray-600 hover:text-white cursor-pointer"
              onClick={(e) => { e.stopPropagation(); headback() }}
            >
              back
            </span>
            <ArrowLeft size={10} color="white" className="ml-3" />
            <span className="text-sm text-white ml-5">Dashboard</span>
          </motion.div>

          {/* add document area */}
          <AnimatePresence mode="wait" initial={false}>
            {choosing ? (
              <motion.div
                key="choosing"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="flex flex-col gap-1.5 mt-1"
              >
                <DocumentUploadDialog roomId={room.id} />

                {/* empty text doc */}
                <Dialog open={open} onOpenChange={setopen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center justify-start gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-[13px] font-semibold text-zinc-300 hover:bg-white/10 transition-colors">
                      <FileText size={13} color="purple" />
                      Empty Text Document
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#101217] border-white/10 text-zinc-100 max-w-md p-0">
                    <DialogHeader className="px-6 pt-6 pb-0">
                      <DialogTitle className="text-base font-bold text-zinc-100">New Text document</DialogTitle>
                      <p className="text-xs text-zinc-500 mt-1">Add an empty document to this room</p>
                    </DialogHeader>
                    <div className="px-6 py-5 flex flex-col gap-5">
                      <div className="flex flex-col gap-1.5">
                        <Label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Title</Label>
                        <Input
                          value={title}
                          onChange={(e) => settitle(e.target.value)}
                          placeholder="Enter title of document..."
                          className="bg-white/5 border-white/10 text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-[#4C82FB]/30 h-9 text-sm"
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <Button
                          variant="ghost" size="sm"
                          onClick={() => setopen(false)}
                          className="flex-1 text-zinc-500 hover:text-zinc-300 hover:bg-white/5 text-xs font-bold"
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          disabled={!title}
                          onClick={handlecreatedocument}
                          className="flex-1 bg-[#4C82FB] hover:bg-[#3E71E8] disabled:opacity-30 text-white text-xs font-bold gap-2"
                        >
                          Create document
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* empty canvas doc */}
                <Dialog open={canvasopen} onOpenChange={setcanvasopen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center justify-start gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-[13px] font-semibold text-zinc-300 hover:bg-white/10 transition-colors">
                      <FileText size={13} color="purple" />
                      Empty Canvas Document
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#101217] border-white/10 text-zinc-100 max-w-md p-0">
                    <DialogHeader className="px-6 pt-6 pb-0">
                      <DialogTitle className="text-base font-bold text-zinc-100">New Canvas document</DialogTitle>
                      <p className="text-xs text-zinc-500 mt-1">Add an empty canvas document to this room</p>
                    </DialogHeader>
                    <div className="px-6 py-5 flex flex-col gap-5">
                      <div className="flex flex-col gap-1.5">
                        <Label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">Title</Label>
                        <Input
                          value={title}
                          onChange={(e) => settitle(e.target.value)}
                          placeholder="Enter title of document..."
                          className="bg-white/5 border-white/10 text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-[#4C82FB]/30 h-9 text-sm"
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <Button
                          variant="ghost" size="sm"
                          onClick={() => setcanvasopen(false)}
                          className="flex-1 text-zinc-500 hover:text-zinc-300 hover:bg-white/5 text-xs font-bold"
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          disabled={!title}
                          onClick={(e) => { e.stopPropagation(); handlecreatecanvasdocument() }}
                          className="flex-1 bg-[#4C82FB] hover:bg-[#3E71E8] disabled:opacity-30 text-white text-xs font-bold gap-2"
                        >
                          Create document
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <button
                  onClick={() => setChoosing(false)}
                  className="flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-medium text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  <X size={12} /> Cancel
                </button>
              </motion.div>
            ) : (
              <motion.div variants={topbarchilvariants} key="add-btn" whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={() => setChoosing(true)}
                  size="sm"
                  className="w-full gap-1.5 bg-[#4C82FB] text-white hover:bg-[#3E71E8] font-bold"
                >
                  <Plus size={14} /> Add document
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* documents label */}
          <motion.div
            variants={topbarchilvariants}
            className="flex items-center justify-between mt-7 mb-2 px-1"
          >
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Documents</span>
            <span className="text-[11px] font-bold text-zinc-600">{getdocumentlength()}</span>
          </motion.div>

          {/* document list */}
          <motion.div variants={topbarvariants} className="flex flex-col gap-0.5">
            {visibleDocs.length === 0 ? (
              <motion.p
                variants={topbarchilvariants}
                className="text-xs text-zinc-600 text-center py-8 px-2 leading-relaxed"
              >
                No documents yet — create one to get started.
              </motion.p>
            ) : (
              <AnimatePresence initial={false}>
                {visibleDocs.map((doc) => (
                  <motion.div key={doc.id} variants={topbarchilvariants}>
                    <DocRow doc={doc} />
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </motion.div>
        </motion.div>
      </ScrollArea>

      {/* sticky bottom — trash bin */}
      <div className="border-t border-white/5 bg-[#0A0B0E] w-full">
        <Trashdocuments />
      </div>
    </div>
  )
}