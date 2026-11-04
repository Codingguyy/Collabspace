"use client"

import { type Editor } from "@tiptap/react"
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
} from "lucide-react"

function ToolbarButton({
  onClick,
  active,
  disabled,
  children,
  label,
}: {
  onClick: () => void
  active?: boolean
  disabled?: boolean
  children: React.ReactNode
  label: string
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onMouseDown={(e) => {
        // prevent the editor from losing focus/selection before the command runs
        e.preventDefault()
        onClick()
      }}
      className={`h-7 w-7 flex items-center justify-center rounded-md text-zinc-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 hover:text-zinc-100 ${
        active ? "bg-[#4C82FB]/20 text-[#4C82FB]" : ""
      }`}
    >
      {children}
    </button>
  )
}

export default function EditorToolbar({
  editor,
  disabled,
}: {
  editor: Editor | null
  disabled?: boolean
}) {
  if (!editor) return null

  return (
    <div
      className={`flex items-center gap-0.5 px-4 py-1.5 border-b border-white/[0.06] bg-[#0A0B0E] ${
        disabled ? "pointer-events-none opacity-40" : ""
      }`}
    >
      <ToolbarButton
        label="Bold"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold size={14} />
      </ToolbarButton>
      <ToolbarButton
        label="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic size={14} />
      </ToolbarButton>
      <ToolbarButton
        label="Strikethrough"
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough size={14} />
      </ToolbarButton>
      <ToolbarButton
        label="Inline code"
        active={editor.isActive("code")}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <Code size={14} />
      </ToolbarButton>

      <span className="w-px h-4 bg-white/10 mx-1.5" />

      <ToolbarButton
        label="Heading 1"
        active={editor.isActive("heading", { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        <Heading1 size={14} />
      </ToolbarButton>
      <ToolbarButton
        label="Heading 2"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 size={14} />
      </ToolbarButton>
      <ToolbarButton
        label="Heading 3"
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 size={14} />
      </ToolbarButton>

      <span className="w-px h-4 bg-white/10 mx-1.5" />

      <ToolbarButton
        label="Bullet list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List size={14} />
      </ToolbarButton>
      <ToolbarButton
        label="Numbered list"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered size={14} />
      </ToolbarButton>
      <ToolbarButton
        label="Quote"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote size={14} />
      </ToolbarButton>

      <span className="w-px h-4 bg-white/10 mx-1.5" />

      <ToolbarButton
        label="Undo"
        disabled={!editor.can().undo()}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Undo size={14} />
      </ToolbarButton>
      <ToolbarButton
        label="Redo"
        disabled={!editor.can().redo()}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <Redo size={14} />
      </ToolbarButton>
    </div>
  )
}
