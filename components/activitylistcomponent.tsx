import { formatDistanceToNow } from "date-fns"
import { activity } from "@/types/collab"
import { Activitylist } from "./store"
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
} from "lucide-react"

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
export default async function Activitylistcomponent(){
  const activitylist=Activitylist(s=>s.activity)
  return(
<>{activitylist.length ? (
  activitylist.map((item, i) => {
    const { icon: Icon, color, text } = getActivityMeta(item)
    return (
      <div
        key={item.id}
        className={`flex items-start gap-3 py-2.5 ${
          i !== activitylist.length - 1 ? "border-b border-white/[0.05]" : ""
        }`}
      >
        <div
          className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md ${color}`}
        >
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
  })
) : (
  <div className="flex min-h-[200px] items-center justify-center text-sm text-zinc-600">
    No activity
  </div>
)}</>
  )
}