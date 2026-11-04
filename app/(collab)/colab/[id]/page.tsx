"use client"

import TopbarSpecRoom from "@/components/topbarspecroom"
import SpecroomDocbar from "@/components/specroomdocbar"
import Documentcomponent from "@/components/documentcomponent"
import Canvascomponent from "@/components/canvascomponent"
import { Separator } from "@/components/ui/separator"
import { useDocumentStore } from "@/components/store"
import { Roompicked } from "@/components/store"
import { motion, AnimatePresence } from "framer-motion"
export default function SpecRoomLayout({ onBack }: { onBack?: () => void }) {
  const activeId = useDocumentStore((s) => s.activeDocumentId)
  const documents = Roompicked(s=>s.documentList)
  const activeDoc = documents.find((d) => d.id === activeId)
  const roompicked=Roompicked(s=>s.room)
  return (
    <div className="h-screen w-full flex flex-col bg-[#0A0B0E] text-zinc-100">
      <TopbarSpecRoom onBack={onBack} />
      <Separator className="bg-white/[0.06]" />
      <div className="w-full flex-1 flex items-stretch min-h-0">
        <SpecroomDocbar />
        <Separator orientation="vertical" className="bg-white/[0.06]" />
        <AnimatePresence mode="wait">
          <motion.div
            key={roompicked.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="flex-1 min-w-0 flex"
          >
            {activeDoc?.type==="canvas"?(
              <Canvascomponent/>
            ):activeDoc?.type==="text"?(
              <Documentcomponent/>
            ):(
              <Canvascomponent/>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
/*<div className="flex-1 h-full flex items-center justify-center text-sm text-zinc-600">
            Select or create a document to get started.
          </div>*/
/**
 * Fixed from the original snippet: it referenced `documenttype` which
 * was never defined anywhere in scope, so the canvas/document ternary
 * could never actually resolve. This version derives it from the
 * currently active document in the store instead — and adds a third
 * state (nothing selected yet) that the original didn't account for.
 */

//const documenttype=Documentrendertype(s=>s.type)
  //  const setdocumenttype=Documentrendertype(s=>s.settype)