import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from "react"
import { AnimatePresence, Variants } from "framer-motion"
import { formatDistanceToNow } from "date-fns"
import {
  Lock,
  LockOpen,
  Clock,
  FilePlus,
  Copy,
  Trash2,
  UserPlus,
  UserMinus,
  UserCog,
  Pencil,
  Settings,
  ArrowUpRight,
} from "lucide-react"
import { motion } from "framer-motion"
import { activity } from "@/types/collab"
function getActivityMeta(item: activity) {
    switch (item.type) {
      case "document:edit-started":
        return { icon: Lock, color: "text-emerald-400 bg-emerald-500/10", text: `locked "${item.documentName ?? "a document"}"` }
      case "document:edit-finished":
        return { icon: LockOpen, color: "text-zinc-400 bg-white/5", text: `released the lock on "${item.documentName ?? "a document"}"` }
      case "document:locked":
        return { icon: Lock, color: "text-emerald-400 bg-emerald-500/10", text: `locked "${item.documentName ?? "a document"}"` }
      case "document:unlocked":
        return { icon: LockOpen, color: "text-zinc-400 bg-white/5", text: `unlocked "${item.documentName ?? "a document"}"` }
      case "document:lock-timeout":
        return { icon: Clock, color: "text-amber-400 bg-amber-500/10", text: `lock on "${item.documentName ?? "a document"}" timed out` }
      case "document:created":
        return { icon: FilePlus, color: "text-violet-400 bg-violet-500/10", text: `created "${item.documentName ?? "a document"}"` }
      case "document:cloned":
        return { icon: Copy, color: "text-violet-400 bg-violet-500/10", text: `cloned "${item.documentName ?? "a document"}"` }
      case "document:deleted":
        return { icon: Trash2, color: "text-red-400 bg-red-500/10", text: `deleted "${item.documentName ?? "a document"}"` }
      case "document:edited":
        return { icon: Pencil, color: "text-violet-400 bg-violet-500/10", text: `edited "${item.documentName ?? "a document"}"` }
      case "member:joined":
        return { icon: UserPlus, color: "text-emerald-400 bg-emerald-500/10", text: "joined the room" }
      case "member:join-requested":
        return { icon: UserCog, color: "text-amber-400 bg-amber-500/10", text: "requested to join the room" }
      case "member:left":
        return { icon: UserMinus, color: "text-zinc-400 bg-white/5", text: "left the room" }
      case "room:renamed":
        return { icon: Pencil, color: "text-violet-400 bg-violet-500/10", text: "renamed the room" }
      case "room:details":
        return { icon: Settings, color: "text-violet-400 bg-violet-500/10", text: "updated room details" }
      default:
        return { icon: Clock, color: "text-zinc-400 bg-white/5", text: "did something" }
    }
  }
// ── shared row renderer, used by both the preview list and the full sheet ──
function ActivityRow({ item, isLast }: { item: activity; isLast: boolean }) {
  const { icon: Icon, color, text } = getActivityMeta(item)
  return (
    <div
      className={`flex items-start gap-3 py-2.5 ${
        !isLast ? "border-b border-white/[0.05]" : ""
      }`}
    >
      <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md ${color}`}>
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] leading-snug text-zinc-200">
          <span className="font-semibold text-zinc-100">{item.actorName}</span>{" "}
          <span className="text-zinc-400">{text}</span>
        </p>
        <p className="mt-0.5 text-[11px] text-zinc-600">
          {formatDistanceToNow(new Date(item.activityAt), { addSuffix: true })}
        </p>
      </div>
    </div>
  )
}

// ── usage ────────────────────────────────────────────────────────────────
export default function ActivityFeed({ activitylist }: { activitylist: activity[] }) {
  const [isAllActivityOpen, setIsAllActivityOpen] = useState(false)

  const sorted = [...activitylist].sort(
    (a, b) => new Date(b.activityAt).getTime() - new Date(a.activityAt).getTime()
  )
  const preview = sorted.slice(0, 6)
  const topbarvariants:Variants={initial:{y:-500,x:0,opacity:0},appear:{y:0,x:0,opacity:1,transition:{type:"spring",stiffness:50,damping:10,duration:1,staggerChildren:0.3,delayChildren:0.3}}}
  const topbarchilvariants:Variants={initial:{x:-40,y:0,opacity:0},appear:{y:0,x:0,opacity:1,transition:{type:"spring",damping:20,stiffness:100,duration:0.8}}}
  return (
    <motion.div variants={topbarvariants}>
      {preview.length ? (
        preview.map((item, i, arr) => (
          <AnimatePresence>
            <motion.div variants={topbarchilvariants}>
            <ActivityRow key={item.id} item={item} isLast={i === arr.length - 1} />
            </motion.div>
          </AnimatePresence>
        ))
      ) : (
        <motion.div variants={topbarchilvariants} className="flex min-h-[200px] items-center justify-center text-sm text-zinc-600">
          No activity
        </motion.div>
      )}

      

      <Sheet open={isAllActivityOpen} onOpenChange={setIsAllActivityOpen}>
        {sorted.length > 0 && (
        <SheetTrigger>
          <motion.div variants={topbarchilvariants}>
            <button
          onClick={() => setIsAllActivityOpen(true)}
          className="mt-3 flex items-center gap-1 text-[11.5px] font-medium text-zinc-600 transition-colors hover:text-[#4C82FB]"
        >
          View all activity <ArrowUpRight size={11} />
        </button>
        </motion.div>
        </SheetTrigger>
        )}
        <SheetContent
          side="right"
          className="w-full sm:max-w-md bg-[#0B0D14] border-white/10 text-zinc-100 p-0"
        >
          <SheetHeader className="border-b border-white/[0.05] px-5 py-4">
            <SheetTitle className="text-sm font-bold text-zinc-100">
              All activity
              <motion.span variants={topbarchilvariants} className="ml-2 text-xs font-normal text-zinc-600">
                {sorted.length} events
              </motion.span>
            </SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-[calc(100vh-64px)] px-5">
            <motion.div variants={topbarvariants} className="py-2">
              {sorted.length ? (
                sorted.map((item, i, arr) => (
                  <AnimatePresence>
                    <motion.div variants={topbarchilvariants}>
                      <ActivityRow key={item.id} item={item} isLast={i === arr.length - 1}/>
                    </motion.div>
                  </AnimatePresence>
                ))
              ) : (
                <motion.div variants={topbarchilvariants} className="flex min-h-[200px] items-center justify-center text-sm text-zinc-600">
                  No activity
                </motion.div>
              )}
            </motion.div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </motion.div>
  )
}