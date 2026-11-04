"use client"
import { useRouter } from "next/navigation"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Drawer, DrawerTrigger, DrawerHeader, DrawerTitle, DrawerDescription, DrawerContent, DrawerFooter, DrawerClose } from "@/components/ui/drawer"
import { Terminal, SquareTerminal, Play, X, GitBranch, History } from "lucide-react"
import Editor from "@monaco-editor/react"
import { useRef, useState, useEffect } from "react"
import type { editor } from "monaco-editor"
import { Drawervalue } from "@/components/store"

export default function CompilerEditor() {
  const router = useRouter()
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null)
  const setOptimizerResult = Drawervalue(v => v.setOptimizerResult)
  const optimizerResult = Drawervalue(v => v.optimizerResult)

  const [loading, setLoading] = useState(false)
  const [compileOutput, setCompileOutput] = useState("")
  const [history, setHistory] = useState<any[]>([])
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  useEffect(() => {
    if (isHistoryOpen) {
      fetchHistory()
    }
  }, [isHistoryOpen])

  async function fetchHistory() {
    try {
      const res = await fetch("http://localhost:8000/history", { cache: "no-store" })
      setHistory(await res.json())
    } catch {
      console.error("could not fetch history")
    }
  }

  async function handleOptimize() {
    const code = editorRef.current?.getValue()
    if (!code) return
    setLoading(true)
    setCompileOutput("")
    try {
      const res = await fetch("http://localhost:8000/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })
      const data = await res.json()
      setCompileOutput(data.normal_output?.stdout || data.normal_output?.stderr || "no output")
      setOptimizerResult(data)
    } catch {
      setCompileOutput("could not reach backend — is uvicorn running?")
    }
    setLoading(false)
  }

  function handlenavigate() {
    const code = editorRef.current?.getValue()
    if (code && !optimizerResult) {
      handleOptimize().then(() => router.push("/editor"))
      return
    }
    router.push("/editor")
  }

  return (
    <ScrollArea className="min-h-screen w-full bg-black">
      <div className="h-[70px] w-full flex items-center justify-start px-8 gap-4">
        <Terminal size={28} color="white"/>
        <div className="text-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-white drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]">
          Optimizer
        </div>
        <div className="flex-1" />
        <Button variant="default" className="text-white" onClick={handleOptimize} disabled={loading}>
          {loading ? <Spinner /> : <Play size={17} color="white"/>}
          {loading ? "Optimizing..." : "Optimize"}
        </Button>
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="default" className="text-white">
              <SquareTerminal size={17} color="white"/>
              Output
            </Button>
          </DrawerTrigger>
          <DrawerContent className="bg-zinc-900">
            <DrawerHeader className="w-full items-start">
              <DrawerTitle className="w-full flex items-center justify-start gap-3 text-lg font-semibold text-white">
                <SquareTerminal size={24} color="white"/>
                <span className="italic text-gray-300">Compilation Output</span>
              </DrawerTitle>
              <DrawerDescription className="text-sm text-zinc-400">stdout and stderr from g++ compilation and execution</DrawerDescription>
            </DrawerHeader>
            <pre className="mx-6 mb-4 p-4 rounded bg-black text-green-400 text-sm font-mono min-h-[200px] max-h-[400px] overflow-auto whitespace-pre-wrap">
              {compileOutput || "click Optimize to see output"}
            </pre>
            <DrawerFooter className="w-full flex items-start justify-start">
              <DrawerClose asChild>
                <Button variant="default">
                  <X size={17} color="white"/>
                  Close
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
        <Button variant="default" className="text-white" onClick={() => setIsHistoryOpen(true)}>
          <History size={17} color="white"/>
          History
        </Button>
        {isHistoryOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 sm:p-6">
            <div className="bg-zinc-900 w-full max-w-4xl max-h-[85vh] flex flex-col rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
              <div className="flex-none p-6 pb-4">
                <div className="flex items-center justify-start gap-3 mb-2">
                  <History size={24} color="white"/>
                  <h2 className="text-lg font-semibold text-white italic">Execution History</h2>
                </div>
                <p className="text-sm text-zinc-400">Past executions and their outputs</p>
              </div>
              <div className="flex-1 overflow-y-auto px-6 pb-2 min-h-0">
                <pre className="p-4 rounded bg-black text-sm font-mono whitespace-pre-wrap h-full">
                  {history.length === 0
                    ? <span className="text-zinc-500">No history found.</span>
                    : history.map((run, i) => (
                        <span key={run.id}>
                          <span className="text-zinc-500">--- run {run.id} ---</span>{"\n"}
                          <span className="text-zinc-300">{run.code}</span>{"\n"}
                          <span className="text-green-400">{run.output || "(no output)"}</span>
                          {i < history.length - 1 && "\n\n"}
                        </span>
                      ))
                  }
                </pre>
              </div>
              <div className="flex-none p-6 pt-4">
                <Button variant="default" onClick={() => setIsHistoryOpen(false)}>
                  <X size={17} color="white"/>
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
        <Button variant="default" className="text-white" onClick={(e) => { e.stopPropagation(); handlenavigate() }}>
          <GitBranch size={17} color="white"/>
          Dep Graph
        </Button>
      </div>
      <Separator/>
      <Editor
        height="60vh"
        defaultLanguage="cpp"
        theme="vs-dark"
        onMount={(ed) => { editorRef.current = ed }}
        defaultValue={`#include <stdio.h>

int main() {
    int shyam, ram, hello;
    int a = 5 + 3;
    int b = 10 + 20;
    shyam = 5;
    ram = 3;
    hello = shyam + ram;
    int c = a + b;
    return 0;
}
`}
        options={{
          fontSize: 15,
          minimap: { enabled: false },
          wordWrap: "on",
          automaticLayout: true,
          smoothScrolling: true,
          cursorBlinking: "smooth",
          scrollBeyondLastLine: false,
          lineNumbers: "on",
          tabSize: 4,
        }}
      />

      {optimizerResult && (
        <div className="p-6 text-white">
          <Separator />
          <div className="text-lg font-semibold mt-4 mb-3 text-purple-300">Optimizer Analysis</div>

          <div className="mb-4">
            <div className="text-sm text-zinc-400 mb-1">IR Representation</div>
            <pre className="bg-zinc-900 p-3 rounded text-green-400 text-sm font-mono">
              {optimizerResult.ir.join("\n")}
            </pre>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-sm text-zinc-400 mb-1">Execution Batches</div>
              <pre className="bg-zinc-900 p-3 rounded text-sm font-mono">
                {optimizerResult.batches.map((b: number[], i: number) =>
                  `batch ${i}: [${optimizerResult.ir.filter((_: string, idx: number) => b.includes(idx)).join(", ")}]`
                ).join("\n")}
              </pre>
            </div>
            <div>
              <div className="text-sm text-zinc-400 mb-1">Performance</div>
              <div className="bg-zinc-900 p-3 rounded text-sm font-mono space-y-1">
                <div>sequential: {optimizerResult.sequential.time.toFixed(4)}s</div>
                <div>parallel:&nbsp;&nbsp; {optimizerResult.parallel.time.toFixed(4)}s</div>
                <div className="text-green-400 font-bold mt-1">
                  speedup: {(optimizerResult.sequential.time / optimizerResult.parallel.time).toFixed(2)}x
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="text-sm text-zinc-400 mb-1">Computed Values</div>
            <pre className="bg-zinc-900 p-3 rounded text-sm font-mono">
              {Object.entries(optimizerResult.sequential.results).map(([k, v]) => `${k} = ${v}`).join("\n")}
            </pre>
          </div>
        </div>
      )}
    </ScrollArea>
  )
}
