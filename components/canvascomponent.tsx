"use client"
import React from 'react'
import { Shapesarray } from "./store"
import {KonvaNodeEvents, Stage} from 'react-konva'
import { Layer } from 'react-konva'
import { Line } from 'react-konva'
import { Rect } from 'react-konva'
import { Circle } from 'react-konva'
import { Text } from 'react-konva'
import Konva from 'konva'
import { CanvasShape, ShapeType, CanvasContent } from "@/types/collab"
import { Command } from '@/types/collab'
import { KonvaEventListener, KonvaEventObject } from 'konva/lib/Node'
import {
  Undo2,
  Redo2,
  PenLine,
  Square,
  Circle as CircleIcon,
  Type,
  Shapes,
  Lock,
  Pencil,
} from "lucide-react"
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip'
import { useDocumentStore, Roompicked, UsercurrentId, Toklue } from "./store"
import { set as socketSet } from "@/socketserver/clientsidesocket"
import { motion } from "framer-motion"

// Cohesive ink + accent palette for a whiteboard-on-dark-chrome look.
// Falls back to whatever the shape itself carries (fill/stroke/strokeWidth)
// so per-shape overrides from the store still win.
const SHAPE_STYLE: Record<Exclude<ShapeType, "image">, { stroke: string; fill?: string; strokeWidth: number }> = {
  line: { stroke: "#18181B", strokeWidth: 3 },
  rect: { stroke: "#7C3AED", fill: "rgba(124,58,237,0.08)", strokeWidth: 2 },
  circle: { stroke: "#059669", fill: "rgba(5,150,105,0.08)", strokeWidth: 2 },
  text: { stroke: "transparent", fill: "#18181B", strokeWidth: 0 },
}

const TOOLS: { type: ShapeType; label: string; icon: React.ElementType }[] = [
  { type: "line", label: "Pen", icon: PenLine },
  { type: "rect", label: "Rectangle", icon: Square },
  { type: "circle", label: "Circle", icon: CircleIcon },
  { type: "text", label: "Text", icon: Type },
]

