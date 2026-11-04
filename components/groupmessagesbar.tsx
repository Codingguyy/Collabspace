"use client"
import { useRef } from "react";
import { Button } from "./ui/button";
import { InputGroup } from "./ui/input-group";
import { InputGroupInput } from "./ui/input-group";
import { InputGroupAddon } from "./ui/input-group";
import { InputGroupButton } from "./ui/input-group";
import { Paperclip } from "lucide-react";
import { Send } from "lucide-react";
import { Mic } from "lucide-react";
import { AudioLines } from "lucide-react";
import { Groupmessagebar } from "./store";
import { Grouppicked } from "./store";
import { Toklue } from "./store";
import { Groupreplymessage } from "./store";
import { Editmessage } from "./store";
import { set } from "@/socketserver/clientsidesocket";
import toast from "react-hot-toast";
export default function Groupmessagesbar(){
   const message=Groupmessagebar(s=>s.name)
   const setmessage=Groupmessagebar(s=>s.setname)
   const group=Grouppicked(s=>s.group)
   const token=Toklue(s=>s.name)
   const replyglobalId=Groupreplymessage(s=>s.global_id)
   const replymessage=Groupreplymessage(s=>s.message)
   const setreplyglobalId=Groupreplymessage(s=>s.setglobal_id)
   const setreplymessage=Groupreplymessage(s=>s.setmessage)
   const original_message=Groupreplymessage(s=>s.original_message)
   const setoriginal_message=Groupreplymessage(s=>s.setoriginal_message)
   const editglobalId=Editmessage(s=>s.global_id)
   const editmessage=Editmessage(s=>s.message)
   const seteditglobalId=Editmessage(s=>s.setglobal_id)
   const seteditmessage=Editmessage(s=>s.setmessage)
   function handlesendmessage(){
      console.log("message sending function triggered")
      set("request:sendmessage:group",{token:token,groupId:group.groupId,message:message,reply:false})
   }
   function handlegrouptyping(){
       set("request:grouptypingonlinetyping:group",{token:token,groupId:group.groupId,status:true})
       setTimeout(()=>{
         set("request:grouptypingonlinetyping:group",{token:token,groupId:group.groupId,status:false})
       },1500)
    }
    function handlegroupreplymessage(){
      if(replyglobalId&&original_message){
      set("request:replymessage:group",{token:token,globalId:replyglobalId,message:message,groupId:group.groupId,replymessage:original_message})
      setreplyglobalId("")
      setreplymessage("")
      setoriginal_message("")
      seteditglobalId("")
      seteditmessage("")
   }
      else{
         toast.error("First select a message")
      }
   }
   function handlesendeditmessage(){
      if(editglobalId&&message){
         set("request:editmessage:group",{groupId:group.groupId,message:message,globalId:editglobalId,token:token})
      }
   }
    return(
        <><div className="relative h-[9.3%] w-full flex items-center justify-start lg:w-[87%] lg:mt-[1%] lg:mb-[1%] lg:rounded-[30px] lg:shadow-[0_0px_6px_2px_rgb(0,0,0,0.2)] lg:px-6 bg-[#E0E0E0]">
            <Button variant={"outline"} className="text-primary">
               <Paperclip size={17} color="black"/>
            </Button>
            <InputGroup className="lg:w-[65%] lg:ml-23 lg:bg-white">
            <InputGroupInput value={message} onChange={(e)=>{e.stopPropagation();setmessage(e.target.value)}}/>
            <InputGroupAddon align={"inline-end"}>
            <InputGroupButton variant={"outline"} size={"icon-sm"} className={`text-primary ${replyglobalId?"bg-red-300":"bg-blue-300"} hover:bg-white hover:shadow-[0_0_14px_2px_rgb(0,0,0,0.2)]`} onClick={(e)=>{e.stopPropagation();replyglobalId?handlegroupreplymessage():editglobalId?handlesendeditmessage():handlesendmessage();handlegrouptyping()}}>
            <Send size={11} color="black" className={`hover:bg-white`}/>
            </InputGroupButton>
            </InputGroupAddon>
            </InputGroup>
            <span className="flex items-center gap-3 ml-auto">
            <Button variant={"outline"} className="text-primary rounded-full bg-green-300 hover:bg-white">
               <Mic size={11} color="black"/>
            </Button>
            <Button variant={"outline"} className="text-primary">
               <AudioLines size={11} color="red"/>
            </Button></span>
            <div className="absolute w-10 h-10 rounded-full shadow-[0px_0px_11px_3px_rgb(0,0,0,0.2)] left-[-2.5%] bg-white"></div></div></>)
}
