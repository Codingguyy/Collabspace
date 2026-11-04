import { Trash2, RotateCcw, X, Trash } from "lucide-react"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "./ui/button"
import { FileText, LayoutGrid } from "lucide-react"
import { Roompicked, UsercurrentId, Toklue } from "@/components/store"
import { set } from "@/socketserver/clientsidesocket"
import type { IDocument } from "@/types/collab"

export default function TrashBinPopover() {
  const documents = Roompicked((s) => s.documentList)
  const currentUserId = UsercurrentId((s) => s.name)
  const toklue = Toklue((s) => s.name)
  const room = Roompicked((s) => s.room)

  const trashedDocs = documents.filter(
    (d) => d.status === "trashed" && d.ownerId === currentUserId
  )

  function handleRestore(documentId: string) {
    set("request:documentrestore:colab", {
      documentId,
      roomId: room.id,
      token: toklue,
    })
  }

  function handlePermanentDelete(documentId: string) {
    set("request:documentpermdelete:colab", {
      documentId,
      roomId: room.id,
      token: toklue,
    })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="sticky bottom-0 w-full border-t border-white/5 bg-[#0A0B0E] px-3 py-2.5 flex items-center gap-2 cursor-pointer group">
          <Trash2 size={13} className="text-zinc-600 group-hover:text-red-400 transition-colors" />
          <span className="text-xs text-zinc-600 group-hover:text-zinc-300 transition-colors">
            Trash bin
          </span>
          {trashedDocs.length > 0 && (
            <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/20">
              {trashedDocs.length}
            </span>
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent
        side="right"
        align="end"
        className="w-72 p-0 bg-[#0F1117] border border-white/10 shadow-2xl shadow-black/60 rounded-xl overflow-hidden"
      >
        {/* header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
          <Trash2 size={13} className="text-red-400" />
          <span className="text-sm font-bold text-zinc-200">Trash bin</span>
          {trashedDocs.length > 0 && (
            <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/20">
              {trashedDocs.length}
            </span>
          )}
        </div>

        {/* list */}
        {trashedDocs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 px-4 gap-2">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center">
              <Trash2 size={16} className="text-zinc-600" />
            </div>
            <p className="text-xs text-zinc-600 text-center leading-relaxed">
              No trashed documents — deleted docs will appear here
            </p>
          </div>
        ) : (
          <div className="flex flex-col max-h-64 overflow-y-auto">
            {trashedDocs.map((doc: IDocument) => (
              <div
                key={doc.id}
                className="flex items-center gap-3 px-4 py-2.5 border-b border-white/5 last:border-b-0 hover:bg-white/5 transition-colors group/row"
              >
                {/* icon */}
                <span className="text-zinc-600 flex-shrink-0">
                  {doc.type === "canvas"
                    ? <LayoutGrid size={13} />
                    : <FileText size={13} />
                  }
                </span>

                {/* title + date */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-zinc-300 truncate">{doc.title}</p>
                </div>

                {/* actions — show on hover */}
                <div className="flex items-center gap-1 opacity-0 group-hover/row:opacity-100 transition-opacity flex-shrink-0">
                  <button
                    onClick={() => set("request:documentrestore:colab",{documentId:doc.id,roomId:room.id,token:toklue})}
                    title="Restore"
                    className="w-6 h-6 rounded-md flex items-center justify-center bg-white/5 hover:bg-emerald-500/15 hover:text-emerald-400 text-zinc-500 transition-colors"
                  >
                    <RotateCcw size={11} />
                  </button>
                  <button
                    onClick={() => set("request:documentpermdel:colab",{documentId:doc.id,roomId:room.id,token:toklue})}
                    title="Delete permanently"
                    className="w-6 h-6 rounded-md flex items-center justify-center bg-white/5 hover:bg-red-500/15 hover:text-red-400 text-zinc-500 transition-colors"
                  >
                    <X size={11} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* footer — only show if there are trashed docs */}
        {trashedDocs.length > 0 && (
          <div className="px-4 py-2.5 border-t border-white/5 bg-[#0A0B0E]">
            <p className="text-[10.5px] text-zinc-600 leading-relaxed">
              Documents are permanently deleted after 30 days
            </p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}