export default function Canvascomponent(){
  const setshapes=Shapesarray(s=>s.setshape)
  const deleteshapes=Shapesarray(s=>s.deleteshape)
  const updateshapes=Shapesarray(s=>s.updateshape)
  const updatetext=Shapesarray(s=>s.updatetext)
  const shapes=Shapesarray(s=>s.shapes)
  const [select,setselect]=React.useState<ShapeType>("line")
  const [toolselect,settoolselect]=React.useState<boolean>(false)
  const [isdrawing,setisdrawing]=React.useState<boolean>(false)
  const idref=React.useRef<string>(null)
  const redostack=React.useRef<Command[]>([])
  const undostack=React.useRef<Command[]>([])
  const [editing,setediting]=React.useState<string>("")
  const [text,settext]=React.useState<string>("")
  const [points,setpoints]=React.useState<{x:number,y:number}>({x:0,y:0})
  const editingShape = shapes.find(
  (s) => s.id === editing
);

  // Responsive stage sizing — the board fills whatever space the layout
  // gives it instead of a fixed 600x600 box.
  const stageWrapRef = React.useRef<HTMLDivElement>(null)
  const [stageSize, setStageSize] = React.useState({ width: 960, height: 640 })

  React.useEffect(() => {
    const el = stageWrapRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      const { width, height } = entry.contentRect
      if (width > 0 && height > 0) {
        setStageSize({ width, height })
      }
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // ── Document wiring: load/save/lock, mirroring documentcomponent.tsx ──
  const setallshapes = Shapesarray(s=>s.setshapes)
  const activeId = useDocumentStore(s=>s.activeDocumentId)
  const documents = Roompicked(s=>s.documentList)
  const doc = documents.find(d=>d.id===activeId)
  const currentUserId = UsercurrentId(s=>s.name)
  const roompicked = Roompicked(s=>s.room)
  const toklue = Toklue(s=>s.name)
  const [saving, setsaving] = React.useState(false)

  const isEditable = !!doc && doc.lockedBy === currentUserId
  const isLockedByOther = !!doc && !!doc.lockedBy && doc.lockedBy !== currentUserId

  const skipNextSave = React.useRef(true)

  function requestEdit() {
    if (!doc) return
    socketSet("request:lockedby:colab", { roomId: roompicked.id, documentId: doc.id, token: toklue })
  }

  function releaseEdit() {
    if (!doc) return
    socketSet("request:lockrelease:colab", { roomId: roompicked.id, documentId: doc.id, token: toklue })
  }

  // Load this document's saved shapes whenever we switch to it, or whenever
  // someone else's edit syncs in new content while we're just viewing it.
  React.useEffect(() => {
    if (!doc || doc.type !== "canvas") return
    skipNextSave.current = true
    const strokes = doc.content?.strokes ?? {}
    setallshapes(Object.values(strokes))
    undostack.current = []
    redostack.current = []
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc?.id, doc && doc.type === "canvas" ? doc.content : null])

  // Debounced save — only the lock holder is allowed to push changes back,
  // same rule the server already enforces for text documents.
  React.useEffect(() => {
    if (!doc || doc.type !== "canvas") return
    if (skipNextSave.current) { skipNextSave.current = false; return }
    if (!isEditable) return
    setsaving(true)
    const timeout = setTimeout(() => {
      const strokes: Record<string, CanvasShape> = {}
      shapes.forEach(s => { strokes[s.id] = s })
      socketSet("request:documentcontent:colab", {
        roomId: roompicked.id,
        documentId: doc.id,
        content: { strokes } as CanvasContent,
        token: toklue,
        type: doc.type,
      })
      setsaving(false)
    }, 400)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shapes])

  function rendershape(shape:CanvasShape){
    switch(shape.type){
      case 'line':
        return (
          <Line
            key={shape.id}
            points={shape.points}
            stroke={shape.stroke ?? SHAPE_STYLE.line.stroke}
            strokeWidth={shape.strokeWidth ?? SHAPE_STYLE.line.strokeWidth}
            lineCap="round"
            lineJoin="round"
          />
        )
      case "rect":
        return (
          <Rect
            key={shape.id}
            x={shape.x}
            y={shape.y}
            height={shape.height}
            width={shape.width}
            cornerRadius={4}
            strokeWidth={shape.strokeWidth ?? SHAPE_STYLE.rect.strokeWidth}
            stroke={shape.stroke ?? SHAPE_STYLE.rect.stroke}
            fill={shape.fill ?? SHAPE_STYLE.rect.fill}
            shadowColor="#000000"
            shadowOpacity={0.08}
            shadowBlur={6}
            shadowOffsetY={2}
          />
        )
      case "circle":
        return (
          <Circle
            key={shape.id}
            x={shape.x}
            y={shape.y}
            radius={shape.radius}
            strokeWidth={shape.strokeWidth ?? SHAPE_STYLE.circle.strokeWidth}
            stroke={shape.stroke ?? SHAPE_STYLE.circle.stroke}
            fill={shape.fill ?? SHAPE_STYLE.circle.fill}
            shadowColor="#000000"
            shadowOpacity={0.08}
            shadowBlur={6}
            shadowOffsetY={2}
          />
        )
     case "text":
  return (
    <Text
      key={shape.id}
      x={shape.x}
      y={shape.y}
      text={shape.text}
      fill={shape.fill ?? SHAPE_STYLE.text.fill}
      fontSize={shape.fontSize}
      fontFamily="Inter, ui-sans-serif, system-ui"
      onDblClick={() => {
  setediting(shape.id);
  settext(shape.text);
}}
    />
  );
    }
  }
 const onMouseDown = (
  e: Konva.KonvaEventObject<MouseEvent>
) => {
  if(editing) return
  if(!isEditable) return
  const stage = e.target.getStage();
  const pos = stage?.getPointerPosition();

  if (!pos) return;

  // TEXT TOOL
  if (select === "text") {
    const id = crypto.randomUUID();
    idref.current=id

    setshapes({
      id:idref.current||"",
      type: "text",
      x: pos.x,
      y: pos.y,
      text: "",
      fontSize: 20,
      fill: "black",
      updatedAt: new Date(),
      updatedBy: "",
    });

    settext("");

    // wait for React to render
    setTimeout(() => {
      setediting(idref.current||"");
    }, 0);

    return;
  }

  setisdrawing(true);

  const id = crypto.randomUUID();
  idref.current = id;

  if (select === "line") {
    setshapes({
      id,
      type: "line",
      x: 0,
      y: 0,
      points: [pos.x, pos.y],
      updatedAt: new Date(),
      updatedBy: "",
    });
  }

  if (select === "rect") {
    setshapes({
      id,
      type: "rect",
      x: pos.x,
      y: pos.y,
      width: 0,
      height: 0,
      updatedAt: new Date(),
      updatedBy: "",
    });
  }

  if (select === "circle") {
    setshapes({
      id,
      type: "circle",
      x: pos.x,
      y: pos.y,
      radius: 0,
      fill:"red",
      updatedAt: new Date(),
      updatedBy: "",
    });
  }
};
 const onMouseMove=(e:Konva.KonvaEventObject<MouseEvent>)=>{
  if(!isdrawing||select==="text") return 
  const stage=e.target.getStage()
  const pos=stage?.getPointerPosition()
  if(select==="line")
  updateshapes(idref.current||"",pos?.x||0,pos?.y||0)
  if(select==="rect")
    updateshapes(idref.current||"",pos?.x||0,pos?.y||0)
  if(select==="circle")
    updateshapes(idref.current||"",pos?.x||0,pos?.y||0)
 }
 const onMouseUp=(e:Konva.KonvaEventObject<MouseEvent>)=>{
  setisdrawing(false)
  const shape=shapes.find(data=>data.id===idref.current)
  if(shape){
    const command=createcommand(shape)
    undostack.current.push(command)
  }
}
function createcommand(shape:CanvasShape){
  return {execute(){
      setshapes(shape)
    },undo(){deleteshapes(shape.id)},redo(){this.execute()}}
  }
  function Undo(){
    const shape=undostack.current.pop()
    if(shape){
      shape.undo()
      redostack.current.push(shape)
    }
    else{
      return
    }
  }
  function Redo(){
    const shape=redostack.current.pop()
    if(shape){
      shape.redo()
      undostack.current.push(shape)
    }
  }
  const handleBlur = () => {
  if (!editing) return;

  if (text.trim() === "") {
    deleteshapes(editing);
  } else {
    updatetext(editing,text);
  }

 setTimeout(() => {
    setediting("");
    settext("");
  }, 0);
};
  if (!doc || doc.type !== "canvas") {
    return (
      <div className="flex-1 h-full flex items-center justify-center text-sm text-zinc-600">
        Select or create a canvas to get started.
      </div>
    )
  }
  return(
    <TooltipProvider>
    <div className="flex-1 h-full flex flex-col min-w-0 bg-[#0A0B0E]">
      {/* Header / toolbar — matches the document view's h-11 chrome */}
      <div className="h-11 shrink-0 flex items-center justify-between px-5 border-b border-white/[0.06] gap-4">
        <div className="flex items-center gap-2 min-w-0">
          <Shapes size={14} className="text-[#4C82FB] shrink-0" />
          <span className="text-[13px] font-semibold text-zinc-300 truncate">
            Canvas Board
          </span>
          <Badge variant="outline" className="text-zinc-500 border-white/10 ml-1">
            {shapes.length} {shapes.length === 1 ? "shape" : "shapes"}
          </Badge>
          <span className="ml-3">
            {isLockedByOther ? (
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-400">
                <Lock size={12} /> Locked by {roompicked.members.find(m=>m.userId===doc?.lockedBy)?.userId ?? doc?.lockedBy}
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
          </span>
          {isEditable ? (
            <span className="text-[11px] text-zinc-500 ml-2">
              {saving ? "saving..." : "saved"}
            </span>
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          {/* Undo / Redo group */}
          <div className="flex items-center gap-0.5 rounded-md border border-white/10 bg-white/[0.03] p-0.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-zinc-400 hover:bg-white/10 hover:text-white"
                  disabled={!isEditable}
                  onClick={(e) => {
                    e.stopPropagation()
                    Undo()
                  }}
                >
                  <Undo2 size={15} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-zinc-400 hover:bg-white/10 hover:text-white"
                  disabled={!isEditable}
                  onClick={(e) => {
                    e.stopPropagation()
                    Redo()
                  }}
                >
                  <Redo2 size={15} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Redo</TooltipContent>
            </Tooltip>
          </div>

          {/* Tool group */}
          <div className="relative flex items-center gap-0.5 rounded-md border border-white/10 bg-white/[0.03] p-0.5">
            {TOOLS.map(({ type, label, icon: Icon }) => (
              <Tooltip key={type}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    disabled={!isEditable}
                    onClick={(e) => {
                      e.stopPropagation()
                      setselect(type)
                    }}
                    className={`relative ${
                      select === type
                        ? "text-white hover:text-white"
                        : "text-zinc-400 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {select === type && (
                      <motion.span
                        layoutId="canvas-tool-highlight"
                        className="absolute inset-0 rounded-md bg-[#4C82FB]"
                        transition={{ type: "spring", stiffness: 500, damping: 40 }}
                      />
                    )}
                    <Icon size={15} className="relative" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{label}</TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      </div>

      {/* Board surface — a light "paper" panel floating on the dark chrome */}
      <div ref={stageWrapRef} className="flex-1 min-h-0 p-6 relative">
        <div
          className="relative w-full h-full rounded-xl border border-black/5 shadow-[0_1px_2px_rgba(0,0,0,0.4),0_16px_40px_-12px_rgba(0,0,0,0.6)] overflow-hidden"
          style={{
            background:
              "radial-gradient(circle, rgba(0,0,0,0.08) 1px, transparent 1px) 0 0/20px 20px, #FAFAF9",
          }}
        >
          <Stage
            width={stageSize.width}
            height={stageSize.height}
            className={!isEditable ? "cursor-not-allowed" : select === "text" ? "cursor-text" : "cursor-crosshair"}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
          >
            <Layer>
              {shapes.map(rendershape)}
            </Layer>
          </Stage>

          {editingShape && (
            <textarea
              autoFocus
              value={text}
              onChange={(e) =>
                settext(e.target.value)
              }
              onBlur={handleBlur}
              style={{
                position: "absolute",
                left: editingShape.x,
                top: editingShape.y,
                zIndex: 1000,
                background: "white",
                color: "#18181B",
                border: "1px solid #4C82FB",
                borderRadius: "4px",
                minWidth: "140px",
                minHeight: "32px",
                padding: "4px 6px",
                fontSize: "14px",
                boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                outline: "none",
              }}
            />
          )}
          {shapes.length === 0 && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="text-sm text-zinc-400">
                Pick a tool above and click on the board to start drawing.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
    </TooltipProvider>
  )
}
