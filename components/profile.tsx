"use client"
import { Dialog } from "./ui/dialog"
import { DialogTrigger } from "./ui/dialog"
import { DialogHeader } from "./ui/dialog"
import { DialogTitle } from "./ui/dialog"
import { DialogDescription } from "./ui/dialog"
import { DialogContent } from "./ui/dialog"
import { Button } from "./ui/button"
import { InputGroup } from "./ui/input-group"
import { InputGroupInput } from "./ui/input-group"
import { InputGroupAddon } from "./ui/input-group"
import { InputGroupButton } from "./ui/input-group"
import { Field } from "./ui/field"
import { FieldLabel } from "./ui/field"
import { Textarea } from "./ui/textarea"
import { Badge } from "./ui/badge"
import { Spinner } from "./ui/spinner"
import { User } from "lucide-react"
import { UserPen } from "lucide-react"
import { AlertCircle } from "lucide-react"
import { Check } from "lucide-react"
import { Profile as Prfle} from "./store"
import { UsercurrentId } from "./store"
import { Toklue } from "./store"
import Changename from "@/actions/changename"
import Changedescription from "@/actions/changedescription"
import toast from "react-hot-toast"
import { set } from "@/socketserver/clientsidesocket"
export default function Profile(){
    const name=Prfle(s=>s.name)
    const description=Prfle(s=>s.description)
    const setname=Prfle(s=>s.setname)
    const setdescription=Prfle(s=>s.setdescription)
    const isnamechanging=Prfle(s=>s.ischangingname)
    const isdescriptionchanging=Prfle(s=>s.ischangingdescription)
    const setisnamechanging=Prfle(s=>s.setisnamechanging)
    const setisdescriptionchanging=Prfle(s=>s.setisdescriptionchanging)
    const isnamechangedmessage=Prfle(s=>s.isnamechangedmessage)
    const isdescriptionchangedmessage=Prfle(s=>s.isdescriptionchangedmessage)
    const setisnamechangedmessage=Prfle(s=>s.setisnamechangedmessage)
    const setisdescriptionchangedmessage=Prfle(s=>s.setisdescriptionchangedmessage)
    const usercurrentid=UsercurrentId(s=>s.name)
    const toklue=Toklue(s=>s.name)
    function handlename(value:string){
       setisdescriptionchangedmessage("")
       setname(value)
    }
    function handledescription(value:string){
       setisnamechangedmessage("")
       setdescription(value)
    }
    async function handlechangename(){
        if(name.length>0){
        setisnamechanging(true)
        const response=await Changename(usercurrentid,name)
        setisnamechangedmessage(response)
        setisnamechanging(false)
        if(response==="Name changed successfully"){
            set("request:namechange:onetooneconversation",{token:toklue,name:name})
        }
        }
        else{
            toast.error("Enter name")
        }
    }
    async function handlechangedescription(){
        if(description.length>0){
            setisdescriptionchanging(true)
            const response=await Changedescription(usercurrentid,description)
            setisdescriptionchangedmessage(response)
            setisdescriptionchanging(false)
            if(response==="Description changed successfully"){
                set("request:descriptionchange:onetooneconversation",{token:toklue,description:description})
            }
        }
        else{
            toast.error("Enter description")
        }
    }
    return(
        <Dialog>
            <DialogTrigger asChild>
                <div className="w-full h-[53px] flex items-center justify-start px-2 space-x-6 rounded-[30px] bg-white shadow-[0px_0px_11px_2px_rgb(0,0,0,0.1)] transition-all duration-200 hover:bg-white/5 hover:scale-[1.02] hover:cursor-pointer">
                    <User size={28} color="black"/>
                    <span className="text-md">Profile</span>
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-start">
                        <span>Profile Settings</span>
                        {isnamechangedmessage||isdescriptionchangedmessage?<Badge variant={"outline"} className={`text-black space-x-2 ml-auto mr-11 bg-red-600 hover:shadow-[0_0px_5px_2px_rgb(0,0,0,0.2)] ${isnamechangedmessage||isdescriptionchangedmessage?isnamechangedmessage?isnamechangedmessage==="Name changed successfully"?"bg-green-600":"bg-red-600":isdescriptionchangedmessage==="Description changed successfully"?"bg-green-600":"bg-red-600":""}`}>{isnamechangedmessage?isnamechangedmessage==="Name changed successfully"?<Check size={11} color="black"/>:<AlertCircle size={11} color="black"/>:isdescriptionchangedmessage==="Description changed succesfully"?<Check size={11} color="black"/>:<AlertCircle size={11} color="black"/>}{isnamechangedmessage?`${isnamechangedmessage}`:isdescriptionchangedmessage?`${isdescriptionchangedmessage}`:""}</Badge>:<></>}
                        </DialogTitle>
                    <DialogDescription>Some settings for profile</DialogDescription>
                </DialogHeader>
                <div className="flex-1 flex flex-col items-center py-2 px-6 space-y-6">
                    <Field orientation={"horizontal"}>
                    <FieldLabel htmlFor="Name">Name:</FieldLabel>
                    <InputGroup id="Name">
                    <InputGroupInput value={name} placeholder="Enter new Name..." onChange={(e)=>{e.stopPropagation();handlename(e.target.value)}}/>
                    <InputGroupAddon align="inline-end">
                    <InputGroupButton variant={"outline"} className="text-black hover:cursor-pointer" disabled={isnamechanging} onClick={(e)=>{e.stopPropagation();handlechangename()}}>{isnamechanging?<Spinner/>:""}Change</InputGroupButton>
                    </InputGroupAddon>
                    <InputGroupAddon align="inline-start"><UserPen size={28} color="black"/></InputGroupAddon>
                    </InputGroup>
                </Field>
                <Field orientation={"vertical"}>
                    <FieldLabel htmlFor="Description" className="w-full flex items-center justify-start">
                        <span>Description:</span>
                        <Button variant={"outline"} size={"sm"} disabled={isdescriptionchanging} className="text-black ml-auto hover:cursor-pointer" onClick={(e)=>{e.stopPropagation();handlechangedescription()}}>{isdescriptionchanging?<Spinner/>:""}Change</Button>
                    </FieldLabel>
                    <Textarea id="Description" value={description} placeholder="Enter Description..." onChange={(e)=>{e.stopPropagation();handledescription(e.target.value)}}></Textarea>
                </Field>
                </div>
                </DialogContent>
        </Dialog>
    )
}