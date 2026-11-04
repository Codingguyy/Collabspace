"use client"
import { useRef } from "react"
import { useEffect } from "react"
import {useState} from 'react'
import { useParams } from "next/navigation"
import {motion} from 'framer-motion'
import Searchuserexistuser from "./searchuserexistuser"
import Colabuserroomlist from "./colabuserroomlist"
import Colabrequestcomponent from './colabrequestcomponent'
import { set } from "@/socketserver/clientsidesocket"
import { Input } from "@/components/ui/input"
import { InputGroup } from "@/components/ui/input-group"
import { InputGroupInput } from "@/components/ui/input-group"
import { InputGroupAddon } from "@/components/ui/input-group"
import { InputGroupButton } from "@/components/ui/input-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "./ui/separator"
import { Tabs } from "./ui/tabs"
import { TabsList } from "./ui/tabs"
import { TabsTrigger } from "./ui/tabs"
import { TabsContent } from "./ui/tabs"
import { Switch } from "./ui/switch"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Spinner } from "./ui/spinner"
import { Dialog } from "./ui/dialog"
import { DialogHeader } from "./ui/dialog"
import { DialogTitle } from "./ui/dialog"
import { DialogDescription } from "./ui/dialog"
import { DialogContent } from "./ui/dialog"
import { DialogTrigger } from "./ui/dialog"
import {DialogFooter} from './ui/dialog'
import { DialogClose } from "./ui/dialog"
import { Field } from "./ui/field"
import { FieldLabel } from "./ui/field"
import { FieldContent } from "./ui/field"
import {Label} from './ui/label'
import { Searchname } from "./store"
import { Toklue } from "./store"
import { Searchvalue } from "./store"
import { Colabloading } from "./store"
import { Onetooneconversationsendrequest } from "./store"
import { Userexistlistt } from "./store"
import { Switchvalue } from "./store"
import { Colabroomvalue } from "./store"
import { Colabsearchroomlist } from "./store"
import { Topbarvalue } from "./store"
import { Colabsearchuserlist } from "./store"
import { Search } from "lucide-react"
import { Plus } from "lucide-react"
import {KeyRound} from 'lucide-react'
import { onetoonerequest } from "@/types/request"
import { Variants } from "framer-motion"
import toast from "react-hot-toast"
function JoinRoomDialog({
  onJoinRoom,
  trigger,
}: {
  onJoinRoom?: (code?: string) => void
  trigger: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [code, setCode] = useState("")
  const submit = () => {
    onJoinRoom?.(code.trim() || undefined)
    setCode("")
    setOpen(false)
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="border-white/10 bg-[#101217] text-zinc-100">
        <DialogHeader>
          <DialogTitle className="text-[15px] text-zinc-100">Join with code</DialogTitle>
          <DialogDescription className="text-[13px] text-zinc-500">
            Enter the code your teammate shared with you.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-1.5 py-1">
          <Label htmlFor="room-code" className="text-[12px] text-zinc-500">Room code</Label>
          <Input
            id="room-code"
            autoFocus
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="XJ4K-9Q2P"
            className="border-white/10 bg-white/[0.03] font-mono text-[13.5px] tracking-widest text-[#F2A93B] placeholder:text-zinc-600 focus-visible:ring-[#4C82FB]/50"
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="outline" onClick={submit}><KeyRound size={14} />Join room</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function Chatdashboard(){
    const params=useParams()
    const timeoutref=useRef<ReturnType<typeof setTimeout>|null>(null)
    const loadingresetref=useRef<ReturnType<typeof setTimeout>|null>(null)
    const loadingref=useRef<boolean>(false)
    const name=Searchname(s=>s.name)
    const setname=Searchname(s=>s.setname)
    const token=Toklue(s=>s.name)
    const chatid=params.id
    const setonetooneconversationsendrequest=Onetooneconversationsendrequest(s=>s.setrequests)
    const searchvalue=Searchvalue(s=>s.value)
    const setsearchvalue=Searchvalue(s=>s.setvlue)
    const userexistlist=Userexistlistt(s=>s.users)
    const switchvalue=Switchvalue(s=>s.value)
    const setswitchvalue=Switchvalue(s=>s.setvlue)
    const colabloading=Colabloading(s=>s.value)
    const setcolabloading=Colabloading(s=>s.setvlue)
    const roomname=Colabroomvalue(s=>s.email)
    const roomdescription=Colabroomvalue(s=>s.password)
    const setroomname=Colabroomvalue(s=>s.setemail)
    const setroomdescription=Colabroomvalue(s=>s.setpassword)
    const searchroomlist=Colabsearchroomlist(s=>s.rooms)
    const searchuserlist=Colabsearchuserlist(s=>s.users)
    const variants:Variants={
        open:{x:0,y:0,opacity:1,transition:{type:"spring",stiffness:60,damping:10}},
        close:{opacity:0,y:-100}
    }

    const mainvariants:Variants={
        close:{
            width:46,
            height:46,
            borderRadius:9999,
            padding:0,
            boxShadow:
                "0 0 0 1px rgba(255,255,255,0.35), " +
                "0 0 16px 3px rgba(255,255,255,0.25), " +
                "0 0 32px 8px rgba(76,130,251,0.55), " +
                "0 0 60px 18px rgba(76,130,251,0.25)",
            transition:{
                width:{type:"spring",stiffness:140,damping:26},
                height:{type:"spring",stiffness:140,damping:26},
                borderRadius:{duration:0.25},
                boxShadow:{duration:0.5,ease:"easeOut"},
                staggerChildren:0.1
            },
        },
        open:{
            width:"calc(100vw - 24px)",
            height:73,
            borderRadius:20,
            padding:8,
            boxShadow:"0 0 0 0 rgba(76,130,251,0)",
            transition:{
                width:{type:"spring",stiffness:55,damping:13},
                height:{type:"spring",stiffness:55,damping:13},
                borderRadius:{duration:0.3},
                boxShadow:{duration:0.25,ease:"easeIn"},
                staggerChildren:0.5,
                delayChildren:0.5
            },
        },
    }
    const mainchilvariants:Variants={open:{y:0,x:0,opacity:1,transition:{type:"spring",stiffness:50,damping:10,duration:0.5}},close:{y:-100,x:0,opacity:0,transition:{type:"tween",ease:"easeOut",duration:0.5}}}
    const topbarvalue=Topbarvalue(s=>s.value)
    const settopbarvalue=Topbarvalue(s=>s.setvlue)

    function handlename(value:string){
        setname(value)
        if(timeoutref.current){
            clearTimeout(timeoutref.current)
        }
        if(value.trim().length>0){
            setsearchvalue(true)
        timeoutref.current=setTimeout(()=>{
            handlesearch()
            console.log("trigger")
        },1000)
    }
    else{
        setcolabloading(false)
        setsearchvalue(false)
    }
    }
    function handlesearch(){
        setcolabloading(true)
        console.log("clicked")
        if(switchvalue){
            console.log("search request send")
            set("request:rooms:search",{token:token,search:name})
        }
        else{
            console.log("user search")
        set("request:users:search",{token:token,search:name})
        }
        if(loadingresetref.current){
            clearTimeout(loadingresetref.current)
        }
        loadingresetref.current=setTimeout(()=>{
            setcolabloading(false)
        },3000)
    }
    function handlecreateroom(){
        if(roomname&&roomdescription){
            set("request:createroom:colab",{name:roomname,description:roomdescription,token:token,unique_Id:crypto.randomUUID()})
        }
        else{
            toast.error("Enter name and description first")
        }
    }
    function onJoinRoom(){

    }
    useEffect(()=>{
      set("request:existusers",{token:token})
    },[userexistlist])
    useEffect(()=>{
        if(loadingref){
            setcolabloading(false)
        }
    },[searchroomlist,searchuserlist])

    /* topbarvalue === true  -> expanded bar
       topbarvalue === false -> collapsed glowing circle

       overflow is now conditional: hidden only while collapsed
       (that's when the circle shape needs clipping), visible while
       expanded so the results dropdown below the input isn't cut off. */
       console.log(searchroomlist,searchuserlist)
    return(
        <motion.div
            variants={mainvariants}
            initial="open"
            animate={topbarvalue?"open":"close"}
            className={`fixed left-3 top-3 z-[1000] flex items-center border border-white/[0.06] bg-[#0A0B0E]/95 backdrop-blur-xl ${
                topbarvalue ? "justify-start overflow-visible" : "justify-center overflow-hidden"
            }`}
        >
            {topbarvalue?
            <>
                <motion.div variants={mainchilvariants} initial={{y:-100,x:0,opacity:0}}
                    className="ml-1 flex h-[47px] w-[47px] flex-shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-lg text-zinc-400 transition-colors hover:border-[#4C82FB]/40 hover:bg-[#4C82FB]/10 hover:text-[#4C82FB]"
                    onClick={(e)=>{e.stopPropagation();settopbarvalue(!topbarvalue)}}
                >
                    ⋈
                </motion.div>
                <motion.div variants={mainchilvariants} initial={{y:-100,x:0,opacity:0}}>
                    <InputGroup className="relative ml-3 w-[389px] flex-shrink-0 rounded-lg border border-white/10 bg-white/[0.04] backdrop-blur-xl">
                    <InputGroupInput
                        value={name}
                        placeholder="Search users here"
                        className="z-[11] bg-transparent text-[13.5px] text-zinc-100 placeholder:text-zinc-600"
                        onChange={(e)=>{e.stopPropagation();handlename(e.target.value)}}
                        style={{fontFamily:"'Roboto-mono',monospace"}}
                    />
                    <InputGroupAddon align={"inline-start"}>
                        <Search size={16} className="text-zinc-500"/>
                    </InputGroupAddon>
                    <InputGroupAddon align={"inline-end"}>
                        <InputGroupButton variant={"outline"} className="border-white/10 bg-white/[0.04] text-zinc-300 sm:hidden">
                            <Search size={16} className="text-zinc-300"/>
                        </InputGroupButton>
                    </InputGroupAddon>
                    {searchvalue?
                        <motion.div
                            variants={variants}
                            initial="close"
                            animate={searchvalue?"open":"close"}
                            className="no-scrollbar absolute top-[112%] z-[1010] flex h-[389px] w-[389px] flex-col items-start justify-start overflow-y-auto rounded-lg border border-white/10 bg-[#101217]/95 p-2 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)] backdrop-blur-2xl"
                        >
                            {colabloading?
                                <div className="mt-8 flex w-full items-center justify-start px-2">
                                    <span className="text-[12.5px] text-zinc-500">loading</span>
                                    <Spinner className="ml-2 text-[#4C82FB]"/>
                                </div>
                            :
                                <span className="px-2 py-1 text-[11px] font-medium uppercase tracking-wider text-zinc-600">
                                    {switchvalue
                                        ? `${searchroomlist?.length ?? 0} rooms found`
                                        : `${userexistlist?.length ?? 0} users found`}
                                </span>
                            }
                            <Colabuserroomlist/>
                        </motion.div>
                    :<></>}
                </InputGroup>
                </motion.div>
                <motion.div variants={mainchilvariants} initial={{y:-100,x:0,opacity:0}}className="z-[12] flex items-center justify-center gap-2 rounded-md p-2 shadow-lg backdrop-blur-xl">
                        <span className="flex w-[107px] items-center justify-center text-[11px] text-zinc-400">
                            {switchvalue?"Room Search":"Single Search"}
                        </span>
                        <Switch
                            checked={switchvalue}
                            onCheckedChange={(value)=>{setswitchvalue(value)}}
                            className="data-[state=checked]:bg-[#4C82FB]"
                        />
                    </motion.div>
                    <Dialog>
                    <DialogTrigger asChild>
                        <motion.div variants={mainchilvariants} initial={{y:-500,x:0,opacity:0}} className="ml-auto mr-3">
                            <Button variant={"default"} className="ml-auto mr-3 flex-shrink-0 gap-1.5 bg-[#4C82FB] text-[13px] text-white hover:bg-[#3E71E8]">
                            <Plus size={13}/>Create new Room
                            </Button>
                        </motion.div>
                    </DialogTrigger>
                    <DialogContent className="border-white/10 bg-[#101217]/95 text-zinc-100 shadow-2xl backdrop-blur-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-[16px] font-semibold text-zinc-100">Create Room</DialogTitle>
                            <DialogDescription className="text-[13px] text-zinc-500">Enter necessary details to create room</DialogDescription>
                        </DialogHeader>
                        <Separator className="bg-white/10"/>
                        <Field orientation={"horizontal"}>
                            <FieldLabel htmlFor="name" className="text-[13px] text-zinc-400">Name:-</FieldLabel>
                            <Input
                                value={roomname}
                                placeholder="Enter Room name..."
                                className="border-white/10 bg-white/[0.04] text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-[#4C82FB]/50"
                                onChange={(e)=>{e.stopPropagation();setroomname(e.target.value)}}
                            />
                        </Field>
                        <Field orientation={"horizontal"}>
                            <FieldLabel htmlFor="description" className="text-[13px] text-zinc-400">Description:-</FieldLabel>
                            <Input
                                value={roomdescription}
                                placeholder="Enter Description name..."
                                className="border-white/10 bg-white/[0.04] text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-[#4C82FB]/50"
                                onChange={(e)=>{e.stopPropagation();setroomdescription(e.target.value)}}
                            />
                        </Field>
                        <Separator className="bg-white/10"/>
                        <span className="flex items-center justify-start">
                            <Button
                                variant={"outline"}
                                className="gap-1.5 border-white/10 bg-[#4C82FB] text-white hover:bg-[#3E71E8]"
                                onClick={(e)=>{e.stopPropagation();handlecreateroom()}}
                            >
                                Create<Plus size={14}/>
                            </Button>
                            <DialogClose asChild>
                                <Button variant={"default"} className="ml-auto border border-white/10 bg-transparent text-zinc-300 hover:bg-white/[0.04]">
                                    Cancel
                                </Button>
                            </DialogClose>
                        </span>
                    </DialogContent>
                </Dialog>
                <JoinRoomDialog
                                        onJoinRoom={onJoinRoom}
                                        trigger={<motion.div variants={mainchilvariants} initial={{y:-100,x:0,opacity:0}}>
                                            <Button variant="secondary"><KeyRound size={14} />Join with code</Button>
                                            </motion.div>}
                                      />
            </>
            :
            <div
                className="flex h-[47px] w-[47px] flex-shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#4C82FB]/50 bg-[#4C82FB]/10 text-lg text-[#4C82FB] transition-colors hover:bg-[#4C82FB]/20"
                onClick={(e)=>{e.stopPropagation();settopbarvalue(!topbarvalue)}}
            >
                ⋈
            </div>
            }
        </motion.div>
    )
}