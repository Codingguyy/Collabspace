"use client"

import { useState, useRef, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Popover } from "./ui/popover"
import { PopoverTrigger } from "./ui/popover"
import { PopoverContent } from "./ui/popover"
import { Loader2, Plus, FileText, PenTool, Upload, X, LayoutGrid, Ellipsis } from "lucide-react"
import { set } from "@/socketserver/clientsidesocket"
import { Roompicked, UsercurrentId } from "./store"
import { Documentupload } from "./store"
import { Toklue } from "./store"
import toast from "react-hot-toast"
import { Separator } from "./ui/separator"
import { Spinner } from "./ui/spinner"
import { IDocument } from "@/types/collab"
import { TextDocument } from "@/types/collab"
import { CanvasDocument } from "@/types/collab"
type DocType = "text" | "canvas"

interface UploadState {
  file: File | null
  title: string
  type: DocType
  uploading: boolean
  error: string | null
}

interface DocumentUploadDialogProps {
  roomId: string
}

export default function DocumentUploadDialog({ roomId}: DocumentUploadDialogProps) {
  const [open, setOpen] = useState(false)
  const [state, setState] = useState<UploadState>({
    file: null,
    title: "",
    type: "text",
    uploading: false,
    error: null,
  })

  const inputRef = useRef<HTMLInputElement>(null)
  const dropRef  = useRef<HTMLDivElement>(null)
  const filerefdata=useRef<FormData>(new FormData())
  const [dragging, setDragging] = useState(false)
  const [statee,setstatee]=useState<boolean>(false)
  const room=Roompicked(s=>s.room)
  const documents=Roompicked(s=>s.documentList)
  const documentupload=Documentupload(s=>s.uploaded)
  const isdocumentuploading=Documentupload(s=>s.isuploading)
  const documenttext=Documentupload(s=>s.text) 
  const setdocumentuploaded=Documentupload(s=>s.setisuploaded)
  const setisdocumentuploading=Documentupload(s=>s.setisuploading)
  const toklue=Toklue(s=>s.name)
  const usercurrentId=UsercurrentId(s=>s.name)
  function reset() {
    setState({ file: null, title: "", type: "text", uploading: false, error: null })
    setDragging(false)
  }

  function handleClose(val: boolean) {
    if (!val) reset()
    setOpen(val)
  }

  function handleTypeFlip() {
    setState(s => ({
      ...s,
      type: s.type === "text" ? "canvas" : "text",
      // canvas doesn't need a file — clear it when switching
      file: s.type === "text" ? null : s.file,
      error: null,
    }))
  }

  function handleFile(file: File) {
    const allowed = ["text/plain", "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
    if (!allowed.includes(file.type) && !file.name.endsWith(".docx")) {
      setState(s => ({ ...s, error: "Only .txt, .pdf or .docx files are supported" }))
      return
    }
    // auto-fill title from filename (strip extension)
    const autoTitle = file.name.replace(/\.[^/.]+$/, "")
    setState(s => ({
      ...s,
      file,
      title: s.title || autoTitle,
      error: null,
    }))
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setDragging(true)
  }

  function handleDragLeave(e: React.DragEvent) {
    if (!dropRef.current?.contains(e.relatedTarget as Node)) setDragging(false)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

 function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0];
  console.log(file);

  // Check filerefdata.current, not filerefdata
  if (!filerefdata.current) {
    filerefdata.current = new FormData();
  }
  
  filerefdata.current.set("file", file ?? "");
  filerefdata.current.set("roomId", room.id);
  setstatee(true)
  
  console.log([...filerefdata.current.entries()]);
}

  async function handleSubmit() {
    
    try {
      setisdocumentuploading(true)
      if(!isCanvas){
        const obj: Record<string, any> = {};
filerefdata.current.forEach((value, key) => {
  obj[key] = value;
});
 const reader = new FileReader();
  reader.onload = () => {
    const dataUrl = reader.result as string;
    const base64 = dataUrl.split(",")[1] ?? ""
    console.log(obj, base64)
    set("request:documentupload:colab",{roomId:room.id,formdata:obj,filename:obj["file"].name,filetype:obj["file"].type,filedata:base64,token:toklue})};
  reader.readAsDataURL(filerefdata.current?.get("file") as File);
      }
    } catch (err: any) {
      setisdocumentuploading(false)
      setState(s => ({ ...s, uploading: false, error: err?.message ?? "Upload failed" }))
    }
  }
  function getfiledata(){
    if(filerefdata.current){
      const file=filerefdata?.current?.get("file") as File||null
      if(file){
        return file.name
      }
      else{
        return ""
      }
    }
  }
  function handlecreatedocument(){
    if(state.title){
    if(state.type==="canvas"){
      const document:CanvasDocument={
        type:"canvas",
        content:{strokes:{}},
        id:crypto.randomUUID(),
        roomId:room.id,
        title:state.title,
        ownerId:usercurrentId,
        visibility:"private",
        lockedAt:null,
        lockedBy:null,
        clonedFrom:"",
        createdAt:new Date(),
        status:"none"
      }
      set("request:documentadd:colab",{roomId:room.id,document:document,token:toklue})
    }
    else if(state.type==="text"){
      const document:TextDocument={
        type:"text",
        content:documenttext,
        id:crypto.randomUUID(),
        roomId:room.id,
        title:state.title,
        ownerId:usercurrentId,
        visibility:"private",
        lockedAt:null,
        lockedBy:null,
        clonedFrom:"",
        createdAt:new Date(),
        status:"none"
      }
      console.log("document",document)
      set("request:documentadd:colab",{document:document,roomId:room.id,token:toklue})
    }
    handleClose(!open)
  }
  else{
    toast.error("Enter title of document")
  }
  }
  const isCanvas  = state.type === "canvas"
  const canSubmit = isCanvas?true:filerefdata.current?.get("file")?true:false
useEffect(()=>{ if(documentupload){
  toast.success("Document successfully uploaded")
  setdocumentuploaded(false)
}
},[documentupload])
useEffect(()=>{if(filerefdata.current?.get("file"))toast.success("file choosed successfully")},[filerefdata.current])
  console.log(documents)
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <button
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-[13px] font-semibold text-zinc-300 hover:bg-white/10 transition-colors"
            >
              <FileText size={14} className="text-[#4C82FB]" /><LayoutGrid size={14} className="text-[#4C82FB]"/> Text document
            </button>
      </DialogTrigger>
      <DialogContent className="bg-[#101217] border-white/10 text-zinc-100 max-w-md p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-base font-bold text-zinc-100">
            New document
          </DialogTitle>
          <p className="text-xs text-zinc-500 mt-1">
            Add a document or canvas to this room
          </p>
        </DialogHeader>

        <div className="px-6 py-5 flex flex-col gap-5">

          {/* ── Type flip ── */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleTypeFlip}
              className={`relative flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 transition-all duration-200 text-left
                ${!isCanvas
                  ? "border-[#4C82FB]/40 bg-[#4C82FB]/10"
                  : "border-white/5 bg-white/5 hover:bg-white/8"
                }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors
                ${!isCanvas ? "bg-[#4C82FB]/20 text-[#4C82FB]" : "bg-white/5 text-zinc-500"}`}
              >
                <FileText size={15} />
              </div>
              <div>
                <p className={`text-sm font-bold transition-colors ${!isCanvas ? "text-[#4C82FB]" : "text-zinc-400"}`}>
                  Text document
                </p>
                <p className="text-[11px] text-zinc-600 mt-0.5">
                  Import .txt, .pdf or .docx
                </p>
              </div>
              {!isCanvas && (
                <div className="ml-auto w-2 h-2 rounded-full bg-[#4C82FB] flex-shrink-0" />
              )}
            </button>

            <button
              onClick={handleTypeFlip}
              className={`relative flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 transition-all duration-200 text-left
                ${isCanvas
                  ? "border-[#4C82FB]/40 bg-[#4C82FB]/10"
                  : "border-white/5 bg-white/5 hover:bg-white/8"
                }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors
                ${isCanvas ? "bg-[#4C82FB]/20 text-[#4C82FB]" : "bg-white/5 text-zinc-500"}`}
              >
                <PenTool size={15} />
              </div>
              <div>
                <p className={`text-sm font-bold transition-colors ${isCanvas ? "text-[#4C82FB]" : "text-zinc-400"}`}>
                  Canvas
                </p>
                <p className="text-[11px] text-zinc-600 mt-0.5">
                  Blank drawing board
                </p>
              </div>
              {isCanvas && (
                <div className="ml-auto w-2 h-2 rounded-full bg-[#4C82FB] flex-shrink-0" />
              )}
            </button>
          </div>

          {/* ── Title ── */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">
              Title
            </Label>
            <Input
              value={state.title}
              onChange={(e) => setState(s => ({ ...s, title: e.target.value, error: null }))}
              placeholder={isCanvas ? "e.g. User Flow Wireframe" : "e.g. API Design Doc"}
              className="bg-white/5 border-white/10 text-zinc-200 placeholder:text-zinc-600 focus-visible:ring-[#4C82FB]/30 h-9 text-sm"
            />
          </div>

          {/* ── File upload — only for text docs ── */}
          {!isCanvas && (
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                File
              </Label>

              {filerefdata.current?.get("file")&&statee? (
                // file chosen — show name + remove
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-[#4C82FB]/30 bg-[#4C82FB]/10">
                  <FileText size={14} className="text-[#4C82FB] flex-shrink-0" />
                  <span className="text-sm text-zinc-300 flex-1 truncate">{getfiledata()}</span>
                  <Popover>
  <PopoverTrigger asChild>
    <button
      onClick={() => {}}
      className="text-zinc-600 hover:text-zinc-400 transition-colors flex-shrink-0"
    >
      <Ellipsis size={13} />
    </button>
  </PopoverTrigger>

  <PopoverContent className="w-[160px] flex flex-col gap-1 px-3 py-2 bg-gray-900 rounded-md shadow-lg">
    <span className="text-xs text-gray-500 mb-1">Options</span>

    <button
      className="w-full text-sm flex items-center justify-between text-white px-2 py-1 rounded hover:bg-gray-800 transition-colors" onClick={(e)=>{filerefdata.current=new FormData();setstatee(false)}}
    >
      <span>Cancel</span>
      <X size={17} className="text-red-500" />
    </button>

    <button
      className="w-full text-sm flex items-center justify-between text-white px-2 py-1 rounded hover:bg-gray-800 transition-colors" disabled={!statee} onClick={(e)=>{handleSubmit()}}
    >
      <span>Upload</span>
      {isdocumentuploading?<Spinner/>:<Upload size={17} className="text-blue-500" />}
    </button>
  </PopoverContent>
</Popover>


                </div>
              ) : (
                // drop zone
                <div
                  ref={dropRef}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => inputRef.current?.click()}
                  className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-7 cursor-pointer transition-all duration-150
                    ${dragging
                      ? "border-[#4C82FB] bg-[#4C82FB]/10"
                      : "border-white/10 bg-white/5 hover:border-[#4C82FB]/30 hover:bg-[#4C82FB]/5"
                    }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors
                    ${dragging ? "bg-[#4C82FB]/20" : "bg-white/5"}`}
                  >
                    <Upload size={16} className={dragging ? "text-[#4C82FB]" : "text-zinc-500"} />
                  </div>
                  <div className="text-center">
                    <p className={`text-sm font-semibold transition-colors ${dragging ? "text-[#4C82FB]" : "text-zinc-400"}`}>
                      {dragging ? "Drop it here" : "Drop a file or click to browse"}
                    </p>
                    <div className="flex items-center justify-center gap-1.5 mt-1.5">
                      {[".txt", ".pdf", ".docx"].map(ext => (
                        <span key={ext} className="text-[10.5px] font-semibold px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-zinc-600">
                          {ext}
                        </span>
                      ))}
                    </div>
                  </div>
                  <input
                    ref={inputRef}
                    type="file"
                    accept=".txt,.pdf,.docx,application/pdf,text/plain"
                    onChange={handleInputChange}
                    className="hidden"
                  />
                </div>
              )}
            </div>
          )}

          {/* canvas hint */}
          {isCanvas && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/5 bg-white/5">
              <PenTool size={14} className="text-[#4C82FB] flex-shrink-0" />
              <p className="text-xs text-zinc-500 leading-relaxed">
                A blank canvas will be created. You can start drawing immediately after it's added to the room.
              </p>
            </div>
          )}

          {/* error */}
          {state.error && (
            <p className="text-xs text-red-400 font-medium -mt-1">{state.error}</p>
          )}

          {/* ── Actions ── */}
          <div className="flex items-center gap-2 pt-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleClose(false)}
              disabled={state.uploading}
              className="flex-1 text-zinc-500 hover:text-zinc-300 hover:bg-white/5 text-xs font-bold"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={documenttext?false:true}
              onClick={(e)=>{handlecreatedocument()}}
              className="flex-1 bg-[#4C82FB] hover:bg-[#3E71E8] disabled:opacity-30 text-white text-xs font-bold gap-2"
            >
               {
                isCanvas ? "Create canvas" : "Upload document"
               }
            </Button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  )
}